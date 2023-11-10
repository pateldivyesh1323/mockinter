'use client';
import NavbarTwo from '@/srcapp/components/NavbarTwo';
import { Avatar } from '@mui/material';
import { ObjectId } from 'mongoose';
import { notFound } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import './styles.css'

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
    _id: ObjectId,
    about: string,
    age: number,
    profession: string,
    location: string
}

export default function UserPage({ params }: UserPageParams) {

    const [userDetails, setUserDetails] = useState<UserDetailsType | undefined>();

    useEffect(() => {
        async function fetchUserData() {
            const res = await fetch(`/api/user/profile?searchid=${params.id}`);
            const data = await res.json();
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
        <main>
            <NavbarTwo />
            <section>
                <div className='bg-white m-auto w-[800px] p-4 px-8'>
                    <div className='text-center font-dmsans text-xl mb-6'>Profile</div>
                    <div className='flex items-center mb-10'>
                        <div className='mr-8'>
                            <Avatar sx={{ width: 100, height: 100, backgroundColor: "black" }} src={userDetails?.image}>{userDetails?.name.split(" ").map((name: string) => name[0])}</Avatar>
                        </div>
                        <div>
                            <div className="text-5xl font-bold font-dmsans">
                                {userDetails?.name}
                            </div>
                            <div className='font-semibold'>
                                {userDetails?.profession}
                            </div>
                        </div>
                    </div>
                    {userDetails?.about &&
                        <div className='userdetailsfield mb-8'>{userDetails?.about}</div>
                    }
                    <div className='userdetailsfield'>
                        Email : {userDetails?.email} &#40;{userDetails?.isVerified ? "verified" : "not verified"}&#41;
                    </div>
                    {userDetails?.age &&
                        <div className='userdetailsfield'>
                            Age : {userDetails.age}
                        </div>
                    }
                    {userDetails?.location &&
                        <div className="userdetailsfield">
                            Location : {userDetails.location}
                        </div>
                    }
                </div>
            </section>
        </main>
    )
}