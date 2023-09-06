import { NextRequest, NextResponse } from "next/server";
import { AppPaths } from "./consts/app-paths";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  const { pathname } = request.nextUrl;

  if (pathname === AppPaths.ROOT) {
    return NextResponse.redirect(new URL(AppPaths.DASHBOARD, request.url));
  }

  if (pathname.includes(AppPaths.DASHBOARD) && !token) {
    return NextResponse.redirect(new URL(AppPaths.AUTHENTICATION, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [AppPaths.ROOT, `${AppPaths.DASHBOARD}/:path*`],
};
