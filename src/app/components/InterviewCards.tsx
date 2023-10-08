import React, { useEffect, useState } from "react";
import { InterviewDataType } from "./InterviewList";
import toast from "react-hot-toast";
import { Avatar } from "@mui/material";

export type interviewerType = {
    name: string,
    image: string
}

export default function InterviewCards({ data }: { data: InterviewDataType }): React.ReactNode {

    const [interviewer, setInterviewer] = useState<interviewerType | null>();

    useEffect(() => {
        const fetchInterviewerData = async () => {
            const res = await fetch(`/api/user/profile?searchid=${data.interviewer}`);
            const interviewerData = await res.json();
            if (interviewerData.success) {
                setInterviewer(interviewerData.data)
            }
            else {
                toast.error("Failed to fetch interviewer data!");
            }
        }
        fetchInterviewerData();
    }, [])

    const date = new Date(data.createdAt).toLocaleDateString();

    return (
        <div className="bg-white text-black mb-4 p-3">
            <div className="flex items-center mb-2">
                <Avatar src={interviewer?.image} className="mr-3"></Avatar>
                <div className="flex flex-col">
                    <span className="font-bold text-md text-neutral-700">{interviewer?.name}</span>
                    <span className="text-xs text-neutral-600">Created on: {date}</span>
                </div>
            </div>
            <div className="text-2xl font-semibold">{data.title}</div>
            <div className="text-neutral-700 mb-2">{data.description}</div>
            <div className="flex justify-between pr-4">
                <div>status: <span className="text-lime-800">{data.status}</span></div>
                <button>More details</button>
            </div>
        </div >
    )
}