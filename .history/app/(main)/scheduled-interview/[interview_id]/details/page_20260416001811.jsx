"use client"
import { supabase } from '@/services/supabaseClient';
import { useParams } from 'next/navigation';
import React from 'react'

const InterviewDetail = () => {
    const {interview_id} = useParams();
    const GetInterviewDetail = async () => {
        const result = await supabase.from('interviews')
            .select('jobPosition, duration, interview_id, interview-feedback(userEmail)')
            .eq('userEmail', user?.email)
            .eq('interview_id', interview_id)
            .order('id', { ascending: false }) ;
    }
  return (
    <div>InterviewDetail</div>
  )
}

export default InterviewDetail