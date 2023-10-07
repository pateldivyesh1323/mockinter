import AccountMenu from "./AccountMenu";
import Link from "next/link";

export default function NavbarTwo() {
    return (
        <div className="font-dmsans font-semibold md:px-10 md:py-2 px-4 pt-4 bg-white flex items-center flex-row justify-between mb-6">
            <span className="sm:text-3xl text-xl">
                <Link href="/home">MockInter</Link>
            </span>
            <AccountMenu />
        </div >
    )
}