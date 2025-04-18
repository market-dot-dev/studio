import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export const parseTierDescription = (description: string) => {
  const lines = description.split("\n");
  const result = [] as any[];

  lines.forEach((content) => {
    const line = content.trim();
    if (line.length === 0) return;
    const latest = result[result.length - 1];
    if (line.startsWith("-")) {
      if (latest?.features) {
        latest.features.push(line.replace(/^-+\s*/, ""));
      } else {
        result.push({ features: [line.replace(/^-+\s*/, "")] });
      }
    } else {
      if (latest?.text) {
        latest.text.push(line);
      } else {
        result.push({ text: [line] });
      }
    }
  });

  return result;
};
