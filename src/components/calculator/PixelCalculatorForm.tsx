'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  calculatePixelDimensions,
  calculateNewDimensions,
  calculateScalePercentage,
} from '@/engines/pixel/calculator';

type Unit = 'px' | 'in' | 'cm';
type Mode = 'dimensions' | 'resize';

export default function PixelCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [mode, setMode] = useState<Mode>('dimensions');
  
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);
  const [dpi, setDpi] = useState<number>(72);
  
  const [newWidth, setNewWidth] = useState<number | null>(null);
  const [newHeight, setNewHeight] = useState<number | null>(null);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [targetUnit, setTargetUnit] = useState<Unit>('in');

  const [result, setResult] = useState<any>(null);
  const [resizeResult, setResizeResult] = useState<any>(null);

  useEffect(() => {
    if (width > 0 && height > 0 && dpi > 0) {
      const calcResult = calculatePixelDimensions(width, height, dpi);
      setResult(calcResult);
    }
  }, [width, height, dpi]);

  useEffect(() => {
    if (width > 0 && height > 0) {
      const newDims = calculateNewDimensions(
        width, height,
        newWidth, newHeight,
        maintainAspectRatio
      );
      setResizeResult({
        ...newDims,
        scaleWidth: newWidth ? calculateScalePercentage(width, newDims.width) : 100,
        scaleHeight: newHeight ? calculateScalePercentage(height, newDims.height) : 100,
      });
    }
  }, [width, height, newWidth, newHeight, maintainAspectRatio]);

  const convertValue = (value: number, fromUnit: Unit, toUnit: Unit): number => {
    if (fromUnit === toUnit) return value;
    if (fromUnit === 'px' && toUnit === 'in') return value / dpi;
    if (fromUnit === 'px' && toUnit === 'cm') return (value / dpi) * 2.54;
    if (fromUnit === 'in' && toUnit === 'px') return value * dpi;
    if (fromUnit === 'in' && toUnit === 'cm') return value * 2.54;
    if (fromUnit === 'cm' && toUnit === 'px') return (value / 2.54) * dpi;
    if (fromUnit === 'cm' && toUnit === 'in') return value / 2.54;
    return value;
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode('dimensions')}
          className={`px-4 py-2 rounded ${mode === 'dimensions' ? 'bg-green-button text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Dimensions & DPI
        </button>
        <button
          onClick={() => setMode('resize')}
          className={`px-4 py-2 rounded ${mode === 'resize' ? 'bg-green-button text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Resize
        </button>
      </div>

      {mode === 'dimensions' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resolution (DPI)</label>
            <input
              type="number"
              value={dpi}
              onChange={(e) => setDpi(Number(e.target.value) || 72)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              min="1"
            />
          </div>
        </div>
      )}

      {mode === 'resize' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                min="1"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="maintainAspect"
              checked={maintainAspectRatio}
              onChange={(e) => setMaintainAspectRatio(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="maintainAspect" className="text-sm text-gray-700">
              Maintain aspect ratio
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Width (px)</label>
              <input
                type="number"
                value={newWidth || ''}
                onChange={(e) => setNewWidth(e.target.value ? Number(e.target.value) : null)}
                placeholder="Leave empty to calculate from height"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Height (px)</label>
              <input
                type="number"
                value={newHeight || ''}
                onChange={(e) => setNewHeight(e.target.value ? Number(e.target.value) : null)}
                placeholder="Leave empty to calculate from width"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>
      )}

      {mode === 'dimensions' && result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <h3 className="font-bold text-lg text-gray-800">Results</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-600 mb-2">Aspect Ratio</h4>
              <p className="text-2xl font-bold text-green-600">{result.aspectRatio}</p>
              <p className="text-sm text-gray-500">({result.aspectRatioDecimal})</p>
            </div>
            
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-600 mb-2">Megapixels</h4>
              <p className="text-2xl font-bold text-green-600">{result.megapixels} MP</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm">
            <h4 className="font-medium text-gray-600 mb-3">Print Dimensions</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Inches</p>
                <p className="text-lg font-semibold">
                  {result.printInches.inchesWidth}" × {result.printInches.inchesHeight}"
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Centimeters</p>
                <p className="text-lg font-semibold">
                  {result.printCm.cmWidth} × {result.printCm.cmHeight} cm
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === 'resize' && resizeResult && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <h3 className="font-bold text-lg text-gray-800">Resize Results</h3>
          
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Original</p>
                <p className="text-xl font-bold text-gray-800">{width} × {height}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">→</p>
                <p className="text-xl font-bold text-green-600">→</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">New Size</p>
                <p className="text-xl font-bold text-green-600">{resizeResult.width} × {resizeResult.height}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm">
            <h4 className="font-medium text-gray-600 mb-2">Scale</h4>
            <p>Width: {resizeResult.scaleWidth}% | Height: {resizeResult.scaleHeight}%</p>
          </div>

          {maintainAspectRatio && (
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm text-yellow-800">
              Aspect ratio maintained: {width / height} ({width}:{height} simplified)
            </div>
          )}
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600 space-y-2">
        <h4 className="font-semibold text-gray-800">Common DPI Values:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>72 DPI</strong> - Standard for web (screens)</li>
          <li><strong>96 DPI</strong> - Common screen resolution</li>
          <li><strong>150 DPI</strong> - Good for web printing</li>
          <li><strong>300 DPI</strong> - Standard for print (photos, documents)</li>
          <li><strong>600 DPI</strong> - High quality print</li>
        </ul>
      </div>
    </div>
  );
}
