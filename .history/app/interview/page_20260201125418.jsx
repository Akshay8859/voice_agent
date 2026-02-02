"use client"
import React, { useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { Bot, PhoneCall, PhoneOff, Timer } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
const Page = () => {
  const vapiRef = useRef(null);
  const [activeUser,setActiveUser]=useState(0)
  if (!vapiRef.current) {
    vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY);
  }

  const startCall = async () => {
    let questionsList = "What is React?,Explain the virtual DOM?,What are hooks in React?";
    const userName = "Akshay";
    const jobPosition = "Frontend Developer";

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: "Hi " + userName + ", how are you? Ready for your interview on " + jobPosition,
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
"Hey there! Welcome to your `+ jobPosition + ` interview. Let's get started with a few questions!"
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
  vapiRef.current.on("call-start",()=>{
    toast("call connected..");
  })

  vapiRef.current.on("speech-start",()=>{
    setActiveUser(1)
  })
  vapiRef.current.on("speech-end",()=>{
    setActiveUser(2)
  })
  vapiRef.current.on("call-end",()=>{
    setActiveUser(0)
  })

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold text-slate-800">AI Interview Session</h1>

        <div className="flex items-center gap-2 text-xl font-mono font-medium text-slate-700">
          <Timer className="w-6 h-6" />
          <span>00:00:00</span>
        </div>
      </div>

      {/* Main Content: Video/Audio Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl flex-grow items-center">
        {/* AI Recruiter Card */}
        <Card className="aspect-video flex flex-col items-center justify-center bg-white border-none shadow-lg rounded-xl p-16">
          <div className=" relative ">
            {activeUser==1 && <span className="absolute inset-0  rounded-full bg-blue-500  w-24 h-24 animate-ping " /> }
            <Avatar className="w-24 h-24 mb-4 border-4 border-slate-700 flex items-center justify-center">
              {/* add  ai image */}
              <Bot className="w-16 h-16 text-slate-500" />
            </Avatar>
          </div>
          <span className="font-semibold text-slate-600">AI Recruiter</span>
        </Card>

        {/* User Card */}
        <Card className="aspect-video flex flex-col items-center justify-center bg-white border-none shadow-lg rounded-xl p-12">
          <div className=" relative ">
            {activeUser==2 && <span className="absolute inset-0  rounded-full bg-blue-500  w-24 h-24 animate-ping " /> }
          <Avatar className="w-24 h-24 mb-4 border-4 border-slate-700">
            <AvatarFallback className="bg-blue-600 text-white text-3xl">R</AvatarFallback>
          </Avatar>
          </div>
          <span className="font-semibold text-slate-600">Rahul</span>
        </Card>
      </div>

      {/* Footer Controls */}
      <div className="mt-auto pt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          {/* start button */}
          <Button
            onClick={startCall}
            variant="outline"
            size="icon"
            className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 border-none group"
          >
            <PhoneCall className="w-6 h-6 text-white" />
          </Button>

          {/* End Call Button */}
          <Button
            onClick={stopInterview}
            variant="destructive"
            size="icon"
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 border-none shadow-lg shadow-red-200"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </Button>
        </div>

        <p className="text-slate-400 text-sm font-medium animate-pulse">
          Interview in Progress...
        </p>
      </div>
    </div>
  );
};

export default Page;
