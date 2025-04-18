export const extractGitHubRepoInfo = (url: string | null | undefined): string => {
  if (!url) {
    return "";
  }

  const pattern = /https:\/\/github\.com\/([^/]+)\/([^/]+)/;
  const match = url.match(pattern);

  return match ? `${match[1]}/${match[2]}` : "";
};
