"use client";

import BasicLayoutWithNavbar from "../components/layouts/BasicLayoutWithNavbar";
import { useQuery } from "@tanstack/react-query";
import { GET_INTERVIEWERS_MUTATION_KEY } from "@/src/constants";
import { getInterviewers } from "../query/interviewers";
import { useAuth } from "../Context/AuthContext";
import { useState } from "react";
import InterviewerCard from "../components/interviewers/InterviewerCard";
import { UserInterface } from "@/srctypes/user";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/src/app/components/ui/pagination";

export default function InterviewersPage() {
    const { user, isAuthenticated } = useAuth();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const { data: interviewers, isLoading: isInterviewersLoading } = useQuery({
        queryKey: [GET_INTERVIEWERS_MUTATION_KEY, page, limit, search],
        queryFn: getInterviewers,
        enabled: isAuthenticated,
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <BasicLayoutWithNavbar>
            <div className="container mx-auto px-4 max-w-[80vw]">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Interviewers</h1>
                    <div className="w-1/3">
                        <input
                            type="text"
                            placeholder="Search interviewers..."
                            value={search}
                            onChange={handleSearch}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
                {isInterviewersLoading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {interviewers?.data?.interviewers?.map(
                            (interviewer: UserInterface) => (
                                <div
                                    key={interviewer._id.toString()}
                                    className="w-80"
                                >
                                    <InterviewerCard
                                        interviewer={interviewer}
                                    />
                                </div>
                            )
                        )}
                    </div>
                )}
                <div className="mt-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        if (page > 1)
                                            handlePageChange(page - 1);
                                    }}
                                />
                            </PaginationItem>
                            {Array.from(
                                { length: interviewers?.data?.totalPages || 1 },
                                (_, i) => (
                                    <PaginationItem key={i + 1}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e: any) => {
                                                e.preventDefault();
                                                handlePageChange(i + 1);
                                            }}
                                            isActive={page === i + 1}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        if (
                                            page <
                                            (interviewers?.data?.totalPages ||
                                                1)
                                        )
                                            handlePageChange(page + 1);
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </BasicLayoutWithNavbar>
    );
}
