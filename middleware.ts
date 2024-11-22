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
    matcher: [
        "/:path",
        "/branches/:path*",
        "/categories/:path*",
        "/inbound/:path*",
        "/inventory-check-note/:path*",
        "/inventory-check/:path*",
        "/manufacturers/:path*",
        "/outbound/:path*",
        "/products/:path*",
        "/profile/:path*",
        "/suppliers/:path*",
        "/types/:path*",
        "/units/:path*",
        "/users/:path*",
        "/login",
    ],
};
