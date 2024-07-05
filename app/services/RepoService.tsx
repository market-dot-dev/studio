"use server";
import SessionService from "./SessionService";
import { nanoid } from 'nanoid';
import prisma from "@/lib/prisma";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'
import { GithubAppInstallation, Lead } from "@prisma/client";
import LeadsService from "./LeadsService";

const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, '\n') ?? '';

class RepoService {

  static getJWT() {
    // Create a JWT to authenticate the GitHub App
    const now = Math.floor(Date.now() / 1000);

    const payload = {
      // issued at time
      iat: now,
      // JWT expiration time (10 minute maximum)
      exp: now + (10 * 60),
      // GitHub App's identifier
      iss: process.env.GITHUB_APP_ID
    };

    return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
  }

  static async createInstallation(id: number, login: string, maybeUserId: number | null) {

    const res = await RepoService.generateInstallationToken(id);
    
    if (!res) {
      throw new Error('Failed to create installation token');
    }

    const { token, expiresAt } = res;
    
    // if its not an org, then we just have one member i.e., the user himself
    const members = maybeUserId ? [{ id: maybeUserId }] : await RepoService.getGithubAppOrgMembers(login, token);
    
    // save the installation information in the database
    return prisma.githubAppInstallation.create({
      data: {
        id,
        token,
        expiresAt,
        login,
        members: {
          create: members.map((member: any) => ({
            gh_id: member.id,
          })),
        },
      },
    });

  }

  static async removeGithubOrgMember(githubAppInstallationId: number, gh_id: number) {
    return await prisma.githubOrgMember.deleteMany({
      where: {
        githubAppInstallationId,
        gh_id,
      },
    });
  }

  static async addGithubOrgMembers(installationId: number, org: string) {
      
      const token = await RepoService.getInstallationToken(installationId);
      
      const members = await RepoService.getGithubAppOrgMembers(org, token);

      if(members?.length) {
        await prisma.githubOrgMember.createMany({
          data: members.map((member: any) => ({
            githubAppInstallationId: installationId,
            gh_id: member.id,
          })),
        });
      }
    
  }

  static async addGithubOrgMember(githubAppInstallationId: number, gh_id: number) {
    return await prisma.githubOrgMember.create({
      data: {
        githubAppInstallationId,
        gh_id,
      },
    });
  }

  static async renameInstallation(id: number, login: string) {
    return prisma.githubAppInstallation.update({
      where: {
        id,
      },
      data: {
        login,
      },
    });
  }

  static async removeInstallation(id: number) {
    return prisma.githubAppInstallation.delete({
      where: {
        id,
      },
    });
  }

  static async getInstallation(id: number) {
    return prisma.githubAppInstallation.findUnique({
      where: {
        id,
      },
    });
  }
  
