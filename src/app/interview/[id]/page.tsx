"use client";
import { getInterviewById } from "@/srcapp/query/interview";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { GET_INTERVIEW_BY_ID } from "@/srcconstants";
import { toast } from "sonner";
import {
    CalendarIcon,
    Clock4Icon,
    BriefcaseIcon,
    UserIcon,
    MapPinIcon,
    DollarSignIcon,
    LoaderCircleIcon,
} from "lucide-react";

// Import shadcn components
import { Button } from "@/src/app/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
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

    if (isLoading) {
        return (
            <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
                <Skeleton className="h-12 w-48 mb-6" />
                <Separator className="mb-6" />
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-24 w-full" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-10 w-32 mx-auto" />
                        </CardFooter>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
                <Card className="bg-red-50 border-red-200">
                    <CardContent className="pt-6 text-center">
                        <div className="text-red-600 font-semibold mb-2 text-lg">
                            Failed to load interview details
                        </div>
                        <div className="text-red-500">
                            {error.message || "Please try again later"}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        interviewDetails && (
            <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
                <div className="font-bold text-2xl">Interview details</div>
                <Separator className="my-4" />

                <Card className="overflow-hidden shadow-md">
                    {/* Status banner */}
                    <div
                        className={`w-full py-2 px-4 text-center font-medium ${
                            interviewDetails?.status === "upcoming"
                                ? "bg-green-500 text-white"
                                : interviewDetails?.status === "completed"
                                ? "bg-blue-500 text-white"
                                : "bg-amber-500 text-white"
                        }`}
                    >
                        {interviewDetails?.status?.toUpperCase()} INTERVIEW
                    </div>

                    <CardHeader>
                        {/* Interviewer profile */}
                        <Link
                            href={`/profile/${interviewDetails?.interviewer?._id}`}
                            className="block no-underline"
                        >
                            <div className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                                    <AvatarImage
                                        src={
                                            interviewDetails?.interviewer?.image
                                        }
                                        alt={
                                            interviewDetails?.interviewer?.name
                                        }
                                    />
                                    <AvatarFallback>
                                        {interviewDetails?.interviewer?.name?.charAt(
                                            0
                                        ) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="ml-4">
                                    <div className="text-indigo-700 font-medium flex items-center">
                                        <UserIcon className="h-4 w-4 mr-1.5" />
                                        {interviewDetails?.interviewer?.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Created on:{" "}
                                        {new Date(
                                            interviewDetails?.createdAt
                                        ).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Interview title */}
                        <CardTitle className="text-2xl mt-4">
                            {interviewDetails?.title}
                        </CardTitle>

                        {/* Status badge */}
                        <div className="flex items-center mt-2">
                            <Badge
                                className={getStatusBadgeColor(
                                    interviewDetails?.status
                                )}
                                variant="outline"
                            >
                                {interviewDetails?.status?.toUpperCase()}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Description */}
                        <div className="bg-slate-50 p-4 rounded-lg border text-gray-800 whitespace-pre-line">
                            {interviewDetails?.description}
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                <DollarSignIcon className="h-5 w-5 text-indigo-600 mr-3" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Price
                                    </div>
                                    <div className="font-semibold text-indigo-700">
                                        {interviewDetails?.price === 0
                                            ? "Free"
                                            : `${interviewDetails?.price} ${interviewDetails?.currency}`}
                                    </div>
                                </div>
                            </div>

                            {interviewDetails?.duration && (
                                <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                                    <Clock4Icon className="h-5 w-5 text-amber-600 mr-3" />
                                    <div>
                                        <div className="text-sm text-gray-500">
                                            Duration
                                        </div>
                                        <div className="font-semibold text-amber-700">
                                            {interviewDetails.duration} minutes
                                        </div>
                                    </div>
                                </div>
                            )}

                            {interviewDetails?.jobType && (
                                <div className="flex items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <BriefcaseIcon className="h-5 w-5 text-emerald-600 mr-3" />
                                    <div>
                                        <div className="text-sm text-gray-500">
                                            Job Type
                                        </div>
                                        <div className="font-semibold text-emerald-700">
                                            {interviewDetails.jobType}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {interviewDetails?.timezone && (
                                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <MapPinIcon className="h-5 w-5 text-blue-600 mr-3" />
                                    <div>
                                        <div className="text-sm text-gray-500">
                                            Timezone
                                        </div>
                                        <div className="font-semibold text-blue-700">
                                            {interviewDetails.timezone}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Skills section */}
                        {interviewDetails?.skillsToFocus &&
                            interviewDetails.skillsToFocus.length > 0 && (
                                <div>
                                    <div className="font-medium mb-2">
                                        Skills Focus:
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {interviewDetails.skillsToFocus.map(
                                            (skill: string, idx: number) => (
                                                <Badge
                                                    key={idx}
                                                    variant="outline"
                                                    className="bg-indigo-50 text-indigo-700 border-indigo-200"
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
                            <div className="p-3 border rounded-lg bg-slate-50">
                                <div className="font-medium mb-2">
                                    Interviewee:
                                </div>
                                <Link
                                    href={`/profile/${interviewDetails?.interviewee?._id}`}
                                >
                                    <div className="flex items-center">
                                        <Avatar className="mr-2 h-8 w-8">
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
                                            <AvatarFallback>
                                                {interviewDetails?.interviewee?.name?.charAt(
                                                    0
                                                ) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="text-indigo-600 hover:text-indigo-800">
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

                    <CardFooter className="flex justify-center pt-4 pb-6">
                        {interviewDetails?.status === "upcoming" ? (
                            <Button
                                size="lg"
                                className="bg-indigo-600 hover:bg-indigo-700 px-8 font-medium"
                                // onClick={handleBooking}
                                disabled={loading}
                            >
                                {loading && (
                                    <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Book Now
                            </Button>
                        ) : (
                            <Button
                                size="lg"
                                disabled
                                variant="outline"
                                className="px-8"
                            >
                                {interviewDetails?.status}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        )
    );
}
