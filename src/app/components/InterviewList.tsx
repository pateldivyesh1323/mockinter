import React from "react";
import InterviewCards from "./InterviewCards";
import { UserState } from "../Context/userProvider";
import Link from "next/link";

type PropsType = {
    title: string,
    data: InterviewDataType[]
}

export default function InterviewList({ title, data }: PropsType): React.ReactNode {

    const user = UserState();
    // data.interviewer !== user?._id &&
    let upcomingInterviews = data.filter(data => (data.status !== "booked" && data.status !== "completed")).map((data, index) => {
        return (
            <InterviewCards key={index} data={data} />
        )
    })

    return (
        <section className="w-[80%] m-auto">
            <div className="flex items-center justify-between mb-2">
                <div className="font-dmsans font-bold text-2xl">{title}</div>
                <Link href="/createnew">
                    <button className="bg-black text-white p-2 rounded hover:bg-neutral-700 transition">Create new</button>
                </Link>
            </div>
            <hr className="border-black mb-6" />
            {upcomingInterviews.length === 0 ?
                (<div>No upcoming interviews!</div>) :
                (<div>
                    {upcomingInterviews}
                </div>)
            }
        </section>
    )
}