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

const CandidateFeedbackDialog = () => {
  return (
    <div>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline' className='text-primary' >View Report</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Feed</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default CandidateFeedbackDialog