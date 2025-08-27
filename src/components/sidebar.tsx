import BottomNav from "~/components/bottom-nav";
import TopNav from "./top-nav";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <TopNav />

      {/* Main content */}
      <div className="pt-4 pb-24">{children}</div>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
