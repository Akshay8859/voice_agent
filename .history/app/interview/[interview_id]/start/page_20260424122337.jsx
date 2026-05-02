"use client"
import { InterviewDataContext } from '@/context/InterviewDataContext';
import Vapi from '@vapi-ai/web';
import { CircleDot, Clock, Clock10, Loader2Icon, Mic, MicOff, Phone, Timer, Video, VideoOff } from 'lucide-react';
import SpeakingIcon from '@/components/ui/speaking-icon';
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
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const streamRef = useRef(null);
  const [activeUser, setActiveUser] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [timerStart, setTimerStart] = useState(false);
  const conversationRef = useRef([]);
  const { interview_id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState();
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const {
  data: { user },
} = await supabase.auth.getUser()

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
          streamRef.current = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
          // Setup MediaRecorder
          try {
            const options = { mimeType: 'video/webm;codecs=vp8,opus' };
            const mediaRecorder = new window.MediaRecorder(mediaStream, options);
            mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data);
              }
            };
            mediaRecorderRef.current = mediaRecorder;
          } catch (err) {
            setMediaError('MediaRecorder not supported: ' + err.message);
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

    // Mute/unmute mic
    const handleToggleMic = () => {
        const stream = streamRef.current;
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !micEnabled;
            });
        }
        setMicEnabled((prev) => !prev);
    };

    // Video on/off
    const handleToggleCam = () => {
        const stream = streamRef.current;
        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.enabled = !camEnabled;
            });
        }
        setCamEnabled((prev) => !prev);
    };
    // Start recording
    const startRecording = () => {
      recordedChunksRef.current = [];
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
        mediaRecorderRef.current.start();
      }
    };

    // Stop recording and upload
    const stopRecordingAndUpload = async () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        await new Promise((resolve) => {
          mediaRecorderRef.current.onstop = resolve;
          mediaRecorderRef.current.stop();
        });
      }
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const fileName = `interview-${interview_id}-${Date.now()}.webm`;
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from('proctoring-data').upload(fileName, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'video/webm',
      });
      if (error) {
        toast.error('Failed to upload recording: ' + error.message);
      } else {
        toast.success('Recording uploaded to proctoring-data!');
      }
    };

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
      startRecording();
    };

    const stopInterview = () => {
      vapiRef.current?.stop();
      stopRecordingAndUpload();
      // Stop all media tracks (camera and mic)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setMicEnabled(false);
      setCamEnabled(false);
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
        vapiRef.current.on("call-end", async () => {
          setActiveUser(0)
          setTimerStart(false);
          toast("Interview Ended.");
          await stopRecordingAndUpload();
            // Stop all media tracks (camera and mic) on call end as well
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
          setMicEnabled(false);
          setCamEnabled(false);
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

        // const firstJsonMatch = cleaned.match(/\{[\s\S]*?\}/);
        // const parsed = firstJsonMatch ? JSON.parse(firstJsonMatch[0]) : null;

        const parsed = JSON.parse(cleaned);  

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
    // <div className="relative h-[90.5vh] bg-[#23272f] flex flex-col justify-between pb-5">
    //         {/* Top bar with timer */}
    //         <div className="flex justify-between items-center px-8 py-4">
    //             <div />
    //             <div className="flex gap-2 items-center text-white text-lg font-semibold">
    //                 <Timer />
    //                 <TimerComponent start={timerStart} />
    //             </div>
    //         </div>

    //         {/* Main call area */}
    //         <div className="flex-1 flex items-center justify-center relative">
    //             {/* Central AI avatar/animation */}
    //             <div className="flex flex-col items-center justify-center w-full h-full">
    //                 <div className="relative flex flex-col items-center justify-center">
    //                     {/* Animated AI avatar ring */}
    //                     {activeUser == 1 && <span className="absolute w-48 h-48 rounded-full bg-blue-700 opacity-30 animate-ping" />}
                        
    //                     {/* <span className="absolute w-32 h-32 rounded-full bg-blue-700 opacity-40 animate-pulse" /> */}
    //                     <Image src={'/ai.png'} alt='ai' width={100} height={100} className='w-[80px] h-[80px] rounded-full object-cover z-10'/>
    //                 </div>
    //                 <h2 className="text-white text-lg mt-4">AI Recruiter</h2>
    //             </div>

    //             {/* User video preview floating at bottom right */}
    //             <div className="fixed bottom-8 right-8 w-64 h-40 rounded-lg overflow-hidden border-2 border-gray-700 bg-black shadow-lg flex items-center justify-center z-20">
    //                 <video
    //                     ref={videoRef}
    //                     autoPlay
    //                     playsInline
    //                     muted
    //                     className="w-full h-full object-cover"
    //                 />
    //                 {/* Mic/Cam status icons overlay */}
    //                 <div className="absolute top-2 right-2 flex gap-2 z-30">
    //                     <span title={micEnabled ? 'Microphone On' : 'Microphone Off'}>
    //                         {micEnabled ? (
    //                             <Mic className="w-5 h-5 text-green-500" />
    //                         ) : (
    //                             <MicOff className="w-5 h-5 text-red-500" />
    //                         )}
    //                     </span>
    //                     <span title={camEnabled ? 'Camera On' : 'Camera Off'}>
    //                         {camEnabled ? (
    //                             <Video className="w-5 h-5 text-green-500" />
    //                         ) : (
    //                             <VideoOff className="w-5 h-5 text-red-500" />
    //                         )}
    //                     </span>
    //                 </div>
    //             </div>
    //             {/* Error message for media */}
    //             {mediaError && <div className="fixed bottom-56 right-8 text-red-500 text-sm bg-white bg-opacity-80 px-3 py-2 rounded shadow">{mediaError}</div>}
    //         </div>

    //         {/* Control bar at the bottom */}
    //         <div className="w-full flex items-center justify-center gap-6 py-3 bg-[#23272f] border-t border-gray-800">
    //             <button
    //                 className={`h-12 w-12 flex items-center justify-center rounded-full ${micEnabled ? 'bg-gray-700' : 'bg-red-700'} text-white hover:bg-gray-600 transition`}
    //                 onClick={handleToggleMic}
    //                 title={micEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
    //             >
    //                 {micEnabled ? <Mic className="h-7 w-7" /> : <MicOff className="h-7 w-7" />}
    //             </button>
    //             <button
    //                 className={`h-12 w-12 flex items-center justify-center rounded-full ${camEnabled ? 'bg-gray-700' : 'bg-red-700'} text-white hover:bg-gray-600 transition`}
    //                 onClick={handleToggleCam}
    //                 title={camEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
    //             >
    //                 {camEnabled ? <Video className="h-7 w-7" /> : <VideoOff className="h-7 w-7" />}
    //             </button>
    //             {!loading ? (
    //                 <button className="h-12 w-12 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition" onClick={() => stopInterview()}>
    //                     <Phone className="h-7 w-7" />
    //                 </button>
    //             ) : (
    //                 <Loader2Icon className="animate-spin h-7 w-7 text-white" />
    //             )}
    //         </div>
    //         <h2 className='text-center text-sm text-gray-400 mt-1 animate-pulse'>Interview in Progress...</h2>
    //     </div>






    <div className="h-[90vh] bg-[#f6f7fa] flex flex-col">

      {/* Main Card */}
      <div className="flex-1 flex items-center justify-center py-8 px-2">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl flex flex-col p-0">
          {/* Interview Title & Status */}
          <div className="flex items-center justify-between px-8 pt-6 pb-2">
            <div className="flex items-center gap-2">
              <CircleDot className="text-green-500" />
              <span className="font-semibold text-lg">AI Interview</span>
            </div>
            <div className="flex items-center gap-4">
              <Timer className="w-5 h-5 text-gray-500" />
              <span className="font-semibold">Interview Time Left</span>
              {/* <span className="font-mono text-lg">05:13</span> */}
                <TimerComponent start={timerStart} interviewDuration={interviewInfo?.duration} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex gap-6 px-8 pb-8 pt-2">
            {/* Video Section */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Mic status */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  
                        {activeUser === 2 && <SpeakingIcon size={24} color="#A3D86E" />}

                </div>
                {/* Rec status */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-semibold">Rec</span>
                </div>
                {/* User name overlay */}
                <div className="absolute top-4 left-4 bg-white/80 px-3 py-1 rounded text-gray-700 text-xs font-medium shadow">
                  {interviewInfo?.userName} (You)
                </div>
              </div>
              {/* Video Controls */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <button
                  className={`h-12 w-12 flex items-center justify-center rounded-full ${micEnabled ? 'bg-gray-100' : 'bg-red-100'} text-gray-700 hover:bg-gray-200 transition`}
                  onClick={handleToggleMic}
                  title={micEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
                >
                  {micEnabled ? <Mic className="h-7 w-7" /> : <MicOff className="h-7 w-7" />}
                </button>
                <button
                  className={`h-12 w-12 flex items-center justify-center rounded-full ${camEnabled ? 'bg-gray-100' : 'bg-red-100'} text-gray-700 hover:bg-gray-200 transition`}
                  onClick={handleToggleCam}
                  title={camEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
                >
                  {camEnabled ? <Video className="h-7 w-7" /> : <VideoOff className="h-7 w-7" />}
                </button>
                {!loading ? (
                  <button className="h-12 w-12 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition" onClick={() => stopInterview()} >
                    <Phone className="h-7 w-7" />
                  </button>
                ) : (
                  <Loader2Icon className="animate-spin h-7 w-7 text-gray-700" />
                )}
              </div>
            </div>
            {/* Question Panel */}
            <div className="w-[340px] flex flex-col gap-4">
              <div className="bg-gray-50 rounded-xl p-5 shadow flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-green-700">Question 1 of 10</span>
                </div>
                <div className="mt-2 text-gray-700 font-medium">
                  How do you balance user needs with business goals when designing a product, and can you share an example where you had to prioritize one over the other?
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow flex flex-col items-center gap-2">
                <span className="font-semibold text-gray-700">
                  {activeUser === 2 ? 'AI Interviewer' : activeUser === 1 ? `${interviewInfo?.userName} (You)` : 'AI Interviewer'}
                </span>
                <div className="grid grid-cols-1 items-center mt-2">
                  
                  <div className='absolute bottom-3 left-3'>

                    {activeUser === 1 && <SpeakingIcon size={25} color="#A3D86E" />}
                  </div>
                  <Image src={'/ai.png'} alt='ai' width={100} height={100} className='w-[80px] h-[80px] rounded-full object-cover z-10'/>
                  <span className="text-green-700 font-medium">
                    {activeUser === 1 && 'AI is speaking...'}
                    {activeUser === 2 && 'You are speaking...'}
                    {activeUser === 0 && 'Waiting...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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