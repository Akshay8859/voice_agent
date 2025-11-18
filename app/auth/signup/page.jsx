"use client";
import Image from "next/image";
import { supabase } from "@/services/supabaseClient";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Signup = () => {
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    //const { error } = await supabase.auth.signUp({ email, password });

    let { data: Users, error } = await supabase.from('Users').select("*").eq('email', email);
          console.log(Users)
    
          if (Users?.length == 0) {
            const { data, error } = await supabase.from('Users')
              .insert([
                {
                  name: "New User",
                  email: email,
                  picture:  "https://www.gravatar.com/avatar",
                  password: password
                }
              ]);
            console.log(data);
            //setUser(data);
            
          }
          setLoading(false);
          //setUser(Users);
        

    if (error) {
      alert(error.message);
    } else {
      alert("Account created. Check your email to verify.");
    }

    setLoading(false);
  };

  const signInWithProvider = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) console.log("Error:", error.message);
  };

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

        <h2 className="text-2xl font-bold text-center">Create an Account</h2>
        <p className="text-center text-gray-500 mt-1">
          Join us and continue your journey
        </p>

        {/* OAuth Signup */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={() => signInWithProvider("google")}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border hover:bg-gray-50"
            variant="outline"
          >
            <Image src="/google.svg" alt="google" width={20} height={20} />
            Continue with Google
          </Button>

          <Button
            onClick={() => signInWithProvider("github")}
            className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-900"
          >
            <Image src="/github.svg" alt="github" width={20} height={20} />
            Continue with GitHub
          </Button>
        </div>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-2 text-gray-500 text-sm">Or sign up with</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/auth/signin" className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
