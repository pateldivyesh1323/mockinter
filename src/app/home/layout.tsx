import type { Metadata } from "next";
import BasicLayoutWithNavbar from "../components/layouts/BasicLayoutWithNavbar";
type PropsType = {
    children: React.ReactNode;
};

export const metadata: Metadata = {
    title: "Home Page | Mockinter",
    description: "Welcome to homepage of MockInter",
};

export default function HomeLayout({ children }: PropsType) {
    return <BasicLayoutWithNavbar>{children}</BasicLayoutWithNavbar>;
}
