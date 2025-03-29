"use client";

import {
    createContext,
    useContext,
    ReactNode,
    useEffect,
    useState,
    useCallback,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { handleError } from "@/src/lib/helpers/errorHandler";
import { login, signUp } from "@/src/app/query/authentication";
import {
    AUTH_TOKEN_KEY,
    LOGIN_MUTATION_KEY,
    SIGN_UP_MUTATION_KEY,
} from "@/src/constants";
import { SignUpDataInterface, UserInterface } from "@/src/types/user";
import { useRouter } from "next/navigation";
import { apiClient } from "../query/apiClient";
import { toast } from "sonner";
import { parseCookies, setCookie, destroyCookie } from "nookies";

type PropsType = {
    children: ReactNode;
};

interface AuthContextType {
    signUpMutation: (data: SignUpDataInterface) => void;
    isSignUpLoading: boolean;
    isAuthLoading: boolean;
    isAuthenticated: boolean;
    user: UserInterface | undefined;
    loginMutation: (data: { email: string; password: string }) => void;
    isLoginLoading: boolean;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const getStoredAccessToken = () => {
    if (typeof window !== "undefined") {
        const cookies = parseCookies();
        return cookies[AUTH_TOKEN_KEY] || null;
    }
    return null;
};

export const AuthProvider = ({ children }: PropsType) => {
    const router = useRouter();

    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserInterface | undefined>(undefined);

    const token = getStoredAccessToken();

    useEffect(() => {
        setIsAuthLoading(true);
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        setIsAuthLoading(false);
    }, [token]);

    const getUser = useCallback(async () => {
        try {
            const res = await apiClient.get("/api/user/profile");
            const data = res.data;
            if (data.success) {
                setUser(data.data);
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }, [token]);

    useEffect(() => {
        if (isAuthenticated) {
            getUser();
        }
    }, [isAuthenticated, getUser]);

    const { mutate: signUpMutation, isPending: isSignUpLoading } = useMutation({
        mutationKey: [SIGN_UP_MUTATION_KEY],
        mutationFn: signUp,
        onError: (error) => {
            handleError(error);
        },
        onSuccess(data) {
            setIsAuthenticated(true);
            toast.success(data.message);
            router.push("/home");
        },
    });

    const { mutate: loginMutation, isPending: isLoginLoading } = useMutation({
        mutationKey: [LOGIN_MUTATION_KEY],
        mutationFn: login,
        onError: (error) => {
            handleError(error);
        },
        onSuccess(data) {
            setIsAuthenticated(true);
            toast.success(data.message);
            router.push("/home");
        },
    });

    const logout = () => {
        destroyCookie(null, AUTH_TOKEN_KEY, { path: "/" });
        setIsAuthenticated(false);
        toast.success("Logged out successfully");
        router.push("/");
    };

    const value: AuthContextType = {
        signUpMutation,
        isSignUpLoading,
        loginMutation,
        isLoginLoading,
        isAuthLoading,
        isAuthenticated,
        user: user,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export { getStoredAccessToken };
