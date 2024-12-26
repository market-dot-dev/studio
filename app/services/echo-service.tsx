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

    const response = await fetch(`${API_ENDPOINT}experts/${user.gh_username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    return response;
  }
}
