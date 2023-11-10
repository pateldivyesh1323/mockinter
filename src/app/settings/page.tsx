'use client'
import React from 'react';
import NavbarTwo from '../components/NavbarTwo';
import { Avatar } from '@mui/material';
import { UserState } from '../Context/userProvider';

export default function SettingsPage(): React.ReactNode {

    let data = UserState();
    let user = data?.data;

    return (
        <>
            <NavbarTwo />
            {user && <section>
                <div className='bg-white m-auto w-[800px] p-4 px-8'>
                    <div className='text-center font-dmsans text-xl mb-6'>Profile Settings</div>
                    <div className='flex items-center justify-center gap-6'>
                        <Avatar sx={{ width: 100, height: 100, backgroundColor: "black" }} src={user.image}>{user.name.split(" ").map((name: string) => name[0])}</Avatar>
                        <button className='bg-black text-white py-2 px-3 rounded-md'>Change</button>
                    </div>
                    <div>
                        <label htmlFor="name">Name : </label>
                        <input type="text" />
                    </div>
                </div>
            </section>}
        </>
    )
}