'use client'
import type { GithubTiersEmbedSettingsProps } from "./github-tiers-embed-settings";

export default async function tiers({site, rootUrl, settings}: {site: any, rootUrl: string, settings: GithubTiersEmbedSettingsProps}) {

  
  const tiers = settings?.tiers?.length ? 'tiers=' + settings.tiers.join(',') : null;

  const darkMode = settings?.darkmode ? 'darkmode=true' : null;

  const queryParams = [tiers, darkMode].filter(Boolean).join('&');
  




  return {
    html: `<a href="${rootUrl}" target="_blank"><img src="/api/tiers/${site?.userId}${queryParams ? '?' + queryParams : ''}" /></a>`,
    markdown: `<a href="${rootUrl}?ref=github">
  <img src="${rootUrl}api/tiers/${site?.userId}${queryParams ? '?' + queryParams : ''}" />
</a>`
  };
}
