"use server";
import SessionService from "./SessionService";
import { nanoid } from 'nanoid';
import prisma from "@/lib/prisma";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'
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

    // get the app installations for the current user   
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

      } catch (error) {
        console.error('Failed to get app:', error);
        throw error; // Re-throw the error to be handled by the caller
      }
    }

    // get the repositories for a given installation
    static async getInstallationRepos(installationId: string) {
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

      const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

      try {
        const installationToken = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }).then(res => res.json());

        
        installationToken.token

        const repos = await fetch(`https://api.github.com/installation/repositories`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${installationToken.token}`,
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

    // verify and connect a repo to the current user
    static async verifyAndConnectRepo(repoId: string) {
      try {
        const accessToken = await SessionService.getAccessToken();

        const userId = await SessionService.getCurrentUserId();

        if (!accessToken) {
            throw new Error('No access token found.');
        }

        if (!userId) {
            throw new Error('No user found.');
        }

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
      } catch (error) {
        console.error('Failed to verify and connect repo:', error);
        throw error; // Re-throw the error to be handled by the caller
      }
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
export const { getRepos, verifyAndConnectRepo, disconnectRepo, getInstallations, getInstallationRepos } = RepoService;