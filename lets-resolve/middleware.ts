import { type NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./utils/amplify-server-utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const user = await authenticatedUser({ request, response });

  const { pathname } = request.nextUrl;
  const isOnAuthRoute = pathname.startsWith("/auth");
  const isOnDashboard = pathname.startsWith("/dashboard");
  const isOnAdminArea = pathname.startsWith("/dashboard/admin");

  // Signed out: the auth pages are the only thing on offer.
  if (!user) {
    if (isOnAuthRoute) {
      return response;
    }
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  // Signed in: keep non-admins out of the admin area.
  if (isOnAdminArea && !user.isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  if (isOnDashboard) {
    return response;
  }

  // Anything else (landing page, auth pages) belongs to signed-out visitors.
  return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
}

export const config = {
  /*
   * Match all request paths except for the ones starting with
   */
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
