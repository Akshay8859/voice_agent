"use client"
import { useUserDetail } from '@/app/provider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient';
import { Video } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import JobRoleCard from './_components/JobRoleCard';

const CreatePhoneCall = () => {
    const [interviewList, setInterviewList] = useState([]);
    const { user } = useUserDetail();

    useEffect(() => {
        user && GetInterviewList();
    }, [user])
    const GetInterviewList = async () => {
        let { data: Interviews, error } = await supabase
            .from('interviews')
            .select("*")
            .eq('userEmail', user?.email)
            .order('id', { ascending: false })
            .limit(6)
            ;
        setInterviewList(Interviews);
    }
    return (
        <div className='my-5'>
        <h2 className='font-bold text-2xl text-center'>Create Face to Face interviews</h2>
        <p>Select for which job role you want to create interviews</p>
        {interviewList?.length == 0 && 
          <div className='p-5 flex flex-col gap-3 items-center mt-5'>
            <Video className='h-10 w-10 text-primary' />
            <h2>You don't have any active job roles</h2>
          </div>
        }
        {interviewList && 
          <div className='grid grid-cols-4 mt-5 xl:grid-cols-3 gap-5'>
            {interviewList.map((interview, index) => (
              <JobRoleCard interview={interview} key={index} />
            ))}
          </div>
        } 
    </div>
    )
}

export default CreatePhoneCall;
