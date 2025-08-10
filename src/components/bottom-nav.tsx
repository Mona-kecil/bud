"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "~/components/app-sidebar";
import { cn } from "~/lib/utils";
import styles from "./bottom-nav.module.css";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className={styles.notch} />
      <ul className="relative z-10 mx-auto grid max-w-screen-md grid-cols-5 items-center gap-1 px-3 py-2 md:max-w-screen-sm">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.url || (item.url !== "/" && pathname?.startsWith(item.url));
          return (
            <li key={item.title} className="flex items-center justify-center">
              <Link
                href={item.url}
                className={cn(
                  "text-muted-foreground hover:text-foreground group flex w-full flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-[11px] font-medium md:text-xs",
                  isActive && "text-foreground"
                )}
              >
                {Icon && (
                  <Icon className={cn("h-5 w-5", isActive ? "opacity-100" : "opacity-70")} />
                )}
                <span className="leading-none">{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
} 