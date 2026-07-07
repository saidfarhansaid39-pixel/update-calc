'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useTranslations } from 'next-intl';

export default function AdvancedBMIForm() {
  const t = useTranslations('calculatorUI');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [height, setHeight] = useState<number>(170);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(7);
  const [weight, setWeight] = useState<number>(70);
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const heightM = unit === 'metric' ? height / 100 : ((heightFt * 12) + heightIn) * 0.0254;
    const weightKg = unit === 'metric' ? weight : weightLbs * 0.453592;
    
    const bmi = weightKg / (heightM * heightM);
    const bmiCategory = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
    
    const bmr = gender === 'male' 
      ? 88.362 + (13.397 * weightKg) + (4.799 * heightM * 100) - (5.677 * age)
      : 447.593 + (9.247 * weightKg) + (3.098 * heightM * 100) - (4.330 * age);
    
    const multipliers: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very: 1.9 };
    const tdee = bmr * multipliers[activityLevel];
    
    const goalCalories = goal === 'lose' ? tdee - 500 : goal === 'gain' ? tdee + 500 : tdee;
    
    const idealWeightMin = 18.5 * (heightM * heightM);
    const idealWeightMax = 25 * (heightM * heightM);
    
    const waistToHeight = gender === 'male' ? 0.53 : 0.49;
    
    const chartData = [];
    for (let w = 40; w <= 150; w++) {
      const bmiVal = gender === 'male' 
        ? w / (heightM * heightM) 
        : (w * 1.1) / (heightM * heightM);
      chartData.push({ weight: w, bmi: bmiVal.toFixed(1) });
    }

    setResult({
      bmi: bmi.toFixed(1),
      category: bmiCategory,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goalCalories: Math.round(goalCalories),
      idealWeightMin: Math.round(idealWeightMin),
      idealWeightMax: Math.round(idealWeightMax),
      dailyCarbs: Math.round(goalCalories * 0.45 / 4),
      dailyProtein: Math.round(weightKg * 1.8),
      dailyFat: Math.round(goalCalories * 0.3 / 9),
      chartData,
      currentWeight: Math.round(weightKg),
      bmiValue: bmi
    });
  }, [unit, height, heightFt, heightIn, weight, weightLbs, age, gender, activityLevel, goal]);

  const getCategoryColor = (cat: string) => {
    if (cat === 'Underweight') return 'text-blue-600 bg-blue-100';
    if (cat === 'Normal') return 'text-green-600 bg-green-100';
    if (cat === 'Overweight') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setUnit('metric')} className={`px-6 py-3 rounded-lg font-medium transition-all ${unit === 'metric' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}>
          📊 Metric (kg/cm)
        </button>
        <button onClick={() => setUnit('imperial')} className={`px-6 py-3 rounded-lg font-medium transition-all ${unit === 'imperial' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}>
          🇺🇸 Imperial (lb/ft)
        </button>
      </div>

      {/* Main Inputs */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {unit === 'metric' ? (
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <label className="block text-sm font-semibold text-gray-700 mb-2">📏 Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" />
            <input type="range" min="100" max="220" value={height} onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full mt-2 accent-green-600" />
          </div>
        ) : (
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <label className="block text-sm font-semibold text-gray-700 mb-2">📏 Height</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input type="number" value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg" placeholder="ft" />
                <span className="text-xs text-gray-500">ft</span>
              </div>
              <div className="flex-1">
                <input type="number" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg" placeholder="in" />
                <span className="text-xs text-gray-500">in</span>
              </div>
            </div>
          </div>
        )}

        {unit === 'metric' ? (
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <label className="block text-sm font-semibold text-gray-700 mb-2">⚖️ Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full px-4 py-3 border rounded-lg" />
            <input type="range" min="30" max="200" value={weight} onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full mt-2 accent-green-600" />
          </div>
        ) : (
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <label className="block text-sm font-semibold text-gray-700 mb-2">⚖️ Weight (lb)</label>
            <input type="number" value={weightLbs} onChange={(e) => setWeightLbs(Number(e.target.value))}
              className="w-full px-4 py-3 border rounded-lg" />
            <input type="range" min="66" max="440" value={weightLbs} onChange={(e) => setWeightLbs(Number(e.target.value))}
              className="w-full mt-2 accent-green-600" />
          </div>
        )}

        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <label className="block text-sm font-semibold text-gray-700 mb-2">🎂 Age</label>
          <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))}
            className="w-full px-4 py-3 border rounded-lg" />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <label className="block text-sm font-semibold text-gray-700 mb-2">👤 Gender</label>
          <div className="flex gap-2">
            <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-lg ${gender === 'male' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Male</button>
            <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-lg ${gender === 'female' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Female</button>
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <label className="block text-sm font-semibold text-gray-700 mb-2">🏃 Activity Level</label>
          <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}
            className="w-full py-3 px-4 border rounded-lg">
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="light">Lightly active (1-3 days/week)</option>
            <option value="moderate">Moderately active (3-5 days/week)</option>
            <option value="active">Very active (6-7 days/week)</option>
            <option value="very">Super active (physical job/training)</option>
          </select>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <label className="block text-sm font-semibold text-gray-700 mb-2">🎯 Goal</label>
          <div className="flex gap-2">
            {(['lose', 'maintain', 'gain'] as const).map(g => (
              <button key={g} onClick={() => setGoal(g)} className={`flex-1 py-2 rounded-lg capitalize ${goal === g ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>
                {g === 'lose' ? '🔥 Lose' : g === 'maintain' ? '⚖️ Maintain' : '💪 Gain'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Main BMI Display */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-green-100 text-sm">Your BMI</p>
                <p className="text-5xl font-bold">{result.bmi}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getCategoryColor(result.category)}`}>
                  {result.category}
                </span>
              </div>
              <div className="text-center">
                <p className="text-green-100 text-sm">Ideal Weight Range</p>
                <p className="text-2xl font-bold">{result.idealWeightMin}-{result.idealWeightMax} {unit === 'metric' ? 'kg' : 'lb'}</p>
                <p className="text-green-100 text-sm mt-2">For Normal BMI</p>
              </div>
              <div className="text-center">
                <p className="text-green-100 text-sm">Daily Calories ({goal})</p>
                <p className="text-3xl font-bold">{result.goalCalories.toLocaleString()}</p>
                <p className="text-green-100 text-sm">kcal/day</p>
              </div>
            </div>
          </div>

          {/* BMI Chart */}
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-4">📊 BMI Scale Visualization</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="weight" tick={{ fontSize: 11 }} label={{ value: 'Weight (kg)', position: 'bottom' }} />
                  <YAxis domain={[10, 40]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <ReferenceLine y={18.5} stroke="#3b82f6" strokeDasharray="5 5" label="Underweight" />
                  <ReferenceLine y={25} stroke="#22c55e" strokeDasharray="5 5" label="Normal" />
                  <ReferenceLine y={30} stroke="#f59e0b" strokeDasharray="5 5" label="Overweight" />
                  <Line type="monotone" dataKey="bmi" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <ReferenceLine x={result.currentWeight} stroke="#ef4444" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-4">🔥 Calorie Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-700">BMR (Basal Metabolic Rate)</span>
                  <span className="font-bold text-blue-700">{result.bmr.toLocaleString()} kcal</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700">TDEE (Daily Burn)</span>
                  <span className="font-bold text-green-700">{result.tdee.toLocaleString()} kcal</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-700">For Your Goal</span>
                  <span className="font-bold text-purple-700">{result.goalCalories.toLocaleString()} kcal</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-4">🥗 Macro Targets</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Carbohydrates (45%)</span>
                    <span className="font-medium">{result.dailyCarbs}g</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-yellow-400 rounded-full" style={{ width: '45%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Protein (30%)</span>
                    <span className="font-medium">{result.dailyProtein}g</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-red-400 rounded-full" style={{ width: '30%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Fat (25%)</span>
                    <span className="font-medium">{result.dailyFat}g</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-blue-400 rounded-full" style={{ width: '25%' }}></div></div>
                </div>
              </div>
            </div>
          </div>

          {/* BMI Categories */}
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-4">📋 BMI Categories</h3>
            <div className="grid md:grid-cols-4 gap-3">
              {[
                { cat: 'Underweight', range: 'Below 18.5', risk: 'Malnutrition risk', color: 'bg-blue-100 border-blue-300' },
                { cat: 'Normal', range: '18.5 - 24.9', risk: 'Low risk', color: 'bg-green-100 border-green-300' },
                { cat: 'Overweight', range: '25 - 29.9', risk: 'Enhanced risk', color: 'bg-yellow-100 border-yellow-300' },
                { cat: 'Obese', range: '30 or higher', risk: 'High/very high risk', color: 'bg-red-100 border-red-300' }
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-lg border ${item.color} ${result.category === item.cat ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}>
                  <p className="font-semibold text-gray-800">{item.cat}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.range}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.risk}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
