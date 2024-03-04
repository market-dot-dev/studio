import "@/styles/globals.css";
import { cal, inter } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import '@radix-ui/themes/styles.css';


const title =
  "Gitwallet";
const description =
  "Gitwallet: The business builder made for open source projects.";
const image = "https://gitwallet.co/thumbnail.png";

export const metadata: Metadata = {
  title,
  description,
  icons: ["https://gitwallet.co/favicon.ico"],
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
    creator: "@gitwallet",
  },
  metadataBase: new URL("https://gitwallet.co"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://cdn.tailwindcss.com" rel="stylesheet" />
      </head>
      <body className={cn(cal.variable, inter.variable)}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
