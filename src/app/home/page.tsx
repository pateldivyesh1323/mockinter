"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {};

export default function HomePage(props: Props) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, []);

  return <div><button onClick={logout}>Logout</button></div>;
}
