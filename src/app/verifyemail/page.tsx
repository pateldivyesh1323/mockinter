"use client";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "sonner";

type PropsType = {
    searchParams: { [key: string]: string | string[] | undefined };
};

export default function VerifyEmailPage({
    searchParams,
}: PropsType): React.ReactNode {
    const { token, email } = searchParams;

    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    const verifyEmailHandler = async () => {
        try {
            setLoading(true);
            const verifyRes = await fetch("/api/user/verifyemail", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ token }),
            });
            const data = await verifyRes.json();
            if (data.success) {
                setVerified(true);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="h-screen flex justify-center items-center flex-col">
            <div className="text-xl mb-4 font-semibold">{email}</div>
            <LoadingButton
                loading={loading}
                variant="contained"
                onClick={verifyEmailHandler}
                className="bg-black hover:bg-gray-800  "
            >
                {verified ? "Verified ✅" : "Click here to Verify"}
            </LoadingButton>
        </main>
    );
}
