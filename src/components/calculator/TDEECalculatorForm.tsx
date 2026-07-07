'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function TDEECalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(30);
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [activity, setActivity] = useState<number>(1.2);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const bmr = gender === 'male' 
      ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
      : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    
    const tdee = bmr * activity;
    const bmi = weight / ((height/100) * (height/100));
    
    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      bmi: bmi.toFixed(1),
      weightLoss: Math.round(tdee - 500),
      weightGain: Math.round(tdee + 500)
    });
  }, [gender, age, weight, height, activity]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.gender')}</label>
          <div className="flex gap-2">
            <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded ${gender === 'male' ? 'bg-green-button text-white' : 'bg-gray-200'}`}>{t('formLabels.male')}</button>
            <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded ${gender === 'female' ? 'bg-green-button text-white' : 'bg-gray-200'}`}>{t('formLabels.female')}</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.age')}</label>
          <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.weight')}</label>
          <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.height')}</label>
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.activityLevel')}</label>
          <select value={activity} onChange={(e) => setActivity(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded">
            <option value="1.2">Sedentary (little or no exercise)</option>
            <option value="1.375">Lightly active (1-3 days/week)</option>
            <option value="1.55">Moderately active (3-5 days/week)</option>
            <option value="1.725">Very active (6-7 days/week)</option>
            <option value="1.9">Super active (physical job/training)</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="font-bold text-xl text-green-800 mb-3">Daily Calories</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded text-center">
                <p className="text-sm text-gray-500">BMR</p>
                <p className="text-xl font-bold">{result.bmr}</p>
                <p className="text-xs text-gray-400">Base metabolism</p>
              </div>
              <div className="bg-white p-3 rounded text-center">
                <p className="text-sm text-gray-500">TDEE</p>
                <p className="text-2xl font-bold text-green-600">{result.tdee}</p>
                <p className="text-xs text-gray-400">Maintenance</p>
              </div>
              <div className="bg-white p-3 rounded text-center">
                <p className="text-sm text-gray-500">BMI</p>
                <p className="text-xl font-bold">{result.bmi}</p>
                <p className="text-xs text-gray-400">Body mass index</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded">
              <p className="text-sm text-blue-700 font-medium">Weight Loss (0.5 kg/week)</p>
              <p className="text-2xl font-bold text-blue-800">{result.weightLoss} cal/day</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 p-4 rounded">
              <p className="text-sm text-orange-700 font-medium">Weight Gain (0.5 kg/week)</p>
              <p className="text-2xl font-bold text-orange-800">{result.weightGain} cal/day</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}