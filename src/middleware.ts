import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname

    const isPublicPath = path === "/" || path === "/login" || path === "/create-account";
    const token = req.cookies.get("token")?.value || ""

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/home", req.nextUrl));
    }
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/create-account',
        '/home'
    ],
}
