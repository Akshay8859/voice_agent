"use client"
import { useUserDetail } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'

const InterviewDetail = () => {
    const {interview_id} = useParams();
    const {user} = useUserDetail();

    useEffect(() => {
        user && GetInterviewDetail();
    }, [user])

    const GetInterviewDetail = async () => {
        const result = await supabase.from('interviews')
            .select('jobPosition, duration, interview_id, interview-feedback(userEmail)')
            .eq('userEmail', user?.email)
            .eq('interview_id', interview_id);
    }
  return (
    <div>
        <h2 className=''>Interview Detail</h2>
    </div>
  )
}

export default InterviewDetail