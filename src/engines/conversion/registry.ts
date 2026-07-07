import type { DimensionType } from './dimensions';

interface UnitInfo { id: string; name: string; symbol: string; toBase: (v: number) => number; fromBase: (v: number) => number; }

const unitDB: Record<string, UnitInfo[]> = {
  length: [
    { id: 'meters', name: 'Meters', symbol: 'm', toBase: v => v, fromBase: v => v },
    { id: 'kilometers', name: 'Kilometers', symbol: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { id: 'miles', name: 'Miles', symbol: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    { id: 'feet', name: 'Feet', symbol: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { id: 'inches', name: 'Inches', symbol: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    { id: 'centimeters', name: 'Centimeters', symbol: 'cm', toBase: v => v * 0.01, fromBase: v => v / 0.01 },
    { id: 'yards', name: 'Yards', symbol: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
  ],
  mass: [
    { id: 'kilograms', name: 'Kilograms', symbol: 'kg', toBase: v => v, fromBase: v => v },
    { id: 'grams', name: 'Grams', symbol: 'g', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { id: 'pounds', name: 'Pounds', symbol: 'lb', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    { id: 'ounces', name: 'Ounces', symbol: 'oz', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
  ],
  temperature: [
    { id: 'celsius', name: 'Celsius', symbol: '°C', toBase: v => v, fromBase: v => v },
    { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
    { id: 'kelvin', name: 'Kelvin', symbol: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  ],
};

export function getCategory(dim: DimensionType): { name: string; units: Record<string, UnitInfo> } | null {
  const units = unitDB[dim];
  if (!units) return null;
  const unitMap: Record<string, UnitInfo> = {};
  for (const u of units) {
    unitMap[u.id] = u;
  }
  const names: Record<string, string> = { length: 'Length', mass: 'Mass', temperature: 'Temperature' };
  return { name: names[dim] ?? dim, units: unitMap };
}

export function getUnitsForCategory(dim: DimensionType): UnitInfo[] {
  return unitDB[dim] ?? [];
}
