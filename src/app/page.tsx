"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
} from "@clerk/nextjs";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (isSignedIn) {
  //     router.replace("/transactions");
  //   }
  // }, [isSignedIn, router]);

  return (
    <div className="mx-auto max-w-screen-sm space-y-10 p-6">
      {/* Hero */}
      <section className="text-center">
        <h1 className="font-sans text-4xl leading-tight font-bold text-balance sm:text-5xl">
          Tap. Type.{" "}
          <span className="decoration-primary underline underline-offset-4">
            Done.
          </span>
        </h1>
        <p className="text-muted-foreground mt-3 text-base sm:text-lg">
          Built for thumbs, not spreadsheets.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <SignedOut>
            <div className="flex items-center justify-center gap-3">
              <SignInButton mode="redirect" forceRedirectUrl="/transactions" />
              <SignUpButton mode="redirect" forceRedirectUrl="/transactions" />
            </div>
          </SignedOut>
          <SignedIn>
            <Link
              href="/transactions"
              className="rounded-md bg-emerald-600 px-4 py-2 text-white"
            >
              Continue
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Proof points */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <BadgeCard>Fast entry</BadgeCard>
        <BadgeCard>Mobile‑first</BadgeCard>
        <BadgeCard>PWA‑ready</BadgeCard>
      </section>

      {/* How it works */}
      <section className="grid grid-cols-3 gap-3 text-center">
        <Step label="Tap" />
        <Step label="Type" />
        <Step label="Done" />
      </section>

      {/* Footer */}
      <footer className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
        <a
          href="https://twitter.com/2045humanoid"
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-4"
        >
          @2045humanoid
        </a>
      </footer>
    </div>
  );
}

function BadgeCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-lg border p-3 text-sm shadow-sm">
      {children}
    </div>
  );
}

function Step({ label }: { label: string }) {
  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <div className="mx-auto mb-2 h-8 w-8 rounded-full border" />
      <div className="font-sans text-base font-semibold">{label}</div>
    </div>
  );
}

