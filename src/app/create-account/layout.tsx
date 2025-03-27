import type { Metadata } from "next";

type PropsType = {
    children: React.ReactNode;
};

export const metadata: Metadata = {
    title: "Create Account | Mockinter",
    description: "Create new account in MockInter",
};

export default function LoginLayout({ children }: PropsType) {
    return <main>{children}</main>;
}
