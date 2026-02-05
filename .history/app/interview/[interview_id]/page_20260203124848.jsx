"use client"
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { Clock, Info, Loader2Icon, Video } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import { toast } from 'sonner'
import { InterviewDataContext } from '@/context/InterviewDataContext'

const Interview = () => {

    const { interview_id } = useParams();
    const [interviewData, setInterviewData] = useState();
    const [userName, setUserName] = useState();
    const [userEmail, setUserEmail] = useState();
    const [loading, setLoading] = useState(false);
    const {interviewInfo, setInterviewInfo} = useContext(InterviewDataContext);
    const router = useRouter();

    console.log(interviewInfo.interviewData ); 
    useEffect(() => {
        interview_id && GetInterviewDetails();
    }, [interview_id]);
    
    const GetInterviewDetails = async () => {
        setLoading(true);
        try {
            let {data: Interviews, error } = await supabase
                .from('interviews')
                .select("jobPosition,jobDescription,duration,type")
                .eq('interview_id', interview_id)
            
            setInterviewData(Interviews?.[0]);
            setLoading(false);

            if(Interviews?.length === 0){
                throw new Error("Incorrect Interview Link");
            }
        } catch (e) {
            setLoading(false);
            toast.error("Incorrect Interview Link");
        }
    }

    const onJoinInterview = async () => {
        setLoading(true);
        let { data: Interviews, error } = await supabase
            .from('interviews')
            .select("*")
            .eq('interview_id', interview_id);

        setInterviewInfo({
            ...Interviews?.[0],
            userName: userName,
            userEmail: userEmail,
        });

        router.push(`/interview/${interview_id}/start`);
        setLoading(false);

    }
  return (
    <div className='px-10 md:px-28 lg:px-48 xl:px-64 mt-16'>
        <div className='flex flex-col items-center justify-center border rounded-lg bg-gray-100 p-7 lg:px-33 xl:px-52 mb-20'>
            <Image src={'/logo.png'} alt='logo' width={200} height={100} className='w-[140px]'/>
            <h2 className=''>AI-Powered Interview Platform</h2>

            <Image src={'/interview.jpg'} alt='interview' width={500} height={500} className='w-[280px] my-5 rounded-4xl' />

            <h2 className='font-bold text-xl'>{interviewData?.jobPosition}</h2>
            <h2 className='flex gap-2 items-center text-gray-500 mt-3'><Clock className='h-4 w-4'/> {interviewData?.duration}</h2>

            <div className='w-full'>
                <h2>Enter your full name</h2>
                <Input placeholder='e.g. John Smith' onChange={(e) => setUserName(e.target.value)}/>
            </div>
            <div className='w-full'>
                <h2>Enter your email</h2>
                <Input placeholder='e.g. john@company.com' onChange={(e) => setUserEmail(e.target.value)}/>
            </div>
            
            <div className='p-3 bg-primary/10 flex gap-4 rounded-lg mt-6'>
                <Info className='text-primary'/>
                <div>
                    <h2 className='font-bold'>Before you begin</h2>
                    <ul className=''>
                        <li className='text-sm text-primary'>- Test your camera and microphone.</li>
                        <li className='text-sm text-primary'>- Ensure you have a stable internet connection.</li>
                        <li className='text-sm text-primary'>- Find a quiet place for interview.</li>
                    </ul>
                </div>
            </div>

            <Button className={'mt-5 w-full font-bold'} disabled={loading || (!userName && !userEmail)} onClick={()=>onJoinInterview()} > <Video/> {loading && <Loader2Icon />} Join Interview</Button>
        </div>
    </div>
  )
}

export default Interview