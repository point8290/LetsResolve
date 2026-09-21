import { redirect } from "next/navigation";

// The app has no public landing page: middleware sends signed-out visitors to
// /auth/login and signed-in ones to /dashboard. This redirect is the fallback
// for the case where middleware does not run.
export default function Home() {
  redirect("/auth/login");
}
