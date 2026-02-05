import React from 'react'
import { CheckCircle2, Send } from "lucide-react";
import Image from "next/image";

const InterviewCompleted = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white px-4 py-12">
      
      {/* Success Icon */}
      <div className="flex flex-col items-center">
        <div className="bg-green-500 rounded-full p-4">
          <CheckCircle2 className="text-white w-10 h-10" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Interview Complete!
        </h1>

        <p className="mt-2 text-center text-gray-500 max-w-xl">
          Thank you for participating in the AI-driven interview with{" "}
          <span className="font-medium text-gray-700">ALPHA</span>.
        </p>
      </div>

      {/* Illustration */}
      <div className="mt-10 w-full max-w-4xl rounded-2xl overflow-hidden shadow-sm">
        <Image
          src="/interviewRating.jpg"
          alt="Interview Illustration"
          width={1200}
          height={600}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* What's Next Card */}
      <div className="mt-12 w-full max-w-md bg-white border rounded-2xl shadow-sm p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 rounded-full p-3">
            <Send className="text-blue-600 w-6 h-6" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900">
          What’s Next?
        </h2>

        <p className="mt-3 text-gray-500 text-sm leading-relaxed">
          The recruiter will review your interview responses and will contact
          you soon regarding the next steps.
        </p>

        <div className="mt-4 text-sm text-gray-400 flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
          Response within 2–3 business days
        </div>
      </div>
    </div>
  )
}

export default InterviewCompleted