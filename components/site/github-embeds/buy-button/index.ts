'use client'

export type BuyButtonEmbedSettingsProps = {
  buttonText: string;
  link: string;
};

export default async function buyButtonEmbed({ site, rootUrl, settings }: { site: any, rootUrl: string, settings: BuyButtonEmbedSettingsProps }) {
  const buttonText = settings.buttonText || 'Buy';
  

  const queryParams = new URLSearchParams({ buttonText }).toString();

  return {
    html: `<a href="${rootUrl}" target="_blank"><img src="${rootUrl}api/buybutton/${site?.userId}?${queryParams}" /></a>`,
    markdown: `<a href="${rootUrl}" target="_blank"><img src="${rootUrl}api/buybutton/${site?.userId}?${queryParams}" /></a>`
  };
}
