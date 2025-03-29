"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import AccountMenu from "./generic/AccountMenu";
import { useAuth } from "../Context/AuthContext";
import { Bell } from "lucide-react";

export default function Navbar() {
    const { user, isAuthenticated } = useAuth();

    console.log("User", user);

    return (
        <nav className="border-b py-3 px-4 md:px-8 sticky top-0 bg-white/95 backdrop-blur-sm z-10 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="text-2xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2 font-pacifico"
                    >
                        <span className="hidden sm:inline">Mockinter</span>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {!isAuthenticated ? (
                        <>
                            <Link href="/login">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="font-medium"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link href="/create-account">
                                <Button size="sm" className="font-medium">
                                    Create Account
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full p-2 hover:bg-gray-200 transition-colors"
                            >
                                <Bell className="h-5 w-5" />
                            </Button>
                            <div className="flex items-center gap-2">
                                <AccountMenu />
                                <span className="text-sm font-medium hidden md:inline">
                                    {user ? user.name : ""}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
