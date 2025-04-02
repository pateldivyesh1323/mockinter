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
import { Skeleton } from "@/src/app/components/ui/skeleton";
import { Input } from "@/src/app/components/ui/input";

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

    const totalPages = interviewers?.data?.totalPages || 1;

    return (
        <BasicLayoutWithNavbar>
            <div className="container mx-auto px-4 py-8 max-w-[80vw]">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Interviewers
                    </h1>
                    <div className="w-full md:w-1/3">
                        <Input
                            type="text"
                            placeholder="Search interviewers..."
                            value={search}
                            onChange={handleSearch}
                            className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div>
                    {isInterviewersLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="w-full">
                                    <div className="h-96 rounded-lg overflow-hidden">
                                        <Skeleton className="w-full h-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {interviewers?.data?.interviewers?.map(
                                (interviewer: UserInterface) => (
                                    <div
                                        key={interviewer._id.toString()}
                                        className="w-full"
                                    >
                                        <InterviewerCard
                                            interviewer={interviewer}
                                        />
                                    </div>
                                )
                            ) || (
                                <div className="col-span-3 text-center py-12 text-gray-500">
                                    No interviewers found
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-8">
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
                                    className={
                                        page <= 1
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => (
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
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        if (page < totalPages)
                                            handlePageChange(page + 1);
                                    }}
                                    className={
                                        page >= totalPages
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </BasicLayoutWithNavbar>
    );
}
