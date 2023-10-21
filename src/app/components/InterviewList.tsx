import React from "react";
import InterviewCards from "./InterviewCards";
import mongoose, { ObjectId } from "mongoose";

export type InterviewDataType = {
    title: string,
    description: string,
    interviewer: mongoose.Schema.Types.ObjectId,
    status: string,
    interviewee?: string,
    createdAt: Date,
    _id: ObjectId
}

type PropsType = {
    title: string,
    data: InterviewDataType[]
}

export default function InterviewList({ title, data }: PropsType): React.ReactNode {

    return (
        <section className="w-[80%] m-auto">
            <div className="font-dmsans font-bold text-2xl">{title}</div>
            <hr className="border-black mb-6" />
            {data.length === 0 ?
                (<div>No Data Found!</div>) :
                (<div>
                    {data.map((data, index) => {
                        return (
                            <InterviewCards key={index} data={data} />
                        )
                    })}
                </div>)
            }
        </section>
    )
}