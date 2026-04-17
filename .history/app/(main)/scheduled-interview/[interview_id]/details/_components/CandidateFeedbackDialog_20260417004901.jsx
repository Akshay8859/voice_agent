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

const CandidateFeedbackDialog = ({ candidate }) => {
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
                    <div>

                    </div>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default CandidateFeedbackDialog