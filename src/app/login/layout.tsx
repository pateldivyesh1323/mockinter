import type { Metadata } from "next";

type PropsType = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: "Login | Mockinter",
  description: "Login to MockInter",
};

export default function LoginLayout({
  children,
}: PropsType) {
  return (
    <main>
      {children}
    </main>
  );
}
