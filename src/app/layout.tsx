import type { Metadata } from "next";
import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "~/components/convex-client-provider";
import StatsigClientProvider from "~/components/statsig-client-provider";
import Sidebar from "~/components/sidebar";
import { env } from "~/env";
import { Toaster } from "~/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bud — Log expenses in 5 seconds",
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
        <link rel="preconnect" href="https://accounts.bud.kecil.dev" />
        {env.NODE_ENV === "development" && (
          <script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
            defer
          />
        )}
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          <ConvexClientProvider>
            <StatsigClientProvider>
              <Sidebar>
                <main className="min-h-dvh p-4 lg:p-6">{children}</main>
                <Toaster />
              </Sidebar>
            </StatsigClientProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
