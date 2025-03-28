"use client";
import { useAuth } from "../Context/AuthContext";
import AccountMenu from "./AccountMenu";
import Link from "next/link";

export default function NavbarTwo() {
    const { user } = useAuth();

    return (
        <div className="font-dmsans font-semibold md:px-10 md:py-2 px-4 pt-4 bg-white flex items-center flex-row justify-between mb-6 sticky top-0 z-10">
            <span className="sm:text-3xl text-xl">
                <Link href="/home">MockInter</Link>
            </span>
            <div className="flex items-center">
                <AccountMenu />
                <span className="text-lg">{user ? user.name : ""}</span>
            </div>
        </div>
    );
}
