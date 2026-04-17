import React from 'react'

const InterviewDetailContainer = ({ interviewDetail }) => {
  return (
    <div className='p-5 bg-grey-700 roun'>
        <h2>{interviewDetail?.jobPosition}</h2>
    </div>
  )
}

export default InterviewDetailContainer