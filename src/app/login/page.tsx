"use client";
import "./styles.css";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ButtonLoading } from "../components/ui/button-loading";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";

export default function LoginPage(): React.ReactNode {
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const handleLoginFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!email || !password) {
                toast.error("Please provide all credentials!");
                return;
            }
            setLoading(true);
            let res = await fetch("/api/user/login", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            let data = await res.json();

            if (!data.success) {
                toast.error(data.message);
                return;
            }
            toast.success(data.message);
            router.push("/home");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
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
                <form
                    onSubmit={handleLoginFormSubmit}
                    className="mt-7 flex flex-col"
                >
                    <div className="flex gap-4 flex-col">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter your Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="relative flex items-center justify-center">
                                <Input
                                    type={hidePassword ? "password" : "text"}
                                    name="password"
                                    id="password"
                                    placeholder="Enter your Password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setHidePassword(!hidePassword);
                                    }}
                                    className="absolute right-1 hover:bg-non"
                                >
                                    {hidePassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <ButtonLoading loading={loading} type="submit">
                            Login
                        </ButtonLoading>
                    </div>
                    <div className="text-sm flex flex-col gap-2 items-center mt-4">
                        <Link href="/create-account">
                            New to MockInter? Create Account
                        </Link>
                        <Link href="/forgot-password">Forgot Password?</Link>
                    </div>
                </form>
            </main>
        </div>
    );
}
