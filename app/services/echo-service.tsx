import { getCurrentUser } from "./UserService";
const API_ENDPOINT = process.env.ECHO_API_ENDPOINT;
const API_KEY = process.env.ECHO_API_KEY;

export class EchoService {
  static async validateAccount() {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.gh_username) {
      throw new Error("User GitHub username not found");
    }

    const response = await fetch(`${API_ENDPOINT}users/link_gitwallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        gitwallet_id: user.id,
        github_id: user.gh_id,
      }),
    });

    return response;
  }
}
