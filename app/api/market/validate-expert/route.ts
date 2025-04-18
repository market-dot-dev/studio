import { MarketService } from "@/app/services/market-service";
import UserService, { getCurrentUser } from "@/app/services/UserService";

interface LinkGitWalletResponse {
  linked: boolean;
  expert?: {
    id: string;
    name: string;
    slug: string;
    uuid: string;
    host: string;
  };
}

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404
    });
  }

  const response = await MarketService.validateAccount();
  if (response.status === 404) {
    return new Response(JSON.stringify({ error: "Not an expert" }), {
      status: 404
    });
  }

  if (response.status != 200) {
    return new Response(JSON.stringify({ error: "Failed to validate Market.dev account" }), {
      status: response.status
    });
  }

  const responseData = (await response.json()) as LinkGitWalletResponse;
  const { linked, expert } = responseData;
  if (!linked) {
    return new Response(JSON.stringify({ error: "Failed to validate Market.dev account" }), {
      status: 500
    });
  }

  if (!expert) {
    return new Response(JSON.stringify({ error: "Not an expert" }), {
      status: 404
    });
  }

  await UserService.updateUser(user.id, {
    marketExpertId: expert.id.toString()
  });

  return new Response(
    JSON.stringify({
      status: 200,
      expert
    })
  );
}
