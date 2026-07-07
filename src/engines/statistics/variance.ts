export function sampleVariance(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  return values.reduce((s, v) => s + (v - m) ** 2, 0) / (values.length - 1);
}

export function populationVariance(values: number[]): number {
  if (values.length === 0) return 0;
  const m = mean(values);
  return values.reduce((s, v) => s + (v - m) ** 2, 0) / values.length;
}

export function sampleStdDev(values: number[]): number {
  return Math.sqrt(sampleVariance(values));
}

export function populationStdDev(values: number[]): number {
  return Math.sqrt(populationVariance(values));
}

export function bounds(values: number[]): { sum: number; min: number; max: number; range: number } {
  if (values.length === 0) return { sum: 0, min: 0, max: 0, range: 0 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const sum = values.reduce((a, b) => a + b, 0);
  const range = max - min;
  return { sum, min, max, range };
}

import { mean } from './averages';
