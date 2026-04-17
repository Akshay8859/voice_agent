import React from 'react'

const ScheduledInterview = () => {
    const  GetInterviewList = () => {
        const result = await supabase.from('interviews')
        .select('jobPosition, duration, interview_id, interview-feedback(userE')
    }
  return (
    <div>ScheduledInterview</div>
  )
}

export default ScheduledInterview