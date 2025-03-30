"use client";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { useAuth } from "../../Context/AuthContext";
import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";

export default function AccountMenu() {
    const { user, logout } = useAuth();
    const actions = [
        {
            label: "My Profile",
            href: `/profile/${user?._id}`,
            icon: User,
        },
        {
            label: "Settings",
            href: "/settings",
            icon: Settings,
        },
        {
            label: "Logout",
            onClick: logout,
            icon: LogOut,
        },
    ];

    return (
        <Popover>
            <PopoverTrigger>
                <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback>
                        {user?.name.split(" ").map((name: string) => name[0])}
                    </AvatarFallback>
                </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-auto" align="start">
                <div className="flex flex-col">
                    {actions.map((action) => {
                        return (
                            <div key={action.label}>
                                {action.href ? (
                                    <Link href={action.href || ""}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start flex items-center text-sm"
                                        >
                                            <action.icon className="mr-2 h-4 w-4" />
                                            {action.label}
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start flex items-center text-sm"
                                        onClick={action.onClick}
                                    >
                                        <action.icon className="mr-2 h-4 w-4" />
                                        {action.label}
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}
