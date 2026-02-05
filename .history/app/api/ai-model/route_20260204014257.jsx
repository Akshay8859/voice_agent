// export const runtime = "nodejs";

// import { QUESTION_PROMPT } from "@/services/Constants";
// import { NextResponse } from "next/server";
// import OpenAI from "openai";

// export async function POST(req) {

//     const {jobPosition, jobDescription, duration, type} = await req.json();

//     const FINAL_PROMPT = QUESTION_PROMPT
//         .replace('{{jobTitle}}', jobPosition)
//         .replace('{{jobDescription}}', jobDescription)
//         .replace('{{duration}}', duration)
//         .replace('{{type}}', type)

//     try {
//         const openai = new OpenAI({
//             baseURL: "https://openrouter.ai/api/v1",
//             apiKey: process.env.OPENROUTER_API_KEY,
//             defaultHeaders: {
//                 "HTTP-Referer": "http://localhost:3000", // or your deployed URL
//                 "X-Title": "Interview Question Generator",
//             },
//         })
    
//         const completion = await openai.chat.completions.create({
//             model: "nvidia/nemotron-3-nano-30b-a3b:free",
//             messages: [
//                 { role: "user", content: FINAL_PROMPT }
//             ],
//             // model: "mistralai/mistral-7b-instruct:free",
//             // messages: [{ role: "user", content: FINAL_PROMPT }],
//             // max_tokens: 700,
//             // temperature: 0.7,
//         })
//         console.log(completion.choices[0].message)
//         return NextResponse.json(completion.choices[0].message);
//     }
//     catch (e) {
//         // console.log("Error generating interview questions:", e);
//         return NextResponse.json({ error: 'Failed to generate interview questions.' }, { status: 500 });
//     }
// }

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { QUESTION_PROMPT } from "@/services/Constants";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
export async function POST(req) {
  try {
    const { jobPosition, jobDescription, duration, type } = await req.json();

    const FINAL_PROMPT = QUESTION_PROMPT
      .replace('{{jobTitle}}', jobPosition)
      .replace('{{jobDescription}}', jobDescription)
      .replace('{{duration}}', duration)
      .replace('{{type}}', type);
    
    // const model = genAI.getGenerativeModel({
    //   model: "gemini-3-pro-preview",
    // });

    // const result = await model.generateContent(FINAL_PROMPT);
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
