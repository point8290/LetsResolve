"use client";

import { useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * The demo API runs on a free host that sleeps when idle and takes up to a
 * minute to wake. Ping it as soon as any page opens, so it is already waking
 * while the visitor reads the login page. The response is ignored (no-cors).
 */
export default function ApiWarmup() {
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`, { mode: "no-cors", cache: "no-store" }).catch(() => {});
  }, []);
  return null;
}
