"use client"

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, XCircle, Video, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PermissionCheck = () => {
  const videoRef = useRef(null);
  const [permission, setPermission] = useState({ camera: false, microphone: false });
  const [error, setError] = useState('');

  useEffect(() => {
    // Request camera and microphone permissions
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setPermission({ camera: true, microphone: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        setError('Permission denied or device not found.');
        setPermission({ camera: false, microphone: false });
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-green-50 to-green-100 py-10 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center border border-green-100">
        <h2 className="text-2xl font-bold mb-2 text-primary flex items-center gap-2">
          <Video className="w-6 h-6 text-primary" /> System Check
        </h2>
        <p className="text-gray-500 mb-6 text-center">We need access to your camera and microphone to proceed with the interview. Please grant permissions below.</p>

        <div className="flex flex-col gap-3 w-full mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
            <Video className="w-5 h-5 text-primary" />
            <span className="font-medium flex-1">Camera</span>
            {permission.camera ? (
              <span className="flex items-center gap-1 text-green-600 font-semibold"><CheckCircle className="w-5 h-5" /> Allowed</span>
            ) : (
              <span className="flex items-center gap-1 text-red-500 font-semibold"><XCircle className="w-5 h-5" /> Denied</span>
            )}
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
            <Mic className="w-5 h-5 text-primary" />
            <span className="font-medium flex-1">Microphone</span>
            {permission.microphone ? (
              <span className="flex items-center gap-1 text-green-600 font-semibold"><CheckCircle className="w-5 h-5" /> Allowed</span>
            ) : (
              <span className="flex items-center gap-1 text-red-500 font-semibold"><XCircle className="w-5 h-5" /> Denied</span>
            )}
          </div>
        </div>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <div className="rounded-xl overflow-hidden border-2 border-blue-200 bg-black w-64 h-48 flex items-center justify-center shadow-md">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-xs text-gray-400 mt-2">Your camera preview is private and only visible to you.</div>

        <Button className="mt-4" onClick={() => joinIn}>Start Interview</Button>
      </div>
    </div>
  );
};

export default PermissionCheck;
