import { Button } from '@/components/ui/button'
import { ArrowRight, Copy, Send } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'

const JobRoleCard = ( {interview, viewDetail=false} ) => {
  return (
    <div className='p-5 bg-white rounded-lg border'>
        <div className='flex items-center justify-between'>
            <div className='h-[40px] w-[40px] bg-primary rounded-full'></div>
            <h2 className='text-sm'>{moment(interview?.created_at).format('DD MMM yyy')}</h2>
        </div>
        <h2 className='mt-3 font-bold text-lg'>{interview?.jobPosition}</h2>
        <h2 className='mt-2 flex justify-between text-gray-500'>{interview?.duration}
            {viewDetail && (
                <span>{interview['interview-feedback']?.length} Candidates</span>
            )}
        </h2>
        {!viewDetail ?  
        <div className='flex gap-3 w-full mt-5'>
            <Link href={`/dashboard/create-phoneCall/${interview?.interview_id}`} variant='outline' >  Create</Link>
        </div>
        :
            <Link href={'/scheduled-interview/' + interview?.interview_id + '/details'}>
                <Button className='mt-5 w-full' variant='outline'>View Detail <ArrowRight/></Button>
            </Link>
        }

    </div>
  )
}

export default JobRoleCard