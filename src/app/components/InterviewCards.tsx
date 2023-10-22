import React, { useEffect, useState } from "react";
import { InterviewDataType } from "./InterviewList";
import toast from "react-hot-toast";
import { Avatar } from "@mui/material";
import Link from "next/link";
import { ObjectId } from "mongoose";

export type interviewerType = {
    name: string,
    image: string,
    _id: ObjectId
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
            <Link href={`/profile/${interviewer?._id}`}>
                <div className="flex items-center mb-2">
                    <Avatar src={interviewer?.image} className="mr-3"></Avatar>
                    <div className="flex flex-col">
                        <span className="font-bold text-md text-neutral-700">{interviewer?.name}</span>
                        <span className="text-xs text-neutral-600">Created on: {date}</span>
                    </div>
                </div>
            </Link>
            <div className="text-2xl font-semibold">{data.title}</div>
            <div className="text-neutral-700 mb-2">{data.description}</div>
            <div className="flex justify-between pr-4">
                <div>status: <span className="text-lime-800">{data.status}</span></div>
                <Link href={`/interview/${data._id}`}>
                    <button className="bg-black text-white p-2 rounded hover:bg-neutral-700 transition">More details</button>
                </Link>
            </div>
        </div >
    )
}