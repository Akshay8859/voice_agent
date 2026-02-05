import { FEEDBACK_PROMPT } from "@/services/Constants";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
export async function POST(req) {
  try {
    const {conversation} = await req.json();
    console.log("Conversation received for feedback:", conversation);
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(conversation));
    // const prompt = 
    console.log("Final Prompt for Gemini:", FINAL_PROMPT);
        const response = await genAI.models.generateContent({
          model: "gemini-3-flash-preview",
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