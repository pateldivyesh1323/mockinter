import { apiClient } from "./apiClient";

export const getAllInterviews = async () => {
    try {
        const res = await apiClient.get("/api/interviews/getall");
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const getInterviewById = async (id: string) => {
    try {
        const res = await apiClient.get(`/api/interviews/getone/${id}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
