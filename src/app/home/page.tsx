"use client";
import React, { useState } from "react";
import InterviewList from "../components/InterviewList";
import { useQuery } from "@tanstack/react-query";
import { getAllInterviews } from "../query/interview";
import { GET_ALL_INTERVIEWS } from "@/srcconstants";
import Pagination from "../components/customui/Pagination";

export default function HomePage() {
    const [limit, setLimit] = useState(25);
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useQuery({
        queryKey: [GET_ALL_INTERVIEWS, limit, page],
        queryFn: () => getAllInterviews(limit, page),
    });

    const interviews = data?.data;

    return (
        <div>
            <InterviewList
                title={"Available Interviews"}
                data={interviews}
                loading={isLoading}
                error={error}
                total={data?.total}
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
            />
        </div>
    );
}
