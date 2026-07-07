'use client';

import { useState, useEffect, useRef } from 'react';

export default function Timer() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setRunning(false);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, timeLeft]);

  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  };

  const start = () => { setTimeLeft(minutes * 60 + seconds); setRunning(true); };
  const reset = () => { setRunning(false); setTimeLeft(0); };

  return (
    <div className="text-center py-12">
      {timeLeft === 0 && !running ? (
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            <input type="number" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="w-20 px-3 py-2 border rounded text-center text-2xl" placeholder="Min" />
            <input type="number" value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} className="w-20 px-3 py-2 border rounded text-center text-2xl" placeholder="Sec" />
          </div>
          <button onClick={start} className="px-8 py-3 rounded-lg bg-blue-500 text-white text-lg">Start Timer</button>
        </div>
      ) : (
        <>
          <p className="text-6xl font-bold font-mono mb-8 text-gray-800">{format(timeLeft)}</p>
          <button onClick={reset} className="px-8 py-3 rounded-lg bg-gray-500 text-white text-lg">Reset</button>
        </>
      )}
    </div>
  );
}