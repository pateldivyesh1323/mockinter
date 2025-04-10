"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Avatar } from "@mui/material";
import Pagination from "./customui/Pagination";
import {
    CalendarIcon,
    ClockIcon,
    Loader2,
    UserIcon,
    Clock4Icon,
    BriefcaseIcon,
    BarChartIcon,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

type PropsType = {
    title: string;
    data: InterviewDataType[];
    loading: boolean;
    error: Error | null;
    total: number;
    page: number;
    setPage: (page: number) => void;
    limit: number;
    setLimit: (limit: number) => void;
};

export default function InterviewList({
    title,
    data,
    loading,
    error,
    total,
    page,
    setPage,
    limit,
    setLimit,
}: PropsType): React.ReactNode {
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setLimit(newPageSize);
        setPage(1);
    };

    const pageSizeOptions = [5, 10, 25];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-amber-100 text-amber-800 border border-amber-200";
            case "booked":
                return "bg-emerald-100 text-emerald-800 border border-emerald-200";
            case "completed":
                return "bg-blue-100 text-blue-800 border border-blue-200";
            case "cancelled":
                return "bg-red-100 text-red-800 border border-red-200";
            default:
                return "bg-green-100 text-gray-800 border border-gray-200";
        }
    };

    const formatDuration = (minutes: number) => {
        if (!minutes) return "Not specified";
        if (minutes < 60) return `${minutes} minutes`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0
            ? `${hours} hr ${remainingMinutes} min`
            : `${hours} hour${hours > 1 ? "s" : ""}`;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const formatPrice = (price: number) => {
        if (!price && price !== 0) return "Not specified";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    const getExperienceBadge = (level: string) => {
        if (!level) return null;

        let bgColor = "";
        switch (level.toLowerCase()) {
            case "beginner":
                bgColor = "bg-blue-100 text-blue-800 border-blue-200";
                break;
            case "intermediate":
                bgColor = "bg-indigo-100 text-indigo-800 border-indigo-200";
                break;
            case "advanced":
                bgColor = "bg-purple-100 text-purple-800 border-purple-200";
                break;
            case "expert":
                bgColor = "bg-pink-100 text-pink-800 border-pink-200";
                break;
            default:
                bgColor = "bg-gray-100 text-gray-800 border-gray-200";
        }

        return (
            <Badge variant="outline" className={`${bgColor} border`}>
                {level}
            </Badge>
        );
    };

    const Header = () => (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between my-2">
                <div className="font-dmsans font-bold text-3xl text-neutral-800 mb-4 sm:mb-0">
                    {title}
                </div>
                <Link href="/create-interview">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-md transition-colors shadow-sm">
                        Create Interview Request
                    </Button>
                </Link>
            </div>
            <Separator className="mb-4" />
        </>
    );

    const LoadingState = () => (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
    );

    const ErrorState = () => (
        <div className="flex justify-center items-center p-10 bg-red-50 rounded-xl border border-red-200">
            <div className="text-center">
                <p className="text-red-600 font-medium mb-2">
                    Error fetching interviews
                </p>
                <p className="text-red-500 text-sm">{error?.message}</p>
            </div>
        </div>
    );

    const EmptyState = () => (
        <div className="bg-white p-10 text-center rounded-xl shadow-sm border border-neutral-200">
            <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center">
                    <CalendarIcon className="h-8 w-8 text-neutral-400" />
                </div>
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                No upcoming interviews
            </h3>
            <p className="text-neutral-600 max-w-md mx-auto">
                Create a new interview request to get started with your mock
                interviews.
            </p>
        </div>
    );

    const InterviewItem = ({ interview }: { interview: InterviewDataType }) => (
        <Link href={`/interview/${interview._id}`}>
            <div className="cursor-pointer p-6 hover:bg-gray-50 transition-colors flex items-start justify-between space-x-4 w-full">
                <Avatar
                    src={interview?.interviewee?.image}
                    className="mt-1 h-12 w-12 rounded-full border-2 border-white shadow-sm"
                />
                <div className="flex-grow">
                    <div className="flex flex-wrap justify-between items-center w-full gap-2">
                        <h3 className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center">
                            <UserIcon className="h-4 w-4 mr-1.5" />
                            {interview?.interviewee?.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                            {interview.price !== undefined && (
                                <div className="text-emerald-600 font-semibold text-sm flex items-center">
                                    {formatPrice(interview.price)}
                                </div>
                            )}
                            <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    interview.status
                                )}`}
                            >
                                {interview.status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <h4 className="font-semibold text-lg text-gray-900 mt-1.5">
                        {interview.title}
                    </h4>
                    <p className="text-neutral-600 mt-2 line-clamp-2 text-sm">
                        {interview.description}
                    </p>

                    {interview.skillsToFocus &&
                        interview.skillsToFocus.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3 mb-3">
                                {interview.skillsToFocus.map((skill, idx) => (
                                    <Badge
                                        key={idx}
                                        className="bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 mt-4">
                        {interview.duration && (
                            <div className="flex items-center text-xs text-neutral-600">
                                <Clock4Icon className="h-3.5 w-3.5 mr-1.5 text-neutral-500 flex-shrink-0" />
                                <span>
                                    {formatDuration(interview.duration)}
                                </span>
                            </div>
                        )}

                        {interview.jobType && (
                            <div className="flex items-center text-xs text-neutral-600">
                                <BriefcaseIcon className="h-3.5 w-3.5 mr-1.5 text-neutral-500 flex-shrink-0" />
                                <span>{interview.jobType}</span>
                            </div>
                        )}

                        {interview.experienceLevel && (
                            <div className="flex items-center text-xs text-neutral-600">
                                <BarChartIcon className="h-3.5 w-3.5 mr-1.5 text-neutral-500 flex-shrink-0" />
                                <span className="flex items-center">
                                    {getExperienceBadge(
                                        interview.experienceLevel
                                    )}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center mt-4 pt-3 border-t text-xs text-neutral-500 gap-4">
                        <div className="flex items-center">
                            <ClockIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                            <span>
                                Created {formatDate(interview.createdAt)}
                            </span>
                        </div>

                        {interview.preferredDate && (
                            <div className="flex items-center text-xs text-emerald-600 font-medium">
                                <CalendarIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                <span>
                                    Preferred Date:{" "}
                                    {interview.preferredDate.map((date) =>
                                        formatDate(date.toLocaleString())
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );

    const InterviewList = () => (
        <div className="bg-white shadow-sm overflow-hidden">
            <div className="divide-y">
                {data?.map((interview, index) => (
                    <InterviewItem key={index} interview={interview} />
                ))}
            </div>
        </div>
    );

    return (
        <section className="w-full max-w-5xl mx-auto px-4">
            <Header />

            {loading ? (
                <LoadingState />
            ) : error ? (
                <ErrorState />
            ) : data?.length === 0 ? (
                <EmptyState />
            ) : (
                <InterviewList />
            )}

            <Pagination
                currentPage={page}
                totalItems={total}
                pageSize={limit}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={pageSizeOptions}
            />
        </section>
    );
}
