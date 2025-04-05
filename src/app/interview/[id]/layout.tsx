"use client";

import BasicLayoutWithNavbar from "@/srcapp/components/layouts/BasicLayoutWithNavbar";

export default function InterviewLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <BasicLayoutWithNavbar>{children}</BasicLayoutWithNavbar>;
}
