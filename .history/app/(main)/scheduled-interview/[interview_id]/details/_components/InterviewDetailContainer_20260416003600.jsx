import React from 'react'

const InterviewDetailContainer = ({ interviewDetail }) => {
  return (
    <div className='p-5 bg-gray-100 rounded-lg mt'>
        <h2>{interviewDetail?.jobPosition}</h2>
    </div>
  )
}

export default InterviewDetailContainer