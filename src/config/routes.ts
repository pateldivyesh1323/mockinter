import { RouteConfig } from "../types/middleware";

export const PUBLIC_ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    CREATE_ACCOUNT: "/create-account",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/resetpassword",
    VERIFY_EMAIL: "/verifyemail",
} as const;

export const API_ROUTES = {
    USER_PROFILE: "/api/user/profile",
    INTERVIEWS: {
        GET_ALL: "/api/interviews/getall",
        GET_ONE: "/api/interviews/getone/:path*",
        BOOK: "/api/interviews/book/:path*",
        CREATE_NEW: "/api/interviews/createnew",
    },
    INTERVIEWERS: {
        GET_ALL: "/api/interviewers/getall",
    },
} as const;

export const PROTECTED_ROUTES = {
    HOME: "/home",
    INTERVIEW: "/interview/:path*",
    INTERVIEWERS: "/interviewers",
} as const;

function flattenRoutes(routes: Record<string, any>): string[] {
    return Object.values(routes).reduce((acc: string[], route) => {
        if (typeof route === "string") {
            acc.push(route);
        } else if (typeof route === "object") {
            acc.push(...flattenRoutes(route));
        }
        return acc;
    }, []);
}

export const routeConfig: RouteConfig = {
    public: Object.values(PUBLIC_ROUTES),
    api: flattenRoutes(API_ROUTES),
    protected: Object.values(PROTECTED_ROUTES),
    matcher: [
        ...Object.values(PUBLIC_ROUTES),
        ...Object.values(PROTECTED_ROUTES),
        ...flattenRoutes(API_ROUTES),
    ],
};
