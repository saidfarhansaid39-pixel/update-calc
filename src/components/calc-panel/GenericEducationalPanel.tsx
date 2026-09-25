import React from 'react';
import { useTranslations } from 'next-intl';

interface EducationalPanelProps {
  title: string;
  type: 'financial' | 'health' | 'engineering' | 'free' | 'conversion';
  formula?: string;
  variables?: Array<{ name: string; description: string }>;
  exampleInput?: any;
  exampleResult?: any;
  disclaimerPoints?: string[];
}

export const GenericEducationalPanel: React.FC<EducationalPanelProps> = ({
  title,
  type,
  formula,
  variables,
  exampleInput,
  exampleResult,
  disclaimerPoints
}) => {
  // Disclaimer content based on type
  const disclaimerContent = (
    <p className="text-sm text-gray-500 mt-4">
      This calculator is for informational purposes only and not a substitute for professional {' '}
      {type === 'health' ? 'medical' : type === 'financial' ? 'financial' : 'engineering'} advice.
    </p>
  );

  return (
    <div className="bg-gray-50 rounded-lg p-6 mt-8 border-t-4 border-primary">
      <h3 className="text-xl font-bold text-primary mb-4">
        📚 {title} - Educational Information
      </h3>
      
      {/* Formula section */}
      {formula && (
        <div className="mb-6">
          <p className="font-medium">Formula:</p>
          <p className="mt-1 text-sm text-gray-700 break-all">{formula}</p>
        </div>
      )}
      
      {/* Variables section */}
      {variables && variables.length > 0 && (
        <div className="mb-6">
          <p className="font-medium">Variables:</p>
          <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-gray-700">
            {variables.map((varDef, i) => (
              <li key={i}>
                <strong>{varDef.name}:</strong> {varDef.description}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Example calculation */}
      {exampleInput !== undefined && exampleResult !== undefined && (
        <div className="mb-6">
          <p className="font-medium">Example Calculation:</p>
          <div className="mt-2 p-3 bg-white rounded border">
            <p className="font-medium">Input:</p>
            <p className="mt-1 text-xs text-gray-500">{typeof exampleInput === 'object' ? JSON.stringify(exampleInput) : String(exampleInput)}</p>
            <p className="mt-2 font-medium">Result:</p>
            <p className="mt-1 text-xs text-green-600">{typeof exampleResult === 'object' ? JSON.stringify(exampleResult) : String(exampleResult)}</p>
          </div>
        </div>
      )}
      
      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-white rounded">
        {disclaimerContent}
      </div>
    </div>
  );
};