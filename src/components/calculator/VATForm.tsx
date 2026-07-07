'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function VATForm() {
  const t = useTranslations('calculatorUI');
  const [amount, setAmount] = useState<number>(100);
  const [rate, setRate] = useState<number>(20);
  const [type, setType] = useState<string>('add');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    if (type === 'add') {
      const vat = amount * (rate / 100);
      const total = amount + vat;
      setResult({ vat: vat.toFixed(2), total: total.toFixed(2), net: amount.toFixed(2) });
    } else {
      const net = amount / (1 + rate / 100);
      const vat = amount - net;
      setResult({ vat: vat.toFixed(2), total: amount.toFixed(2), net: net.toFixed(2) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Amount ($)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">VAT Rate (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="add">Add VAT</option><option value="remove">Remove VAT</option>
          </select></div>
      </div>
      <button onClick={calculate} className="bg-purple-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">${result.total}</p>
          <p className="text-sm mt-2">VAT: ${result.vat} | Net: ${result.net}</p>
        </div>
      )}
    </div>
  );
}
