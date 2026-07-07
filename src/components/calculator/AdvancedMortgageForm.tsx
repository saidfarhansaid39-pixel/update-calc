'use client';

import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTranslations } from 'next-intl';

type LoanType = 'purchase' | 'refinance' | 'cashout';
type PaymentFrequency = 'monthly' | 'biweekly' | 'weekly';

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function AdvancedMortgageForm() {
  const t = useTranslations('calculatorUI');
  const [loanType, setLoanType] = useState<LoanType>('purchase');
  const [homePrice, setHomePrice] = useState<number>(350000);
  const [downPayment, setDownPayment] = useState<number>(70000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [propertyTax, setPropertyTax] = useState<number>(1.2);
  const [insurance, setInsurance] = useState<number>(1200);
  const [pmi, setPmi] = useState<number>(0);
  const [hoa, setHoa] = useState<number>(0);
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>('monthly');
  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [points, setPoints] = useState<number>(0);
  const [includeTaxes, setIncludeTaxes] = useState<boolean>(true);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'payment' | 'comparison' | 'schedule'>('overview');
  
  const chartRef = useRef<HTMLDivElement>(null);
  
  const [result, setResult] = useState<any>(null);
  const [amortization, setAmortization] = useState<AmortizationRow[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    calculateMortgage();
  }, [homePrice, downPayment, loanTerm, interestRate, propertyTax, insurance, pmi, hoa, paymentFrequency, points]);

  useEffect(() => {
    setDownPayment(Math.round(homePrice * (downPaymentPercent / 100)));
  }, [downPaymentPercent, homePrice]);

  const calculateMortgage = () => {
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    
    let monthlyPayment: number;
    if (paymentFrequency === 'monthly') {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else if (paymentFrequency === 'biweekly') {
      const biweeklyRate = interestRate / 100 / 26;
      const biweeklyPayments = loanTerm * 26;
      monthlyPayment = (loanAmount * (biweeklyRate * Math.pow(1 + biweeklyRate, biweeklyPayments)) / (Math.pow(1 + biweeklyRate, biweeklyPayments) - 1)) / 2;
    } else {
      const weeklyRate = interestRate / 100 / 52;
      const weeklyPayments = loanTerm * 52;
      monthlyPayment = (loanAmount * (weeklyRate * Math.pow(1 + weeklyRate, weeklyPayments)) / (Math.pow(1 + weeklyRate, weeklyPayments) - 1)) / 4;
    }

    const monthlyPropertyTax = (homePrice * (propertyTax / 100)) / 12;
    const monthlyInsurance = insurance / 12;
    const monthlyPMI = pmi;
    const monthlyHOA = hoa / 12;
    
    const totalMonthly = monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyPMI + monthlyHOA;
    const totalInterest = (monthlyPayment * totalPayments) - loanAmount;
    const totalCost = totalInterest + loanAmount + (monthlyPropertyTax * totalPayments) + (monthlyInsurance * totalPayments) + (monthlyPMI * totalPayments) + (monthlyHOA * totalPayments);
    
    const amortizationSchedule: AmortizationRow[] = [];
    let balance = loanAmount;
    const monthlyP = monthlyPayment;
    
    for (let month = 1; month <= totalPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyP - interestPayment;
      balance = Math.max(0, balance - principalPayment);
      
      if (month <= 360) {
        amortizationSchedule.push({
          month,
          payment: monthlyP,
          principal: principalPayment,
          interest: interestPayment,
          balance
        });
      }
    }
    
    const yearlyData = [];
    for (let year = 1; year <= loanTerm; year++) {
      const startIdx = (year - 1) * 12;
      const endIdx = year * 12;
      const yearPayments = amortizationSchedule.slice(startIdx, endIdx);
      const yearlyPrincipal = yearPayments.reduce((sum, p) => sum + p.principal, 0);
      const yearlyInterest = yearPayments.reduce((sum, p) => sum + p.interest, 0);
      yearlyData.push({
        year: `Year ${year}`,
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
        balance: Math.round(yearPayments[yearPayments.length - 1]?.balance || 0)
      });
    }

    setAmortization(amortizationSchedule);
    setChartData(yearlyData);
    setPieData([
      { name: 'Principal', value: Math.round(loanAmount), color: '#22c55e' },
      { name: 'Interest', value: Math.round(totalInterest), color: '#ef4444' },
      { name: 'Taxes & Insurance', value: Math.round((monthlyPropertyTax + monthlyInsurance) * totalPayments), color: '#f59e0b' }
    ]);

    setResult({
      loanAmount,
      monthlyPayment: Math.round(monthlyPayment),
      monthlyPropertyTax: Math.round(monthlyPropertyTax),
      monthlyInsurance: Math.round(monthlyInsurance),
      monthlyPMI: Math.round(monthlyPMI),
      monthlyHOA: Math.round(monthlyHOA),
      totalMonthly: Math.round(totalMonthly),
      totalInterest: Math.round(totalInterest),
      totalCost: Math.round(totalCost),
      totalPayments,
      upfrontCosts: downPayment + (loanAmount * points / 100) + (loanAmount * 0.02)
    });
  };

  const exportToCSV = () => {
    const headers = ['Month', 'Payment', 'Principal', 'Interest', 'Balance'];
    const csv = [headers.join(','), ...amortization.map(r => 
      [r.month, r.payment.toFixed(2), r.principal.toFixed(2), r.interest.toFixed(2), r.balance.toFixed(2)].join(',')
    )].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amortization_schedule.csv';
    a.click();
  };

  const copyResults = () => {
    const text = `Mortgage Summary:
Loan Amount: $${result?.loanAmount.toLocaleString()}
Interest Rate: ${interestRate}%
Term: ${loanTerm} years
Monthly Payment: $${result?.totalMonthly.toLocaleString()}
Total Interest: $${result?.totalInterest.toLocaleString()}
Total Cost: $${result?.totalCost.toLocaleString()}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Loan Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['purchase', 'refinance', 'cashout'] as LoanType[]).map(type => (
          <button key={type} onClick={() => setLoanType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${loanType === type ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {type === 'purchase' ? '🏠 Purchase' : type === 'refinance' ? '🔄 Refinance' : '💰 Cash Out'}
          </button>
        ))}
      </div>

      {/* Main Input Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">🏠 Home Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" />
          </div>
          <input type="range" min="50000" max="2000000" step="5000" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))}
            className="w-full mt-2 accent-green-600" />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">💵 Down Payment</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="relative w-20">
              <input type="number" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full px-2 py-3 border border-gray-200 rounded-lg text-center" />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
            </div>
          </div>
          <input type="range" min="0" max="50" step="1" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full mt-2 accent-green-600" />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Loan Term</label>
          <select value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500">
            <option value={15}>15 Years</option>
            <option value={20}>20 Years</option>
            <option value={30}>30 Years</option>
          </select>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">📊 Interest Rate</label>
          <div className="relative">
            <input type="number" step="0.125" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          </div>
          <input type="range" min="1" max="15" step="0.125" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full mt-2 accent-green-600" />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">🏛️ Property Tax (Yearly %)</label>
          <div className="relative">
            <input type="number" step="0.1" value={propertyTax} onChange={(e) => setPropertyTax(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">🔒 Home Insurance (Yearly)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input type="number" value={insurance} onChange={(e) => setInsurance(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={includeTaxes} onChange={(e) => setIncludeTaxes(e.target.checked)}
              className="w-4 h-4 text-green-600 rounded" />
            <span className="text-sm text-gray-700">Include Taxes & Insurance</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-700">PMI: $</span>
            <input type="number" value={pmi} onChange={(e) => setPmi(Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded" />
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-700">HOA: $</span>
            <input type="number" value={hoa} onChange={(e) => setHoa(Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded" />
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-700">Points:</span>
            <input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))}
              className="w-16 px-2 py-1 border rounded" />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {[
          { id: 'overview', label: '📈 Overview', icon: '📊' },
          { id: 'payment', label: '💰 Payment Details', icon: '💵' },
          { id: 'comparison', label: '⚖️ Comparison', icon: '🔍' },
          { id: 'schedule', label: '📋 Schedule', icon: '📅' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 font-medium transition-all border-b-2 ${activeTab === tab.id ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Main Result Card */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
                <p className="text-green-100 text-sm font-medium mb-1">Estimated Monthly Payment</p>
                <p className="text-5xl font-bold mb-4">${result.totalMonthly.toLocaleString()}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="text-green-100">Principal & Interest</p>
                    <p className="font-bold">${result.monthlyPayment}</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="text-green-100">Taxes</p>
                    <p className="font-bold">${result.monthlyPropertyTax}</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="text-green-100">Insurance</p>
                    <p className="font-bold">${result.monthlyInsurance}</p>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">Loan Details</h3>
                    <div className="flex gap-2">
                      <button onClick={copyResults} className="p-2 hover:bg-gray-100 rounded-lg" title="Copy">📋</button>
                      <button onClick={exportToCSV} className="p-2 hover:bg-gray-100 rounded-lg" title="Export">📥</button>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Home Price</span><span className="font-medium">${homePrice.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Down Payment</span><span className="font-medium">${downPayment.toLocaleString()} ({downPaymentPercent}%)</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Loan Amount</span><span className="font-medium">${result.loanAmount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Interest Rate</span><span className="font-medium">{interestRate}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Loan Term</span><span className="font-medium">{loanTerm} years</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Upfront Costs</span><span className="font-medium">${result.upfrontCosts.toLocaleString()}</span></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3">💰 Cost Breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Total Interest</span><span className="font-medium text-red-500">${result.totalInterest.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Total Cost</span><span className="font-medium">${result.totalCost.toLocaleString()}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && chartData.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Line Chart */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">📊 Principal vs Interest Over Time</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v/1000}k`} />
                      <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="principal" stroke="#22c55e" strokeWidth={2} dot={false} name="Principal" />
                      <Line type="monotone" dataKey="interest" stroke="#ef4444" strokeWidth={2} dot={false} name="Interest" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">🥧 Total Cost Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {pieData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                      </Pie>
                      <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">💵 Monthly Payment Breakdown</h3>
              <div className="space-y-4">
                {[
                  { label: 'Principal & Interest', value: result.monthlyPayment, color: 'bg-green-500' },
                  { label: 'Property Tax', value: result.monthlyPropertyTax, color: 'bg-blue-500' },
                  { label: 'Home Insurance', value: result.monthlyInsurance, color: 'bg-purple-500' },
                  { label: 'PMI', value: result.monthlyPMI, color: 'bg-yellow-500' },
                  { label: 'HOA', value: result.monthlyHOA, color: 'bg-pink-500' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <span className="font-medium">${item.value.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.value / result.totalMonthly) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t flex justify-between text-lg font-bold">
                  <span>Total Monthly Payment</span>
                  <span className="text-green-600">${result.totalMonthly.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">⚖️ Compare Different Scenarios</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { rate: interestRate - 1, label: 'Lower Rate' },
                  { rate: interestRate, label: 'Current' },
                  { rate: interestRate + 1, label: 'Higher Rate' }
                ].map((scenario, i) => {
                  const monthlyRate = scenario.rate / 100 / 12;
                  const monthlyP = result.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm * 12)) / (Math.pow(1 + monthlyRate, loanTerm * 12) - 1);
                  const totalInterest = (monthlyP * loanTerm * 12) - result.loanAmount;
                  return (
                    <div key={i} className={`p-4 rounded-lg border-2 ${i === 1 ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                      <p className="text-sm text-gray-500 mb-1">{scenario.label}</p>
                      <p className="text-2xl font-bold text-gray-800">{scenario.rate}%</p>
                      <p className="text-lg font-semibold text-green-600 mt-2">${Math.round(monthlyP).toLocaleString()}/mo</p>
                      <p className="text-sm text-gray-500">Total Interest: ${Math.round(totalInterest).toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">📋 Amortization Schedule</h3>
                <button onClick={() => setShowAmortization(!showAmortization)} className="text-green-600 hover:underline text-sm">
                  {showAmortization ? 'Hide' : 'Show'} Full Schedule
                </button>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="p-3 text-left">Month</th>
                      <th className="p-3 text-right">Payment</th>
                      <th className="p-3 text-right">Principal</th>
                      <th className="p-3 text-right">Interest</th>
                      <th className="p-3 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showAmortization ? amortization : amortization.slice(0, 24)).map((row, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        <td className="p-3">{row.month}</td>
                        <td className="p-3 text-right">${row.payment.toFixed(2)}</td>
                        <td className="p-3 text-right text-green-600">${row.principal.toFixed(2)}</td>
                        <td className="p-3 text-right text-red-500">${row.interest.toFixed(2)}</td>
                        <td className="p-3 text-right">${row.balance.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!showAmortization && (
                <p className="text-center text-gray-500 text-sm mt-4">Showing first 24 months. Click "Show Full Schedule" to see all {loanTerm * 12} payments.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Formula Section */}
      <div className="bg-gray-50 rounded-xl p-6 mt-6">
        <h3 className="font-bold text-gray-800 mb-3">📐 Mortgage Payment Formula</h3>
        <div className="bg-white p-4 rounded-lg border font-mono text-center text-lg">
          M = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]
        </div>
        <div className="mt-4 grid md:grid-cols-4 gap-4 text-sm">
          <div><span className="font-semibold">M</span> = Monthly payment</div>
          <div><span className="font-semibold">P</span> = Principal (${result?.loanAmount.toLocaleString()})</div>
          <div><span className="font-semibold">r</span> = Monthly rate ({interestRate}%/12 = {(interestRate/12).toFixed(4)}%)</div>
          <div><span className="font-semibold">n</span> = Total payments ({loanTerm * 12})</div>
        </div>
      </div>
    </div>
  );
}
