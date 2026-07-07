'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function BinaryCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<string>('1010');
  const [fromBase, setFromBase] = useState<number>(2);
  const [toBase, setToBase] = useState<number>(10);
  const [result, setResult] = useState<string>('');

  const convert = () => {
    try {
      const decimal = parseInt(value, fromBase);
      const converted = decimal.toString(toBase).toUpperCase();
      setResult(converted);
    } catch { setResult('Invalid input'); }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-4 py-3 border rounded-lg" placeholder="Enter number" /></div>
        <div><select value={fromBase} onChange={(e) => setFromBase(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg">
          <option value={2}>Binary (2)</option><option value={8}>Octal (8)</option><option value={10}>Decimal (10)</option><option value={16}>Hex (16)</option>
        </select></div>
        <div><select value={toBase} onChange={(e) => setToBase(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg">
          <option value={10}>Decimal (10)</option><option value={2}>Binary (2)</option><option value={8}>Octal (8)</option><option value={16}>Hex (16)</option>
        </select></div>
      </div>
      <button onClick={convert} className="bg-green-600 text-white px-6 py-2 rounded">Convert</button>
      {result && <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6 text-center"><p className="text-4xl font-bold">{result}</p></div>}
    </div>
  );
}