  static async getGithubAppOrgMembers(org: string, installationToken: string) {

    try {
      const res = await fetch(`https://api.github.com/orgs/${org}/members`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${installationToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      const data = await res.json();

      if (res.status !== 200) {
        return false;
      }

      return data;
    } catch (error) {
      throw new Error("unable to get org members.");
    }
  }

  static async getGithubAppInstallation(id: number) {
    const jwtToken = RepoService.getJWT();

    try {
      const res = await fetch(`https://api.github.com/app/installations/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      const data = await res.json();

      if (res.status !== 200) {
        return false;
      }

      return data;
    } catch (error) {
      throw new Error("unable to get installation.");
    }
  }

  static async generateInstallationToken(id: number) {

    const jwtToken = RepoService.getJWT();

    try {
      const res = await fetch(`https://api.github.com/app/installations/${id}/access_tokens`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      const data = await res.json();

      if (res.status !== 201) {
        return false;
      }
      const { token, expires_at } = data;
      return {
        token,
        expiresAt: expires_at,
      }
    } catch (error) {
      throw new Error("unable to generate installation token.");
    }

  }


  static async getInstallationToken(id: number) {
    
    let installation = await RepoService.getInstallation(id) as GithubAppInstallation;

    // check if the token is still valid
    const expiresAt = new Date(installation.expiresAt).getTime();
    const now = new Date().getTime();

    if (expiresAt < now) {
      // refresh the token
      const res = await RepoService.generateInstallationToken(id);

      if (res) {
        await prisma.githubAppInstallation.update({
          where: {
            id,
          },
          data: {
            token: res.token,
            expiresAt: res.expiresAt,
          },
        });
        return res.token;
      }
    }

    return installation.token;
  }

  static async getGithubAppInstallState() {
    const state = nanoid();
    // set a httpOnly cookie with the state
    cookies().set('ghstate', state, { httpOnly: true })
    
    return state;
  }

  static async getInstallationsList() {
    const userId = await SessionService.getCurrentUserId();

    const account = await prisma.account.findFirst({
      where: { 
        userId,
        provider: 'github',
      },
      select: { providerAccountId: true },
    });
  
    if (!account || !account.providerAccountId) {
      return [];
    }
  
    return await prisma.githubAppInstallation.findMany({
      where: {
        members: {
          some: {
            gh_id: parseInt(account.providerAccountId),
          },
        },
      },
      select: {
        id: true,
        login: true,
      },
    });
  }

  // get the repositories for a given installation
  static async getInstallationRepos(installationId: number) {

    const installationToken = await RepoService.getInstallationToken(installationId);

    try {
      const repos = await fetch(`https://api.github.com/installation/repositories`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${installationToken}`,
        }
      }).then(res => res.json());


      return repos.repositories;

    } catch (error) {
      console.error(error);
      return new Response('Failed to create access token', { status: 500 });
    }

  }

  

  // get the connected (verified) repos for the current user
  static async getRepos() {
    // get repos of a given userId from the database
    const userId = await SessionService.getCurrentUserId();

    if (!userId) {
      throw new Error('No user found.');
    }

    return RepoService.getReposFromUserId(userId);
  }

  static async getReposFromUserId(userId: string) {
    // get repos of a given userId from the database
    return prisma.repo.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  static async getRepo(repoId: string) {
    const accessToken = await SessionService.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token found.');
    }

    try {
      // Fetch the repository information from GitHub
      const url = `https://api.github.com/repositories/${repoId}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github+json',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API responded with status code ${response.status}`);
      }

      const repoDetails = await response.json();
      return repoDetails;
    } catch (error) {
      console.error('Failed to get repo:', error);
      throw new Error('Failed to get repo');
    }
  }

  // verify and connect a repo to the current user
  static async verifyAndConnectRepo(repoId: string, installationId: string) {

    const userId = await SessionService.getCurrentUserId();

    if (!userId) {
      throw new Error('No user found.');
    }

    const githubAppInstallationId = parseInt(installationId);
    
    const installationRepos = await RepoService.getInstallationRepos(githubAppInstallationId);
    // check if the repo is part of the installation
    const repoDetails = installationRepos.find((repo: any) => repo.id === parseInt(repoId));

    if (!repoDetails) {
      throw new Error('The repository is not part of the installation.');
    }

    let radarId = null;
    try {
      const repoSetupResult = await LeadsService.setup(repoDetails.html_url);
      radarId = repoSetupResult.data.id;
    } catch (error) {
      console.error('Failed to setup repository:', error);
    }

    if (!radarId) {
      throw new Error('Failed to setup repository.');
    }

    // Insert the repo information into the database
    return prisma.repo.create({
      data: {
        repoId: repoDetails.id.toString(),
        radarId,
        name: repoDetails.name,
        url: repoDetails.html_url,
        userId
      }
    });
  }

  static async disconnectRepo(repoId: string) {
    const userId = await SessionService.getCurrentUserId();
    return prisma.repo.deleteMany({
      where: {
        repoId: `${repoId}`,
        userId,
      },
    });
  }
}

export default RepoService;
export const { getRepos, verifyAndConnectRepo, disconnectRepo, getInstallationsList, getInstallationRepos, getRepo, getGithubAppInstallState } = RepoService;