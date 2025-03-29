"use client";
import React from "react";
import Navbar from "../Navbar";

interface NavbarLayoutProps {
    children: React.ReactNode;
}

export default function NavbarLayout({ children }: NavbarLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-6">
                {children}
            </main>
        </div>
    );
}
