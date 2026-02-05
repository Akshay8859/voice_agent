"use client"
import { InterviewDataContext } from '@/context/InterviewDataContext';
import Vapi from '@vapi-ai/web';
import { Loader2Icon, Mic, Phone, Timer } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react'
import AlertConfirmation from './_components/AlertConfirmation';
import TimerComponent from './_components/TimerComponent';
import { toast } from 'sonner';
import axios from 'axios';
import { supabase } from '@/services/supabaseClient';
import { useParams, useRouter } from 'next/navigation';


const StartInterview = () => {
    const vapiRef = useRef(null);
    const {interviewInfo, setInterviewInfo} = useContext(InterviewDataContext);
    const [activeUser,setActiveUser]=useState(0);
    const [conversation, setConversation] = useState();
    const {interview_id} = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState();
    if (!vapiRef.current) {
        vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY);
    }

    useEffect(() => {
        interviewInfo && startCall();
    }, [interviewInfo])

    const startCall = async () => {
        let questionsList;
        interviewInfo?.interviewData?.questionsList.forEach((item, index) => {
            questionsList = item?.question + "," + questionsList;
        });

        const assistantOptions = {
        name: "AI Recruiter",
        firstMessage: "Hi " + interviewInfo?.userName + ", how are you? Ready for your interview on " + interviewInfo?.interviewData?.jobPosition,
        model: {
            provider: "openai",
            model: "gpt-4o-mini",
            messages: [
            {
                role: "system",
                content: `
    You are an AI voice assistant conducting interviews.
    Your job is to ask candidates provided interview questions, assess their responses.
    Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
    "Hey there! Welcome to your `+ interviewInfo?.interviewData?.jobPosition + ` interview. Let's get started with a few questions!"
    Ask one question at a time and wait for the candidate's response before proceeding. Keep questions clear and concise. Below Are the questions ask one by one.
    Questions: `+ questionsList + `

    If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
    "Need a hint? Think about how React tracks component updates."
    Provide brief, encouraging feedback after each answer. Example:
    "Nice! That's a solid answer."
    "Hmm, not quite. Want to try again?"
    Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
    After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
    "I'm glad you handled some tough questions well. Keep sharpening your skills!"
    End on a positive note:
    "Thanks for chatting! Hope to see you crushing projects soon!"

    Key Guidelines:
    ✓ Be friendly, engaging, and witty
    ✓ Keep responses short and natural, like a real conversation
    ✓ Adapt based on the candidate's confidence level
    ✓ Ensure the conversation remains focused on React interview
            `.trim(),
            },
            ],
        },
    };

    await vapiRef.current.start(assistantOptions);
    };

    const stopInterview = () => {
        vapiRef.current?.stop();
    };

    // vapiRef.current.on("call-start",()=>{
    //     toast("Call Connected..");
    // })

    // vapiRef.current.on("speech-start",()=>{
    //     setActiveUser(1)
    // })
    // vapiRef.current.on("speech-end",()=>{
    //     setActiveUser(2)
    // })
    // vapiRef.current.on("call-end",()=>{
    //     setActiveUser(0)
    //     toast("Interview Ended.");
    //     GenerateFeedback();
    // })
    // vapiRef.current.on("message", (message) => {
    //     console.log("New message from Vapi:", message);
    //     setConversation(message?.conversation);
    // });

    useEffect(() => {
        const handleMessage = (message) => {
            console.log("New message from Vapi:", message);
            if(message?.conversation){
                const convoString = JSON.stringify(message.conversation);
                setConversation(convoString);
            }
        }
        vapiRef.current.on("message", handleMessage);
        vapiRef.current.on("call-start",()=>{
            toast("Call Connected..");
        })

        vapiRef.current.on("speech-start",()=>{
            setActiveUser(1)
        })
        vapiRef.current.on("speech-end",()=>{
            setActiveUser(2)
        })
        vapiRef.current.on("call-end",()=>{
            setActiveUser(0)
            toast("Interview Ended.");
            GenerateFeedback();
        })

        return () => {
            vapiRef.current.off("message", handleMessage);
            vapiRef.current.off("call-start", ()=>{});
            vapiRef.current.off("speech-start", ()=>{});
            vapiRef.current.off("speech-end", ()=>{});
            vapiRef.current.off("call-end", ()=>{});
        }
    },[]);

    const GenerateFeedback = async () => {
        setLoading(true);
        const result = await axios.post('/api/ai-feedback', {
            conversation: conversation,
        })

        const rawContent = result.data?.content;

        if (!rawContent) {
            throw new Error("No content returned from AI");
        }

        // Remove markdown safely
        const cleaned = rawContent
            .replace('```json', '')
            .replace('```', '')
            .trim();

        const parsed = JSON.parse(cleaned);

        const {data, error} = await supabase
            .from('interview-feedback')
            .insert([
                { userName: interviewInfo?.userName, userEmail: interviewInfo?.userEmail, interviewId: interview_id, feedback: parsed, recommended: false }
            ])
            .select();

        router.replace('/interview/' + interview_id + '/completed');
        setLoading(false);
        
        
    }
  return (
    <div className='p-20 lg:px-48 xl:px-56'>
        <h2 className='font-bold text-xl flex justify-between'>AI Interview Session
            <span className='flex gap-2 items-center'>
                <Timer />
                {/* 00:00:00 */}
                <TimerComponent start={true} />
            </span>
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
            <div className='bg-gray-100 h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
                <div className='relative'>
                    {!activeUser && <span className='absolute inset-0 rounded-full bg-primary/10 opacity-75 animate-ping' />}
                    <Image src={'/ai.png'} alt='ai' width={100} height={100} className='w-[60px] h-[60px] rounded-full object-cover'/>
                    <h2>AI Recruiter</h2>
                </div>
            </div>
            <div className='bg-gray-100 h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
                <div className='relative'>
                    {!activeUser && <span className='absolute inset-0 rounded-full bg-primary/10 opacity-75 animate-ping' />}
                    <h2 className='text-2xl bg-primary h-[50px] w-[50px] text-white p-3 rounded-full px-6'>{interviewInfo?.userName[0]}</h2>
                </div>
                <h2>{interviewInfo?.userName}</h2>
            </div>
        </div>

        <div className='flex items-center justify-center gap-5 mt-7'>
            <Mic className='h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer' />
            {/* <AlertConfirmation stopInterview={() => stopInterview()}> */}
                {!loading ? <Phone className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer' onClick={() => stopInterview()} /> : <Loader2Icon className='animate-spin' />}
            {/* </AlertConfirmation> */}
        </div>
        <h2 className='text-center text-sm text-gray-400 mt-5 animate-pulse'>Interview in Progress...</h2>
    </div>
  )
}

export default StartInterview