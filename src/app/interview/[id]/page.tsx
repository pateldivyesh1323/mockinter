"use client";
import { LoadingButton } from "@mui/lab";
import { Avatar, Button } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type InterviewPageProps = {
    params: {
        id: string;
    };
};

export default function InterviewPage({ params }: InterviewPageProps) {
    const [interviewDetails, setInterviewDetails] =
        useState<InterviewDataType>();
    const [interviewer, setInterviewer] = useState<UserType | null>();
    const [interviewee, setInterviewee] = useState<UserType | null>();
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchInterviewerData = async (data: InterviewDataType) => {
        const res = await fetch(
            `/api/user/profile?searchid=${data.interviewer}`
        );
        const interviewerData = await res.json();
        if (interviewerData.success) {
            setInterviewer(interviewerData.data);
        } else {
            toast.error("Failed to fetch interviewer data!");
        }
    };

    const fetchIntervieweeData = async (data: InterviewDataType) => {
        try {
            const res = await fetch(
                `/api/user/profile?searchid=${data.interviewee}`
            );
            const intervieweeData = await res.json();
            setInterviewee(intervieweeData.data);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    async function fetchInterviewDetails() {
        const res = await fetch(`/api/interviews/getone/${params.id}`);
        const data = await res.json();

        if (data.success) {
            setInterviewDetails(data.data);
            fetchInterviewerData(data.data);
            if (data.data.createdAt) {
                const tempDate = new Date(
                    data.data.createdAt
                ).toLocaleDateString();
                setDate(tempDate);
            }
            if (data.data.interviewee) {
                fetchIntervieweeData(data.data);
            }
        } else {
            console.log(data.message);
        }
    }

    const handleBooking = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `/api/interviews/book/${interviewDetails?._id}`,
                { method: "POST" }
            );
            const data = await res.json();
            if (data.success) {
                console.log(data);
                fetchInterviewDetails();
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviewDetails();
    }, []);

    return (
        <>
            {interviewDetails && (
                <section className="w-[80%] m-auto">
                    <div className="font-dmsans font-bold text-2xl">
                        Interview details
                    </div>
                    <hr className="border-black mb-6" />
                    <div className="bg-white p-4 relative">
                        <Link href={`/profile/${interviewer?._id}`}>
                            <div className="flex items-center mb-2">
                                <Avatar
                                    src={interviewer?.image}
                                    className="mr-3"
                                ></Avatar>
                                <div className="flex flex-col">
                                    <span className="font-bold text-md text-neutral-700">
                                        {interviewer?.name}
                                    </span>
                                    <span className="text-xs text-neutral-600">
                                        Created on: {date}
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <div className="text-4xl font-bold pb-4">
                            {interviewDetails?.title}
                            <hr />
                        </div>
                        <div className="text-lg font-medium mb-4">
                            {interviewDetails?.description}
                        </div>
                        <div className="text-lg font-bold mb-4">
                            Status: {interviewDetails?.status?.toUpperCase()}{" "}
                            <br />
                            Price:{" "}
                            {interviewDetails?.price === 0
                                ? "Free"
                                : `${interviewDetails?.price}$`}{" "}
                            <br />
                            {interviewee && (
                                <Link href={`/profile/${interviewee._id}`}>
                                    Interviewee: {interviewee.name}
                                </Link>
                            )}
                        </div>
                        {interviewDetails?.status === "upcoming" ? (
                            <LoadingButton
                                variant="contained"
                                className="bg-black"
                                sx={{
                                    "&:hover": { backgroundColor: "#424242" },
                                }}
                                onClick={handleBooking}
                                loading={loading}
                            >
                                Book Now
                            </LoadingButton>
                        ) : (
                            <Button
                                variant="contained"
                                disabled
                                className="bg-black"
                            >
                                {interviewDetails?.status}
                            </Button>
                        )}
                    </div>
                </section>
            )}
        </>
    );
}
