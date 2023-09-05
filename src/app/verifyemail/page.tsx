'use client'
import { useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';

type params = {
    params:{
        token:string
    }
}

export default function VerifyEmailPage({
    searchParams,
  }: {
    searchParams: { [key: string]: string | string[] | undefined }
  }):React.ReactNode{
    const { token, email } = searchParams;

    const [verified,setVerified] = useState(false);
    const [loading,setLoading] = useState(false);
    

    const verifyEmailHandler = async ()=>{
        setLoading(true);
        try{
            const verifyRes = await fetch('/api/user/verifyemail',{
                method:'POST',
                headers:{
                'Content-type':'application/json'
                },
                body:JSON.stringify({token})
            });
        
            if(verifyRes.ok)setVerified(true)
        }
        catch(error)
        {
            console.log(error);
        }
        setLoading(false);
    }
    
    return(
        <main className='h-screen flex justify-center items-center flex-col'>
            <div className='text-xl mb-4 font-semibold'>{email}</div>
            <button 
                className="text-white bg-black rounded-md w-72 h-10 text-lg flex items-center justify-center" 
                onClick={verifyEmailHandler} 
                disabled={loading || verified}
            >
            {
            loading ?
                <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="35"
                    visible={true}
                />
                :
                !verified?"Verify your Email Address":"✅ Email address verified!"
            }
            </button>
        </main>
    )
}