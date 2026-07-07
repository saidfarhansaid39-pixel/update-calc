'use client';

import { useState, useEffect } from 'react';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (running) {
      interval = setInterval(() => setTime(t => t + 10), 10);
    }
    return () => clearInterval(interval);
  }, [running]);

  const format = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const ms10 = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}.${ms10.toString().padStart(2,'0')}`;
  };

  return (
    <div className="text-center py-12">
      <p className="text-6xl font-bold font-mono mb-8 text-gray-800">{format(time)}</p>
      <div className="flex justify-center gap-4">
        <button onClick={() => setRunning(!running)} className={`px-8 py-3 rounded-lg text-white text-lg ${running ? 'bg-red-500' : 'bg-green-500'}`}>
          {running ? 'Stop' : 'Start'}
        </button>
        <button onClick={() => { setRunning(false); setTime(0); }} className="px-8 py-3 rounded-lg bg-gray-500 text-white text-lg">Reset</button>
      </div>
    </div>
  );
}