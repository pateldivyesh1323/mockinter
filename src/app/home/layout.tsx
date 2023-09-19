import type { Metadata } from "next";
import NavbarTwo from "../components/NavbarTwo";

type PropsType = {
    children: React.ReactNode
}

export const metadata: Metadata = {
    title: "Home Page-MockInter",
    description: "Welcome to homepage of MockInter",
};

export default function HomeLayout({ children }: PropsType) {
    return (
        <main>
            <NavbarTwo />
            {children}
        </main>
    )
}