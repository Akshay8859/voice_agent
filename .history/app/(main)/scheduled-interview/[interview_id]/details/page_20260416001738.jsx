"use client"
import { useParams } from 'next/navigation';
import React from 'react'

const InterviewDetail = () => {
    const {interview_id} = useParams();
    const GetInterviewDetail = () => {
        const result = await supabase.from('interviews')
            .select('jobPosition, duration, interview_id, interview-feedback(userEmail)')
            .eq('userEmail', user?.email)
            .order('id', { ascending: false }) ;
    }
  return (
    <div>InterviewDetail</div>
  )
}

export default InterviewDetail