import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const CandidateFeedbackDialog = ({ candidate }) => {
    const feedback = candidate?.feedback;
  return (
    <div>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline' className='text-primary' >View Report</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Feedback</DialogTitle>
                <DialogDescription asChild>
                    <div className='mt-5'>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-5'>
                                <h2 className='bg-primary p-3 px-4.5 font-bold text-white rounded-full'>{candidate.userName[0]}</h2>
                                <div>
                                    <h2 className='font-bold'>{candidate?.userName}</h2>
                                    <h2 className='text-sm text-gray-500'>{candidate?.userEmail}</h2>
                                </div>
                            </div>
                            <div className='flex gap-3 items-center'>
                                <h2 className='text-primary text-2xl font-bold'>8/10</h2>
                            </div>
                        </div>
                        <div className='mt-5'>
                            <h2 className='font-bold'>Skills Assessment</h2>
                            <div className='mt-3 grid grid-cols-2 gap-10'>
                                <div>
                                    <h2 className='flex justify-between'>Technical Skills <span>9/10</span></h2>
                                    <Progress value={9*10} className='mt-1' />
                                </div>
                                <div>
                                    <h2 className='flex justify-between'>Communication <span>9/10</span></h2>
                                    <Progress value={9*10} className='mt-1' />
                                </div>
                                <div>
                                    <h2 className='flex justify-between'>Problem Solving <span>9/10</span></h2>
                                    <Progress value={9*10} className='mt-1' />
                                </div>
                                <div>
                                    <h2 className='flex justify-between'>Experience <span>9/10</span></h2>
                                    <Progress value={9*10} className='mt-1' />
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default CandidateFeedbackDialog