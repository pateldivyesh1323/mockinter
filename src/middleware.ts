import { NextResponse, NextRequest } from 'next/server'
import { getDataFromToken } from './lib/helpers/getDataFromToken';

const PublicPath = ["/", "/login", "/create-account", "forgot-passowrd", "/resetpassword", "/verifyemail"];
const ApiPath = ["/api/user/profile", "/api/interviews/getall"]

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const token = req.cookies.get("token")?.value || ""

    const isPublicPath = PublicPath.includes(path);
    const isApiPath = ApiPath.includes(path);

    if (isApiPath) {
        try {
            const id = await getDataFromToken(req) as string;
            const headers = new Headers(req.headers);
            headers.set("id", id);
            return NextResponse.next({ request: { headers } })
        } catch (error) {
            return NextResponse.json({ success: false, message: "Not authorized" }, { status: 400 });
        }
    }

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
        '/verifyemail',
        '/api/user/profile',
        '/api/interviews/getall'
    ],
}
