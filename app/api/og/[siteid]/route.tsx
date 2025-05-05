import { getSiteInfo } from "@/app/services/site-crud-service";
import { ImageResponse } from "@vercel/og";
import { Buffer } from "buffer";
import fs from "fs/promises";
import path from "path";

const PLACEHOLDER_TITLE = "market.dev";
const PLACEHOLDER_SUBTITLE = "All-in-one business tools, built for developers.";

const FONT_DIR = path.join(process.cwd(), "public", "fonts", "inter");
const interMediumPath = path.join(FONT_DIR, "Inter-Medium.ttf");
const interBoldPath = path.join(FONT_DIR, "Inter-Bold.ttf");

async function loadAndEncodeSvg(filePath: string): Promise<string> {
  try {
    const svgContent = await fs.readFile(filePath, "utf-8");
    const base64Content = Buffer.from(svgContent).toString("base64");
    return `data:image/svg+xml;base64,${base64Content}`;
  } catch (error) {
    console.error(`Error loading or encoding SVG file at ${filePath}:`, error);
    return "";
  }
}

// Get nav items for the site of the current admin
export async function GET(_req: Request, props: { params: Promise<{ siteid: string }> }) {
  const params = await props.params;
  const site = await getSiteInfo(params.siteid);
  const projectName = site?.user?.projectName;

  const title = projectName ?? PLACEHOLDER_TITLE;
  const subtitle = site?.subdomain
    ? `${site.subdomain}.market.dev`
    : projectName
      ? null
      : PLACEHOLDER_SUBTITLE;

  const interMediumData = await fs.readFile(interMediumPath);
  const interBoldData = await fs.readFile(interBoldPath);

  const svgFilePath = path.join(process.cwd(), "public", "dots.svg");
  const dotsSvgDataUrl = await loadAndEncodeSvg(svgFilePath);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#E9E9E5",
          backgroundImage: "linear-gradient(180deg, #E9E9E5, #DCDCD8)"
        }}
      >
        {dotsSvgDataUrl && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${dotsSvgDataUrl})`,
              backgroundRepeat: "repeat",
              backgroundSize: "auto",
              maskImage: "linear-gradient(60deg, transparent 30%, black 90%)",
              WebkitMaskImage: "linear-gradient(60deg, transparent 30%, black 90%)",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%"
            }}
          />
        )}

        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            paddingTop: "48px",
            paddingLeft: "64px",
            paddingRight: "64px",
            paddingBottom: "96px",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1
          }}
        >
          {site?.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={site?.user?.projectName ? `${site.user.projectName} logo` : "logo"}
              height={100}
              src={site?.logo ?? ""}
              style={{
                borderRadius: "12px"
              }}
            />
          ) : (
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M57.4372 32.5C57.4372 46.2726 46.2724 57.4374 32.4999 57.4374C18.7273 57.4374 7.5625 46.2726 7.5625 32.5C7.5625 18.7275 18.7273 7.56268 32.4999 7.56268C46.2724 7.56268 57.4372 18.7275 57.4372 32.5Z"
                fill="black"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M32.5 60.8973C48.1834 60.8973 60.8973 48.1834 60.8973 32.5C60.8973 16.8166 48.1834 4.10267 32.5 4.10267C16.8166 4.10267 4.10267 16.8166 4.10267 32.5C4.10267 48.1834 16.8166 60.8973 32.5 60.8973ZM32.5 65C50.4493 65 65 50.4493 65 32.5C65 14.5507 50.4493 0 32.5 0C14.5507 0 0 14.5507 0 32.5C0 50.4493 14.5507 65 32.5 65Z"
                fill="black"
              />
            </svg>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "87px",
                lineHeight: "80px",
                color: "#222214",
                fontWeight: "700",
                marginBottom: "40px",
                letterSpacing: "-0.035em",
                fontFamily: "'Inter'"
              }}
            >
              {title}
            </span>
            <span
              style={{
                fontSize: "42px",
                lineHeight: "32px",
                color: "#727269",
                fontWeight: 500,
                letterSpacing: "-0.025em",
                fontFamily: "'Inter'"
              }}
            >
              {subtitle}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: "Inter",
          data: interMediumData,
          style: "normal",
          weight: 500
        },
        {
          name: "Inter",
          data: interBoldData,
          style: "normal",
          weight: 700
        }
      ]
    }
  );
}
