'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function GPACalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [courses, setCourses] = useState([{ name: 'Course 1', credits: 3, grade: 'A' }]);
  const [result, setResult] = useState<any>(null);

  const grades: Record<string, number> = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 };

  const addCourse = () => setCourses([...courses, { name: `Course ${courses.length + 1}`, credits: 3, grade: 'B' }]);
  
  const updateCourse = (index: number, field: string, value: string | number) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
  };

  const calculate = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(c => {
      totalPoints += grades[c.grade] * c.credits;
      totalCredits += c.credits;
    });
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    setResult({ gpa, totalCredits, totalPoints: Math.round(totalPoints) });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {courses.map((course, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input type="text" value={course.name} onChange={(e) => updateCourse(i, 'name', e.target.value)} className="flex-1 px-3 py-2 border rounded" placeholder="Course name" />
            <input type="number" value={course.credits} onChange={(e) => updateCourse(i, 'credits', Number(e.target.value))} className="w-20 px-3 py-2 border rounded" min="1" max="6" />
            <select value={course.grade} onChange={(e) => updateCourse(i, 'grade', e.target.value)} className="w-20 px-3 py-2 border rounded">
              {Object.keys(grades).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        ))}
      </div>
      
      <button onClick={addCourse} className="text-green-600 hover:underline text-sm">+ Add Course</button>
      <button onClick={calculate} className="ml-4 bg-green-button text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded text-center">
          <p className="text-sm text-gray-500">Your GPA</p>
          <p className="text-4xl font-bold text-green-600">{result.gpa}</p>
          <p className="text-sm text-gray-500 mt-2">Total Credits: {result.totalCredits} | Quality Points: {result.totalPoints}</p>
        </div>
      )}
    </div>
  );
}