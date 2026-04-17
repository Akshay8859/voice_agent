"use client"
import { useUserDetail } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';
import React from 'react'

const ScheduledInterview = () => {

    const { user } = useUserDetail();
    const [interviewList, setInterviewList] = useState();
    useEffect(() => {
        user && GetInterviewList();
    }, [user])

    const  GetInterviewList = async () => {
        const result = await supabase.from('interviews')
        .select('jobPosition, duration, interview_id, interview-feedback(userEmail')
        .eq('userEmail', user?.email)
        .order('id', { ascending: false }) ;

        
    }
  return (
    <div>ScheduledInterview</div>
  )
}

export default ScheduledInterview