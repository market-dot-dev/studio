import { getSession } from '@/lib/auth';
import prisma from "@/lib/prisma";

class SessionService {

  // return a refreshed acccess token of github
  static async getAccessToken() : Promise<string | null> {
    const session = await getSession();
    const userId = session?.user.id;

    try {
      // Retrieve the current refresh token from the database
      const currentAccount = await prisma.account.findFirst({
        where: { userId: userId, provider: 'github' },
      });
      
      // if access token and not expired
      if( currentAccount?.access_token && currentAccount?.expires_at && Date.now() < currentAccount?.expires_at * 1000 ) {
        return currentAccount.access_token;
      }
  
      if (!currentAccount?.refresh_token) {
        throw new Error("No refresh token available");
      }
  
      // get updated tokens using refresh token
      const url = `https://github.com/login/oauth/access_token`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          refresh_token: currentAccount.refresh_token,
          client_id: process.env.AUTH_GITHUB_ID,
          client_secret: process.env.AUTH_GITHUB_SECRET,
          grant_type: 'refresh_token'
        }),
      });
  
      const refreshedTokens = await response.json();
      
      if (!response.ok) {
        throw refreshedTokens;
      }
  
      // Update the refresh token in the database
      await prisma.account.update({
        where: { id: currentAccount.id },
        data: {
          access_token: refreshedTokens.access_token,
          expires_at: Math.round(Date.now() / 1000) + refreshedTokens.expires_in,
          refresh_token: refreshedTokens.refresh_token
        },
      });
  
      return refreshedTokens.access_token;
  
    } catch (error) {
      console.error('RefreshAccessTokenError', error);
      return null;
    }
  }
}

export default SessionService;
export const { getAccessToken } = SessionService;