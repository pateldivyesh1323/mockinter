"use client";
import "./styles.css";
import { FormEvent, useState } from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import Link from "next/link";
import { useRouter } from "next/navigation"
import toast from "react-hot-toast";
import { common } from "@mui/material/colors";

export default function LoginPage(): React.ReactNode {
  const router = useRouter()

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoginFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.error("Please provide all credentials!")
        return;
      }
      setLoading(true);
      let res = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      let data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      router.push("/home")
    }
    catch (error: any) {
      toast.error(error.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <main className="border-2 border-zinc-300 sm:w-[500px] w-[350px] min-h-[500px] rounded-xl bg-white py-5 sm:px-10 px-4">
        <div className="font-dmsans text-center text-2xl font-bold">
          MockInter
        </div>
        <div className="font-dmsans text-center text-lg">Login</div>
        <form onSubmit={handleLoginFormSubmit} className="mt-7 flex flex-col">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <div className="form-input-field">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your Email"
              className="h-full w-[90%] outline-none"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
            />
          </div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="!mb-0 form-input-field">
            <input
              type={hidePassword ? "password" : "text"}
              name="password"
              id="password"
              placeholder="Enter your Password"
              className="h-full w-[90%] outline-none"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setHidePassword(!hidePassword);
              }}
              className="relative top-[7px] right-[4px]"
            >
              {hidePassword ? (
                <span className="material-symbols-outlined">
                  visibility
                </span>
              ) : (
                <span className="material-symbols-outlined">
                  visibility_off
                </span>
              )}
            </button>
          </div>
          <div className="text-sm mb-5">
            <Link href="/forgot-password">Forgot Password?</Link>
          </div>
          <LoadingButton loading={loading} variant="contained" type="submit" className="bg-black hover:bg-gray-800">
            Login
          </LoadingButton>
          <div className="text-sm mb-5">
            <Link href="/create-account">New to MockInter? Create Account</Link>
          </div>
        </form>
      </main>
    </div >
  );
}
