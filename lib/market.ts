import { User } from "@prisma/client";

export async function validateMarketExpert(
  currentUser: User,
  onComplete: () => void,
  onError: (error: string) => void,
  onSuccess: () => void,
) {
  if (currentUser.marketExpertId) {
    onComplete();
    return;
  }

  try {
    const response = await fetch(`/api/market/validate-expert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const errorMessages = {
      404: "You are not an expert on Market.dev. Make sure you have an account created on Market.dev.",
      default: "Failed to validate your Market.dev account.",
    };

    if (!response.ok) {
      throw new Error(
        errorMessages[response.status as keyof typeof errorMessages] ||
          errorMessages.default,
      );
    }

    onSuccess();
  } catch (error) {
    onError(
      error instanceof Error
        ? error.message
        : "Error validating your Market.dev account.",
    );
    throw error;
  } finally {
    onComplete();
  }
}
