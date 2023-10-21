'use client';
import { ObjectId } from 'mongoose';
import React, { useEffect, useState } from 'react';

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
    status: string
}

export default function InterviewPage({ params }: InterviewPageProps) {

    const [interviewDetails, setInterviewDetails] = useState<InterviewDetailsType>();

    useEffect(() => {
        async function fetchInterviewDetails() {
            const res = await fetch(`/api/interviews/getdetails?id=${params.id}`)
            const data = await res.json();

            if (data.success) {
                console.log(data.data);
            }
            else {
                console.log(data.message);
            }
        }
        fetchInterviewDetails();
    }, [])

    return (
        <div>
            This is {params.id}
        </div>
    )
}