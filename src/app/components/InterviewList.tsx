import React from "react";
import InterviewCards from "./InterviewCards";
import { UserState } from "../Context/userProvider";

type PropsType = {
    title: string,
    data: InterviewDataType[]
}

export default function InterviewList({ title, data }: PropsType): React.ReactNode {

    const user = UserState();
    return (
        <section className="w-[80%] m-auto">
            <div className="font-dmsans font-bold text-2xl">{title}</div>
            <hr className="border-black mb-6" />
            {data.length === 0 ?
                (<div>No upcoming interviews!</div>) :
                (<div>
                    {data.filter(data => (data._id !== user?._id && data.status !== "booked" && data.status !== "completed")).map((data, index) => {
                        return (
                            <InterviewCards key={index} data={data} />
                        )
                    })}
                </div>)
            }
        </section>
    )
}