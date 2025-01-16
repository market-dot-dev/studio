"use client";

export default async function buyButtonEmbed({
  site,
  rootUrl,
}: {
  site: any;
  rootUrl: string;
}) {
  return {
    html: `<a href="${rootUrl}" target="_blank"><img src="${rootUrl}/api/buybutton/${site?.userId}" /></a>`,
    markdown: `<a href="${rootUrl}" target="_blank"><img src="${rootUrl}/api/buybutton/${site?.userId}" /></a>`,
  };
}
