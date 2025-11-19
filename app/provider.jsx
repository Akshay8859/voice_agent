"use client"
import { UserDetailContext } from '@/context/UserDetailContext';
import { supabase } from '@/services/supabaseClient'
import { User } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'


function Provider({children}){
    const [user,setUser]=useState(null);
    useEffect(()=>{
        CreateNewUser();
    },[])
    const CreateNewUser=()=>{
        supabase.auth.getUser().then(async({data:{user}})=>{
            //check if new user exists
            let {data:Users,error}=await supabase.from('Users').select("*").eq('email',user?.email);
            console.log(Users)
  
           if(Users?.length==0){
               const { data, error } =await supabase.from('Users')
               .insert([
                {
                    name:user?.user_metadata?.name || "New User",
                    email:user?.email,
                    picture:user?.user_metadata?.picture || "https://www.gravatar.com/avatar",
                }
               ]);
               console.log(data);  
               setUser(data);
               return ;
           }
           setUser(Users[0]);
        })
        

    }
  return (
    <UserDetailContext.Provider value={{user,setUser}}>
      <div>
        {children}
      </div>
    </UserDetailContext.Provider>
  )
}

export default Provider

export const useUserDetail = () =>{
    const context=useContext(UserDetailContext);
    return context;
} 
