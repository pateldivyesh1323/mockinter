import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname

    const isPublicPath = path === "/" || path === "/login" || path === "/create-account" || path === "/forgot-password" || path === "/resetpassword" || path === "/verifyemail";
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
        '/create-account',
        '/forgot-password',
        '/home',
        '/login',
        '/resetpassword',
        '/verifyemail'
    ],
}
