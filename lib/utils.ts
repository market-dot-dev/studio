import { type ClassValue, clsx } from "clsx";
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

export const capitalize = (s: string) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const truncate = (str: string, num: number) => {
  if (!str) return "";
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
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
