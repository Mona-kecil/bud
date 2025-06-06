import type React from "react";
import type { Metadata } from "next";
import "~/styles/globals.css";
import {
  ArrowUpRight,
  Bell,
  CreditCard,
  DollarSign,
  PieChart,
  Search,
  Settings,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { Inter } from "next/font/google";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "~/components/convex-client-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mint Clone",
  description: "A clone of Mint financial management app",
  generator: "v0.dev",
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
            <div className="bg-muted/40 flex min-h-screen w-full flex-col">
              <div className="bg-background flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                >
                  <Wallet className="h-6 w-6 text-emerald-500" />
                  <span>MintClone</span>
                </Link>
                <div className="ml-auto flex items-center gap-4">
                  <form className="relative hidden lg:block">
                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="bg-background w-[200px] rounded-lg pl-8 lg:w-[280px]"
                    />
                  </form>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                  <Button className="rounded-full" size="sm">
                    Add Account
                  </Button>
                </div>
              </div>
              <div className="flex">
                <div className="bg-background hidden border-r lg:block lg:w-[280px]">
                  <nav className="grid gap-1 p-4 text-sm font-medium">
                    <Link
                      href="/"
                      className="text-muted-foreground hover:bg-muted hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                    >
                      <DollarSign className="h-4 w-4" />
                      Overview
                    </Link>
                    <Link
                      href="/transactions"
                      className="text-muted-foreground hover:bg-muted hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                    >
                      <CreditCard className="h-4 w-4" />
                      Transactions
                    </Link>
                    <Link
                      href="/budgets"
                      className="text-muted-foreground hover:bg-muted hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                    >
                      <PieChart className="h-4 w-4" />
                      Budgets
                    </Link>
                    <Link
                      href="/goals"
                      className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      Goals
                    </Link>
                  </nav>
                </div>
                <main className="flex-1 p-4 lg:p-6">{children}</main>
              </div>
            </div>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
