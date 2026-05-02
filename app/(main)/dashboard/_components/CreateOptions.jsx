import { Phone, Video } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CreateOptions = () => {
  return (
    <div className='grid grid-cols-2 gap-5'>
        <Link href={'/dashboard/create-interview'} className='bg-gray-100 border border-gray-50 rounded-lg p-5 cursor-pointer'>
            <Video className='p-3 text-primary bg-primary/10 rounded-lg h-12 w-12' />
            <h2 className='font-bold'>Create New Interview</h2>
            <p className='text-gray-500'>Create AI Interviews and schedule then with Candidates</p>
        </Link>
        <Link href={'/dashboard/create-phoneCall'} className='bg-gray-100 border border-gray-50 rounded-lg p-5 cursor-pointer'>
            <Phone className='p-3 text-primary bg-primary/10 rounded-lg h-12 w-12' />
            <h2 className='font-bold'>Create Phone Screening Call</h2>
            <p className='text-gray-500'>Schedule phone screening call with candidates</p>
        </Link>
    </div>
  )
}

export default CreateOptions