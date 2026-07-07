'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function DiscountCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [originalPrice, setOriginalPrice] = useState<number>(100);
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const savings = originalPrice * (discountPercent / 100);
    const finalPrice = originalPrice - savings;
    setResult({ savings: savings.toFixed(2), finalPrice: finalPrice.toFixed(2), finalPriceRounded: Math.round(finalPrice) });
  }, [originalPrice, discountPercent]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Original Price ($)</label>
          <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Discount (%)</label>
          <input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">${result.finalPriceRounded}</p>
          <p className="text-sm mt-2">You save: ${result.savings}</p>
        </div>
      )}
    </div>
  );
}