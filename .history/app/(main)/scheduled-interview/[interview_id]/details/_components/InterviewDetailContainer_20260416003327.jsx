import React from 'react'

const InterviewDetailContainer = ({ interviewDetail }) => {
  return (
    <div className='p-5 bg-gray-500 rounded-lg'>
        <h2>{interviewDetail?.jobPosition}</h2>
    </div>
  )
}

export default InterviewDetailContainer