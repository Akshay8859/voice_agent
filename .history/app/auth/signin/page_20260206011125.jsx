// "use client"
// import Image from 'next/image';
// import { supabase } from '@/services/supabaseClient'
// import React from 'react'
// import { Button } from '@/components/ui/button';

// const Login = () => {
//   const signInWithGoogle = async() => {
//     const {error}= await supabase.auth.signInWithOAuth({
//       provider:"google"
//     })
//     if(error){
//       console.log("Error signing in:", error.message)
//     }
//   }
//   return (
//     <div className='flex flex-col items-center justify-center h-screen'>
//       <div className='flex flex-col items-center border rounded-2xl p-8'>
//         <Image src={'/logo.png'} alt='logo' width={400} height={100} className='w-[180px]'/>

//         <div className='flex flex-col items-center'>
//           <Image src={'/login.png'} alt='login' width={600} height={400} className='w-[400px] h-[250px] rounded-2xl'/>
//           <h2 className='text-2xl font-bold text-center mt-5'>
//             Welcome to AlphaHire
//           </h2>
//           <p className='text-gray-500 text-center'>Sign in With Google Authentication</p>
//           <Button onClick={signInWithGoogle} className='mt-7 w-full'> Login with Google </Button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login
"use client";
import Image from "next/image";
import { supabase } from "@/services/supabaseClient";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Login = () => {
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  const signInWithProvider = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

  };
  const signInFunction = async() => {
    
      //check if new user exists
      let { data: Users, error } = await supabase.from('Users').select("*").eq('email', email).eq('password', password);
      console.log(Users)

      if (Users?.length == 0) {
        console.log("No user found, please sign up first.");
        return;
      }
       alert("login successful");
       router.push("/dashboard");
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="logo"
            width={120}
            height={40}
            className="opacity-90"
          />
        </div>

        {/* Title */}
        <h2 className="text-2- font-bold text-center">Welcome Back</h2>
        <p className="text-center text-gray-500 mt-1">
          Sign in to your account to continue
        </p>

        {/* OAuth buttons */}
        <div className="mt-6 space-y-3">

          <Button
            onClick={() => signInWithProvider("google")}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border hover:bg-gray-50 cursor-pointer"
            variant="outline"
          >
            <Image src="/google.svg" alt="google" width={20} height={20} />
            Continue with Google
          </Button>

          <Button
            onClick={() => signInWithProvider("github")}
            className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-900 cursor-pointer"
          >
            <Image src="/github.svg" alt="github" width={20} height={20} />
            Continue with GitHub
          </Button>
        </div>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-2 text-gray-500 text-sm">Or continue with</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Email login fields */}
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <Button onClick={() => signInFunction()} className="w-full bg-primary cursor-pointer">
            Sign In
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="text-indigo-600 font-semibold hover:underline">
            Sign up
          </a>
        </p>

      </div>
    </div>
  );
};

export default Login;
