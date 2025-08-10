import { UserButton } from "@clerk/nextjs";
import BottomNav from "~/components/bottom-nav";
import QuickAddFab from "~/components/quick-add-fab";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh flex flex-col">
      {/* Floating User Button respecting safe area top */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-end px-4"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="pointer-events-auto py-2">
          <UserButton />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 pt-2 pb-28">{children}</div>

      {/* Quick Add floating action button */}
      <QuickAddFab />

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
