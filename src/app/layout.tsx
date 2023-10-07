import { Toaster } from "react-hot-toast";
import "./globals.css";
import type { Metadata } from "next";
import UserProvider from "./Context/userProvider";

export const metadata: Metadata = {
  title: "MockInter",
  description: "Welcome to world of Interviews",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0" />
      </head>
      <body>
        <UserProvider>
          <Toaster />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
