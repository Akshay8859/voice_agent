"use client"
import { useUserDetail } from '@/app/provider';
import Image from 'next/image';
import React from 'react'

const WelcomeContainer = () => {
    const {user} = useUserDetail();
    console.log("user", user);
  return (
    <div className='bg-gray-100 p-5 rounded-2xl flex justify-between items-center'>
        <div>
            <h2 className='text-lg font-bold'>Welcome Back, {user?.name} </h2>
            <h2 className='text-gray-500'>AI- Driven Interviews, Hassel-Free Hiring</h2>
        </div>
        {user && <Image src={user?.picture} alt='useAvatar' width={40} height={40} className='rounded-full'/>}
    </div> 
  )
}

export default WelcomeContainer