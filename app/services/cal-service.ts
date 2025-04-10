import prisma from "@/lib/prisma";

export default class CalService {
  /**
   * Check if a user has connected their Cal.com account
   */
  static async isConnected(userId: string): Promise<boolean> {
    try {
      const integration = await prisma.calIntegration.findUnique({
        where: { userId },
      });
      return !!integration;
    } catch (error) {
      console.error("Error checking Cal.com connection:", error);
      return false;
    }
  }

  /**
   * Get the Cal.com integration for a user
   */
  static async getIntegration(userId: string) {
    try {
      return await prisma.calIntegration.findUnique({
        where: { userId },
      });
    } catch (error) {
      console.error("Error getting Cal.com integration:", error);
      return null;
    }
  }

  /**
   * Check if the access token needs to be refreshed
   */
  static needsRefresh(expiresAt: Date | null): boolean {
    if (!expiresAt) return true;
    
    // Refresh token if it expires in less than 5 minutes
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return expiresAt < fiveMinutesFromNow;
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  static async getAccessToken(userId: string): Promise<string | null> {
    try {
      const integration = await this.getIntegration(userId);
      if (!integration) return null;

      // Check if token needs refresh
      if (this.needsRefresh(integration.expiresAt)) {
        // Make a server-side call to refresh the token
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/integrations/cal/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authentication
        });

        if (!response.ok) {
          throw new Error("Failed to refresh Cal.com token");
        }

        // Get the updated integration
        const updatedIntegration = await this.getIntegration(userId);
        return updatedIntegration?.accessToken || null;
      }

      return integration.accessToken;
    } catch (error) {
      console.error("Error getting Cal.com access token:", error);
      return null;
    }
  }

  /**
   * Test the Cal.com connection
   */
  static async testConnection(userId: string): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken(userId);
      if (!accessToken) return false;

      const response = await fetch("https://app.cal.com/api/auth/oauth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Error testing Cal.com connection:", error);
      return false;
    }
  }
} 