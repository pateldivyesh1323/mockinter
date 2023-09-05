'use client'
import Link from "next/link"
import { FormEvent, useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { RotatingLines } from "react-loader-spinner";

export default function CreateAccount():React.ReactNode{

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmpassword,setConfirmpassword] = useState("");
    const [loading,setLoading] = useState(false);

    const handleCreateAccountFormSubmit = async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setLoading(true);
        if(!name || !email || !password || !confirmpassword)
        {
            console.log("Please provide all credentials!");
        }
        else if(password!==confirmpassword)
        {
            console.log("Passwords does not match!");
        }
        else 
        {
            try{
                const data = await fetch("/api/user/signup",{
                    method:'POST',
                    headers:{
                        'Content-type':'application/json',
                    },
                    body:JSON.stringify({name,email,password})
                })
                const {token} = await data.json();
                localStorage.setItem("token",token);
                // redirect('/home');
            }
            catch(error)
            {
                console.log(error);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        if(localStorage.getItem("token"))
        {
            redirect('/home');
        }
    }, [])

    return(
        <div className="flex items-center justify-center h-screen">
        <main className="border-2 border-zinc-300 w-[500px] h-[600px] rounded-xl bg-white py-5 px-10">
            <div className="font-dmsans text-center text-2xl font-bold">
                MockInter
            </div>
            <div className="font-dmsans text-center text-lg">
                Create new account
            </div>
            <form onSubmit={handleCreateAccountFormSubmit} className="mt-7 flex flex-col">
                <label htmlFor="name" className="form-label">Name</label>
                <div className='form-input-field'>
                <input type="text" name="name" id="name" placeholder="Enter your Name" className='h-full w-[90%] outline-none' value={name} onChange={(e)=>{setName(e.target.value)}}/>
                </div>
                <label htmlFor="email" className="form-label">Email</label>
                <div className='form-input-field'>
                <input type="email" name="email" id="email" placeholder="Enter your Email" className='h-full w-[90%] outline-none' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                </div>
                <label htmlFor="password" className="form-label">Password</label>
                <div className='form-input-field'>
                <input type="password" name="password" id="password" placeholder="Enter your Password" className='h-full w-[90%] outline-none' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                </div>
                <label htmlFor="confirmpassword" className="form-label">Confirm password</label>
                <div className='form-input-field'>
                <input type="text" name="confirmpassword" id="confirmpassword" placeholder="Confirm your password" className='h-full w-[90%] outline-none' value={confirmpassword} onChange={(e)=>{setConfirmpassword(e.target.value)}}/>
                </div>
                <button type='submit' className='bg-black rounded-md text-white h-10 mb-2 flex items-center justify-center' disabled={loading}>
                {loading ?
                    <RotatingLines
                        strokeColor="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="35"
                        visible={true}
                    />
                    : "Create account"}
                </button>
            </form>
                <div className='text-sm mb-5'>
                    <Link href='/login'>Already have an account? Login</Link>
                </div>
                <div className='text-center form-with-line'>
                    or
                </div>
        </main>
    </div>
    )
}