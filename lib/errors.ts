// errors that are expected to be thrown by gitwallet
export class GitWalletError extends Error {
  public readonly originalError?: Error;
  public readonly code = "GW_ERROR";

  constructor(message: string, options?: { originalError?: Error }) {
    super(message);
    this.name = "GitWalletError";
    this.originalError = options?.originalError;
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
    };
  }
}

export function isGitWalletError(error: unknown): error is GitWalletError {
  if (!error || typeof error !== "object") return false;

  // Check if it's a server action error
  if ("digest" in error) {
    return error.toString().includes("Error:");
  }

  // Check for regular GitWalletError
  return "code" in error && (error as any).code === "GW_ERROR";
}
