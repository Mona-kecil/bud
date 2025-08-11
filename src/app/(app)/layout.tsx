"use client";

import Sidebar from "~/components/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar>
      <main className="flex-1">{children}</main>
    </Sidebar>
  );
}
