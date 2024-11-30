"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ReactPasswordChecklist from "react-password-checklist";
import { Types } from "mongoose";
import { ButtonLoading } from "../components/ui/button-loading";

type DataType = {
    name: string;
    email: string;
    id: Types.ObjectId;
    image: string;
};

type ResponseType = {
    success: boolean;
    message: string;
    data?: DataType;
};

export default function CreateAccount(): React.ReactNode {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmpassword, setConfirmpassword] = useState<string>("");
    const [isValidPass, setIsValidPass] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const createNewUser = async (): Promise<DataType | undefined> => {
        try {
            const res: Response = await fetch("/api/user/signup", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });
            let { message, success, data }: ResponseType = await res.json();
            if (success && data) {
                toast.success(message);
                return data;
            } else {
                toast.error(message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
        return undefined;
    };

    const handleCreateAccountFormSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (!name || !email || !password || !confirmpassword) {
                toast.error("Please provide all the credentials!");
                return;
            }
            if (!isValidPass) {
                toast.error("Password must fulfill all requirements!");
                return;
            }
            let userdata = await createNewUser();
            if (!userdata) {
                return;
            }
            let { id, email: emailId } = userdata;
            let emaildata = await fetch("/api/user/sendverificationmail", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ userId: id, email: emailId }),
            });
            let emailres = await emaildata.json();
            if (emailres.success) {
                toast.success(emailres.message);
            } else {
                toast.error(emailres.message);
            }
            router.push("/home");
        } catch (error: any) {
            toast.error("Error : ", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <main className="border-2 border-zinc-300 sm:w-[500px] w-[350px] min-h-[600px] rounded-xl bg-white py-5 sm:px-10 px-4">
                <div className="font-dmsans text-center text-2xl font-bold">
                    MockInter
                </div>
                <div className="font-dmsans text-center text-lg">
                    Create new account
                </div>
                <form
                    onSubmit={handleCreateAccountFormSubmit}
                    className="mt-7 flex flex-col"
                >
                    <div>
                        <label htmlFor="name" className="form-label">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter your Name"
                            className="h-full w-[90%] outline-none form-input-field"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your Email"
                            className="h-full w-[90%] outline-none form-input-field"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your Password"
                            className="h-full w-[90%] outline-none form-input-field"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmpassword" className="form-label">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            name="confirmpassword"
                            id="confirmpassword"
                            placeholder="Confirm your password"
                            className="h-full w-[90%] outline-none form-input-field"
                            value={confirmpassword}
                            onChange={(e) => {
                                setConfirmpassword(e.target.value);
                            }}
                        />
                    </div>
                    <div className="mb-5">
                        <ReactPasswordChecklist
                            rules={[
                                "capital",
                                "match",
                                "specialChar",
                                "minLength",
                                "number",
                            ]}
                            minLength={8}
                            value={password}
                            valueAgain={confirmpassword}
                            onChange={(isValid) => {
                                setIsValidPass(isValid);
                            }}
                        />
                    </div>
                    <ButtonLoading loading={loading} type="submit">
                        Create Account
                    </ButtonLoading>
                </form>
                <div className="text-sm mb-5 text-center mt-4">
                    <Link href="/login">Already have an account? Login</Link>
                </div>
            </main>
        </div>
    );
}
