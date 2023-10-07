'use client'

import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserContext = createContext<any>({});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState();

    useEffect(() => {
        async function getUser() {
            try {
                const res = await fetch("/api/user/profile");
                const data = await res.json();
                if (data.success) {
                    setUser(data);
                }
                else {
                    toast.error(data.message)
                }
            } catch (error: any) {
                toast.error(error.message)
            }
        }
        getUser();
    }, [])

    return (
        <UserContext.Provider value={user}>{children}</UserContext.Provider>
    )
}

export const UserState = () => {
    return (useContext(UserContext))
}

export default UserProvider;