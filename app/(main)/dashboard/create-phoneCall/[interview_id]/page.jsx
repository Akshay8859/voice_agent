"use client"
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { supabase } from '@/services/supabaseClient';
import {sendEmail} from "../_components/sendEmail"
import {toast} from "sonner"

const page = () => {
  const url = useParams().interview_id;
  const [candidateList, setCandidateList] = useState([])

  const handleClick = async (user) => {
    sendEmail(user.userEmail,`Interview Link and docs link`,`interview link: localhost:3001/interview/test123  docs link: http://10.16.162.115:5173/documents/69e4e6fbdf1c68c4bc3d79ff  date: ${user.date} time: ${user.time}`)
    const role=await getRole();
    const email=await getInterviewer(role);
    sendEmail(email,`Interview Link and docs link`,`interview link: localhost:3001/interview/test123  docs link: http://10.16.162.115:5173/documents/69e4e6fbdf1c68c4bc3d79ff  date: ${user.date} time: ${user.time}`)
    toast.success("Emails sent successfully!");
  };
  useEffect(() => {
    url && GetCandidateList();
  }, [url])
  const GetCandidateList = async () => {
    let { data: Interviews, error } = await supabase
      .from('interview-feedback')
      .select("*")
      .eq('interview_id', url)
      .order('id', { ascending: false })
      ;
    setCandidateList(Interviews);
  }
  const getRole=async()=>{
    let { data: Interviews, error } = await supabase
      .from('interviews')
      .select("*")
      .eq('interview_id', url)
      .order('id', { ascending: false })
      ;
    return Interviews[0].jobPosition;
  }
  const getInterviewer= async (role) => {
    let { data: Interviewers, error } = await supabase
      .from('interviewers')
      .select("*")
      .eq('role', role)
      ;
    return Interviewers[0].email;

  }
  return (
    <div className=" bg-gray-100 p-6 flex justify-center">
      <div className="w-full  bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Candidates List</h2>

        {candidateList.length == 0 && <p>no candidate is there</p>}

        {candidateList.length && <div className="space-y-3">
          {candidateList.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white font-medium">
                  {index + 1}
                </div>

                <div>
                  <p className="font-medium text-gray-800">{user?.userName}</p>
                  <p className="text-sm text-gray-500">{user?.userEmail}</p>
                </div>
              </div>

              <input
                type="date"
                value={user.date || ""}
                onChange={(e) => {
                  const updated = [...candidateList];
                  updated[index].date = e.target.value;
                  setCandidateList(updated);
                }}
                className="border rounded px-2 py-1 text-sm"
              />

              <input
                type="time"
                value={user.time || ""}
                onChange={(e) => {
                  const updated = [...candidateList];
                  updated[index].time = e.target.value;
                  setCandidateList(updated);
                }}
                className="border rounded px-2 py-1 text-sm"
              />

              <button onClick={() => handleClick(user)} className="px-4 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-blue-600 transition">
                Create
              </button>
            </div>
          ))}
        </div>}
      </div>
    </div>
  )
}

export default page