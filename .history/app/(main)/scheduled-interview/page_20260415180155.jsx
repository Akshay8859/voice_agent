import React from 'react'

const ScheduledInterview = () => {
    const  GetInterviewList = () => {
        const result = await supabase.from('interviews')
        .select()
    }
  return (
    <div>ScheduledInterview</div>
  )
}

export default ScheduledInterview