"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { HouseAffordabilityForm1 } from '@/components/calculator/HouseAffordabilityForm1';
import { HouseAffordabilityForm2 } from '@/components/calculator/HouseAffordabilityForm2';
import { HouseAffordabilityResults } from '@/components/calculator/HouseAffordabilityResults';
import { HouseAffordabilityArticle } from '@/components/calculator/HouseAffordabilityArticle';

export function HouseAffordabilityCalculator() {
  const t = useTranslations('calculatorUI');
  // Form 1 State
  const [f1_income, setF1Income] = useState("120,000");
  const [f1_term, setF1Term] = useState("30");
  const [f1_rate, setF1Rate] = useState("6.609");
  const [f1_debt, setF1Debt] = useState("0");
  const [f1_downPayment, setF1DownPayment] = useState("20");
  const [f1_downPaymentType, setF1DownPaymentType] = useState("%");
  const [f1_propertyTax, setF1PropertyTax] = useState("1.5");
  const [f1_propertyTaxType, setF1PropertyTaxType] = useState("%");
  const [f1_hoa, setF1Hoa] = useState("0");
  const [f1_hoaType, setF1HoaType] = useState("%");
  const [f1_insurance, setF1Insurance] = useState("0.5");
  const [f1_insuranceType, setF1InsuranceType] = useState("%");
  const [f1_dti, setF1Dti] = useState("Conventional loan (28/36 rule)");
  
  const state1 = {
    income: f1_income, term: f1_term, rate: f1_rate, debt: f1_debt,
    downPayment: f1_downPayment, downPaymentType: f1_downPaymentType,
    propertyTax: f1_propertyTax, propertyTaxType: f1_propertyTaxType,
    hoa: f1_hoa, hoaType: f1_hoaType, insurance: f1_insurance, insuranceType: f1_insuranceType,
    dti: f1_dti
  };
  const setters1 = {
    setIncome: setF1Income, setTerm: setF1Term, setRate: setF1Rate, setDebt: setF1Debt,
    setDownPayment: setF1DownPayment, setDownPaymentType: setF1DownPaymentType,
    setPropertyTax: setF1PropertyTax, setPropertyTaxType: setF1PropertyTaxType,
    setHoa: setF1Hoa, setHoaType: setF1HoaType, setInsurance: setF1Insurance, setInsuranceType: setF1InsuranceType,
    setDti: setF1Dti
  };

  // Form 2 State
  const [f2_budget, setF2Budget] = useState("3,500");
  const [f2_term, setF2Term] = useState("30");
  const [f2_rate, setF2Rate] = useState("6.609");
  const [f2_downPayment, setF2DownPayment] = useState("20");
  const [f2_downPaymentType, setF2DownPaymentType] = useState("%");
  const [f2_includeTax, setF2IncludeTax] = useState(true);
  const [f2_propertyTax, setF2PropertyTax] = useState("1.5");
  const [f2_propertyTaxType, setF2PropertyTaxType] = useState("%");
  const [f2_hoa, setF2Hoa] = useState("0");
  const [f2_hoaType, setF2HoaType] = useState("%");
  const [f2_insurance, setF2Insurance] = useState("0.5");
  const [f2_insuranceType, setF2InsuranceType] = useState("%");
  const [f2_maintenance, setF2Maintenance] = useState("1.5");
  const [f2_maintenanceType, setF2MaintenanceType] = useState("%");

  const state2 = {
    budget: f2_budget, term: f2_term, rate: f2_rate, downPayment: f2_downPayment, downPaymentType: f2_downPaymentType,
    includeTax: f2_includeTax, propertyTax: f2_propertyTax, propertyTaxType: f2_propertyTaxType,
    hoa: f2_hoa, hoaType: f2_hoaType, insurance: f2_insurance, insuranceType: f2_insuranceType,
    maintenance: f2_maintenance, maintenanceType: f2_maintenanceType
  };
  const setters2 = {
    setBudget: setF2Budget, setTerm: setF2Term, setRate: setF2Rate, setDownPayment: setF2DownPayment, setDownPaymentType: setF2DownPaymentType,
    setIncludeTax: setF2IncludeTax, setPropertyTax: setF2PropertyTax, setPropertyTaxType: setF2PropertyTaxType,
    setHoa: setF2Hoa, setHoaType: setF2HoaType, setInsurance: setF2Insurance, setInsuranceType: setF2InsuranceType,
    setMaintenance: setF2Maintenance, setMaintenanceType: setF2MaintenanceType
  };

  const [results1, setResults1] = useState<any>(null);
  const [results2, setResults2] = useState<any>(null);

  const calculateF1 = () => {
    const i = parseFloat(f1_income.replace(/,/g, '')) || 0;
    const t = parseFloat(f1_term) || 0;
    const r = parseFloat(f1_rate) || 0;
    const debt = parseFloat(f1_debt.replace(/,/g, '')) || 0;
    
    // Front end and back end max limits based on DTI selection
    let frontEnd = 0.28;
    let backEnd = 0.36;
    if (f1_dti.includes("FHA")) { frontEnd = 0.31; backEnd = 0.43; }
    if (f1_dti.includes("VA")) { frontEnd = 1.0; backEnd = 0.41; } // VA doesn't use front-end really

    const monthlyGross = i / 12;
    const maxHousingFront = monthlyGross * frontEnd;
    const maxHousingBack = (monthlyGross * backEnd) - debt;
    
    const maxHousingCost = Math.min(maxHousingFront, maxHousingBack);
    if (maxHousingCost <= 0) {
      setResults1({ homePrice: 0, loanAmount: 0, downPayment: 0, monthlyCost: 0 });
      return;
    }

    const downPct = f1_downPaymentType === "%" ? (parseFloat(f1_downPayment) || 0) / 100 : 0;
    const taxPct = f1_propertyTaxType === "%" ? (parseFloat(f1_propertyTax) || 0) / 100 : 0;
    const hoaPct = f1_hoaType === "%" ? (parseFloat(f1_hoa) || 0) / 100 : 0;
    const insPct = f1_insuranceType === "%" ? (parseFloat(f1_insurance) || 0) / 100 : 0;

    const rateMonthly = r / 100 / 12;
    const n = t * 12;

    let piFactor = 0;
    if (rateMonthly > 0) {
      piFactor = (rateMonthly * Math.pow(1 + rateMonthly, n)) / (Math.pow(1 + rateMonthly, n) - 1);
    } else {
      piFactor = 1 / n;
    }

    const K = ((1 - downPct) * piFactor) + ((taxPct + hoaPct + insPct) / 12);
    let homePrice = maxHousingCost / K;
    
    if (f1_downPaymentType === "$") {
      const flatDown = parseFloat(f1_downPayment.replace(/,/g, '')) || 0;
      const K_flat = piFactor + ((taxPct + hoaPct + insPct) / 12);
      homePrice = (maxHousingCost + flatDown * piFactor) / K_flat;
    }

    const finalDown = f1_downPaymentType === "%" ? homePrice * downPct : (parseFloat(f1_downPayment.replace(/,/g, '')) || 0);
    const loanAmount = homePrice - finalDown;

    setResults1({
      homePrice,
      loanAmount,
      downPayment: finalDown,
      monthlyCost: maxHousingCost
    });
  };

  const calculateF2 = () => {
    const budget = parseFloat(f2_budget.replace(/,/g, '')) || 0;
    const t = parseFloat(f2_term) || 0;
    const r = parseFloat(f2_rate) || 0;
    
    const downPct = f2_downPaymentType === "%" ? (parseFloat(f2_downPayment) || 0) / 100 : 0;
    const taxPct = f2_includeTax && f2_propertyTaxType === "%" ? (parseFloat(f2_propertyTax) || 0) / 100 : 0;
    const hoaPct = f2_includeTax && f2_hoaType === "%" ? (parseFloat(f2_hoa) || 0) / 100 : 0;
    const insPct = f2_includeTax && f2_insuranceType === "%" ? (parseFloat(f2_insurance) || 0) / 100 : 0;
    const maintPct = f2_includeTax && f2_maintenanceType === "%" ? (parseFloat(f2_maintenance) || 0) / 100 : 0;

    const rateMonthly = r / 100 / 12;
    const n = t * 12;

    let piFactor = 0;
    if (rateMonthly > 0) {
      piFactor = (rateMonthly * Math.pow(1 + rateMonthly, n)) / (Math.pow(1 + rateMonthly, n) - 1);
    } else {
      piFactor = 1 / n;
    }

    const K = ((1 - downPct) * piFactor) + ((taxPct + hoaPct + insPct + maintPct) / 12);
    let homePrice = budget / K;

    if (f2_downPaymentType === "$") {
      const flatDown = parseFloat(f2_downPayment.replace(/,/g, '')) || 0;
      const K_flat = piFactor + ((taxPct + hoaPct + insPct + maintPct) / 12);
      homePrice = (budget + flatDown * piFactor) / K_flat;
    }

    const finalDown = f2_downPaymentType === "%" ? homePrice * downPct : (parseFloat(f2_downPayment.replace(/,/g, '')) || 0);
    const loanAmount = homePrice - finalDown;

    setResults2({
      homePrice,
      loanAmount,
      downPayment: finalDown,
      monthlyCost: budget
    });
  };

  const clearF1 = () => {
    setF1Income(""); setF1Term(""); setF1Rate(""); setF1Debt(""); setF1DownPayment("");
    setResults1(null);
  };
  
  const clearF2 = () => {
    setF2Budget(""); setF2Term(""); setF2Rate(""); setF2DownPayment("");
    setResults2(null);
  };

  useEffect(() => {
    calculateF1();
    calculateF2();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-[800px] mx-auto bg-white p-2 md:p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2 border-b pb-1">
        <div>home / financial / house affordability calculator</div>
        <div className="text-blue-600 underline cursor-pointer">{t('buttons.print')}</div>
      </div>
      
      <h1 className="text-[26px] font-bold text-gray-800 mb-4 font-sans">How Much House Can I Afford?</h1>
      
      <h2 className="text-[18px] font-bold text-[#1c4587] mb-2 font-sans">House Affordability Calculator</h2>
      <p className="mb-4 text-[13px] text-gray-800 leading-relaxed">
        There are two House Affordability Calculators that can be used to estimate an affordable purchase amount for a house based on either household income-to-debt estimates or fixed monthly budgets. They are mainly intended for use by U.S. residents.
      </p>

      {/* Calculator 1 */}
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="flex-1">
          <HouseAffordabilityForm1 
            state={state1} 
            setters={setters1} 
            handleCalculate={calculateF1}
            handleClear={clearF1}
          />
          <div className="bg-[#f0f0f0] p-2 mt-4 text-center border border-gray-300 mx-auto w-[350px]">
             <div className="text-[12px] font-bold mb-1">Latest Mortgage Rates:</div>
             <div className="text-[12px] space-x-2">
                <span>30 Years: <span className="text-blue-600 underline">6.609%</span></span>
                <span>15 Years: <span className="text-blue-600 underline">5.77%</span></span>
                <span>10 Years: <span className="text-blue-600 underline">5.635%</span></span>
             </div>
             <div className="flex justify-center gap-2 mt-2">
                <button className="bg-[#466a9b] text-white px-3 py-1 text-[13px]">See your local rates</button>
                <button className="bg-[#466a9b] text-white px-3 py-1 text-[13px]">Get pre-approval</button>
             </div>
          </div>
        </div>
        <div className="w-full md:w-[300px]">
          <HouseAffordabilityResults results={results1} />
        </div>
      </div>

      <h2 className="text-[18px] font-bold text-[#1c4587] mt-8 mb-2 font-sans">House affordability based on fixed, monthly budgets</h2>
      <p className="mb-4 text-[13px] text-gray-800 leading-relaxed">
        This is a separate calculator used to estimate house affordability based on monthly allocations of a fixed amount for housing costs.
      </p>

      {/* Calculator 2 */}
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="flex-1">
          <HouseAffordabilityForm2 
            state={state2} 
            setters={setters2} 
            handleCalculate={calculateF2}
            handleClear={clearF2}
          />
        </div>
        <div className="w-full md:w-[300px]">
          <HouseAffordabilityResults results={results2} />
        </div>
      </div>

      <HouseAffordabilityArticle />
    </div>
  );
}
