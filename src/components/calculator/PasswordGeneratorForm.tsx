'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function PasswordGeneratorForm() {
  const t = useTranslations('calculatorUI');
  const [length, setLength] = useState<number>(12);
  const [uppercase, setUppercase] = useState<boolean>(true);
  const [lowercase, setLowercase] = useState<boolean>(true);
  const [numbers, setNumbers] = useState<boolean>(true);
  const [symbols, setSymbols] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');

  const generate = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let chars = '';
    if (uppercase) chars += upper;
    if (lowercase) chars += lower;
    if (numbers) chars += nums;
    if (symbols) chars += syms;
    if (!chars) chars = lower;
    
    let pwd = '';
    for (let i = 0; i < length; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(pwd);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Length: {length}</label>
          <input type="range" min="6" max="50" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full" /></div>
        <div className="space-y-2">
          <label className="flex items-center gap-2"><input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} /> Uppercase</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} /> Lowercase</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} /> Numbers</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} /> Symbols</label>
        </div>
      </div>
      <button onClick={generate} className="bg-green-600 text-white px-6 py-2 rounded">Generate Password</button>
      {password && (
        <div className="bg-gray-800 rounded-2xl p-6 text-white text-center font-mono text-2xl">{password}</div>
      )}
    </div>
  );
}
