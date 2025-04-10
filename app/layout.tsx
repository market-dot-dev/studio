import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Providers } from "./providers";
import { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import { getRootUrl } from "@/lib/domain";

const title = "market.dev";
const description =
  "Business tools for developers.";
const image = "/thumbnail.png";

export const metadata: Metadata = {
  title,
  description,
  icons: ["/favicon.ico"],
  openGraph: {
    title,
    description,
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    creator: "@marketdotdev",
  },
  metadataBase: new URL(getRootUrl()),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* @TODO: Nooooo, this should be internal, you don't want to include the whole thing. */}
        <link href="https://cdn.tailwindcss.com" rel="stylesheet" />
        {/* <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp,container-queries"></script> */}
      </head>
      <body className="font-sans">
        <Providers>
          {children}
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
