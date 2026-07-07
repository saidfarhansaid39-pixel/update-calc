'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTranslations } from 'next-intl';

type ContributionTiming = 'end' | 'beginning';

export default function AdvancedCompoundInterestForm() {
  const t = useTranslations('calculatorUI');
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);
  const [regularContribution, setRegularContribution] = useState<number>(500);
  const [contributionFrequency, setContributionFrequency] = useState<'monthly' | 'annually'>('monthly');
  const [contributionTiming, setContributionTiming] = useState<ContributionTiming>('end');
  const [interestRate, setInterestRate] = useState<number>(7);
  const [years, setYears] = useState<number>(30);
  const [compoundFrequency, setCompoundFrequency] = useState<'annually' | 'quarterly' | 'monthly' | 'daily'>('monthly');
  const [taxRate, setTaxRate] = useState<number>(0);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [showInflation, setShowInflation] = useState<boolean>(true);
  const [showAdjustForInflation, setShowAdjustForInflation] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'chart' | 'schedule' | 'breakdown'>('chart');
  
  const [results, setResults] = useState<any>(null);
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    calculateCompoundInterest();
  }, [initialInvestment, regularContribution, contributionFrequency, contributionTiming, interestRate, years, compoundFrequency, taxRate, inflationRate]);

  const calculateCompoundInterest = () => {
    const n = compoundFrequency === 'annually' ? 1 : compoundFrequency === 'quarterly' ? 4 : compoundFrequency === 'monthly' ? 12 : 365;
    const r = interestRate / 100;
    const monthlyR = r / 12;
    
    const annualContrib = contributionFrequency === 'monthly' ? regularContribution * 12 : regularContribution;
    const monthlyContrib = contributionFrequency === 'monthly' ? regularContribution : regularContribution / 12;
    
    const yearlyResults = [];
    const monthlyResults = [];
    
    let balance = initialInvestment;
    let totalContributed = initialInvestment;
    let totalInterest = 0;
    
    for (let month = 1; month <= years * 12; month++) {
      const monthInterest = balance * monthlyR;
      balance += monthInterest;
      totalInterest += monthInterest;
      
      if (contributionTiming === 'end') {
        balance += monthlyContrib;
        totalContributed += monthlyContrib;
      } else if (month > 1) {
        balance += monthlyContrib;
        totalContributed += monthlyContrib;
      }
      
      if (month % 12 === 0) {
        const year = month / 12;
        const inflationFactor = Math.pow(1 + inflationRate / 100, year);
        yearlyResults.push({
          year,
          balance: Math.round(balance),
          totalContributed: Math.round(totalContributed),
          totalInterest: Math.round(balance - totalContributed),
          inflationAdjusted: Math.round(balance / inflationFactor),
          yearLabel: `Year ${year}`
        });
      }
      
      if (month <= 60 || month % 6 === 0) {
        monthlyResults.push({
          month,
          balance: Math.round(balance),
          contributed: Math.round(totalContributed),
          interest: Math.round(balance - totalContributed)
        });
      }
    }
    
    const futureValue = balance;
    const taxOnEarnings = (balance - initialInvestment - annualContrib * years) * (taxRate / 100);
    const afterTaxValue = futureValue - Math.max(0, taxOnEarnings);
    const inflationAdjustedValue = futureValue / Math.pow(1 + inflationRate / 100, years);
    
    const futureValueAnnually = initialInvestment * Math.pow(1 + r, years) + 
      annualContrib * ((Math.pow(1 + r, years) - 1) / r);

    setResults({
      futureValue,
      futureValueAnnually,
      totalContributed,
      totalInterest: futureValue - totalContributed,
      afterTaxValue: Math.max(0, afterTaxValue),
      inflationAdjustedValue,
      taxOnEarnings: Math.max(0, taxOnEarnings),
      effectiveRate: ((futureValue - totalContributed) / totalContributed * 100).toFixed(1)
    });
    
    setYearlyData(yearlyResults);
    setMonthlyData(monthlyResults);
  };

  const exportData = () => {
    const csv = ['Year,Balance,Contributions,Interest,Inflation Adjusted'];
    yearlyData.forEach(row => {
      csv.push(`${row.year},${row.balance},${row.totalContributed},${row.totalInterest},${row.inflationAdjusted}`);
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compound_interest_data.csv';
    a.click();
  };

  const copyResults = () => {
    const text = `Compound Interest Results:
Initial Investment: $${initialInvestment.toLocaleString()}
Regular Contribution: $${regularContribution.toLocaleString()}/month
Interest Rate: ${interestRate}%
Years: ${years}
Future Value: $${results?.futureValue.toLocaleString()}
Total Contributions: $${results?.totalContributed.toLocaleString()}
Total Interest: $${results?.totalInterest.toLocaleString()}
Inflation Adjusted: $${results?.inflationAdjustedValue.toLocaleString()}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: '🚀 Retirement', years: 30, contrib: 1000 },
          { label: '🏠 House Down Payment', years: 5, contrib: 500 },
          { label: '🎓 Education', years: 18, contrib: 200 },
          { label: '💰 Emergency Fund', years: 2, contrib: 300 }
        ].map((preset, i) => (
          <button key={i} onClick={() => { setYears(preset.years); setRegularContribution(preset.contrib); }}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 text-sm font-medium transition-all">
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main Inputs */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Initial Investment</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>
          <input type="range" min="0" max="100000" step="500" value={initialInvestment} onChange={(e) => setInitialInvestment(Number(e.target.value))}
            className="w-full mt-2 accent-green-600" />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">📈 Regular Contribution</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input type="number" value={regularContribution} onChange={(e) => setRegularContribution(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg" />
            </div>
            <select value={contributionFrequency} onChange={(e) => setContributionFrequency(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded-lg">
              <option value="monthly">/month</option>
              <option value="annually">/year</option>
            </select>
          </div>
          <input type="range" min="0" max="10000" step="50" value={regularContribution} onChange={(e) => setRegularContribution(Number(e.target.value))}
            className="w-full mt-2 accent-green-600" />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">📊 Annual Interest Rate</label>
          <div className="relative">
            <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          </div>
          <input type="range" min="1" max="15" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full mt-2 accent-green-600" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Conservative (4%)</span>
            <span>Aggressive (12%)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Investment Period</label>
          <div className="flex gap-2 items-center">
            <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
            <span className="text-gray-500">years</span>
          </div>
          <input type="range" min="1" max="50" value={years} onChange={(e) => setYears(Number(e.target.value))}
            className="w-full mt-2 accent-green-600" />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">🔄 Compound Frequency</label>
          <select value={compoundFrequency} onChange={(e) => setCompoundFrequency(e.target.value as any)}
            className="w-full py-3 px-4 border border-gray-200 rounded-lg">
            <option value="annually">Annually</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
          </select>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">📆 Contribution Timing</label>
          <div className="flex gap-2">
            <button onClick={() => setContributionTiming('end')} 
              className={`flex-1 py-2 rounded-lg ${contributionTiming === 'end' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>End of Period</button>
            <button onClick={() => setContributionTiming('beginning')} 
              className={`flex-1 py-2 rounded-lg ${contributionTiming === 'beginning' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Beginning</button>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={showAdjustForInflation} onChange={(e) => setShowAdjustForInflation(e.target.checked)}
              className="w-4 h-4 text-green-600 rounded" />
            <span className="text-sm text-gray-700">Account for Inflation</span>
          </label>
          {showAdjustForInflation && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Inflation Rate:</span>
              <input type="number" step="0.1" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-20 px-2 py-1 border rounded" />
              <span className="text-gray-400">%</span>
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600">Tax Rate:</span>
            <input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-16 px-2 py-1 border rounded" />
            <span className="text-gray-400">%</span>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'chart', label: '📈 Growth Chart' },
          { id: 'schedule', label: '📋 Yearly Schedule' },
          { id: 'breakdown', label: '💰 Breakdown' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveView(tab.id as any)}
            className={`px-4 py-3 font-medium transition-all border-b-2 ${activeView === tab.id ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Main Results Card */}
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
              <p className="text-green-100 text-sm font-medium mb-1">Future Value</p>
              <p className="text-4xl font-bold mb-2">${results.futureValue.toLocaleString()}</p>
              <p className="text-green-100 text-sm">in {years} years</p>
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3">📊 Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Total Contributed</span><span className="font-medium">${results.totalContributed.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Total Interest</span><span className="font-medium text-green-600">${results.totalInterest.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Interest as % of Contrib.</span><span className="font-medium">{results.effectiveRate}%</span></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">Actions</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={copyResults} className="flex-1 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">Copy Results</button>
                <button onClick={exportData} className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm">Export CSV</button>
              </div>
            </div>
          </div>

          {/* Charts */}
          {activeView === 'chart' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">📈 Investment Growth Over Time</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="yearLabel" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                      <Legend />
                      <Area type="monotone" dataKey="balance" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} name="Total Balance" />
                      <Area type="monotone" dataKey="totalContributed" stackId="2" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.6} name="Contributions" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">📊 Principal vs Interest</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="yearLabel" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                      <Legend />
                      <Area type="monotone" dataKey="totalInterest" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Interest Earned" />
                      <Area type="monotone" dataKey="totalContributed" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Your Contributions" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Schedule */}
          {activeView === 'schedule' && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 overflow-x-auto">
              <h3 className="font-semibold text-gray-800 mb-4">📋 Yearly Breakdown</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Year</th>
                    <th className="p-3 text-right">Balance</th>
                    <th className="p-3 text-right">Contributions</th>
                    <th className="p-3 text-right">Interest</th>
                    {showAdjustForInflation && <th className="p-3 text-right">Inflation Adj.</th>}
                  </tr>
                </thead>
                <tbody>
                  {yearlyData.map((row, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{row.yearLabel}</td>
                      <td className="p-3 text-right text-green-600 font-medium">${row.balance.toLocaleString()}</td>
                      <td className="p-3 text-right">${row.totalContributed.toLocaleString()}</td>
                      <td className="p-3 text-right text-red-500">${row.totalInterest.toLocaleString()}</td>
                      {showAdjustForInflation && <td className="p-3 text-right text-gray-500">${row.inflationAdjusted.toLocaleString()}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Breakdown */}
          {activeView === 'breakdown' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">💵 Final Balance Composition</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Initial Investment</span>
                      <span className="font-medium">${initialInvestment.toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(initialInvestment / results.futureValue) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Regular Contributions</span>
                      <span className="font-medium">${(results.totalContributed - initialInvestment).toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${((results.totalContributed - initialInvestment) / results.futureValue) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Interest Earned</span>
                      <span className="font-medium text-green-600">${results.totalInterest.toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${(results.totalInterest / results.futureValue) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">📈 Key Metrics</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">Total Return</p>
                    <p className="text-2xl font-bold text-green-700">+{((results.totalInterest / results.totalContributed) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">Annualized Return</p>
                    <p className="text-2xl font-bold text-blue-700">{((Math.pow(results.futureValue / initialInvestment, 1 / years) - 1) * 100).toFixed(2)}%</p>
                  </div>
                  {showAdjustForInflation && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-700">Inflation Adjusted Value</p>
                      <p className="text-2xl font-bold text-yellow-700">${results.inflationAdjustedValue.toLocaleString()}</p>
                      <p className="text-xs text-yellow-600">Purchasing power in today's dollars</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Formula */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 mb-3">📐 Compound Interest Formula</h3>
        <div className="bg-white p-4 rounded-lg border font-mono text-center text-lg">
          A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
        </div>
        <div className="mt-4 grid md:grid-cols-4 gap-4 text-sm">
          <div><span className="font-semibold">A</span> = Final Amount</div>
          <div><span className="font-semibold">P</span> = Principal (${initialInvestment})</div>
          <div><span className="font-semibold">r</span> = Annual Rate ({interestRate}%)</div>
          <div><span className="font-semibold">n</span> = Compounds/Year ({compoundFrequency === 'monthly' ? '12' : '4'})</div>
          <div><span className="font-semibold">t</span> = Time ({years} years)</div>
          <div><span className="font-semibold">PMT</span> = Regular Contribution</div>
        </div>
      </div>
    </div>
  );
}
