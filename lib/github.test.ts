import { describe, expect, it } from "vitest";
import { extractGitHubRepoInfo } from "./github";

describe("extractGitHubRepoInfo", () => {
  it("should return org/repo format for valid GitHub URL", () => {
    const url = "https://github.com/username/repo-name";
    const result = extractGitHubRepoInfo(url);

    expect(result).toBe("username/repo-name");
  });

  it("should handle URLs with additional paths", () => {
    const url = "https://github.com/username/repo-name/issues/123";
    const result = extractGitHubRepoInfo(url);

    expect(result).toBe("username/repo-name");
  });

  it("should return empty string for non-GitHub URLs", () => {
    const url = "https://gitlab.com/username/repo-name";
    const result = extractGitHubRepoInfo(url);

    expect(result).toBe("");
  });

  it("should return empty string for null input", () => {
    const result = extractGitHubRepoInfo(null);
    expect(result).toBe("");
  });

  it("should return empty string for undefined input", () => {
    const result = extractGitHubRepoInfo(undefined);
    expect(result).toBe("");
  });

  it("should handle organization repositories", () => {
    const url = "https://github.com/organization-name/repo-name";
    const result = extractGitHubRepoInfo(url);

    expect(result).toBe("organization-name/repo-name");
  });
});
