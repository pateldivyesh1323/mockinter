import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getStoredAccessToken } from "@/src/app/Context/AuthContext";

export const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export const apiClient = axios.create({
    baseURL: "/",
});

apiClient.interceptors.request.use((config) => {
    const submitly_token = getStoredAccessToken();
    if (submitly_token) {
        config.headers["Authorization"] = `Bearer ${submitly_token}`;
    }
    return config;
});
