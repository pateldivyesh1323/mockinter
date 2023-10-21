'use client';
import { ObjectId } from 'mongoose';
import { notFound } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type UserPageParams = {
    params: {
        id: string
    }
}

type UserDetailsType = {
    email: string,
    image: string,
    isVerified: boolean,
    name: string,
    _id: ObjectId
}

export default function UserPage({ params }: UserPageParams) {

    const [userDetails, setUserDetails] = useState<UserDetailsType | undefined>();

    useEffect(() => {
        async function fetchUserData() {
            const res = await fetch(`/api/user/profile?searchid=${params.id}`);
            const data = await res.json();
            console.log(data);
            if (data.success) {
                setUserDetails(data.data);
            }
            else {
                notFound();
            }
        }
        fetchUserData();
    }, [])

    return (
        <div>
            <div>Name : {userDetails?.name}</div>
            <div>Email : {userDetails?.email}</div>
            <div>Id: {userDetails?._id.toString()}</div >
        </div>
    )
}