"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Mic, Brain, Sparkles, ShieldCheck } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Image
            src="/logo.png"   // 🔁 replace with your logo path
            alt="Voice Agent Logo"
            width={40}
            height={40}
          />
          <h1 className="text-xl font-bold tracking-wide">VOICE AGENT</h1>
        </div>

        <Button
          variant="outline"
          onClick={() => router.push("/sign-in")}
        >
          Sign In
        </Button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 mt-20">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
          AI-Powered <span className="text-primary">Voice Interviews</span>
        </h2>

        <p className="mt-6 max-w-2xl text-gray-400 text-lg">
          Conduct intelligent, real-time voice interviews powered by AI.  
          Analyze communication, technical skills, and confidence instantly.
        </p>

        <div className="mt-8 flex gap-4">
          <Button
            size="lg"
            className="px-8"
            onClick={() => router.push("/sign-in")}
          >
            Get Started
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/sign-in")}
          >
            Try Demo
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="mt-24 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          
          <FeatureCard
            icon={<Mic />}
            title="Voice-Based Interviews"
            description="Natural, real-time voice conversations with AI interviewers."
          />

          <FeatureCard
            icon={<Brain />}
            title="AI Evaluation"
            description="Automatic feedback on technical skills, communication, and problem solving."
          />

          <FeatureCard
            icon={<Sparkles />}
            title="Smart Insights"
            description="Structured summaries, ratings, and hiring recommendations."
          />

          <FeatureCard
            icon={<ShieldCheck />}
            title="Secure & Reliable"
            description="Your data is encrypted and safely stored."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} VOICE AGENT · All rights reserved
      </footer>
    </div>
  );
}

/* Feature Card Component */
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-primary transition">
      <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-gray-400 text-sm">{description}</p>
    </div>
  );
}
