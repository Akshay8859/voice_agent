"use client"
import React, { useEffect, useRef, useState } from 'react';

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <h2 className="text-xl font-semibold mb-4">Permissions Check</h2>
      <div className="mb-4">
        <span className={`mr-2 ${permission.camera ? 'text-green-600' : 'text-red-600'}`}>●</span>
        Camera: {permission.camera ? 'Allowed' : 'Denied'}
      </div>
      <div className="mb-4">
        <span className={`mr-2 ${permission.microphone ? 'text-green-600' : 'text-red-600'}`}>●</span>
        Microphone: {permission.microphone ? 'Allowed' : 'Denied'}
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="rounded-lg overflow-hidden border border-gray-300 bg-black w-64 h-48 flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default PermissionCheck;
