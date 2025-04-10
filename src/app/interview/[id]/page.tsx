"use client";
import { getInterviewById } from "@/srcapp/query/interview";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { GET_INTERVIEW_BY_ID } from "@/srcconstants";
import {
    Clock4Icon,
    BriefcaseIcon,
    MapPinIcon,
    DollarSignIcon,
    LoaderCircleIcon,
    ArrowLeftIcon,
} from "lucide-react";

// Import shadcn components
import { Button } from "@/src/app/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/src/app/components/ui/card";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/src/app/components/ui/avatar";
import { Badge } from "@/src/app/components/ui/badge";
import { Separator } from "@/src/app/components/ui/separator";
import { Skeleton } from "@/src/app/components/ui/skeleton";

export default function InterviewPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {
        data,
        isLoading,
        error,
        refetch: fetchInterviewDetails,
    } = useQuery({
        queryKey: [GET_INTERVIEW_BY_ID, id],
        queryFn: () => getInterviewById(id as string),
    });

    const interviewDetails = data?.data;

    // const handleBooking = async () => {
    //     try {
    //         setLoading(true);
    //         const res = await fetch(
    //             `/api/interviews/book/${interviewDetails?._id}`,
    //             { method: "POST" }
    //         );
    //         const data = await res.json();
    //         if (data.success) {
    //             console.log(data);
    //             fetchInterviewDetails();
    //             toast.success(data.message);
    //         } else {
    //             toast.error(data.message);
    //         }
    //     } catch (error: any) {
    //         toast.error(error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "upcoming":
                return "bg-green-100 text-green-800 border-green-200";
            case "completed":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }
    };

    const getStatusBannerColor = (status: string) => {
        switch (status) {
            case "upcoming":
                return "bg-gradient-to-r from-green-600 to-green-500";
            case "completed":
                return "bg-gradient-to-r from-blue-600 to-blue-500";
            case "cancelled":
                return "bg-gradient-to-r from-red-600 to-red-500";
            default:
                return "bg-gradient-to-r from-amber-600 to-amber-500";
        }
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-12 w-48" />
                </div>
                <Separator className="mb-6" />
                <div className="space-y-6">
                    <Card className="border border-gray-200 shadow-lg">
                        <Skeleton className="h-10 w-full rounded-t-lg" />
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-14 w-14 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-3/4 mt-4" />
                            <Skeleton className="h-6 w-24 mt-2" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Skeleton className="h-24 w-full rounded-lg" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Skeleton className="h-16 w-full rounded-lg" />
                                <Skeleton className="h-16 w-full rounded-lg" />
                                <Skeleton className="h-16 w-full rounded-lg" />
                                <Skeleton className="h-16 w-full rounded-lg" />
                            </div>
                            <Skeleton className="h-10 w-40" />
                            <Skeleton className="h-16 w-full rounded-lg" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-12 w-40 mx-auto rounded-full" />
                        </CardFooter>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
                <Link
                    href="/interviews"
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    <span>Back to Interviews</span>
                </Link>
                <Card className="bg-red-50 border-red-200 shadow-md">
                    <CardContent className="pt-6 text-center">
                        <div className="text-red-600 font-semibold mb-3 text-lg">
                            Failed to load interview details
                        </div>
                        <div className="text-red-500 mb-4">
                            {error.message || "Please try again later"}
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => fetchInterviewDetails()}
                        >
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        interviewDetails && (
            <div className="w-full max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0 justify-between mb-4">
                    <div>
                        <Link
                            href=""
                            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-2"
                            onClick={(e) => {
                                e.preventDefault();
                                router.back();
                            }}
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            <span>Back to Interviews</span>
                        </Link>
                        <h1 className="font-bold text-2xl md:text-3xl text-gray-800">
                            {interviewDetails?.title}
                        </h1>
                    </div>
                    <Badge
                        className={`${getStatusBadgeColor(
                            interviewDetails?.status
                        )} text-sm px-3 py-1 capitalize`}
                        variant="outline"
                    >
                        {interviewDetails?.status} Interview
                    </Badge>
                </div>
                <Separator className="mb-6" />

                <Card className="overflow-hidden border-gray-200 shadow-xl rounded-xl pt-0">
                    <div
                        className={`w-full py-3 px-4 text-center font-medium text-white ${getStatusBannerColor(
                            interviewDetails?.status
                        )}`}
                    >
                        {interviewDetails?.status === "upcoming"
                            ? "UPCOMING INTERVIEW"
                            : interviewDetails?.status === "completed"
                            ? "COMPLETED INTERVIEW"
                            : "INTERVIEW " +
                              interviewDetails?.status?.toUpperCase()}
                    </div>

                    <CardContent className="space-y-6">
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm text-gray-700 whitespace-pre-line">
                            <h3 className="font-medium text-gray-900 mb-2">
                                Description
                            </h3>
                            {interviewDetails?.description ||
                                "No description provided."}
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center p-4 bg-white rounded-lg border border-indigo-100 shadow-sm transition-transform hover:translate-y-[-2px]">
                                <div className="p-2 bg-indigo-100 rounded-full mr-4">
                                    <DollarSignIcon className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500">
                                        Price
                                    </div>
                                    <div className="font-bold text-xl text-indigo-700">
                                        {interviewDetails?.price === 0
                                            ? "Free"
                                            : `${interviewDetails?.price} ${interviewDetails?.currency}`}
                                    </div>
                                </div>
                            </div>

                            {interviewDetails?.duration && (
                                <div className="flex items-center p-4 bg-white rounded-lg border border-amber-100 shadow-sm transition-transform hover:translate-y-[-2px]">
                                    <div className="p-2 bg-amber-100 rounded-full mr-4">
                                        <Clock4Icon className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">
                                            Duration
                                        </div>
                                        <div className="font-bold text-xl text-amber-700">
                                            {interviewDetails.duration} minutes
                                        </div>
                                    </div>
                                </div>
                            )}

                            {interviewDetails?.jobType && (
                                <div className="flex items-center p-4 bg-white rounded-lg border border-emerald-100 shadow-sm transition-transform hover:translate-y-[-2px]">
                                    <div className="p-2 bg-emerald-100 rounded-full mr-4">
                                        <BriefcaseIcon className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">
                                            Job Type
                                        </div>
                                        <div className="font-bold text-xl text-emerald-700">
                                            {interviewDetails.jobType}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {interviewDetails?.timezone && (
                                <div className="flex items-center p-4 bg-white rounded-lg border border-blue-100 shadow-sm transition-transform hover:translate-y-[-2px]">
                                    <div className="p-2 bg-blue-100 rounded-full mr-4">
                                        <MapPinIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">
                                            Timezone
                                        </div>
                                        <div className="font-bold text-xl text-blue-700">
                                            {interviewDetails.timezone}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Skills section */}
                        {interviewDetails?.skillsToFocus &&
                            interviewDetails.skillsToFocus.length > 0 && (
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="font-medium text-gray-900 mb-3">
                                        Skills Focus:
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {interviewDetails.skillsToFocus.map(
                                            (skill: string, idx: number) => (
                                                <Badge
                                                    key={idx}
                                                    variant="outline"
                                                    className="bg-indigo-50 text-indigo-700 border-indigo-200 px-3 py-1"
                                                >
                                                    {skill}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Interviewee info */}
                        {interviewDetails?.interviewee && (
                            <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                                <div className="font-medium text-gray-900 mb-3">
                                    Interviewee:
                                </div>
                                <Link
                                    href={`/profile/${interviewDetails?.interviewee?._id}`}
                                    className="block hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center">
                                        <Avatar className="mr-3 h-10 w-10 border-2 border-white shadow-sm">
                                            <AvatarImage
                                                src={
                                                    interviewDetails
                                                        ?.interviewee?.image
                                                }
                                                alt={
                                                    interviewDetails
                                                        ?.interviewee?.name
                                                }
                                            />
                                            <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                                {interviewDetails?.interviewee?.name?.charAt(
                                                    0
                                                ) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="text-indigo-600 hover:text-indigo-800 font-medium">
                                            {
                                                interviewDetails?.interviewee
                                                    ?.name
                                            }
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-center pt-4 pb-8">
                        {interviewDetails?.status === "upcoming" ? (
                            <Button
                                size="lg"
                                className="bg-indigo-600 hover:bg-indigo-700 px-8 py-6 font-medium text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                                // onClick={handleBooking}
                                disabled={loading}
                            >
                                {loading && (
                                    <LoaderCircleIcon className="mr-2 h-5 w-5 animate-spin" />
                                )}
                                Book Now
                            </Button>
                        ) : (
                            <Button
                                size="lg"
                                disabled
                                variant="outline"
                                className="px-8 py-6 rounded-full border-2"
                            >
                                {interviewDetails?.status === "completed"
                                    ? "Completed"
                                    : interviewDetails?.status}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        )
    );
}
