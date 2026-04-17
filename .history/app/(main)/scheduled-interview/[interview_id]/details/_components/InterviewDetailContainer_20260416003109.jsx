import React from 'react'

const InterviewDetailContainer = ({ interviewDetail }) => {
  return (
    <div className='p-5 bg- rounded-lg'>
        <h2>{interviewDetail?.jobPosition}</h2>
    </div>
  )
}

export default InterviewDetailContainer