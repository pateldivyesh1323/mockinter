import { NextResponse, NextRequest } from "next/server";
import { routeConfig } from "./config/routes";
import {
    handleApiRoute,
    handlePublicRoute,
    handleProtectedRoute,
    isMatchingRoute,
} from "./lib/middleware/handlers";
import { AUTH_TOKEN_KEY } from "./constants";

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const token = req.headers.get(AUTH_TOKEN_KEY) || "";

    if (isMatchingRoute(path, routeConfig.api)) {
        return handleApiRoute(req);
    }

    if (isMatchingRoute(path, routeConfig.public)) {
        const response = handlePublicRoute(req, token);
        if (response) return response;
    }

    if (isMatchingRoute(path, routeConfig.protected)) {
        const response = handleProtectedRoute(req, token);
        if (response) return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*  Match all request paths except for the ones starting with:
            - api (API routes)
            - _next/static (static files)
            - _next/image (image optimization files)
            - favicon.ico (favicon file)
        */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
