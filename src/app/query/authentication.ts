import { apiClient } from "@/src/app/query/apiClient";
import { SignUpDataInterface } from "@/src/types/user";

export const signUp = async (signUpData: SignUpDataInterface) => {
    const { data } = await apiClient.post("/api/user/signup", signUpData);
    return data;
};

export const login = async (loginData: { email: string; password: string }) => {
    const { data } = await apiClient.post("/api/user/login", loginData);
    return data;
};

export const getUser = async (queryKey: any) => {
    const { data } = await apiClient.get(`/api/user/profile?${queryKey}`);
    return data;
};
