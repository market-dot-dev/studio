import TierService from "@/app/services/TierService";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, props: { params: Promise<{ userid: string }> }) {
  const params = await props.params;
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

  const width = (250 + 100) * tiers.length;
  let height = 300;

  // @TODO: This will likely need a cleanup
  if (enforceHeight) {
    height = enforceHeight;
  } else if (tiers.find((tier) => tier.checkoutType == "gitwallet")) {
    height = 300;
  }

  const darkModeStyles = `
  .tierWrap {
    background: rgb(31, 41, 55);
    border: rgb(31, 41, 55);
    color: rgb(156, 163, 175)
  }
  .title, .price {
    color: rgb(156, 163, 175)
  }
  .button {
    background: rgb(55, 65, 81);
    color: #fff;
  }
  .button:hover {
    background: rgb(55, 65, 81); 
  }
`;

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
