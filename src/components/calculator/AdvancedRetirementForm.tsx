'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import { useTranslations } from 'next-intl';

export default function AdvancedRetirementForm() {
  const t = useTranslations('calculatorUI');
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(90);
  const [currentSavings, setCurrentSavings] = useState<number>(50000);
  const [annualContribution, setAnnualContribution] = useState<number>(12000);
  const [expectedReturn, setExpectedReturn] = useState<number>(7);
  const [inflation, setInflation] = useState<number>(2.5);
  const [currentIncome, setCurrentIncome] = useState<number>(75000);
  const [retirementIncomePercent, setRetirementIncomePercent] = useState<number>(70);
  const [socialSecurity, setSocialSecurity] = useState<number>(24000);
  const [pension, setPension] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'projection' | 'income' | 'scenarios'>('projection');
  const [results, setResults] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const yearsToRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;
    const annualReturn = expectedReturn / 100;
    const annualInflation = inflation / 100;
    
    let balance = currentSavings;
    const yearlyData = [];
    
    for (let year = currentAge; year <= lifeExpectancy; year++) {
      if (year < retirementAge) {
        balance = balance * (1 + annualReturn) + annualContribution;
      } else {
        const withdrawalYear = year - retirementAge;
        const inflationAdjustedIncome = currentIncome * (retirementIncomePercent / 100) * Math.pow(1 + annualInflation, yearsToRetirement + withdrawalYear);
        const totalIncomeNeeded = Math.max(0, inflationAdjustedIncome - socialSecurity - pension);
        balance = balance * (1 + annualReturn) - totalIncomeNeeded;
      }
      
      yearlyData.push({
        age: year,
        year: year - currentAge,
        balance: Math.max(0, Math.round(balance)),
        contributions: year < retirementAge ? Math.round(currentSavings + annualContribution * (year - currentAge)) : 0,
        withdrawals: year >= retirementAge ? Math.round(currentSavings * 0.05) : 0
      });
    }
    
    const balanceAtRetirement = yearlyData.find(d => d.age === retirementAge)?.balance || 0;
    const withdrawalAmount = (balanceAtRetirement * 0.04) / 12;
    const safeWithdrawalAnnual = balanceAtRetirement * 0.04;
    
    const retirementIncomeNeed = (currentIncome * (retirementIncomePercent / 100)) * Math.pow(1 + annualInflation, yearsToRetirement);
    const monthlyIncomeFromSS = socialSecurity / 12;
    const monthlyPension = pension / 12;
    const requiredSavingsIncome = (retirementIncomeNeed - socialSecurity - pension) / 12;
    
    const shortfall = Math.max(0, requiredSavingsIncome - withdrawalAmount);
    const yearsUntilDepletion = yearlyData.findIndex(d => d.age >= lifeExpectancy && d.balance <= 0);
    
    setResults({
      balanceAtRetirement,
      withdrawalAmount: Math.round(withdrawalAmount),
      safeWithdrawalAnnual,
      monthlyIncome: Math.round(withdrawalAmount + monthlyIncomeFromSS + monthlyPension),
      retirementIncomeNeed: Math.round(retirementIncomeNeed),
      shortfall: Math.round(shortfall),
      yearsToRetirement,
      requiredSavings: Math.round(retirementIncomeNeed / 0.04)
    });
    
    setChartData(yearlyData);
  }, [currentAge, retirementAge, lifeExpectancy, currentSavings, annualContribution, expectedReturn, inflation, currentIncome, retirementIncomePercent, socialSecurity, pension]);

  const ageGroups = [
    { range: '20-30', avg: 35000, desc: 'Start early!' },
    { range: '30-40', avg: 135000, desc: 'Building momentum' },
    { range: '40-50', avg: 212000, desc: 'Peak earning years' },
    { range: '50-60', avg: 296000, desc: 'Pre-retirement' },
    { range: '60-70', avg: 408000, desc: 'Final stretch' }
  ];

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: 'Aggressive', return: 9, contrib: 20000 },
          { label: 'Moderate', return: 7, contrib: 12000 },
          { label: 'Conservative', return: 5, contrib: 8000 }
        ].map((preset, i) => (
          <button key={i} onClick={() => { setExpectedReturn(preset.return); setAnnualContribution(preset.contrib); }}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 text-sm font-medium">
            {preset.label}
          </button>
        ))}
      </div>

      {/* Inputs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <label className="block text-sm font-semibold text-gray-700 mb-2">🎂 Current Age</label>
          <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))}
            className="w-full px-4 py-3 border rounded-lg" />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <label className="block text-sm font-semibold text-gray-700 mb-2">🎯 Retirement Age</label>
          <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))}
            className="w-full px-4 py-3 border rounded-lg" />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Current Savings</label>
          <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))}
            className="w-full px-4 py-3 border rounded-lg" />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <label className="block text-sm font-semibold text-gray-700 mb-2">📈 Annual Contribution</label>
          <input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(Number(e.target.value))}
            className="w-full px-4 py-3 border rounded-lg" />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <label className="block text-sm font-semibold text-gray-700 mb-2">📊 Expected Return (%)</label>
          <input type="number" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))}
            className="w-full px-4 py-3 border rounded-lg" />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <label className="block text-sm font-semibold text-gray-700 mb-2">🏛️ Current Income</label>
          <input type="number" value={currentIncome} onChange={(e) => setCurrentIncome(Number(e.target.value))}
            className="w-full px-4 py-3 border rounded-lg" />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <label className="block text-sm font-semibold text-gray-700 mb-2">% of Income in Retirement</label>
          <input type="number" value={retirementIncomePercent} onChange={(e) => setRetirementIncomePercent(Number(e.target.value))}
            className="w-full px-4 py-3 border rounded-lg" />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <label className="block text-sm font-semibold text-gray-700 mb-2">📋 Social Security</label>
          <input type="number" value={socialSecurity} onChange={(e) => setSocialSecurity(Number(e.target.value))}
            className="w-full px-4 py-3 border rounded-lg" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['projection', 'income', 'scenarios'] as const).map(tab => (
          <button key={tab} onClick={() => setViewMode(tab)}
            className={`px-4 py-3 font-medium border-b-2 ${viewMode === tab ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}>
            {tab === 'projection' ? '📈 Projection' : tab === 'income' ? '💰 Monthly Income' : '⚖️ Scenarios'}
          </button>
        ))}
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {viewMode === 'projection' && (
            <>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
                <p className="text-green-100 text-sm mb-1">At Retirement (Age {retirementAge})</p>
                <p className="text-5xl font-bold mb-2">${results.balanceAtRetirement.toLocaleString()}</p>
                <p className="text-green-100">4% Safe Withdrawal: ${results.safeWithdrawalAnnual.toLocaleString()}/year</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border">
                <h3 className="font-semibold text-gray-800 mb-4">📊 Savings Projection</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                      <Legend />
                      <Area type="monotone" dataKey="balance" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} name="Balance" />
                      <ReferenceLine x={retirementAge} stroke="#ef4444" strokeDasharray="5 5" label="Retirement" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {viewMode === 'income' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border">
                <h3 className="font-semibold text-gray-800 mb-4">💵 Monthly Income Sources</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-700">4% Rule Withdrawal</span>
                    <span className="font-bold text-green-700">${results.withdrawalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-700">Social Security</span>
                    <span className="font-bold text-blue-700">${Math.round(socialSecurity / 12).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-purple-700">Pension</span>
                    <span className="font-bold text-purple-700">${Math.round(pension / 12).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg font-bold">
                    <span>Total Monthly Income</span>
                    <span className="text-green-600">${results.monthlyIncome.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border">
                <h3 className="font-semibold text-gray-800 mb-4">📋 Income Comparison</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Current Monthly Income</span>
                      <span>${Math.round(currentIncome / 12).toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Retirement Monthly Income</span>
                      <span>${results.monthlyIncome.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${(results.monthlyIncome / (currentIncome/12)) * 100}%` }}></div></div>
                  </div>
                  <div className="text-sm text-gray-500 mt-4">
                    {((results.monthlyIncome / (currentIncome/12)) * 100).toFixed(0)}% of current income replacement
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'scenarios' && (
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-4">⚖️ What If Scenarios</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: 'Work 5 years longer', age: retirementAge + 5, desc: 'Add more savings time' },
                  { label: 'Contribute 20% more', contrib: annualContribution * 1.2, desc: 'Increase savings rate' },
                  { label: '4.5% withdrawal', rate: 4.5, desc: 'Slightly higher withdrawal' }
                ].map((scenario, i) => {
                  const extraYears = scenario.age ? scenario.age - retirementAge : 0;
                  const extraContrib = scenario.contrib ? scenario.contrib - annualContribution : 0;
                  const benefit = scenario.age ? Math.round(results.balanceAtRetirement * 0.08) : Math.round(extraContrib * 15);
                  return (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800">{scenario.label}</h4>
                      <p className="text-sm text-gray-600 mt-1">{scenario.desc}</p>
                      <p className="text-green-600 font-bold mt-2">+${benefit.toLocaleString()}/year</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Milestones */}
      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <h3 className="font-semibold text-gray-800 mb-4">🏆 Retirement Savings Milestones by Age</h3>
        <div className="grid md:grid-cols-5 gap-3">
          {ageGroups.map((group, i) => (
            <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800">{group.range}</p>
              <p className="text-lg font-bold text-green-600">${(group.avg / 1000).toFixed(0)}k</p>
              <p className="text-xs text-gray-500">{group.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
