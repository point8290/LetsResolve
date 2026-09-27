/**
 * Public demo mode. When both values are set (on Vercel), the login page
 * shows the demo credentials with a one-click "Use demo account" button,
 * and the sign-up / forgot-password links are hidden (self sign-up is
 * disabled in the demo user pool).
 */
export const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || "";
export const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "";
export const IS_DEMO = Boolean(DEMO_EMAIL && DEMO_PASSWORD);
