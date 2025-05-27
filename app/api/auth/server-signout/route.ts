import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// @NOTE: This route exists as a way of forcing a server-side signout from authHelpers, by redirecting to this.
// Normally the middleware would take care of it, but this is for catching deleted accounts / fake tokens.
export async function GET() {
  const cookieStore = await cookies();

  // Clear all Next-auth related cookies
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("next-auth.csrf-token");
  cookieStore.delete("next-auth.callback-url");
  cookieStore.delete("next-auth.state");

  // For secure cookies in production
  cookieStore.delete("__Secure-next-auth.session-token");

  redirect("/login");
}
