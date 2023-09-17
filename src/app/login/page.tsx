"use client";
import "./styles.css";
import { FormEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import Link from "next/link";
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast";
import { RotatingLines } from "react-loader-spinner";


export default function LoginPage(): React.ReactNode {
  const router = useRouter()

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoginFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    console.log(data);
    if (!data.success) {
      toast.error(data.message);
      setLoading(false);
      return;
    }
    localStorage.setItem("token", data.token);
    toast.success(data.message);
    router.push("/home")
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/home");
    }
  }, [])

  return (
    <div className="flex items-center justify-center h-screen">
      <Toaster />
      <main className="border-2 border-zinc-300 sm:w-[500px] w-[350px] min-h-[600px] rounded-xl bg-white py-5 sm:px-10 px-4">
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
          <div className="form-input-field">
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
              className="form-hide-password-btn"
            >
              {hidePassword ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="bg-black rounded-md text-white h-10 mb-2 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="35"
                visible={true}
              />
            ) : (
              "Login"
            )}
          </button>
          <div className="text-sm mb-5">
            <Link href="/create-account">New to MockInter? Create Account</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
