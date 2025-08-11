"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "~/components/app-sidebar";
import { cn } from "~/lib/utils";
import { useState } from "react";
import QuickAddSheet from "~/components/quick-add-sheet";
import { useLongPress } from "use-long-press";

export default function BottomNav() {
  const pathname = usePathname();

  const items = NAV_ITEMS;
  const centerIndex = 2; // transactions in the middle

  const [quickOpen, setQuickOpen] = useState(false);

  const centerLongPress = useLongPress(() => setQuickOpen(true), {
    threshold: 300,
  });

  return (
    <nav
      className="bg-background/90 supports-[backdrop-filter]:bg-background/60 fixed inset-x-0 bottom-0 z-40 border-t shadow-[0_-4px_12px_rgba(0,0,0,0.04)] backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="relative z-10 mx-auto grid max-w-screen-md grid-cols-5 items-center gap-1 px-3 py-2 md:max-w-screen-sm">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.url ||
            (item.url !== "/" && pathname?.startsWith(item.url));
          const isCenter = idx === centerIndex;
          return (
            <li key={item.title} className="flex items-center justify-center">
              {isCenter ? (
                <Link
                  href={item.url}
                  {...centerLongPress()}
                  className={cn(
                    "text-muted-foreground hover:text-foreground group relative flex w-full flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-[11px] font-medium md:text-xs",
                    isActive && "text-foreground",
                    "font-semibold",
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        isActive ? "opacity-100" : "opacity-70",
                      )}
                    />
                  )}
                  <span className="leading-none">{item.title}</span>
                </Link>
              ) : (
                <Link
                  href={item.url}
                  className={cn(
                    "text-muted-foreground hover:text-foreground group relative flex w-full flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-[11px] font-medium md:text-xs",
                    isActive && "text-foreground",
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        isActive ? "opacity-100" : "opacity-70",
                      )}
                    />
                  )}
                  <span className="leading-none">{item.title}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      <QuickAddSheet open={quickOpen} onOpenChange={setQuickOpen} />
    </nav>
  );
}
