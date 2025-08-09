"use client";

import Link from "next/link";

export default function AppHome() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Welcome to Bud</h2>
      <p className="text-muted-foreground">
        Select a tab to get started, or go to Overview.
      </p>
      <Link href="/app/overview" className="underline">
        Go to Overview
      </Link>
    </div>
  );
}
