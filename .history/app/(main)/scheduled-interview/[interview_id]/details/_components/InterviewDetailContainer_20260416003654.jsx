import { Clock } from 'lucide-react'
import React from 'react'

const InterviewDetailContainer = ({ interviewDetail }) => {
  return (
    <div className='p-5 bg-gray-100 rounded-lg mt-5'>
        <h2>{interviewDetail?.jobPosition}</h2>

        <div>
            <div>
                <h2>Duration</h2>
                <h2><Clock /></h2>
            </div>
        </div>
    </div>
  )
}

export default InterviewDetailContainer