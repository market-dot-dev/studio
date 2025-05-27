"use server";

import pretty from "pretty";

export async function formatHtml(code: string): Promise<string> {
  try {
    // Use pretty for HTML formatting - it's much lighter than Prettier
    return pretty(code, {
      ocd: true // Equivalent to Prettier's strictness
    });
  } catch (err) {
    console.warn("Failed to format HTML:", err);
    return code.trim();
  }
}
