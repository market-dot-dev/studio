'use client'
import Tier from "@/app/models/Tier";

type TierWithFeatures = Partial<Tier> & { features: { name: string }[] };

function markdownToHtmlTable(markdown: string) {
    const lines = markdown.split('\n').filter(line => line.trim() !== '');
    let htmlTable = '<table class="border w-min-content divide-y divide-gray-200">\n';
  
    // Process header
    if (lines.length > 0) {
      htmlTable += '  <thead>\n    <tr>\n';
      const headers = lines[0].slice(2, -2).split(' | ');
      headers.forEach((header, index) => {
        htmlTable += `      <th scope="col" class="px-3 py-2 text-center${index !== headers.length - 1 ? ' border border-t-0 border-b-0 border-l-0' : ''}">${header}</th>\n`;
      });
      htmlTable += '    </tr>\n  </thead>\n';
    }
  
    // Process body
    if (lines.length > 2) { // Skip the second line as it's the Markdown separator
      htmlTable += '  <tbody class="bg-white divide-y divide-gray-200">\n';
      for (let i = 2; i < lines.length; i++) {
        const rowBgClass = i % 2 === 1 ? 'bg-gray-50' : 'bg-white';
        htmlTable += `    <tr class="${rowBgClass}">\n`;
        const cells = lines[i].slice(2, -2).split(' | ');
        cells.forEach((cell, index) => {
            
          htmlTable += `      <td class="px-3 py-2 whitespace-nowrap text-left${index !== cells.length - 1 ? ' border border-t-0 border-b-0 border-l-0' : ''}">${cell}</td>\n`;
        });
        htmlTable += '    </tr>\n';
      }
      htmlTable += '  </tbody>\n';
    }
  
    htmlTable += '</table>';
    return htmlTable;
  }



export default async function tiers(buyUrl?: string) {
  const response = await fetch('/api/preview/tiers');
  const tiers = await response.json() as TierWithFeatures[];

  
  let markdownTable = `| ${tiers.map(tier => tier.name).join(' | ')} |\n`;
  markdownTable += `| ${tiers.map(() => '-').join(' | ')} |\n`;

  
  const featuresRows = tiers.map(tier => tier.features.map(feature => `✅ ${feature.name}`).join('<br />')).join(' | ');

  const priceRows = tiers.map(tier => tier.price ? `$${tier.price}` : '').join(' | ');
  const buyLinkRows = tiers.map(tier => `<a href="${buyUrl ?? ''}">Buy</a>`).join(' | ');

  markdownTable += `| ${featuresRows} |\n`; // Second row with features
  markdownTable += `| ${priceRows} |\n`; // Third row with prices
  markdownTable += `| ${buyLinkRows} |`; // Fourth row with "Buy" links

  return {
    html: markdownToHtmlTable(markdownTable),
    markdown: markdownTable 
  };
}
