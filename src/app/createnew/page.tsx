"use client";

import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function CreateNewPage() {
    const router = useRouter();

    const [title, setTitle] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log(title, desc, price);
            const res = await fetch("/api/interviews/createnew", {
                method: "POST",
                body: JSON.stringify({ title, description: desc, price }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                router.push("/home");
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
        <section className="flex items-center justify-center flex-col">
            <div className="mb-6 font-semibold font-dmsans text-2xl">
                Create new interview
            </div>
            <form
                className="bg-white md:w-[60%] w-[90%] md:p-6 p-4"
                onSubmit={handleSubmit}
            >
                <div className="mb-6">
                    <label htmlFor="title" className="text-lg font-semibold">
                        Title:{" "}
                    </label>
                    <TextField
                        required
                        id="outlined-required title"
                        label="Required"
                        size="small"
                        sx={{
                            width: "100%",
                        }}
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />
                </div>
                <div className="mb-6">
                    <label
                        htmlFor="description"
                        className="text-lg font-semibold"
                    >
                        Description:{" "}
                    </label>
                    <TextField
                        required
                        id="outlined-multiline-static description"
                        label="Required"
                        multiline
                        rows={8}
                        sx={{
                            width: "100%",
                        }}
                        value={desc}
                        onChange={(e) => {
                            setDesc(e.target.value);
                        }}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="price" className="text-lg font-semibold">
                        Price: ${" "}
                    </label>
                    <input
                        type="number"
                        min={0}
                        className="border border-gray-400 rounded h-10 p-2 w-32"
                        value={price}
                        onChange={(e) => {
                            setPrice(Number(e.target.value));
                        }}
                    />
                </div>
                <LoadingButton
                    type="submit"
                    className="bg-black float-right text-white p-2 rounded hover:bg-neutral-700 transition"
                    loading={loading}
                >
                    Create
                </LoadingButton>
            </form>
        </section>
    );
}
