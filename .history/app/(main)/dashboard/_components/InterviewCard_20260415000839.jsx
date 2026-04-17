import React from 'react'

const InterviewCard = ( {interview} ) => {
  return (
    <div>
        <div>
            <div className='h-[40px] w-[40px] bg-primary rounded-full'></div>
            <h2>{moment(interview?.created_at}</h2>
        </div>
    </div>
  )
}

export default InterviewCard