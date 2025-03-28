import Link from "next/link";
import { Button } from "./ui/button";

export default function NavbarOne() {
    return (
        <nav className="border-b py-4 px-4 md:px-8 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link
                    href="/"
                    className="text-2xl font-bold hover:opacity-90 transition-opacity"
                >
                    MockInter
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="font-medium">
                            Login
                        </Button>
                    </Link>
                    <Link href="/create-account">
                        <Button className="font-medium">Create Account</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
