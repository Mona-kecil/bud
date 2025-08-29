"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";
import { cn } from "~/lib/utils";

type MockTransaction = {
  id: string;
  date: string;
  merchant: string;
  description: string;
  amount: number;
  type: "income" | "expense" | "investment";
};

export default function SandboxPage() {
  const items: Array<MockTransaction> = useMemo(() => {
    const merchants = [
      "Coffee House",
      "Grocery Mart",
      "RideShare",
      "Book Store",
      "Streaming+",
      "Gym Club",
      "Pharmacy",
      "Bakery",
      "ElectroHub",
      "Green Market",
    ];
    const descriptions = [
      "Daily essentials",
      "Subscription",
      "Morning latte",
      "Weekly grocery",
      "Commute",
      "Protein snacks",
      "Gift",
      "Household items",
      "Utilities",
      "Snacks",
    ];
    const types: Array<MockTransaction["type"]> = [
      "expense",
      "income",
      "investment",
    ];
    const now = Date.now();
    const list: Array<MockTransaction> = [];
    for (let i = 0; i < 50; i++) {
      const type = types[i % types.length];
      const amountBase =
        type === "income" ? 150000 : type === "investment" ? 120000 : 50000;
      const amount = amountBase + ((i * 137) % 45000);
      list.push({
        id: String(i + 1),
        date: new Date(now - i * 1000 * 60 * 60 * 6).toISOString(),
        merchant: merchants[i % merchants.length] ?? "Merchant",
        description:
          descriptions[(i * 3) % descriptions.length] ?? "Description",
        amount,
        type: type ?? "expense",
      });
    }
    return list;
  }, []);

  const { isFabVisible, bottomSentinelRef } = useScrollDirectionVisibility();

  return (
    <div className="px-4 pt-4">
      <h1 className="font-hand mb-3 text-xl">Sandbox</h1>
      <p className="text-muted-foreground mb-4 text-sm">
        50 mocked transactions to test FAB hide/show on scroll.
      </p>

      <ul className="space-y-2">
        {items.map((t) => (
          <li
            key={t.id}
            className="border-border/25 hover:bg-muted flex items-center gap-4 rounded-md border p-2 shadow-xs"
          >
            <div className="h-fit w-fit rounded-full border p-2">
              {t.type === "income" ? (
                <ArrowDownLeft className="h-4 w-4 stroke-3 text-green-400" />
              ) : t.type === "expense" ? (
                <ArrowUpRight className="h-4 w-4 stroke-3 text-red-400" />
              ) : (
                <ArrowUpRight className="h-4 w-4 stroke-3 text-blue-400" />
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <p className="font-bold">{t.merchant}</p>
              <p className="text-muted-foreground text-sm">{t.description}</p>
            </div>

            <div className="text-right">
              <p className="font-bold">{formatRupiah(t.amount)}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Bottom sentinel: when visible, force-show the FAB */}
      <div ref={bottomSentinelRef} className="h-1 w-1 opacity-0" />

      {/* Spacer to prevent the FAB from overlapping the last item */}
      <div className="h-[calc(env(safe-area-inset-bottom)+24px)]" />

      <Button
        aria-label="Add transaction"
        className={cn(
          "fixed left-4 z-50 h-12 w-12 rounded-full shadow-lg",
          "bottom-[calc(env(safe-area-inset-bottom)+72px)]",
          "transition-all duration-200",
          isFabVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0",
        )}
        onClick={() => {
          // placeholder action
          console.log("FAB clicked");
        }}
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}

function useScrollDirectionVisibility() {
  const [isFabVisible, setIsFabVisible] = useState(true);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);
  const visibleRef = useRef(true);
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);


  /**
   * This hook is used to:
   * - Get current scroll level
   * - Use requestAnimationFrame to batch reads/writes and avoid jank
   * - Toggle FAB visibility based on scroll direction with a small threshold
   * - Force-show the FAB when reaching the end of the list so it doesn't hide
   */
  useEffect(() => {
    lastYRef.current = window.scrollY;
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const diff = currentY - lastYRef.current;
        const threshold = 10; // small movement threshold to avoid jitter
        const doc = document.documentElement;
        const atBottom = window.innerHeight + currentY >= doc.scrollHeight - 2;
        if (diff > threshold && visibleRef.current) {
          visibleRef.current = false;
          setIsFabVisible(false);
        } else if (diff < -threshold && !visibleRef.current) {
          visibleRef.current = true;
          setIsFabVisible(true);
        }
        // Ensure FAB is visible at the end of the list
        if (atBottom && !visibleRef.current) {
          visibleRef.current = true;
          setIsFabVisible(true);
        }
        lastYRef.current = currentY;
        tickingRef.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Observe bottom sentinel to force-show FAB when near the end of the list
  useEffect(() => {
    const target = bottomSentinelRef.current;
    if (!target) return;
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (!visibleRef.current) {
            visibleRef.current = true;
            setIsFabVisible(true);
          }
        }
      }
    }, { root: null, threshold: 0 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return { isFabVisible, bottomSentinelRef } as const;
}

function formatRupiah(value: number): string {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `Rp ${value.toLocaleString("id-ID")}`;
  }
}
