import type { Metadata } from "next";
import "~/styles/globals.css";
import { Inter, Patrick_Hand } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "~/components/convex-client-provider";
import StatsigClientProvider from "~/components/statsig-client-provider";
import { env } from "~/env";
import { Toaster } from "~/components/ui/sonner";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bud — Log expenses within seconds",
  description: "Tap. Type. Done. Built for thumbs, not spreadsheets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 viewport-fit=cover"
        />
        <link rel="preconnect" href="https://accounts.bud.kecil.dev" />
        {env.NODE_ENV === "development" && (
          <script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
            defer
          />
        )}
      </head>
      <body className={`${inter.variable} ${patrickHand.variable}`}>
        <ClerkProvider>
          <ConvexClientProvider>
            <StatsigClientProvider>
              <main className="text-base-sm min-h-dvh px-4 font-sans">
                {children}
              </main>
              <Toaster />
            </StatsigClientProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
