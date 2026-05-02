"use client"
import { InterviewDataContext } from '@/context/InterviewDataContext';
import Vapi from '@vapi-ai/web';
import { CircleDot, Loader2Icon, Mic, MicOff, Phone, Timer, Video, VideoOff, ShieldCheck } from 'lucide-react';
import SpeakingIcon from '@/components/ui/speaking-icon';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react'
import TimerComponent from './_components/TimerComponent';
import { toast } from 'sonner';
import axios from 'axios';
import { supabase } from '@/services/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import QuestionOverlayPanel from './_components/QuestionOverlayPanel';
import { useInterviewProctoring } from '@/hooks/useInterviewProctoring';



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
  const hasUploadedRef = useRef(false);
  const proctoringActive = Boolean(timerStart && !mediaError);
    const { canvasRef, logRef, status: proctoringStatus, displayCounts, resetLog } = useInterviewProctoring({
        videoRef,
        active: proctoringActive,
    });
  

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
      if (hasUploadedRef.current) {
        console.log("Already uploaded, skipping...");
        return;
      }

      hasUploadedRef.current = true;
      const { data: authData } = await supabase.auth.getUser();
      console.log("USER:", authData.user);

      if (!authData.user) {
        toast.error("User not logged in");
        return;
      }

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        await new Promise((resolve) => {
          mediaRecorderRef.current.onstop = resolve;
          mediaRecorderRef.current.stop();
        });
      }

      if (!recordedChunksRef.current.length) {
        toast.error("No recording found");
        return;
      }

      const blob = new Blob(recordedChunksRef.current, {
        type: "video/webm",
      });

      const fileName = `test-${Date.now()}.webm`;

      const { data, error } = await supabase.storage
        .from("proctoring-data")
        .upload(fileName, blob);
      
      const {data, error} = await supabase.from('proctoring-recording').insert({
        interview_id: interview_id,
        file_url: fileName,
      })
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Uploaded!");
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
            hasUploadedRef.current = false;
            conversationRef.current = [];
            resetLog();
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
    },[resetLog]);

    const GenerateFeedback = async () => {
        setLoading(true);
        const proctoringSummary = {
            noFaceCount: logRef.current.noFaceCount,
            multipleFaceCount: logRef.current.multipleFaceCount,
            cellPhoneCount: logRef.current.cellPhoneCount,
            prohibitedObjectCount: logRef.current.prohibitedObjectCount,
            screenshots: (logRef.current.screenshots || []).map((s) => ({
                url: s.url,
                type: s.type,
                detectedAt: s.detectedAt,
            })),
        };

        const insertRow = async (feedbackPayload) => {
            const { error } = await supabase.from("interview-feedback").insert([
                {
                    userName: interviewInfo?.userName,
                    userEmail: interviewInfo?.userEmail,
                    interview_id: interview_id,
                    feedback: feedbackPayload,
                    recommended: false,
                },
            ]);
            if (error) {
                console.error("interview-feedback insert:", error);
                toast.error(error.message || "Could not save interview record.");
                throw error;
            }
        };

        try {
            const result = await axios.post(
                "/api/ai-feedback",
                { conversation: conversationRef.current },
                { headers: { "Content-Type": "application/json" } }
            );
            const rawContent = result.data?.content;
            if (!rawContent) {
                await insertRow({
                    proctoring: proctoringSummary,
                    aiFeedbackError: "No content returned from AI",
                });
            } else {
                const cleaned = rawContent
                    .replace(/```json/gi, "")
                    .replace(/```/g, "")
                    .trim();
                let parsed = null;
                try {
                    const firstJsonMatch = cleaned.match(/\{[\s\S]*\}/);
                    parsed = firstJsonMatch
                        ? JSON.parse(firstJsonMatch[0])
                        : JSON.parse(cleaned);
                } catch (parseErr) {
                    console.warn("AI feedback JSON parse failed:", parseErr);
                    parsed = {
                        aiFeedbackParseError: String(parseErr?.message || parseErr),
                        aiFeedbackRawSnippet: cleaned.slice(0, 4000),
                    };
                }
                const feedbackWithProctoring =
                    parsed && typeof parsed === "object" && !Array.isArray(parsed)
                        ? { ...parsed, proctoring: proctoringSummary }
                        : { raw: parsed, proctoring: proctoringSummary };
                await insertRow(feedbackWithProctoring);
            }
        } catch (e) {
            console.error("GenerateFeedback:", e);
            toast.error(e?.response?.data?.error || e?.message || "Feedback request failed.");
            try {
                await insertRow({
                    proctoring: proctoringSummary,
                    aiFeedbackError: e?.message || String(e),
                });
            } catch {
                /* insertRow already toasts */
            }
        } finally {
            router.replace("/interview/" + interview_id + "/completed");
            setLoading(false);
        }
    };
  return (

    <div className="min-h-[90vh] bg-[#f6f7fa] flex flex-col">
      <div className="flex-1 flex items-center justify-center py-6 px-2">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl flex flex-col overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 sm:px-8 pt-5 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <CircleDot className="text-green-500 shrink-0" />
              <span className="font-semibold text-lg">AI Interview</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-gray-600 text-sm">
              <Timer className="w-5 h-5 shrink-0" />
              <span className="font-medium hidden sm:inline">Elapsed</span>
              <TimerComponent start={timerStart} />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 px-6 sm:px-8 pb-8 pt-4">
            <div className="flex-1 flex flex-col items-center min-w-0">
              <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  aria-hidden
                />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
                  {activeUser === 2 && <SpeakingIcon size={24} color="#A3D86E" />}
                </div>
                {timerStart && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                    <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-semibold animate-pulse">
                      Rec
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded text-gray-700 text-xs font-medium shadow z-10 max-w-[70%] truncate">
                  {interviewInfo?.userName} (You)
                </div>
                <div className="absolute bottom-3 right-3 z-10 pointer-events-none flex flex-col items-end gap-1">
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                      proctoringActive && !proctoringStatus.error
                        ? "bg-emerald-600/90 text-white"
                        : "bg-black/60 text-gray-200"
                    }`}
                  >
                    <ShieldCheck className="h-3 w-3 shrink-0" />
                    {proctoringStatus.loading
                      ? "Proctoring…"
                      : proctoringStatus.error
                        ? "Off"
                        : proctoringActive
                          ? "Live"
                          : "Ready"}
                  </span>
                </div>
              </div>
              {(displayCounts.noFaceCount +
                displayCounts.multipleFaceCount +
                displayCounts.cellPhoneCount +
                displayCounts.prohibitedObjectCount) > 0 && (
                <div className="w-full mt-2 text-[11px] text-gray-600 px-2 py-1.5 bg-amber-50 border border-amber-100 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-1">
                  {displayCounts.noFaceCount > 0 && <span>No face: {displayCounts.noFaceCount}</span>}
                  {displayCounts.multipleFaceCount > 0 && (
                    <span>Multi-face: {displayCounts.multipleFaceCount}</span>
                  )}
                  {displayCounts.cellPhoneCount > 0 && <span>Phone: {displayCounts.cellPhoneCount}</span>}
                  {displayCounts.prohibitedObjectCount > 0 && (
                    <span>Object: {displayCounts.prohibitedObjectCount}</span>
                  )}
                </div>
              )}
              {mediaError && (
                <p className="w-full mt-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {mediaError}
                </p>
              )}
              <div className="flex items-center justify-center gap-6 mt-6">
                <button
                  type="button"
                  className={`h-12 w-12 flex items-center justify-center rounded-full ${
                    micEnabled ? "bg-gray-100" : "bg-red-100"
                  } text-gray-700 hover:bg-gray-200 transition`}
                  onClick={handleToggleMic}
                  title={micEnabled ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {micEnabled ? <Mic className="h-7 w-7" /> : <MicOff className="h-7 w-7" />}
                </button>
                <button
                  type="button"
                  className={`h-12 w-12 flex items-center justify-center rounded-full ${
                    camEnabled ? "bg-gray-100" : "bg-red-100"
                  } text-gray-700 hover:bg-gray-200 transition`}
                  onClick={handleToggleCam}
                  title={camEnabled ? "Turn Off Camera" : "Turn On Camera"}
                >
                  {camEnabled ? <Video className="h-7 w-7" /> : <VideoOff className="h-7 w-7" />}
                </button>
                {!loading ? (
                  <button
                    type="button"
                    className="h-12 w-12 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                    onClick={() => stopInterview()}
                  >
                    <Phone className="h-7 w-7" />
                  </button>
                ) : (
                  <Loader2Icon className="animate-spin h-7 w-7 text-gray-700" />
                )}
              </div>
              <p className="text-center text-xs text-gray-400 mt-3 animate-pulse">Interview in Progress...</p>
            </div>

            <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-4">
              <QuestionOverlayPanel interviewInfo={interviewInfo} />
              <div className="bg-white rounded-xl p-5 shadow flex flex-col items-center gap-2">
                <span className="font-semibold text-gray-700 text-center">
                  {activeUser === 1
                    ? "AI Interviewer"
                    : activeUser === 2
                      ? `${interviewInfo?.userName ?? "You"} (You)`
                      : "AI Interviewer"}
                </span>
                <div className="flex justify-center min-h-[28px]">
                  {activeUser === 1 && <SpeakingIcon size={25} color="#A3D86E" />}
                </div>
                <div className="grid grid-cols-1 items-center justify-items-center mt-2 gap-2">
                  <Image
                    src="/ai.png"
                    alt="AI interviewer"
                    width={100}
                    height={100}
                    className="w-[80px] h-[80px] rounded-full object-cover"
                  />
                  <span className="text-green-700 font-medium text-sm text-center">
                    {activeUser === 1 && "AI is speaking..."}
                    {activeUser === 2 && "You are speaking..."}
                    {activeUser === 0 && "Waiting..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>




  )
}

export default StartInterview