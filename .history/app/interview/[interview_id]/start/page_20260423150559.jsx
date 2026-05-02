"use client"
import { InterviewDataContext } from '@/context/InterviewDataContext';
import Vapi from '@vapi-ai/web';
import { Loader2Icon, Mic, Phone, Timer, Video } from 'lucide-react';
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
    const videoRef = useRef(null);
    const [mediaError, setMediaError] = useState("");
    const {interviewInfo, setInterviewInfo} = useContext(InterviewDataContext);
    // For demo: always enabled. For real, track these from stream tracks.
    const [micEnabled, setMicEnabled] = useState(true);
    const [camEnabled, setCamEnabled] = useState(true);
    const [activeUser,setActiveUser]=useState(0);
    const [conversation, setConversation] = useState([]);
    const [timerStart, setTimerStart] = useState(false);
    const conversationRef = useRef([]);
    const {interview_id} = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState();
    if (!vapiRef.current) {
        vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY);
    }

    useEffect(() => {
        interviewInfo && startCall();
    }, [interviewInfo])

    // Camera & mic permission and video display
    useEffect(() => {
        let stream;
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((mediaStream) => {
                stream = mediaStream;
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            })
            .catch(() => {
                setMediaError("Camera or microphone permission denied.");
            });
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);
    const startCall = async () => {
        let questionsList;
        interviewInfo?.interviewContent?.questionList.forEach((item, index) => {
            questionsList = item?.question + "," + questionsList;
        });

        const assistantOptions = {
        name: "AI Recruiter",
        firstMessage: "Hi " + interviewInfo?.userName + ", how are you? Ready for your interview on " + interviewInfo?.interviewContent?.jobPosition,
        
        // transcriber: {
        //     provider: "deepgram",
        //     model: "nova-2",
        //     language: "en-US",
        // },
        // voice: {
        //     provider: "playht",
        //     voiceId: "jennifer"
        // },
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
    "Hey there! Welcome to your `+ interviewInfo?.interviewContent?.jobPosition + ` interview. Let's get started with a few questions!"
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

    useEffect(() => {
        const handleMessage = (message) => {
            console.log("New message from Vapi:", message);
            if (message?.type === "transcript" && message?.transcript) {
                const role = message.role === "assistant" ? "assistant" : "user";
                conversationRef.current.push({
                    role,
                    content: message.transcript,
                }); 
            }

        }
        vapiRef.current.on("message", handleMessage);
        vapiRef.current.on("call-start",()=>{
            conversationRef.current = [];
            setTimerStart(true);
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
            setTimerStart(false);
            toast("Interview Ended.");

            setTimeout(() => {
                GenerateFeedback();
            }, 1000);
        })

        return () => {
            vapiRef.current.off("message", handleMessage);
            // vapiRef.current.off("call-start", ()=>console.log("END"));
            // vapiRef.current.off("speech-start", ()=>console.log("END"));
            // vapiRef.current.off("speech-end", ()=>console.log("END"));
            // vapiRef.current.off("call-end", ()=>console.log("END"));
        }
    },[]);

    const GenerateFeedback = async () => {
        setLoading(true);
        console.log("Conversation for feedback:", conversation);
        const result = await axios.post('/api/ai-feedback', {
            conversation: conversationRef.current,
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const rawContent = result.data?.content;
        // console.log("API Response:", result.data);

        if (!rawContent) {
            throw new Error("No content returned from AI");
        }

        
        const cleaned = rawContent
            .replace('```json', '')
            .replace('```', '')
            .trim();

        const firstJsonMatch = cleaned.match(/\{[\s\S]*?\}/);
        const parsed = firstJsonMatch ? JSON.parse(firstJsonMatch[0]) : null;

        // const parsed = JSON.parse(cleaned);  

        const {data, error} = await supabase
            .from('interview-feedback')
            .insert([
                { userName: interviewInfo?.userName, userEmail: interviewInfo?.userEmail, interview_id: interview_id, feedback: parsed, recommended: false }
            ])
            .select();

        router.replace('/interview/' + interview_id + '/completed');
        setLoading(false);
        
        
    }
  return (
    <div className="relative h-[90.5vh] bg-[#23272f] flex flex-col justify-between pb-5">
            {/* Top bar with timer */}
            <div className="flex justify-between items-center px-8 py-4">
                <div />
                <div className="flex gap-2 items-center text-white text-lg font-semibold">
                    <Timer />
                    <TimerComponent start={timerStart} />
                </div>
            </div>

            {/* Main call area */}
            <div className="flex-1 flex items-center justify-center relative">
                {/* Central AI avatar/animation */}
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <div className="relative flex flex-col items-center justify-center">
                        {/* Animated AI avatar ring */}
                        {activeUser == 1 && <span className="absolute w-48 h-48 rounded-full bg-blue-700 opacity-30 animate-ping" />}
                        
                        {/* <span className="absolute w-32 h-32 rounded-full bg-blue-700 opacity-40 animate-pulse" /> */}
                        <Image src={'/ai.png'} alt='ai' width={100} height={100} className='w-[80px] h-[80px] rounded-full object-cover z-10'/>
                    </div>
                    <h2 className="text-white text-lg mt-4">AI Recruiter</h2>
                </div>

                {/* User video preview floating at bottom right */}
                <div className="fixed bottom-8 right-8 w-64 h-40 rounded-lg overflow-hidden border-2 border-gray-700 bg-black shadow-lg flex items-center justify-center z-20">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                    {/* Mic/Cam status icons overlay */}
                    <div className="absolute top-2 right-2 flex gap-2 z-30">
                        <span title={micEnabled ? 'Microphone On' : 'Microphone Off'}>
                            <Mic className={`w-5 h-5 ${micEnabled ? 'text-green-500' : 'text-red-500'}`} />
                        </span>
                        <span title={camEnabled ? 'Camera On' : 'Camera Off'}>
                            <Video className={`w-5 h-5 ${camEnabled ? 'text-green-500' : 'text-red-500'}`} />
                        </span>
                    </div>
                </div>
                {/* Error message for media */}
                {mediaError && <div className="fixed bottom-56 right-8 text-red-500 text-sm bg-white bg-opacity-80 px-3 py-2 rounded shadow">{mediaError}</div>}
            </div>

            {/* Control bar at the bottom */}
            <div className="w-full flex items-center justify-center gap-6 py-3 bg-[#23272f] border-t border-gray-800">
                <button className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600 transition">
                    <Mic className="h-7 w-7" />
                </button>
                {!loading ? (
                    <button className="h-12 w-12 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition" onClick={() => stopInterview()}>
                        <Phone className="h-7 w-7" />
                    </button>
                ) : (
                    <Loader2Icon className="animate-spin h-7 w-7 text-white" />
                )}
            </div>
            <h2 className='text-center text-sm text-gray-400 mt-1 animate-pulse'>Interview in Progress...</h2>
        </div>
    // <div className='p-20 lg:px-48 xl:px-56'>
    //     <h2 className='font-bold text-xl flex justify-between'>AI Interview Session
    //         <span className='flex gap-2 items-center'>
    //             <Timer />   
    //             <TimerComponent start={timerStart} />
    //         </span>
    //     </h2>
    //     <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
    //         <div className='bg-gray-100 h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
    //             <div className='relative items-center justify-center flex flex-col'>
    //                 {activeUser == 1 && <span className='absolute inset-0 rounded-full bg-primary opacity-75 animate-ping' />}
    //                 <Image src={'/ai.png'} alt='ai' width={100} height={100} className='w-[60px] h-[60px] rounded-full object-cover'/>
    //                 <h2>AI Recruiter</h2>
    //             </div>
    //         </div>
    //         <div className='bg-gray-100 h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>   
    //             <div className='relative items-center justify-center flex flex-col'>
    //                 {/* {activeUser == 2 && <span className='absolute inset-0 rounded-full bg-primary opacity-75 animate-ping' />} */}
    //                 {/* <div className="w-full h-full overflow-hidden "> */}
    //                     <video
    //                         ref={videoRef}
    //                         autoPlay
    //                         playsInline
    //                         muted
    //                         className="w-full h-full rounded-lg flex items-center justify-center object-center"
    //                     />
    //                 {/* </div> */}
    //             </div>
    //             {/* <h2>{interviewInfo?.userName}</h2> */}
    //             {/* {mediaError && <div className="text-red-500 text-sm mt-2">{mediaError}</div>} */}
    //         </div>
    //     </div>

    //     <div className='flex items-center justify-center gap-5 mt-7'>
    //         <Mic className='h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer' />
    //         {/* <AlertConfirmation stopInterview={() => stopInterview()}> */}
    //             {!loading ? <Phone className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer' onClick={() => stopInterview()} /> : <Loader2Icon className='animate-spin' />}
    //         {/* </AlertConfirmation> */}
    //     </div>
    //     <h2 className='text-center text-sm text-gray-400 mt-5 animate-pulse'>Interview in Progress...</h2>
    // </div>
  )
}

export default StartInterview