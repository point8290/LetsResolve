"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/button";

const RETRY_EVERY_MS = 6000;
const MAX_AUTO_RETRIES = 12; // about a minute: long enough for a cold start

/**
 * Shown when a dashboard page could not load its data. On the free demo host
 * the usual cause is the API waking from sleep, so retry quietly for a minute
 * before asking the visitor to try again.
 */
export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(0);
  const autoRetrying = attempt < MAX_AUTO_RETRIES;

  const retry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });

  useEffect(() => {
    if (!autoRetrying) return;
    const timer = setTimeout(() => {
      setAttempt((n) => n + 1);
      retry();
    }, RETRY_EVERY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, autoRetrying]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center py-24 text-center">
      {autoRetrying && (
        <div className="mb-6 h-6 w-6 animate-spin rounded-full border-2 border-separator border-t-accent" />
      )}
      <h1 className="font-display text-xl font-semibold text-typography">
        {autoRetrying ? "Waking up the demo server…" : "The server is taking longer than usual"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {autoRetrying
          ? "This demo runs on free hosting that sleeps when nobody is using it. It usually takes under a minute to wake, and this page will load by itself."
          : "Please try again in a moment."}
      </p>
      {!autoRetrying && (
        <Button className="mt-6" onClick={() => { setAttempt(0); retry(); }}>
          Try again
        </Button>
      )}
    </main>
  );
}
