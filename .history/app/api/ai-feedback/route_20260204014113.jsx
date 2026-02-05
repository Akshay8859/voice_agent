import { FEEDBACK_PROMPT } from "@/services/Constants";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
export async function POST(req) {
  try {
    if (req.headers.get("content-type") !== "application/json") {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }
    // const {conversation} = await req.json();
    
    const body = await req.json();
    const conversation = body?.conversation;
    if (!conversation) {
      return NextResponse.json(
        { error: "Missing 'conversation' in request body" },
        { status: 400 }
      );
    }
    console.log("Conversation received for feedback:", conversation);
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(conversation));
    // const prompt = 
    console.log("Final Prompt for Gemini:", FINAL_PROMPT);
        const response = await genAI.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: FINAL_PROMPT, 
        });
        const text = response?.text;
        console.log("Gemini Pro Response Text:", text);
        if (!text) {  
          throw new Error("No text returned from Gemini");
        }
    
        return NextResponse.json({ content: text });
    
    } catch (e) {
    console.error("Gemini Pro Error:", e);
    return NextResponse.json(
        { error: "Failed to generate interview questions" },
        { status: 500 }
    );
    }
}