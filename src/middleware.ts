import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define paths that are public
  const isPublicPath = 
    path === "/auth/signin" || 
    path === "/auth/signup" ||
    path === "/";

  // Get the session using getToken (this simplifies server-side auth checks)
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // Redirect logic
  if (isPublicPath && isAuthenticated) {
    // Redirect authenticated users away from public paths to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  if (!isPublicPath && !isAuthenticated) {
    // Redirect unauthenticated users to sign-in
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // Define which paths this middleware will run on
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes (handled separately in their own route handlers)
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. Static files (favicon.ico, etc.)
     */
    '/((?!api|api/.*|_next|_static|_vercel|.*\\..*).*)'
  ],
};
