'use server';

import * as Sentry from "@sentry/nextjs";
import { updateCurrentSite } from "@/app/services/SiteService";
import { isGitWalletError } from "@/lib/errors";

export async function updateSite(formData: FormData) {
  try {
    const result = await updateCurrentSite(formData);
    return { success: true, data: result };
  } catch (error) {
    if (!isGitWalletError(error)) {
      Sentry.captureException(error);
    }
    
    return { 
      success: false, 
      message: isGitWalletError(error) ? error.message : "An unexpected error occurred" 
    };
  }
} 