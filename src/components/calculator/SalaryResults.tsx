"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

export function SalaryResults({ results }: any) {
  const t = useTranslations('calculatorUI');
  if (!results) return null;

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center border border-[#3b7b13]">
        <span className="text-xl">{t('results.result')}</span>
      </div>
      
      <table className="w-full text-right border-collapse bg-white">
        <thead>
          <tr className="bg-[#1c4587] text-white">
            <th className="p-1 border border-gray-400 text-center font-normal"></th>
            <th className="p-1 border border-gray-400 text-center font-bold">Unadjusted</th>
            <th className="p-1 border border-gray-400 text-center font-bold">Holidays & vacation<br/>days adjusted</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white">
            <td className="p-1 border border-gray-300 text-left">Hourly</td>
            <td className="p-1 border border-gray-300">${results.unadjusted.hourly.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td className="p-1 border border-gray-300">${results.adjusted.hourly.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          </tr>
          <tr className="bg-gray-100">
            <td className="p-1 border border-gray-300 text-left">Daily</td>
            <td className="p-1 border border-gray-300">${results.unadjusted.daily.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td className="p-1 border border-gray-300">${results.adjusted.daily.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          </tr>
          <tr className="bg-white">
            <td className="p-1 border border-gray-300 text-left">Weekly</td>
            <td className="p-1 border border-gray-300">${results.unadjusted.weekly.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
            <td className="p-1 border border-gray-300">${results.adjusted.weekly.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
          </tr>
          <tr className="bg-gray-100">
            <td className="p-1 border border-gray-300 text-left">Bi-weekly</td>
            <td className="p-1 border border-gray-300">${results.unadjusted.biWeekly.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
            <td className="p-1 border border-gray-300">${results.adjusted.biWeekly.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
          </tr>
          <tr className="bg-white">
            <td className="p-1 border border-gray-300 text-left">Semi-monthly</td>
            <td className="p-1 border border-gray-300">${results.unadjusted.semiMonthly.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
            <td className="p-1 border border-gray-300">${results.adjusted.semiMonthly.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
          </tr>
          <tr className="bg-gray-100">
            <td className="p-1 border border-gray-300 text-left">Monthly</td>
            <td className="p-1 border border-gray-300">${results.unadjusted.monthly.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
            <td className="p-1 border border-gray-300">${results.adjusted.monthly.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
          </tr>
          <tr className="bg-white">
            <td className="p-1 border border-gray-300 text-left">Quarterly</td>
            <td className="p-1 border border-gray-300">${results.unadjusted.quarterly.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
            <td className="p-1 border border-gray-300">${results.adjusted.quarterly.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
          </tr>
          <tr className="bg-gray-100">
            <td className="p-1 border border-gray-300 text-left">Annual</td>
            <td className="p-1 border border-gray-300">${results.unadjusted.annual.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
            <td className="p-1 border border-gray-300">${results.adjusted.annual.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
