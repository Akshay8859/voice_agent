import { FEEDBACK_PROMPT } from "@/services/Constants";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
export async function POST(req) {
  try { 
    const {conversation} = await req.json();
    conso
    if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
      return NextResponse.json(
        { error: "Missing or empty 'conversation' in request body" },
        { status: 400 }
      );
    }

    const FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(conversation));

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: FINAL_PROMPT,
    });
    const text = response?.text;
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