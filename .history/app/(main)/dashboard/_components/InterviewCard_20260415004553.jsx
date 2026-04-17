import moment from 'moment'
import React from 'react'

const InterviewCard = ( {interview} ) => {
  return (
    <div className='p-5 bg-white rounded-lg border'>
        <div className='flex items-center justify-between'>
            <div className='h-[40px] w-[40px] bg-primary rounded-full'></div>
            <h2 className='text-sm'>{moment(interview?.created_at).format('DD MMM yyy')}</h2>
        </div>
        <h2></h2>
    </div>
  )
}

export default InterviewCard