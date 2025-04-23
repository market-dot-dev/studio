import { getSession } from "@/lib/auth";
import { SessionUser } from "../models/Session";

class SessionService {
  static async getCurrentUserId() {
    const session = await getSession();
    return session?.user!.id;
  }

  static async getSessionUser(): Promise<SessionUser | undefined> {
    const session = await getSession();
    return session?.user;
  }

  static async signedIn() {
    const session = await getSession();
    return !!session?.user!.id;
  }
}

export default SessionService;

export const { getCurrentUserId, getSessionUser } = SessionService;
