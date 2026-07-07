export type Dimension = 'mass' | 'length' | 'time' | 'force' | 'acceleration' | 'volume' | 'area' | 'temperature' | 'energy' | 'power' | 'pressure' | 'speed' | 'torque'

export interface UnitDef {
  id: string
  label: string
  name: string
  dimension: Dimension
  baseFactor: number
  offset?: number
}

export const allUnits: Record<Dimension, UnitDef[]> = {
  mass: [
    { id: 'kg', label: 'kg', name: 'Kilograms', dimension: 'mass', baseFactor: 1 },
    { id: 'g', label: 'g', name: 'Grams', dimension: 'mass', baseFactor: 0.001 },
    { id: 'mg', label: 'mg', name: 'Milligrams', dimension: 'mass', baseFactor: 0.000001 },
    { id: 'lb', label: 'lb', name: 'Pounds', dimension: 'mass', baseFactor: 0.453592 },
    { id: 'oz', label: 'oz', name: 'Ounces', dimension: 'mass', baseFactor: 0.0283495 },
    { id: 'st', label: 'st', name: 'Stone', dimension: 'mass', baseFactor: 6.35029 },
    { id: 't', label: 't', name: 'Metric Tonnes', dimension: 'mass', baseFactor: 1000 },
  ],
  length: [
    { id: 'm', label: 'm', name: 'Meters', dimension: 'length', baseFactor: 1 },
    { id: 'cm', label: 'cm', name: 'Centimeters', dimension: 'length', baseFactor: 0.01 },
    { id: 'mm', label: 'mm', name: 'Millimeters', dimension: 'length', baseFactor: 0.001 },
    { id: 'km', label: 'km', name: 'Kilometers', dimension: 'length', baseFactor: 1000 },
    { id: 'in', label: 'in', name: 'Inches', dimension: 'length', baseFactor: 0.0254 },
    { id: 'ft', label: 'ft', name: 'Feet', dimension: 'length', baseFactor: 0.3048 },
    { id: 'yd', label: 'yd', name: 'Yards', dimension: 'length', baseFactor: 0.9144 },
    { id: 'mi', label: 'mi', name: 'Miles', dimension: 'length', baseFactor: 1609.34 },
    { id: 'nm', label: 'nm', name: 'Nautical Miles', dimension: 'length', baseFactor: 1852 },
  ],
  time: [
    { id: 's', label: 's', name: 'Seconds', dimension: 'time', baseFactor: 1 },
    { id: 'ms', label: 'ms', name: 'Milliseconds', dimension: 'time', baseFactor: 0.001 },
    { id: 'min', label: 'min', name: 'Minutes', dimension: 'time', baseFactor: 60 },
    { id: 'h', label: 'h', name: 'Hours', dimension: 'time', baseFactor: 3600 },
    { id: 'd', label: 'd', name: 'Days', dimension: 'time', baseFactor: 86400 },
  ],
  force: [
    { id: 'N', label: 'N', name: 'Newtons', dimension: 'force', baseFactor: 1 },
    { id: 'kN', label: 'kN', name: 'Kilonewtons', dimension: 'force', baseFactor: 1000 },
    { id: 'lbf', label: 'lbf', name: 'Pound-force', dimension: 'force', baseFactor: 4.44822 },
    { id: 'dyn', label: 'dyn', name: 'Dynes', dimension: 'force', baseFactor: 0.00001 },
    { id: 'kgf', label: 'kgf', name: 'Kilogram-force', dimension: 'force', baseFactor: 9.80665 },
    { id: 'ozf', label: 'ozf', name: 'Ounce-force', dimension: 'force', baseFactor: 0.278014 },
  ],
  acceleration: [
    { id: 'm/s2', label: 'm/s²', name: 'Meters per second²', dimension: 'acceleration', baseFactor: 1 },
    { id: 'ft/s2', label: 'ft/s²', name: 'Feet per second²', dimension: 'acceleration', baseFactor: 0.3048 },
    { id: 'g', label: 'g', name: 'Standard gravity (g)', dimension: 'acceleration', baseFactor: 9.80665 },
    { id: 'cm/s2', label: 'cm/s²', name: 'Centimeters per second²', dimension: 'acceleration', baseFactor: 0.01 },
  ],
  volume: [
    { id: 'L', label: 'L', name: 'Liters', dimension: 'volume', baseFactor: 1 },
    { id: 'mL', label: 'mL', name: 'Milliliters', dimension: 'volume', baseFactor: 0.001 },
    { id: 'm3', label: 'm³', name: 'Cubic meters', dimension: 'volume', baseFactor: 1000 },
    { id: 'gal', label: 'gal', name: 'Gallons (US)', dimension: 'volume', baseFactor: 3.78541 },
    { id: 'qt', label: 'qt', name: 'Quarts (US)', dimension: 'volume', baseFactor: 0.946353 },
    { id: 'pt', label: 'pt', name: 'Pints (US)', dimension: 'volume', baseFactor: 0.473176 },
    { id: 'cup', label: 'cup', name: 'Cups', dimension: 'volume', baseFactor: 0.236588 },
    { id: 'floz', label: 'fl oz', name: 'Fluid ounces', dimension: 'volume', baseFactor: 0.0295735 },
  ],
  area: [
    { id: 'm2', label: 'm²', name: 'Square meters', dimension: 'area', baseFactor: 1 },
    { id: 'cm2', label: 'cm²', name: 'Square centimeters', dimension: 'area', baseFactor: 0.0001 },
    { id: 'ft2', label: 'ft²', name: 'Square feet', dimension: 'area', baseFactor: 0.092903 },
    { id: 'in2', label: 'in²', name: 'Square inches', dimension: 'area', baseFactor: 0.00064516 },
    { id: 'ha', label: 'ha', name: 'Hectares', dimension: 'area', baseFactor: 10000 },
    { id: 'acre', label: 'acre', name: 'Acres', dimension: 'area', baseFactor: 4046.86 },
  ],
  temperature: [
    { id: 'C', label: '°C', name: 'Celsius', dimension: 'temperature', baseFactor: 1, offset: 0 },
    { id: 'F', label: '°F', name: 'Fahrenheit', dimension: 'temperature', baseFactor: 5 / 9, offset: -32 },
    { id: 'K', label: 'K', name: 'Kelvin', dimension: 'temperature', baseFactor: 1, offset: -273.15 },
  ],
  energy: [
    { id: 'J', label: 'J', name: 'Joules', dimension: 'energy', baseFactor: 1 },
    { id: 'kJ', label: 'kJ', name: 'Kilojoules', dimension: 'energy', baseFactor: 1000 },
    { id: 'cal', label: 'cal', name: 'Calories', dimension: 'energy', baseFactor: 4.184 },
    { id: 'kcal', label: 'kcal', name: 'Kilocalories', dimension: 'energy', baseFactor: 4184 },
    { id: 'Wh', label: 'Wh', name: 'Watt-hours', dimension: 'energy', baseFactor: 3600 },
    { id: 'kWh', label: 'kWh', name: 'Kilowatt-hours', dimension: 'energy', baseFactor: 3600000 },
    { id: 'BTU', label: 'BTU', name: 'British Thermal Units', dimension: 'energy', baseFactor: 1055.06 },
  ],
  power: [
    { id: 'W', label: 'W', name: 'Watts', dimension: 'power', baseFactor: 1 },
    { id: 'kW', label: 'kW', name: 'Kilowatts', dimension: 'power', baseFactor: 1000 },
    { id: 'MW', label: 'MW', name: 'Megawatts', dimension: 'power', baseFactor: 1000000 },
    { id: 'hp', label: 'hp', name: 'Horsepower (mechanical)', dimension: 'power', baseFactor: 745.7 },
    { id: 'BTU/h', label: 'BTU/h', name: 'BTU per hour', dimension: 'power', baseFactor: 0.293071 },
  ],
  pressure: [
    { id: 'Pa', label: 'Pa', name: 'Pascals', dimension: 'pressure', baseFactor: 1 },
    { id: 'kPa', label: 'kPa', name: 'Kilopascals', dimension: 'pressure', baseFactor: 1000 },
    { id: 'bar', label: 'bar', name: 'Bar', dimension: 'pressure', baseFactor: 100000 },
    { id: 'atm', label: 'atm', name: 'Atmospheres', dimension: 'pressure', baseFactor: 101325 },
    { id: 'psi', label: 'psi', name: 'Pounds per sq inch', dimension: 'pressure', baseFactor: 6894.76 },
    { id: 'mmHg', label: 'mmHg', name: 'Millimeters of mercury', dimension: 'pressure', baseFactor: 133.322 },
  ],
  speed: [
    { id: 'm/s', label: 'm/s', name: 'Meters per second', dimension: 'speed', baseFactor: 1 },
    { id: 'km/h', label: 'km/h', name: 'Kilometers per hour', dimension: 'speed', baseFactor: 0.277778 },
    { id: 'mph', label: 'mph', name: 'Miles per hour', dimension: 'speed', baseFactor: 0.44704 },
    { id: 'kn', label: 'kn', name: 'Knots', dimension: 'speed', baseFactor: 0.514444 },
    { id: 'ft/s', label: 'ft/s', name: 'Feet per second', dimension: 'speed', baseFactor: 0.3048 },
  ],
  torque: [
    { id: 'Nm', label: 'N·m', name: 'Newton-meters', dimension: 'torque', baseFactor: 1 },
    { id: 'lb-ft', label: 'lb-ft', name: 'Pound-feet', dimension: 'torque', baseFactor: 1.35582 },
    { id: 'in-lb', label: 'in-lb', name: 'Inch-pounds', dimension: 'torque', baseFactor: 0.112985 },
    { id: 'kgf-m', label: 'kgf·m', name: 'Kilogram-force meters', dimension: 'torque', baseFactor: 9.80665 },
    { id: 'ozf-in', label: 'ozf·in', name: 'Ounce-force inches', dimension: 'torque', baseFactor: 0.00706155 },
  ],
}
