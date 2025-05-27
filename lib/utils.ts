import { type ClassValue, clsx } from "clsx";
import { customAlphabet } from "nanoid";
import { extendTailwindMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  const customTwMerge = extendTailwindMerge({
    extend: {
      // Adds custom sizes to existing classGroups, so they don't get filtered out
      classGroups: {
        "font-size": [{ text: ["xxs"] }, { text: ["xxs/4", "xxs/5"] }]
      }
    }
  });

  return customTwMerge(clsx(inputs));
}

export const capitalize = (str: string) => {
  if (typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const pluralize = (str: string, count: number, pluralSuffix: string = "s"): string => {
  if (count === 1) return str;
  return str + pluralSuffix;
};

export const truncate = (str: string, num: number) => {
  if (!str) return "";
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "…";
};

/**
 * Formats a URL for display by removing the protocol and truncating if needed
 * @param url The URL to format
 * @param maxLength Maximum length before truncation (optional)
 * @returns Formatted URL string suitable for display
 */
export const formatUrlForDisplay = (url: string, maxLength?: number): string => {
  if (!url) return "";

  const urlWithoutProtocol = url.split("://")[1] || url;

  return maxLength ? truncate(urlWithoutProtocol, maxLength) : urlWithoutProtocol;
};

export const formatDate = (date: Date | string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC" // Ensure consistent output by using UTC
  };

  // Convert the date string to a Date object if it's not already
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  // Use 'en-US' for a consistent locale
  return parsedDate.toLocaleDateString("en-US", options);
};

/**
 * Formats a subscription's expiry date into a human-readable text
 * @param expiryDate The date when the subscription will expire
 * @returns A string describing when the subscription will end (e.g. "Ends in 2 months", "Ends in 20 days", "Ends Today")
 */
export const formatSubscriptionExpiryDate = (expiryDate: Date | null): string => {
  if (!expiryDate) {
    return "Ending";
  }

  const currentTime = new Date().getTime();
  const expiryTime = new Date(expiryDate).getTime();
  const daysRemaining = Math.ceil(expiryTime - currentTime / (1000 * 3600 * 24));

  if (daysRemaining > 30) {
    return `Ends on ${formatDate(expiryDate)}`;
  }

  if (daysRemaining > 1) {
    return `Ends in ${daysRemaining} days`;
  }

  if (daysRemaining === 1) {
    return `Ends Tomorrow`;
  }

  if (daysRemaining === 0) {
    return "Ends Today";
  }

  return "Ending";
};

interface TextSection {
  text: string[];
  features?: undefined;
}

interface FeatureSection {
  features: string[];
  text?: undefined;
}

type ContentSection = TextSection | FeatureSection;

export const parseTierDescription = (description: string): ContentSection[] => {
  const lines = description.split("\n");
  const result: ContentSection[] = [];

  lines.forEach((content) => {
    const line = content.trim();
    if (line.length === 0) return;

    const latest = result[result.length - 1];

    if (line.startsWith("-")) {
      if (latest && latest.features) {
        latest.features.push(line.replace(/^-+\s*/, ""));
      } else {
        result.push({ features: [line.replace(/^-+\s*/, "")] });
      }
    } else {
      if (latest && latest.text) {
        latest.text.push(line);
      } else {
        result.push({ text: [line] });
      }
    }
  });

  return result;
};

/**
 * Standard ID generator for the application
 * Uses alphanumeric characters (0-9, A-Z, a-z) with 7 character length
 */
export const generateId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
);

/**
 * Generates a unique filename with the given extension
 * @param extension File extension (without the dot)
 * @returns A unique filename with extension
 */
export function generateUniqueFilename(extension: string): string {
  return `${generateId()}.${extension || "unknown"}`;
}
