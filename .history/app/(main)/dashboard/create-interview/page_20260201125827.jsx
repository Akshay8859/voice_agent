"use client"
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import FormContainer from './_components/FormContainer';
import QuestionList from './_components/QuestionList';
import { toast } from 'sonner';
import InterviewLink from './_components/InterviewLink';
import { Inter } from 'next/font/google';

const CreateInterview = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState();
    const [interviewId, setInterviewId] = useState();
    const onHandleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      console.log(formData);
    }

    const onGoToNext = () => {
      if(!formData?.jobPosition || !formData?.jobDescription || !formData?.duration || !formData?.type || formData?.type?.length == 0) {
        toast('Please fill all the fields')
        return;
      }
      setStep(prev => prev + 1);
    }
    const onCreateLink = (interview_id) => {
      setInterviewId(interview_id);
      setStep(prev => prev + 1);
    }
  return (
    <div className='px-10 md:px-24 lg:px-44 xl:px-56'>
        <div className='flex gap-5 items-center'>
            <ArrowLeft onClick={()=>router.back()} className='cursor-pointer'/>
            <h2 className='font-bold text-2xl'>Create New Interview</h2>
        </div>
        <Progress value={step * 33.33} className='my-5'/> 
        {step == 1 ? <FormContainer onHandleInputChange={onHandleInputChange} GoToNext={() => onGoToNext()}/>
        : step == 2 ? <QuestionList formData={formData} onCreateLink={(interview_id) => onCreateLink(interview_id)} /> 
        : step == 3 ? <InterviewLink interview_id={interviewId} formData={formData} /> : null}
    </div>
  )
}

export default CreateInterview