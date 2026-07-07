'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function DecimalToBinaryForm() {
  const t = useTranslations('calculatorUI');
  const [number, setNumber] = useState<number>(42);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const binary = number.toString(2);
    const hex = number.toString(16).toUpperCase();
    const octal = number.toString(8);
    setResult({ binary, hex, octal });
  };

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">Decimal Number</label>
        <input type="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">Convert</button>
      {result && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">Binary: {result.binary}</p>
          <p className="text-sm mt-2">Hex: 0x{result.hex} | Octal: {result.octal}</p>
        </div>
      )}
    </div>
  );
}
