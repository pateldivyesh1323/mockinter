export interface RouteConfig {
    public: string[];
    api: string[];
    protected: string[];
    matcher: string[];
}

export interface MiddlewareResponse {
    success: boolean;
    message?: string;
    status?: number;
    headers?: Headers;
}

export type RouteType = "public" | "api" | "protected";
