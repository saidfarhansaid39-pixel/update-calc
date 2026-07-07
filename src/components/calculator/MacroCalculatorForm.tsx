'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function MacroCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(30);
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [activity, setActivity] = useState<number>(1.2);
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const bmr = gender === 'male' 
      ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
      : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    
    const tdee = Math.round(bmr * activity);
    
    let calories: number;
    if (goal === 'lose') calories = tdee - 500;
    else if (goal === 'gain') calories = tdee + 500;
    else calories = tdee;
    
    const protein = Math.round(weight * 2);
    const fat = Math.round((calories * 0.3) / 9);
    const carbs = Math.round((calories - (protein * 4 + fat * 9)) / 4);
    
    setResult({
      bmr: Math.round(bmr),
      tdee,
      calories,
      protein,
      fat,
      carbs
    });
  }, [gender, age, weight, height, activity, goal]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="flex gap-2">
          <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded ${gender === 'male' ? 'bg-green-button text-white' : 'bg-gray-200'}`}>{t('formLabels.male')}</button>
          <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded ${gender === 'female' ? 'bg-green-button text-white' : 'bg-gray-200'}`}>{t('formLabels.female')}</button>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('formLabels.age')}</label>
          <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('formLabels.weight')}</label>
          <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('formLabels.height')}</label>
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('formLabels.activityLevel')}</label>
          <select value={activity} onChange={(e) => setActivity(Number(e.target.value))} className="w-full px-3 py-2 border rounded">
            <option value="1.2">Sedentary</option>
            <option value="1.375">Light</option>
            <option value="1.55">Moderate</option>
            <option value="1.725">Active</option>
            <option value="1.9">Very Active</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('formLabels.healthGoal')}</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value as any)} className="w-full px-3 py-2 border rounded">
            <option value="lose">Lose Weight</option>
            <option value="maintain">Maintain</option>
            <option value="gain">Gain Weight</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-lg text-gray-800 mb-4">{t('sections.results')}</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded text-center">
              <p className="text-sm text-blue-700">{t('formLabels.calories')}</p>
              <p className="text-2xl font-bold text-blue-800">{result.calories}</p>
            </div>
            <div className="bg-green-100 p-4 rounded text-center">
              <p className="text-sm text-green-700">{t('formLabels.protein')}</p>
              <p className="text-2xl font-bold text-green-800">{result.protein}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded text-center">
              <p className="text-sm text-yellow-700">{t('formLabels.carbs')}</p>
              <p className="text-2xl font-bold text-yellow-800">{result.carbs}</p>
            </div>
            <div className="bg-red-100 p-4 rounded text-center">
              <p className="text-sm text-red-700">{t('formLabels.fat')}</p>
              <p className="text-2xl font-bold text-red-800">{result.fat}</p>
            </div>
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <p>BMR: {result.bmr} kcal</p>
            <p>TDEE: {result.tdee} kcal</p>
          </div>
        </div>
      )}
    </div>
  );
}