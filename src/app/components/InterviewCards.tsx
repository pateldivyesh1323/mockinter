import React, { useState } from "react";
import { InterviewDataType } from "./InterviewList";

export default function InterviewCards({ title, description, status, interviewer, interviewee }: InterviewDataType): React.ReactNode {
    return (
        <div>
            {title}, {description}
        </div>
    )
}