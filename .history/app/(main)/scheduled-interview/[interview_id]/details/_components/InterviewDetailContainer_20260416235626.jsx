import { Calendar, Clock } from 'lucide-react'
import moment from 'moment'
import React from 'react'

const InterviewDetailContainer = ({ interviewDetail }) => {
  return (
    <div className='p-5 bg-gray-100 rounded-lg mt-5'>
        <h2>{interviewDetail?.jobPosition}</h2>

        <div className='mt-4 flex items-center justify-between lg:pr-52'>
            <div>
                <h2 className='text-sm text-gray-500'>Duration</h2>
                <h2 className='flex text-sm font-bold items-center gap-2'><Clock className='h-4 w-4' /> {interviewDetail?.duration}</h2>
            </div>
            <div>
                <h2 className='text-sm text-gray-500'>Created On</h2>
                <h2 className='flex text-sm font-bold items-center gap-2'><Calendar className='h-4 w-4' /> {moment(interviewDetail?.created_at).format('MMM DD, yyyy')}</h2>
            </div>
            {interviewDetail?.type && <div>
                <h2 className='text-sm text-gray-500'>Type</h2>
                <h2 className='flex text-sm font-bold items-center gap-2'><Clock className='h-4 w-4' /> {JSON.parseinterviewDetail?.type}</h2>
            </div>}
        </div>
        <div className='mt-5'>
            <h2 className='font-bold'>Job Description</h2>
            <p>{interviewDetail?.jobPosition}</p>
        </div>
    </div>
  )
}

export default InterviewDetailContainer