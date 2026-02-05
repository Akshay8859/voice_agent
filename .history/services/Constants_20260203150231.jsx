import { BriefcaseBusinessIcon, Calendar, Code2Icon, Component, icons, LayoutDashboard, List, Puzzle, Settings, User, User2Icon, WalletCards } from "lucide-react";

export const SideBarOptions = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard'
    },
    {
        name: 'Scheduled Interview',
        icon: Calendar,
        path: '/scheduled-interview'
    },
    {
        name: 'All Interview',
        icon: List,
        path: '/all-interview'
    },
    {
        name: 'Billing',
        icon: WalletCards,
        path: '/billing'
    },
    {
        name: 'Settings',
        icon: Settings,
        path: '/settings'
    },

]

export const InterviewType = [
    {
        title: 'Technical',
        icon: Code2Icon,
    },
    {
        title: 'Behavioral',
        icon: User2Icon,
    },
    {
        title: 'Experience',
        icon: BriefcaseBusinessIcon,
    },
    {
        title: 'Problem Solving',
        icon: Puzzle,
    },
    {
        title: 'Leadership',
        icon: Component,
    },

]

export const QUESTION_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {{jobTitle}}

Job Description:{{jobDescription}}

Interview Duration: {{duration}}

Interview Type: {{type}}

📝 Your task:

Analyze the job description to identify key responsibilities, required skills, and expected experience.

Generate a list of interview questions depends on interview duration

Adjust the number and depth of questions to match the interview duration.

Ensure the questions match the tone and structure of a real-life {{type}} interview.

🧩 Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
 question:'',
 type:'Technical/Behavioral/Experince/Problem Solving/Leaseship'
},{
...
}]

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`

// Based on the interview conversation above, return ONLY valid JSON.
// Do NOT include explanations, markdown, or extra text.
// Do NOT wrap the response in backticks.
// Do NOT add comments.

export const FEEDBACK_PROMPT = `
{{conversation}}
Based on this interview conversation between the assistant and the user,
give me feedback for the user interview. Give me ratings out of 10 for
Technical Skills, Communication, Problem Solving, and Experience.
Also give me a summary in 3 lines about the interview and one line to let me know
whether the candidate is recommended for hire or not, with a message.
Give me the response in JSON format.


Return the response strictly in the following JSON format:

{
  "feedback": {
    "rating": {
      "technicalSkills": 0,
      "communication": 0,
      "problemSolving": 0,
      "experience": 0
    },
    "summary": [
      "",
      "",
      ""
    ],
    "recommendation": "",
    "recommendationMsg": ""
  }
}
`


