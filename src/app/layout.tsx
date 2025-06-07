import type { Metadata } from "next";
import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "~/components/convex-client-provider";
import StatsigClientProvider from "~/components/statsig-client-provider";
import Sidebar from "~/components/sidebar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bud",
  description: "A simple budget tracker app to replace my excel sheet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <ConvexClientProvider>
            <StatsigClientProvider>
              <Sidebar>
                <main className="flex-1 p-4 lg:p-6">{children}</main>
              </Sidebar>
            </StatsigClientProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
