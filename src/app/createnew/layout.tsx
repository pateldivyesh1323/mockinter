import type { Metadata } from "next";

type PropsType = {
    children: React.ReactNode;
};

export const metadata: Metadata = {
    title: "Create new interview | Mockinter",
    description: "Create new interview",
};

export default function CreateNewLayout({ children }: PropsType) {
    return <main>{children}</main>;
}
