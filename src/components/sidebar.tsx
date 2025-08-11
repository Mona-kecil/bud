import { UserButton } from "@clerk/nextjs";
import BottomNav from "~/components/bottom-nav";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
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
      <div className="flex-1 p-4 pt-2 pb-24">{children}</div>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
