import TierService from "@/app/services/TierService";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
  const searchParams = req.nextUrl.searchParams;
  const onlyTiersString = searchParams.get("tiers");
  const onlyTiers = onlyTiersString ? onlyTiersString.split(",") : [];
  const darkmode = searchParams.get("darkmode") === "true";
  const heightParam = searchParams.get("height");
  let enforceHeight = heightParam ? parseInt(heightParam) : 0;
  if (isNaN(enforceHeight)) {
    enforceHeight = 0;
  }

  const tiersForUser = await TierService.getTiersForUser(params.userid);

  const tiers = tiersForUser.filter((tier) => {
    return onlyTiers.includes(tier.id);
  });

  // find heighest number of features a tier among all tiers
  const maxFeatures = tiers.reduce((max, tier) => {
    return Math.max(max, tier.features.length);
  }, 0);

  const width = (250 + 100) * tiers.length;
  let height = 300;

  if (enforceHeight) {
    height = enforceHeight;
  } else if (tiers.find((tier) => tier.checkoutType == "gitwallet")) {
    // If there checkout type if gitwallet then we display the features, so need to add the height of the features
    height = 300 + maxFeatures * 24;
  }

  const darkModeStyles = `
  .tierWrap {
    background: rgb(31, 41, 55);
    border: rgb(31, 41, 55);
    color: rgb(156, 163, 175)
  }
  .title, .price, .features ul > li {
    color: rgb(156, 163, 175)
  }
  .button {
    background: rgb(55, 65, 81);
    color: #fff;
  }
  .button:hover {
    background: rgb(55, 65, 81); 
  }
  .features ul > li > svg {
    stroke: rgb(49, 196, 141);
  }
`;

  const featuresList = (features: any[]) => {
    return `<div class="features">
            <ul>
          ${features
            .filter((feature) => feature["isEnabled"])
            .map((feature: any) => {
              return `<li>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="min-width: 24px; margin-top: -2px" fill="none" stroke="rgb(14, 159, 110)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="m9 12 2 2 4-4"></path></svg>
              ${feature.name}</li>`;
            })
            .join(" ")}
            </ul>
          </div>`;
  };

  const tiersMarkup = tiers
    .map((tier) => {
      return `
      <div class="tierWrap">
        <div class="tierInfo">
          <h3 class="title">${tier.name}</h3>
          <p class="tagline">${tier.tagline}</p>
          ${
            tier.checkoutType == "gitwallet"
              ? `<div class="price">
            <span class="amount">$${tier.price}</span>
            <span class="duration"> / month</span>
          </div>`
              : ""
          }
          ${
            tier.checkoutType == "gitwallet" && tier.features?.length
              ? `<p class="included">What's Included:</p>` +
                `<div class="features-wrap">` +
                featuresList(tier.features) +
                `</div>`
              : ""
          }
    
          <div class="button">Get Started</div>
        </div>
      </div>
    `;
    })
    .join("");

  const svg = `<svg fill="none" width="${width + 4}" height="${height + 4}" xmlns="http://www.w3.org/2000/svg">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml">
        <style>
          .container {
            display: flex;
            width: ${width}px;
            height: ${height}px;
            gap: 4rem;
            justify-content: center;
            align-items: stretch;
            font-family: -apple-system, "system-ui", "Segoe UI (Custom)", Roboto, "Helvetica Neue", "Open Sans (Custom)", system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
          }
          .tierWrap {
            width: 250px;
            margin-top: 2px;
            padding: 2rem;
            background: #fff;
            border: 1px solid rgb(243, 244, 246);
            border-radius: 0.5rem;
            box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px, rgb(229, 231, 235) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
            display: flex;
          }
          .tierInfo {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            color: rgb(107, 114, 128);
            flex-grow: 1;
          }
          .title {
            font-weight: 700;
            font-size: 1.5rem;
            margin: 0;
          }
          .tagline {
            font-weight: 300;
          }
          .price > .amount {
            font-weight: 800;
            font-size: 2rem;
          }
          .included {
            font-size: 0.75rem;
            color: rgb(156, 163, 175);
          }
          .features {
            text-align: left;
            width: 100%;
            flex-grow: 1;
          }
          .features ul {
            list-style: none;
            margin: 0;
            padding: 0;
          }
          .features-wrap {
            flex-grow: 1
          }
          .features ul > li {
            display: flex;
            align-items: start;
            gap: 0.5rem;
            margin-top: 0.25rem;
            margin-bottom: 0.25rem;
          }
          .button {
            width: 100%;
            text-align: center;
            font-size: 14px;
            padding: 0.5rem 0;
            background: rgb(55, 65, 81);
            color: #fff;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease 0s;
            margin-top: 1rem;
            box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
          }
          .button:hover {
            background: rgb(31, 41, 55);
          }
          ${darkmode ? darkModeStyles : ""}
        </style>
        <div class="container">
          ${tiersMarkup}
        </div>
      </div>
    </foreignObject>
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
