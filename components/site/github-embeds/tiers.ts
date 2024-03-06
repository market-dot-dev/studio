'use client'

export default async function tiers({site, rootUrl}: any) {
  return {
    html: `<a href="${rootUrl}" target="_blank"><img src="/api/tiers/${site?.userId}" style="width: 100%" /></a>`,
    markdown: `<a href="${rootUrl}"><img src="${rootUrl}api/tiers/${site?.userId}" width="100%" /></a>`
  };
}
