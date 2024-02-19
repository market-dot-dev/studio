"use server";
import SessionService from "./SessionService";

import prisma from "@/lib/prisma";


class RepoService {


    static async searchUserRepos(searchString: string) {
        
      const token = await SessionService.getAccessToken();
      if (!token) {
          throw new Error('No access token found.');
      }

      // repositories search
      const searchRepositories = async (query: string) => {
          const url = `https://api.github.com/search/repositories?q=${query}&sort=updated`;
          const response = await fetch(url, {
              method: "GET",
              headers: {
                  "Accept": "application/vnd.github+json",
                  "Authorization": `Bearer ${token}`,
                  "X-GitHub-Api-Version": "2022-11-28"
              }
          });
          if (!response.ok) {
              throw new Error(`GitHub API responded with status code ${response.status}`);
          }
          const data = await response.json();
          return data.items;
      };
        
      try {
        // Search for user repositories
        const userQuery = encodeURIComponent(`${searchString} in:name user:@me`);

        const result = await searchRepositories(userQuery)
        return result;
      } catch (error) {
          console.error('Failed to search for repositories:', error);
          throw error; 
      }
    }

    static async getApp() {
      const token = await SessionService.getAccessToken();
      if (!token) {
          throw new Error('No access token found.');
      }
      
      const url = 'https://api.github.com/app';
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28"
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
export const { searchUserRepos, getRepos, verifyAndConnectRepo, disconnectRepo, getApp } = RepoService;