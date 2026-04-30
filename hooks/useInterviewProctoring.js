"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { drawRect } from "@/lib/proctoring/drawRect";
import { toast } from "sonner";

const THROTTLE_MS = 3000;

const TYPE_TO_COUNT_KEY = {
  noFace: "noFaceCount",
  multipleFace: "multipleFaceCount",
  cellPhone: "cellPhoneCount",
  prohibitedObject: "prohibitedObjectCount",
};

const TOAST_MESSAGES = {
  noFace: "Face not visible — warning recorded",
  multipleFace: "Multiple faces detected — warning recorded",
  cellPhone: "Cell phone detected — warning recorded",
  prohibitedObject: "Prohibited object detected — warning recorded",
};

function dataURLtoFile(dataUrl, fileName) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], fileName, { type: mime });
}

function emptyLog() {
  return {
    noFaceCount: 0,
    multipleFaceCount: 0,
    cellPhoneCount: 0,
    prohibitedObjectCount: 0,
    screenshots: [],
  };
}

/**
 * Runs COCO-SSD on the same {@link HTMLVideoElement} used for the interview preview
 * (aligned with AI-Proctored-System WebCam.jsx, without a second camera stream).
 */
export function useInterviewProctoring({ videoRef, active }) {
  const canvasRef = useRef(null);
  const netRef = useRef(null);
  const intervalRef = useRef(null);
  const lastDetectionRef = useRef({});
  const detectingRef = useRef(false);
  const logRef = useRef(emptyLog());
  const [status, setStatus] = useState({ loading: true, error: null });
  const [displayCounts, setDisplayCounts] = useState({
    noFaceCount: 0,
    multipleFaceCount: 0,
    cellPhoneCount: 0,
    prohibitedObjectCount: 0,
  });

  const resetLog = useCallback(() => {
    logRef.current = emptyLog();
    lastDetectionRef.current = {};
    setDisplayCounts({
      noFaceCount: 0,
      multipleFaceCount: 0,
      cellPhoneCount: 0,
      prohibitedObjectCount: 0,
    });
  }, []);

  const captureAndUpload = useCallback(async (video, type) => {
    if (!video || video.readyState !== 4 || video.videoWidth === 0 || video.videoHeight === 0) {
      return null;
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    const uploadKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;
    let url = null;
    if (uploadKey) {
      try {
        const { UploadClient } = await import("@uploadcare/upload-client");
        const client = new UploadClient({ publicKey: uploadKey });
        const file = dataURLtoFile(dataUrl, `proctor_${type}_${Date.now()}.jpg`);
        const result = await client.uploadFile(file);
        url = result.cdnUrl;
      } catch (e) {
        console.error("Proctoring screenshot upload failed:", e);
      }
    }
    return { url, type, detectedAt: new Date().toISOString() };
  }, []);

  const handleDetection = useCallback(
    async (type, video) => {
      const now = Date.now();
      const last = lastDetectionRef.current[type] || 0;
      if (now - last < THROTTLE_MS) return;
      lastDetectionRef.current[type] = now;

      const screenshot = await captureAndUpload(video, type);
      const log = logRef.current;
      const key = TYPE_TO_COUNT_KEY[type];
      if (key) log[key] = (log[key] || 0) + 1;
      if (screenshot) log.screenshots = [...(log.screenshots || []), screenshot];

      setDisplayCounts({
        noFaceCount: log.noFaceCount,
        multipleFaceCount: log.multipleFaceCount,
        cellPhoneCount: log.cellPhoneCount,
        prohibitedObjectCount: log.prohibitedObjectCount,
      });

      toast.warning(TOAST_MESSAGES[type] || "Proctoring warning");
    },
    [captureAndUpload]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await tf.ready();
        const net = await cocoSsd.load();
        if (!cancelled) {
          netRef.current = net;
          setStatus({ loading: false, error: null });
        }
      } catch (e) {
        console.error("Proctoring model load error:", e);
        if (!cancelled) {
          setStatus({ loading: false, error: e?.message || "Failed to load proctoring model" });
          toast.error("Could not load interview proctoring model.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!active || status.loading || status.error || !netRef.current) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const net = netRef.current;

    const runDetect = async () => {
      if (detectingRef.current) return;
      const video = videoRef?.current;
      if (!video || video.readyState !== 4) return;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;

      detectingRef.current = true;
      try {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = vw;
          canvas.height = vh;
        }

        const predictions = await net.detect(video);
        const ctx = canvas?.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawRect(predictions, ctx);
        }

        let personCount = 0;
        let faceDetected = false;
        for (const element of predictions) {
          const detectedClass = element.class;
          if (detectedClass === "cell phone") await handleDetection("cellPhone", video);
          if (detectedClass === "book" || detectedClass === "laptop") {
            await handleDetection("prohibitedObject", video);
          }
          if (detectedClass === "person") {
            faceDetected = true;
            personCount++;
            if (personCount > 1) await handleDetection("multipleFace", video);
          }
        }
        if (!faceDetected) await handleDetection("noFace", video);
      } catch (e) {
        console.error("Proctoring detection error:", e);
      } finally {
        detectingRef.current = false;
      }
    };

    intervalRef.current = setInterval(runDetect, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, status.loading, status.error, videoRef, handleDetection]);

  return { canvasRef, logRef, status, displayCounts, resetLog };
}
