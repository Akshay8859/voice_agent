import React, { useEffect, useRef, useState } from "react";

const TimerComponent = ({ start, interviewDuration }) => {
  // interviewDuration in minutes
  
  const initialSeconds = (interviewDuration || 0) * 60;
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (start && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    if (!start && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
    // Only reset when start or interviewDuration changes
  }, [start, interviewDuration]);

  useEffect(() => {
    if (!start) {
      setSeconds(initialSeconds);
    }
  }, [start, initialSeconds]);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <span className="font-mono text-sm">
      {formatTime()}
    </span>
  );
};

export default TimerComponent;
