"use client";

import { Toaster } from "./components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./Context/AuthContext";
import { queryClient } from "./query/apiClient";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Toaster />
                {children}
            </AuthProvider>
        </QueryClientProvider>
    );
}
