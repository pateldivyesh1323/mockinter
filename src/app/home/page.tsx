"use client";
import React from "react";
import InterviewList from "../components/InterviewList";
import { useQuery } from "@tanstack/react-query";
import { getAllInterviews } from "../query/interview";
import { GET_ALL_INTERVIEWS } from "@/srcconstants";

export default function HomePage() {
    const { data, isLoading, error } = useQuery({
        queryKey: [GET_ALL_INTERVIEWS],
        queryFn: getAllInterviews,
    });

    const interviews = data?.data;
    return (
        <InterviewList
            title={"Available Interviews"}
            data={interviews}
            loading={isLoading}
            error={error}
        />
    );
}
