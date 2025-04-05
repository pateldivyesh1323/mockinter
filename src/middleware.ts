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
    const token = req.cookies.get(AUTH_TOKEN_KEY)?.value || "";

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
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
