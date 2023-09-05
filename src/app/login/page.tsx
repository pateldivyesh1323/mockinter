'use client'
import './styles.css'
import { FormEvent, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import Link from 'next/link'

const handleLoginFormSubmit=(e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
}

export default function LoginPage():React.ReactNode{
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [hidePassword,setHidePassword] = useState<boolean>(true);

    return (
        <div className="flex items-center justify-center h-screen">
            <main className="border-2 border-zinc-300 w-[500px] h-[600px] rounded-xl bg-white py-5 px-10">
            <div className="font-dmsans text-center text-2xl font-bold">
                MockInter
            </div>
            <div className="font-dmsans text-center text-lg">
                Login
            </div>
                <form onSubmit={handleLoginFormSubmit} className="mt-7 flex flex-col">
                    <label htmlFor="email" className="form-label">Email</label>
                    <div className='form-input-field'>
                    <input type="email" name="email" id="email" placeholder="Enter your Email" className='h-full w-[90%] outline-none'/>
                    </div>
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className='form-input-field'>
                    <input type={hidePassword?"password":"text"} name="password" id="password" placeholder="Enter your Password" className='h-full w-[90%] outline-none'/>
                    <button onClick={()=>{setHidePassword(!hidePassword)}} className="form-hide-password-btn">
                        {hidePassword ? 
                            <FontAwesomeIcon icon={faEye} /> :
                            <FontAwesomeIcon icon={faEyeSlash}/>
                        }
                    </button>
                    </div>
                    <button type='submit' className='bg-black rounded-md text-white h-10 mb-2'>Login</button>
                    <div className='text-sm mb-5'>
                        <Link href='/create-account'>New to MockInter? Create Account</Link>
                    </div>
                    <div className='text-center form-with-line'>
                        or
                    </div>
                </form>
            </main>
        </div>
    )
}