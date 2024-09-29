import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isTokenExpired } from "./utils/methods";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get("sessionToken");
    if (!pathname.includes("/login") && isTokenExpired(sessionToken?.value))
        return NextResponse.redirect(new URL("/login", request.url));

    if (pathname.includes("/login") && !isTokenExpired(sessionToken?.value))
        return NextResponse.redirect(new URL("/", request.url));

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/:path", "/login"],
};
