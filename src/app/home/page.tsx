"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import InterviewList from "../components/InterviewList";

export default function HomePage() {
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        async function getAll() {
            const res = await fetch("/api/interviews/getall");
            const data = await res.json();
            if (data.success) {
                setInterviews(data.data);
            } else {
                toast.error(data.message);
            }
        }
        getAll();
    }, []);

    return (
        <>
            <main>
                <InterviewList
                    title={"Available Interviews"}
                    data={interviews}
                />
            </main>
        </>
    );
}
