'use client'

export default async function tiers({site, rootUrl, settings}: any) {

  // if(settings?.tiers)  {
  //   console.log('settings tiers', settings.tiers)
  // }

  // tier ids as querystring parameters
  let tiers = '';
  if(settings?.tiers?.length) {
    tiers = '?tiers=' + settings.tiers.join(',');
  }



  return {
    html: `<a href="${rootUrl}" target="_blank"><img src="/api/tiers/${site?.userId}${tiers}" /></a>`,
    markdown: `<a href="${rootUrl}"><img src="${rootUrl}api/tiers/${site?.userId}${tiers}" /></a>`
  };
}
