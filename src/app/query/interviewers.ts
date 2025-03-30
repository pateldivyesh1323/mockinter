import { apiClient } from "@/src/app/query/apiClient";

export const getInterviewers = async (queryKey: any) => {
    const { data } = await apiClient.get(
        `/api/interviewers/getall?${queryKey}`
    );
    return data;
};
