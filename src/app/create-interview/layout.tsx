import type { Metadata } from "next";
import BasicLayoutWithNavbar from "../components/layouts/BasicLayoutWithNavbar";
type PropsType = {
    children: React.ReactNode;
};

export const metadata: Metadata = {
    title: "Create new interview | Mockinter",
    description: "Create new interview",
};

export default function CreateNewLayout({ children }: PropsType) {
    return <BasicLayoutWithNavbar>{children}</BasicLayoutWithNavbar>;
}
