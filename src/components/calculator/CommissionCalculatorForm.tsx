'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function CommissionCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [salePrice, setSalePrice] = useState<number>(300000);
  const [commissionPercent, setCommissionPercent] = useState<number>(6);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const commission = salePrice * (commissionPercent / 100);
    const agentSplit = commission / 2;
    setResult({ commission: Math.round(commission), agentSplit: Math.round(agentSplit), netSeller: salePrice - commission });
  }, [salePrice, commissionPercent]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Sale Price ($)</label>
          <input type="number" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Commission (%)</label>
          <input type="number" value={commissionPercent} onChange={(e) => setCommissionPercent(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-2xl font-bold">Total Commission: ${result.commission.toLocaleString()}</p>
          <p className="text-sm mt-2">Each Agent: ${result.agentSplit.toLocaleString()} | Net to Seller: ${result.netSeller.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
