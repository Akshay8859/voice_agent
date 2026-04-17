import { Calendar, Clock } from 'lucide-react'
import React from 'react'

const InterviewDetailContainer = ({ interviewDetail }) => {
  return (
    <div className='p-5 bg-gray-100 rounded-lg mt-5'>
        <h2>{interviewDetail?.jobPosition}</h2>

        <div className='mt-4 flex items-center justify-between'>
            <div>
                <h2 className='text-sm text-gray-500'>Duration</h2>
                <h2 className='flex text-sm font-bold items-center gap-3'><Clock className='h-4 w-4' /> {interviewDetail?.duration}</h2>
            </div>
            <div>
                <h2 className='text-sm text-gray-500'>Created On</h2>
                <h2 className='flex text-sm font-bold items-center gap-3'><Calendar className='h-4 w-4' /> {momentinterviewDetail?.created_at}</h2>
            </div>
            <div>
                <h2 className='text-sm text-gray-500'>Duration</h2>
                <h2 className='flex text-sm font-bold items-center gap-3'><Clock className='h-4 w-4' /> {interviewDetail?.duration}</h2>
            </div>
        </div>
    </div>
  )
}

export default InterviewDetailContainer