import { FEEDBACK_PROMPT } from "@/services/Constants";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
export async function POST(req) {
  try {
    // Log headers for debugging
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    // Accept content-type with charset (e.g., application/json; charset=utf-8)
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().startsWith("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }
    // const {conversation} = await req.json();
    
    const {conversation} = await req.json();
    console.log("Request body:", conversation);
    if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
      return NextResponse.json(
        { error: "Missing or empty 'conversation' in request body" },
        { status: 400 }
      );
    }
    
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