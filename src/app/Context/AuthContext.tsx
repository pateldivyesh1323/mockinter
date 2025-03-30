"use client";

import {
    createContext,
    useContext,
    ReactNode,
    useEffect,
    useState,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { handleError } from "@/src/lib/helpers/errorHandler";
import { getUser, login, signUp } from "@/src/app/query/authentication";
import {
    AUTH_TOKEN_KEY,
    LOGIN_MUTATION_KEY,
    SIGN_UP_MUTATION_KEY,
    GET_USER_MUTATION_KEY,
} from "@/src/constants";
import { SignUpDataInterface, UserInterface } from "@/src/types/user";
import { useRouter } from "next/navigation";
import { parseCookies, destroyCookie } from "nookies";
import { toast } from "sonner";

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
    isUserLoading: boolean;
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
            getUserMutation(null, {});
        } else {
            setIsAuthenticated(false);
        }
        setIsAuthLoading(false);
    }, [token]);

    const { mutate: getUserMutation, isPending: isUserLoading } = useMutation({
        mutationKey: [GET_USER_MUTATION_KEY, token],
        mutationFn: getUser,
        onSuccess(data) {
            setUser(data.data);
        },
        onError: (error) => {
            handleError(error);
        },
    });

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
        setUser(undefined);
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
        user,
        isUserLoading,
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
