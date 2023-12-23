import type { Metadata } from "next";
import NavbarTwo from "../components/NavbarTwo";

type PropsType = {
    children: React.ReactNode
}

export const metadata: Metadata = {
    title: "Create new interview | Mockinter",
    description: "Create new interview",
};

export default function CreateNewLayout({ children }: PropsType) {
    return (
        <main>
            <NavbarTwo />
            {children}
        </main>
    )
}