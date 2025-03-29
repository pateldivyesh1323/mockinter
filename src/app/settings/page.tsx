"use client";
import React from "react";
import { Avatar } from "@mui/material";
import { useAuth } from "../Context/AuthContext";
import BasicLayoutWithNavbar from "../components/layouts/BasicLayoutWithNavbar";

export default function SettingsPage(): React.ReactNode {
    const { user } = useAuth();

    return (
        <BasicLayoutWithNavbar>
            {user && (
                <section>
                    <div className="bg-white m-auto w-[800px] p-4 px-8">
                        <div className="text-center font-dmsans text-xl mb-6">
                            Profile Settings
                        </div>
                        <div className="flex items-center justify-center gap-6">
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    backgroundColor: "black",
                                }}
                                src={user.image}
                            >
                                {user.name
                                    .split(" ")
                                    .map((name: string) => name[0])}
                            </Avatar>
                            <button className="bg-black text-white py-2 px-3 rounded-md">
                                Change
                            </button>
                        </div>
                        <div>
                            <label htmlFor="name">Name : </label>
                            <input type="text" />
                        </div>
                    </div>
                </section>
            )}
        </BasicLayoutWithNavbar>
    );
}
