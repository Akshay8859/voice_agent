"use client"
import { useUserDetail } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import InterviewDetailContainer from './_components/InterviewDetailContainer';

const InterviewDetail = () => {
    const {interview_id} = useParams();
    const {user} = useUserDetail();

    useEffect(() => {
        user && GetInterviewDetail();
    }, [user])

    const GetInterviewDetail = async () => {
        const result = await supabase.from('interviews')
            .select('jobPosition, jobDescription, type, questionList, duration, interview_id, created interview-feedback(userEmail)')
            .eq('userEmail', user?.email)
            .eq('interview_id', interview_id);
    }
  return (
    <div className='mt-5'>
        <h2 className='font-bold text-2xl'>Interview Detail</h2>
        <InterviewDetailContainer  />
    </div>
  )
}

export default InterviewDetail