'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function BinaryToDecimalForm() {
  const t = useTranslations('calculatorUI');
  const [binary, setBinary] = useState<string>('101010');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const decimal = parseInt(binary, 2);
    const hex = decimal.toString(16).toUpperCase();
    const octal = decimal.toString(8);
    setResult({ decimal, hex: '0x' + hex, octal });
  };

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">Binary Number</label>
        <input type="text" value={binary} onChange={(e) => setBinary(e.target.value)} className="w-full px-4 py-3 border rounded-lg" /></div>
      <button onClick={calculate} className="bg-purple-600 text-white px-6 py-2 rounded">Convert</button>
      {result && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">Decimal: {result.decimal}</p>
          <p className="text-sm mt-2">Hex: {result.hex} | Octal: {result.octal}</p>
        </div>
      )}
    </div>
  );
}
