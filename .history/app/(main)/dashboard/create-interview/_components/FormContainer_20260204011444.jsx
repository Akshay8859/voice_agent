import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"     
import React, { useEffect, useState } from 'react'
import { InterviewType } from '@/services/Constants'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FormContainer = ({onHandleInputChange, GoToNext}) => {
  const [interviewType, setInterviewType] = useState([]);
  useEffect(() => {
    if(interviewType) {
      onHandleInputChange('type', interviewType);
    }
  }, [interviewType]);

  const AddInterviewType = (type) => {
    const data = interviewType.includes(type);
    if(!data) {
      setInterviewType(prev=>[...prev, type]);
    } else{
      const filteredTypes = interviewType.filter(t => t !== type);
      setInterviewType(filteredTypes);
    }
  }
  return (
    <div className='p-5 bg-gray-100 rounded-xl'>
      <div>
        <h2 className='text-sm font-medium'>Job Position</h2>
        <Input placeholder="e.g. Full Stack Developer" className='mt-2' onChange={(e) => onHandleInputChange('jobPosition', e.target.value)} />
      </div>

      <div className='mt-5'>
        <h2 className='text-sm font-medium'>Job Description</h2>
        <Textarea placeholder="Enter detailed job description" className='h-[200px] mt-2' onChange={(e) => onHandleInputChange('jobDescription', e.target.value)} />
      </div>

      <div className='mt-5'>
        <h2 className='text-sm font-medium'>Interview Duration</h2>
        <Select onValueChange={(value) => onHandleInputChange('duration', value)}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5 Min">5 Min</SelectItem>
            <SelectItem value="15 Min">15 Min</SelectItem>
            <SelectItem value="30 Min">30 Min</SelectItem>
            <SelectItem value="45 Min">45 Min</SelectItem>
            <SelectItem value="60 Min">60 Min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='mt-5'>
        <h2 className='text-sm font-medium  '>Interview Type</h2>
        <div className='flex gap-3 flex-wrap mt-2'>
          {InterviewType.map((type, index) => (
            <div key={index} className={`flex items-center gap-2 hover:bg-white p-1 px-2 border border-gray-300 rounded-2xl cursor-pointer ${interviewType.includes(type.title) && 'bg-primary/10 text-primary'}`} onClick={()=>AddInterviewType(type.title)} >
              <type.icon className='h-4 w-4' />
              <span>{type.title}</span>
            </div>
          ))}
        </div>   
      </div>
      <div className='mt-7 flex justify-end' onClick={() => GoToNext()} >
        <Button className='cursor-pointer' >Generate Question <ArrowRight /> </Button>
      </div>
    </div>
  )
}

export default FormContainer
