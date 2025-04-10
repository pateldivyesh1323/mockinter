import { apiClient } from "./apiClient";

export const getAllInterviews = async (
    limit: number = 10,
    page: number = 1
) => {
    try {
        const res = await apiClient.get("/api/interviews/getall", {
            params: { limit, page },
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching interviews:", error);
        throw error;
    }
};

export const getInterviewById = async (id: string) => {
    try {
        const res = await apiClient.get(`/api/interviews/getone/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching interview details:", error);
        throw error;
    }
};
