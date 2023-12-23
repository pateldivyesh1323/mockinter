import type { Metadata } from "next";

type PropsType = {
    children: React.ReactNode
}

export const metadata: Metadata = {
    title: "Forgot Password | Mockinter",
    description: "ForgotPassword",
};

export default function HomeLayout({ children }: PropsType) {
    return (
        <main>
            {children}
        </main>
    )
}