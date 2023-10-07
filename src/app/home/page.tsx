'use client'
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import InterviewList from "../components/InterviewList";
import { UserState } from "../Context/userProvider";


export default function HomePage() {
  const user = UserState();

  return (
    <>
      <main>
        <InterviewList title={"Available Interviews"} data={[]} />
      </main>
    </>
  )
}
