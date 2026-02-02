import { FEEDBACK_PROMPT } from "@/services/Constants";
import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    const {converstion} = await req.json();

    const FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(converstion));

    try {
    
        cachesonst genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
            
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