import Link from "next/link";
import { Button } from "./ui/button";

export default function NavbarOne() {
    return (
        <nav className="font-dmsans font-semibold md:px-20 md:py-10 sm:px-10 sm:py-5 px-4 pt-4">
            <span className="sm:text-3xl text-xl">
                <Link href="/">MockInter</Link>
            </span>
            <span className="float-right flex items-center box-border sm:gap-5 gap-2">
                <Link href="/login" className="hover:text-neutral-700">
                    <span>Login</span>
                </Link>
                <Link href="/create-account">
                    <span className="bg-black text-white md:px-5 md:py-2 sm:px-3 sm:py-1 px-2 py-2 sm:rounded-full rounded-lg hover:bg-neutral-700 transition-all duration-200">
                        Create Account
                    </span>
                </Link>
            </span>
        </nav>
    );
}
