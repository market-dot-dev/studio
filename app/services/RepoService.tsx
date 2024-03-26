"use server";
import SessionService from "./SessionService";
import { nanoid } from 'nanoid';
import prisma from "@/lib/prisma";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'
import { GithubAppInstallation } from "@prisma/client";
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

    static async createInstallation(id: number) {
      const userId = await SessionService.getCurrentUserId();

      if (!userId) {
          throw new Error('No user found.');
      }

      const res = await RepoService.generateInstallationToken(id);

      if( ! res ) {
        throw new Error('Failed to create installation token');
      }

      const { token, expiresAt } = res;

      // save the installation information in the database
      return prisma.githubAppInstallation.create({
        data: {
          id,
          userId,
          token,
          expiresAt,
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
      
      if (!installation) {
          // verify the installation with github and create a new installation
          const data = await RepoService.getInstallations() as any;

          if( ! data?.installations ) {
            throw new Error('No installations found.');
          }

          const verifiedInstallation = data.installations.find((installation: any) => installation.id === id);

          if (!verifiedInstallation) {
              throw new Error('No installation found.');
          }

          await RepoService.createInstallation(id);

          installation = await RepoService.getInstallation(id) as GithubAppInstallation;
      }

      // check if the token is still valid
      const expiresAt = new Date(installation.expiresAt).getTime();
      const now = new Date().getTime();

      if (expiresAt < now) {
        // refresh the token
        const res = await RepoService.generateInstallationToken(id);
        
        if( res ) {
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

    // get the app installations for the current user from github 
    static async getInstallations() {
      const token = await SessionService.getAccessToken();
      if (!token) {
          throw new Error('No access token found.');
      }
      
      const url = 'https://api.github.com/user/installations';
      
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`GitHub API responded with status code ${response.status}`);
        }

        const data = await response.json();
        
        return data;

      } catch (error) {
        console.error('Failed to get app:', error);
        throw error; // Re-throw the error to be handled by the caller
      }
    }

    static async getInstallationsList() {
      const data = await RepoService.getInstallations() as any;

      if( ! data?.installations ) {
        throw new Error('No installations found.');
      }

      const state = nanoid();

      // set a httpOnly cookie with the state
      cookies().set('ghstate', state, { httpOnly: true })

      return {
        state: state,
        data: (data?.installations ?? []).map((installation: any) => ({
          id: installation.id,
          account: installation.account.login,
          accountType: installation.account.type,
        }))
      }; 
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
    static async verifyAndConnectRepo(repoId: string) {

        const userId = await SessionService.getCurrentUserId();

        if (!userId) {
            throw new Error('No user found.');
        }

        
        const repoDetails = await RepoService.getRepo(repoId);

        if( ! repoDetails.permissions.admin && ! repoDetails.permissions.maintain ) {
            throw new Error('The current user does not own or maintain the repository with the provided ID.');
        }
        
        // Insert the repo information into the database
        return prisma.repo.create({
            data: {
                repoId: repoDetails.id.toString(),
                name: repoDetails.name,
                url: repoDetails.html_url,
                userId, // Assuming this is the ID in your own user table
            },
        });
     
    }

    static async disconnectRepo(repoId: string) {
      return prisma.repo.delete({
          where: {
              repoId: `${repoId}`,
          },
      });
    }
}

export default RepoService;
export const { getRepos, verifyAndConnectRepo, disconnectRepo, getInstallationsList, getInstallationRepos, getRepo } = RepoService;