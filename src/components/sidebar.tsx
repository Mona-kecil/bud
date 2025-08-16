import BottomNav from "~/components/bottom-nav";
import TopNav from "./top-nav";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Floating User Button respecting safe area top */}
      {/* TODO: replace with top nav containing: user button, current page title, settings button */}
      <TopNav />

      {/* Main content */}
      <div className="px-2 pt-4 pb-24">{children}</div>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
