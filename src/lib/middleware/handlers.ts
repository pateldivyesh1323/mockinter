import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "../helpers/getDataFromToken";

export async function handleApiRoute(req: NextRequest): Promise<NextResponse> {
    try {
        const id = (await getDataFromToken(req)) as string;
        const headers = new Headers(req.headers);
        headers.set("id", id);
        return NextResponse.next({ request: { headers } });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Not authorized" },
            { status: 400 }
        );
    }
}

export function handlePublicRoute(
    req: NextRequest,
    token: string
): NextResponse | null {
    if (token) {
        return NextResponse.redirect(new URL("/home", req.nextUrl));
    }
    return null;
}

export function handleProtectedRoute(
    req: NextRequest,
    token: string
): NextResponse | null {
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    return null;
}

type DynamicRoutePattern = {
    pattern: RegExp;
    params: string[];
};

function parseDynamicRoute(route: string): DynamicRoutePattern {
    const params: string[] = [];
    const pattern = route
        .replace(/:(\w+)/g, (_, param) => {
            params.push(param);
            return "([^/]+)";
        })
        .replace(/\*/g, ".*");

    return {
        pattern: new RegExp(`^${pattern}$`),
        params,
    };
}

export function isMatchingRoute(path: string, routes: string[]): boolean {
    return routes.some((route) => {
        if (route.endsWith("*")) {
            const baseRoute = route.slice(0, -1);
            return path.startsWith(baseRoute);
        }

        if (route.includes(":")) {
            const { pattern } = parseDynamicRoute(route);
            return pattern.test(path);
        }

        return path === route;
    });
}

export function extractRouteParams(
    path: string,
    route: string
): Record<string, string> {
    if (!route.includes(":")) return {};

    const { pattern, params } = parseDynamicRoute(route);
    const match = path.match(pattern);

    if (!match) return {};

    return params.reduce((acc, param, index) => {
        acc[param] = match[index + 1];
        return acc;
    }, {} as Record<string, string>);
}
