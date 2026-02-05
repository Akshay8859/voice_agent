"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Video, PhoneCall, BarChart3, ShieldCheck } from "lucide-react";
import FeatureCard from "./_components/FeatureCard";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-6 bg-white border-b">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png" // your ALPHAHIRE / project logo
            alt="Logo"
            width={200}
            height={200}
          />
        </div>

        <Button
          className="bg-primar hover:bg-green-600"
          onClick={() => router.push("/sign-in")}
        >
          Sign In
        </Button>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          AI-Driven Interviews, <span className="text-green-500">Hassle-Free Hiring</span>
        </h1>

        <p className="mt-5 text-gray-600 max-w-2xl mx-auto text-lg">
          Create, schedule, and conduct AI-powered interviews that evaluate
          candidates on communication, technical skills, and confidence.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600"
            onClick={() => router.push("/sign-in")}
          >
            Get Started
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/sign-in")}
          >
            View Dashboard
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <FeatureCard
            icon={<Video />}
            title="AI Video Interviews"
            description="Conduct automated AI interviews with structured questions."
          />

          <FeatureCard
            icon={<PhoneCall />}
            title="Phone Screening"
            description="Schedule and run AI-powered phone screening calls."
          />

          <FeatureCard
            icon={<BarChart3 />}
            title="Smart Feedback"
            description="Get ratings, summaries, and hiring recommendations instantly."
          />

          <FeatureCard
            icon={<ShieldCheck />}
            title="Secure & Reliable"
            description="Candidate data is encrypted and safely stored."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t bg-white">
        © {new Date().getFullYear()} ALPHAHIRE · All rights reserved
      </footer>
    </div>
  );
}

