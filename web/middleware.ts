import { NextRequest, NextResponse } from "next/server";
import { AppPaths } from "./consts/app-paths";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  const { pathname } = request.nextUrl;

  if (pathname.includes(AppPaths.DASHBOARD) && !token) {
    return NextResponse.redirect(new URL("/authentication", request.url));
  }

  return NextResponse.next();
}
