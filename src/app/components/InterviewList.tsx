import React from "react";
import InterviewCards from "./InterviewCards";
import mongoose from "mongoose";

export type InterviewDataType = {
    title: string,
    description: string,
    interviewer: mongoose.Schema.Types.ObjectId,
    status: string,
    interviewee?: string
}

type PropsType = {
    title: string,
    data: InterviewDataType[]
}

const interviews: InterviewDataType[] = [
    {
        title: "This is Card title",
        description: "This is card description",
        status: "upcoming",
        interviewer: Object("65080e025e5b276c3e6e0dd2")
    },
    {
        title: "This is Card title",
        description: "This is card description",
        status: "upcoming",
        interviewer: Object("65080e025e5b276c3e6e0dd2")
    }, {
        title: "This is Card title",
        description: "This is card description",
        status: "upcoming",
        interviewer: Object("65080e025e5b276c3e6e0dd2")
    }, {
        title: "This is Card title",
        description: "This is card description",
        status: "upcoming",
        interviewer: Object("65080e025e5b276c3e6e0dd2")
    }, {
        title: "This is Card title",
        description: "This is card description",
        status: "upcoming",
        interviewer: Object("65080e025e5b276c3e6e0dd2")
    }, {
        title: "This is Card title",
        description: "This is card description",
        status: "upcoming",
        interviewer: Object("65080e025e5b276c3e6e0dd2")
    },
]

export default function InterviewList({ title, data }: PropsType): React.ReactNode {
    return (
        <section className="flex items-center justify-center flex-col">
            <div className="align-left text-5xl font-dmsans font-bold">{title}</div>
            {interviews.map((interview, index) => {
                return (
                    <InterviewCards key={index} title={interview.title} description={interview.description} interviewer={interview.interviewer} interviewee={interview?.interviewee} status={interview.status} />
                )
            })}
        </section>
    )
}