'use client'
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import ReactPasswordChecklist from "react-password-checklist";

type PropsType = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default function ResetPasswordPage({ searchParams }: PropsType) {

    const { token } = searchParams;

    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isValidPass, setIsValidPass] = useState<boolean>(false);


    const resetPasswordHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isValidPass) {
            try {
                setLoading(true);
                const res = await fetch("/api/user/resetpassword", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({ token, password })
                });
                const data = await res.json();
                if (data.success) {
                    toast.success(data.message);
                    router.push("/login");
                }
                else {
                    toast.error(data.message);
                }
            }
            catch (error: any) {
                toast.error(error.message);
            }
            finally {
                setPassword("");
                setConfirmPassword("");
                setLoading(false);
            }
        }
    }

    return (
        <main className="flex items-center justify-center h-screen">
            <form className="flex items-center justify-center flex-col w-80" onSubmit={resetPasswordHandler}>
                <label htmlFor="password" className="form-label">Create new Password</label>
                <input type="password" id="password" placeholder="Enter new Password" className="form-input-field w-full" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                <input type="password" id="confirm-password" placeholder="Confirm your password" className="form-input-field w-full" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
                <ReactPasswordChecklist
                    rules={["capital", "match", "specialChar", "minLength", "number"]}
                    minLength={8}
                    value={password}
                    valueAgain={confirmPassword}
                    onChange={(isValid) => { setIsValidPass(isValid); }}
                    className="mb-4"
                />
                <LoadingButton loading={loading} variant="contained" type="submit" className="bg-black hover:bg-gray-800 w-full">
                    Reset Password
                </LoadingButton>
            </form>
        </main>
    )
}