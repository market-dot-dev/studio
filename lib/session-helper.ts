import { Session } from "@/app/models/Session";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getSession(): Promise<Session | null> {
  return getServerSession(authOptions) as Promise<Session | null>;
}
