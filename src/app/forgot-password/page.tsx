"use client";
import { LoadingButton } from "@mui/lab";
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";
export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const handleForgotPasswordSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (email === "") {
                toast.error("Please enter email");
                return;
            }
            let res = await fetch("/api/user/sendforgotpasswordmail", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            let data = await res.json();
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setEmail("");
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <form
                className="flex flex-col"
                onSubmit={handleForgotPasswordSubmit}
            >
                <label htmlFor="forgot-password-email" className="form-label">
                    Enter your email to reset your password:
                </label>
                <input
                    type="email"
                    name="forgot-password-email"
                    className="form-input-field"
                    placeholder="email@gmail.com"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <LoadingButton
                    loading={loading}
                    variant="contained"
                    type="submit"
                    className="bg-black hover:bg-gray-800  "
                >
                    Send Mail
                </LoadingButton>
            </form>
        </div>
    );
}
