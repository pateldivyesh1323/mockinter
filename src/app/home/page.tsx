'use client'
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

export default function HomePage() {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch("/api/user/logout");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const getUserData = async () => {
    const res = await fetch("/api/user/profile");
    const data = await res.json();
    console.log(data);
  }

  const sendMail = async () => {
    const res = await fetch("/api/user/sendverificationmail", {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ userId: "650743e3260000e0f20176a7", emailType: "VERIFY", email: "email@gmail.com" })
    })
    let data = await res.json();
    console.log(data)
  }

  return (
    <>
      <div>
        <button type="button" onClick={logout}>Logout</button>
        <button type="button" onClick={getUserData}>Get Data</button>
        <button onClick={sendMail}>SendMail</button>
      </div>
    </>
  )
}
