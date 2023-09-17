"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {};

export default function HomePage(props: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, []);

  return <div>Home</div>;
}
