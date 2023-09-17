import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login-MockInter",
  description: "Login to MockInter",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
