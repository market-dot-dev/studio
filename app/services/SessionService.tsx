import { getSession } from '@/lib/auth';
import prisma from "@/lib/prisma";
import { SessionUser } from '../models/Session';
import { authOptions } from '@/lib/auth';
import { getServerSession as naGetServerSession, type NextAuthOptions } from "next-auth";
import Session from "@/app/models/Session";

class SessionService {
  static async getSession() {
    return getSession();
  }

  static async getCurrentUserId() {
    const session = await getSession();
    return session?.user!.id;
  }

  static async getSessionUser(): Promise<SessionUser | undefined> {
    const session = await getSession();
    return session?.user;
  }

  static async fetchSessionUser() {
  }

  static async signedIn(){
    const session = await getSession();
    return !!session?.user!.id;
  }

  // return a refreshed acccess token of github
  static async getAccessToken( forceRefresh? : boolean) : Promise<string | null> {
    const session = await getSession();
    const userId = session?.user!.id;

    try {
      // Retrieve the current refresh token from the database
      const currentAccount = await prisma.account.findFirst({
        where: { userId: userId, provider: 'github' },
      });
      
      // if access token and not expired, return it unless forceRefresh is true
      if( !forceRefresh && currentAccount?.access_token && currentAccount?.expires_at && Date.now() < currentAccount?.expires_at * 1000 ) {
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
      
      if (!response.ok || refreshedTokens.error) {
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

export const getServerSession = async () => {
  return naGetServerSession(authOptions) as Promise<Session>;
};

export default SessionService;
export const { getAccessToken, getCurrentUserId, getSessionUser } = SessionService;