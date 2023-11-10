'use client';
import { interviewerType } from '@/srcapp/components/InterviewCards';
import { InterviewDataType } from '@/srcapp/components/InterviewList';
import NavbarTwo from '@/srcapp/components/NavbarTwo';
import { Avatar } from '@mui/material';
import { ObjectId } from 'mongoose';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type InterviewPageProps = {
    params: {
        id: string
    }
}

type InterviewDetailsType = {
    _id: ObjectId,
    title: string,
    description: string,
    interviewer: ObjectId,
    interviewee?: ObjectId,
    status: string,
    price: Number,
    createdAt: string | number | Date
}

export default function InterviewPage({ params }: InterviewPageProps) {

    const [interviewDetails, setInterviewDetails] = useState<InterviewDetailsType>();
    const [interviewer, setInterviewer] = useState<interviewerType | null>();
    const [date, setDate] = useState("");

    const fetchInterviewerData = async (data: InterviewDataType) => {
        const res = await fetch(`/api/user/profile?searchid=${data.interviewer}`);
        const interviewerData = await res.json();
        if (interviewerData.success) {
            setInterviewer(interviewerData.data)
        }
        else {
            toast.error("Failed to fetch interviewer data!");
        }
    }

    useEffect(() => {
        async function fetchInterviewDetails() {
            const res = await fetch(`/api/interviews/getdetails?id=${params.id}`)
            const data = await res.json();

            if (data.success) {
                setInterviewDetails(data.data)
                fetchInterviewerData(data.data)
                if (data.data.createdAt) {
                    const tempDate = new Date(data.data.createdAt).toLocaleDateString();
                    setDate(tempDate);
                }
            }
            else {
                console.log(data.message);
            }
        }
        fetchInterviewDetails();
    }, [])


    return (
        <>
            <NavbarTwo />
            <section className="w-[80%] m-auto">
                <div className="font-dmsans font-bold text-2xl">Interview details</div>
                <hr className="border-black mb-6" />
                <div className='bg-white h-[800px] p-4'>
                    <Link href={`/profile/${interviewer?._id}`}>
                        <div className="flex items-center mb-2">
                            <Avatar src={interviewer?.image} className="mr-3"></Avatar>
                            <div className="flex flex-col">
                                <span className="font-bold text-md text-neutral-700">{interviewer?.name}</span>
                                <span className="text-xs text-neutral-600">Created on: {date}</span>
                            </div>
                        </div>
                    </Link>
                    <div className='text-4xl font-bold pb-4'>
                        {interviewDetails?.title}
                    </div>
                    <div className='text-lg font-medium mb-4'>
                        {interviewDetails?.description}
                    </div>
                    <div className='text-lg font-bold'>
                        Status: {interviewDetails?.status}
                    </div>
                </div>
            </section>
        </>
    )
}