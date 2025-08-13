"use client"
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'
import React from 'react'

const Login = () => {
  const signInWithGoogle = async() => {
    const {error}= await supabase.auth.signInWithOAuth({
      provider:"google"
    })
    if(error){
      console.log("Error signing in:", error.message)
    }
  }
  return (
    <div>
      <div>
        <h1>Login</h1>
        <p>Please login to your account</p>
      </div>
      <Button onClick={signInWithGoogle}>Login with Google</Button>
    </div>
  )
}

export default Login
