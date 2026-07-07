export function generateExplanation(
  category: string,
  calcType: string,
  mainValue: number,
  inputs: Record<string, number>,
  unit?: string
): { summary: string; details: string[]; tips: string[] } {
  const unitStr = unit ? ` ${unit}` : ''
  const val = mainValue.toLocaleString(undefined, { maximumFractionDigits: 2 })

  switch (category) {
    case 'financial': return explainFinancial(calcType, mainValue, inputs)
    case 'health': return explainHealth(calcType, mainValue, inputs)
    case 'math': return explainMath(calcType, mainValue, inputs)
    case 'construction': return explainConstruction(calcType, mainValue, inputs)
    case 'engineering': return explainEngineering(calcType, mainValue, inputs)
    case 'conversion': return explainConversion(calcType, mainValue, inputs)
    case 'statistics': return explainStatistics(calcType, mainValue, inputs)
    case 'education': return explainEducation(calcType, mainValue, inputs)
    case 'physics': return explainPhysics(calcType, mainValue, inputs)
    case 'chemistry': return explainChemistry(calcType, mainValue, inputs)
    case 'food': return explainFood(calcType, mainValue, inputs)
    case 'biology': return explainBiology(calcType, mainValue, inputs)
    case 'ecology': return explainEcology(calcType, mainValue, inputs)
    case 'sports': return explainSports(calcType, mainValue, inputs)
    case 'date-time': return explainDateTime(calcType, mainValue, inputs)
    default: return { summary: `Result: ${val}${unitStr}`, details: [], tips: [] }
  }
}

function explainFinancial(calcType: string, val: number, inputs: Record<string, number>) {
  switch (calcType) {
    case 'loan': {
      const totalInterest = val * (inputs.term || 1) * 12 - (inputs.principal || 0)
      return {
        summary: `Your monthly payment would be **$${val.toFixed(2)}**`,
        details: [
          `Over ${inputs.term || 0} years, you will pay a total of **$${(val * (inputs.term || 1) * 12).toFixed(2)}**`,
          `Total interest paid: **$${Math.max(0, totalInterest).toFixed(2)}**`,
          `Interest represents **${(inputs.principal || 1) > 0 ? ((totalInterest / (inputs.principal || 1)) * 100).toFixed(1) : 0}%** of your principal`,
        ],
        tips: [
          'Consider a shorter term to reduce total interest',
          'Making extra payments can save thousands in interest',
          'Compare rates from multiple lenders before committing',
        ]
      }
    }
    case 'investment': {
      const totalContrib = (inputs.initial || 0) + (inputs.monthly || 0) * (inputs.years || 0) * 12
      return {
        summary: `Your investment could grow to **$${val.toFixed(2)}**`,
        details: [
          `Total contributions: **$${totalContrib.toFixed(2)}**`,
          `Total earnings: **$${Math.max(0, val - totalContrib).toFixed(2)}**`,
          `Your money could grow **${totalContrib > 0 ? (val / totalContrib).toFixed(2) : 1}x** over ${inputs.years || 0} years`,
        ],
        tips: [
          'Start early to maximize compound growth',
          'Diversify across asset classes to manage risk',
          'Consider dollar-cost averaging for consistent investing',
        ]
      }
    }
    case 'retirement': {
      const annualIncome = val * 0.04
      return {
        summary: `At retirement, you could have **$${val.toFixed(2)}** saved`,
        details: [
          `Estimated annual income (4% rule): **$${annualIncome.toFixed(2)}/yr**`,
          `Monthly equivalent: **$${(annualIncome / 12).toFixed(2)}/mo**`,
          `You have **${Math.max(0, (inputs.retirementAge || 65) - (inputs.age || 30))} years** to save`,
        ],
        tips: [
          'The 4% rule is a guideline; adjust based on your situation',
          'Consider inflation when planning your retirement income',
          'Delay Social Security to increase monthly benefits',
        ]
      }
    }
    case 'mortgage': {
      return {
        summary: `Your monthly mortgage payment would be **$${val.toFixed(2)}**`,
        details: [
          `Over ${inputs.term || 30} years, total cost: **$${(val * (inputs.term || 30) * 12).toFixed(2)}**`,
          `Down payment: **${((inputs.downPayment || 0) / (inputs.homePrice || 1) * 100).toFixed(1)}%** of home price`,
          `Debt-to-income ratio: **${(inputs.income ? (val / (inputs.income / 12) * 100).toFixed(1) : 'N/A')}%**`,
        ],
        tips: [
          'A 20% down payment eliminates PMI',
          'Consider a 15-year term for significant interest savings',
          'Shop for the best rate at least 3-6 months before buying',
        ]
      }
    }
    default: return {
      summary: `Result: **$${val.toFixed(2)}**`,
      details: [],
      tips: ['Double-check your inputs for accuracy', 'Consider consulting a financial advisor']
    }
  }
}

function explainHealth(calcType: string, val: number, inputs: Record<string, number>) {
  switch (calcType) {
    case 'bmi': {
      let category = 'Normal weight'
      if (val < 18.5) category = 'Underweight'
      else if (val < 25) category = 'Normal weight'
      else if (val < 30) category = 'Overweight'
      else if (val < 35) category = 'Obese Class I'
      else if (val < 40) category = 'Obese Class II'
      else category = 'Obese Class III'
      return {
        summary: `Your BMI is **${val.toFixed(1)}** — **${category}**`,
        details: [
          `BMI categories: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (≥30)`,
          `Healthy BMI range for your height: **${((inputs.height || 1.7) ** 2 * 18.5).toFixed(1)}–${((inputs.height || 1.7) ** 2 * 24.9).toFixed(1)} kg**`,
          `BMI is a screening tool, not a diagnostic measure`,
        ],
        tips: [
          'BMI does not account for muscle mass or body composition',
          'Combine BMI with waist circumference for better health assessment',
          'Consult a healthcare provider for personalized health advice',
        ]
      }
    }
    case 'calorie': {
      const deficit = val - 500
      const surplus = val + 300
      return {
        summary: `Your daily calorie needs: **${val.toFixed(0)} kcal**`,
        details: [
          `For weight loss (deficit): **${deficit.toFixed(0)} kcal/day**`,
          `For weight gain (surplus): **${surplus.toFixed(0)} kcal/day**`,
          `This is based on your BMR and activity level`,
        ],
        tips: [
          'A deficit of 300-500 kcal/day leads to sustainable weight loss',
          'Focus on nutrient-dense foods rather than just calorie counting',
          'Re-evaluate your needs as your weight changes',
        ]
      }
    }
    default: return {
      summary: `Result: **${val.toFixed(1)}**`,
      details: [],
      tips: ['Consult a healthcare professional for medical decisions']
    }
  }
}

function explainMath(calcType: string, val: number, inputs: Record<string, number>) {
  switch (calcType) {
    case 'arithmetic': {
      const a = inputs.a || 0
      const b = inputs.b || 0
      const op = inputs.op === 1 ? '+' : inputs.op === 2 ? '-' : inputs.op === 3 ? '×' : inputs.op === 4 ? '÷' : '?'
      return {
        summary: `**${a} ${op} ${b} = ${val.toLocaleString(undefined, { maximumFractionDigits: 4 })}**`,
        details: [
          `${a} ${op} ${b} = **${val.toLocaleString(undefined, { maximumFractionDigits: 4 })}**`,
          `Standard arithmetic rules apply with automatic order of operations`,
        ],
        tips: [
          'Double-check your numbers for data entry errors',
          'Use parentheses to control calculation order in complex expressions',
        ]
      }
    }
    case 'percentage': {
      const part = inputs.value || 0
      const total = inputs.total || 100
      return {
        summary: `**${part}** is **${val.toFixed(2)}%** of **${total}**`,
        details: [
          `Formula: (${part} ÷ ${total}) × 100 = **${val.toFixed(2)}%**`,
          `${total} × ${val.toFixed(2)}% = **${(total * val / 100).toFixed(2)}**`,
        ],
        tips: [
          'Percentages are fractions with denominator 100',
          'To reverse a percentage, divide by the decimal form',
        ]
      }
    }
    case 'percentage-change': {
      const oldV = inputs.oldValue || 0
      const newV = inputs.newValue || 0
      const direction = val >= 0 ? 'increase' : 'decrease'
      return {
        summary: `${direction.charAt(0).toUpperCase() + direction.slice(1)} of **${Math.abs(val).toFixed(2)}%**`,
        details: [
          `From **${oldV}** to **${newV}**`,
          `Formula: ((${newV} − ${oldV}) ÷ ${oldV}) × 100 = **${val.toFixed(2)}%**`,
        ],
        tips: [
          'Percentage change is relative to the original value',
          'A negative change indicates a decrease from the original',
        ]
      }
    }
    case 'percentage-increase': {
      const original = inputs.original || 0
      const result = original * (1 + val / 100)
      return {
        summary: `**${val.toFixed(2)}%** increase`,
        details: [
          `Original value: **${original}**`,
          `After increase: **${result.toFixed(2)}**`,
          `Formula: ${original} × (1 + ${val.toFixed(2)}/100) = **${result.toFixed(2)}**`,
        ],
        tips: [
          'A percentage increase multiplies the original by (1 + rate)',
          'Compounding increases can have exponential effects over time',
        ]
      }
    }
    case 'percentage-decrease': {
      const original = inputs.original || 0
      const result = original * (1 - val / 100)
      return {
        summary: `**${val.toFixed(2)}%** decrease`,
        details: [
          `Original value: **${original}**`,
          `After decrease: **${result.toFixed(2)}**`,
          `Formula: ${original} × (1 − ${val.toFixed(2)}/100) = **${result.toFixed(2)}**`,
        ],
        tips: [
          'A percentage decrease multiplies the original by (1 − rate)',
          'Discounts are usually applied sequentially, not cumulatively',
        ]
      }
    }
    case 'percentage-difference': {
      const v1 = inputs.value1 || 0
      const v2 = inputs.value2 || 0
      return {
        summary: `Percentage difference: **${val.toFixed(2)}%**`,
        details: [
          `Between **${v1}** and **${v2}**`,
          `Formula: |${v1} − ${v2}| ÷ ((${v1} + ${v2}) ÷ 2) × 100 = **${val.toFixed(2)}%**`,
        ],
        tips: [
          'Percentage difference uses the average as the reference',
          'Unlike percentage change, difference is symmetric (order doesn\'t matter)',
        ]
      }
    }
    case 'discount': {
      const originalPrice = inputs.price || 0
      const saved = originalPrice * (val / 100)
      const finalPrice = originalPrice - saved
      return {
        summary: `You save **${val.toFixed(1)}%** — pay **$${finalPrice.toFixed(2)}**`,
        details: [
          `Original price: **$${originalPrice.toFixed(2)}**`,
          `You save: **$${saved.toFixed(2)}**`,
          `Final price: **$${finalPrice.toFixed(2)}**`,
        ],
        tips: [
          'Check if the discount applies before or after tax',
          'Stacking coupons may not always be allowed',
        ]
      }
    }
    case 'pythagorean': {
      const a = inputs.a || 0
      const b = inputs.b || 0
      return {
        summary: `Hypotenuse (c): **${val.toFixed(4)}**`,
        details: [
          `Formula: **a² + b² = c²**`,
          `${a.toFixed(2)}² + ${b.toFixed(2)}² = **${(a * a + b * b).toFixed(4)}**`,
          `c = √(${(a * a + b * b).toFixed(4)}) = **${val.toFixed(4)}**`,
        ],
        tips: [
          'The Pythagorean theorem applies only to right triangles',
          'A 3-4-5 triangle is the most common Pythagorean triple',
        ]
      }
    }
    case 'area': {
      return {
        summary: `Area: **${val.toLocaleString(undefined, { maximumFractionDigits: 4 })}** sq units`,
        details: [
          `Calculated using the appropriate geometric formula for your shape`,
          `All dimensions should be in the same unit before calculating`,
        ],
        tips: [
          'For irregular shapes, divide into smaller regular shapes',
          'Always use consistent units for all dimensions',
        ]
      }
    }
    case 'volume': {
      return {
        summary: `Volume: **${val.toLocaleString(undefined, { maximumFractionDigits: 4 })}** cubic units`,
        details: [
          `Calculated using the appropriate 3D geometric formula`,
          `All dimensions must be in the same unit for accurate results`,
        ],
        tips: [
          'Volume scales with the cube of linear dimensions',
          'For irregular solids, use water displacement',
        ]
      }
    }
    case 'trigonometry': {
      const angle = inputs.angle || 0
      const fn = inputs.fn === 1 ? 'sin' : inputs.fn === 2 ? 'cos' : inputs.fn === 3 ? 'tan' : '?'
      const ratio = fn === 'sin' ? 'opposite/hypotenuse' : fn === 'cos' ? 'adjacent/hypotenuse' : 'opposite/adjacent'
      return {
        summary: `${fn}(${angle}°) = **${val.toFixed(6)}**`,
        details: [
          `In a right triangle: ${fn}(${angle}°) = ${ratio}`,
          `Angle: **${angle}°** in degrees (not radians)`,
        ],
        tips: [
          'Ensure your calculator is in the correct mode (degrees vs radians)',
          'Remember SOH CAH TOA for right triangle trig ratios',
        ]
      }
    }
    default: return {
      summary: `Result: **${val.toLocaleString(undefined, { maximumFractionDigits: 4 })}**`,
      details: [`Computed from your input values using standard mathematical formulas`],
      tips: ['Verify your inputs for accuracy', 'Use parentheses for complex expressions']
    }
  }
}

function explainConstruction(calcType: string, val: number, inputs: Record<string, number>) {
  switch (calcType) {
    case 'concrete': {
      const volume = val
      const bags80lb = Math.ceil(volume * 45)
      return {
        summary: `You need **${volume.toFixed(2)} cubic yards** of concrete`,
        details: [
          `Approximate 80lb bags: **${bags80lb} bags**`,
          `Dimensions: ${inputs.length || 0}ft × ${inputs.width || 0}ft × ${((inputs.depth || 0) / 12).toFixed(2)}ft`,
        ],
        tips: [
          'Order 10-15% extra for spillage and uneven subgrade',
          'Consider ready-mix for pours over 2 cubic yards',
        ]
      }
    }
    case 'lumber': {
      return {
        summary: `Total: **${val.toFixed(1)} board feet**`,
        details: [
          `Board feet = (thickness" × width" × length") ÷ 12`,
          `Based on your lumber dimensions and quantity`,
        ],
        tips: [
          'A board foot is 1" × 12" × 12"',
          'Add 15% for waste and off-cuts',
        ]
      }
    }
    case 'flooring': {
      const waste = val * 0.1
      return {
        summary: `Flooring needed: **${val.toFixed(1)} sq ft**`,
        details: [
          `Room area: **${val.toFixed(1)} sq ft**`,
          `Add **${waste.toFixed(1)} sq ft** (10%) for waste and cutting`,
          `Total to order: **${Math.ceil(val + waste)} sq ft**`,
        ],
        tips: [
          'Add 10% for straight layouts, 15% for diagonal or patterned layouts',
          'Keep extra boxes for future repairs',
        ]
      }
    }
    case 'paint': {
      const coats = inputs.coats || 2
      const area = inputs.area || 400
      const gallons = area / val * coats
      return {
        summary: `Coverage: **${val.toFixed(0)} sq ft per gallon**`,
        details: [
          `For a **${area.toFixed(0)} sq ft** room with **${coats} coat(s)**`,
          `You need approximately **${gallons.toFixed(1)} gallon(s)**`,
        ],
        tips: [
          'One gallon typically covers 350-400 sq ft per coat',
          'Dark colors and textured surfaces may require extra coats',
        ]
      }
    }
    case 'tile': {
      const waste = val * 0.1
      const boxSize = inputs.boxSize || 10
      const boxes = Math.ceil((val + waste) / boxSize)
      return {
        summary: `Tile needed: **${val.toFixed(1)} sq ft**`,
        details: [
          `Area to cover: **${val.toFixed(1)} sq ft**`,
          `With waste (10%): **${(val + waste).toFixed(1)} sq ft**`,
          `Boxes needed (${boxSize} sq ft/box): **${boxes} boxes**`,
        ],
        tips: [
          'Order 10-15% extra for diagonal patterns and cuts',
          'Keep a spare box for future replacements',
        ]
      }
    }
    case 'roofing': {
      const bundles = Math.ceil(val * 3.33)
      return {
        summary: `Roof area: **${val.toFixed(1)} squares** (${(val * 100).toFixed(0)} sq ft)`,
        details: [
          `Estimated bundles of shingles: **${bundles} bundles** (3.33 bundles/square)`,
          `Roof pitch factor is included in the calculation`,
        ],
        tips: [
          'A roofing square = 100 sq ft',
          'Steep roofs require more materials and safety equipment',
        ]
      }
    }
    case 'siding': {
      const waste = val * 0.1
      return {
        summary: `Siding needed: **${val.toFixed(1)} sq ft**`,
        details: [
          `Wall area: **${val.toFixed(1)} sq ft**`,
          `Add **${waste.toFixed(1)} sq ft** (10%) for waste`,
          `Order **${Math.ceil(val + waste)} sq ft** total`,
        ],
        tips: [
          'Subtract window and door openings from total area',
          'Consider ordering extra for future repairs',
        ]
      }
    }
    case 'drywall': {
      const sheets = val
      const tape = Math.ceil(sheets * 48 / 60)
      const mud = Math.ceil(sheets * 0.5)
      return {
        summary: `Drywall needed: **${Math.ceil(sheets)} sheets** (4×8)`,
        details: [
          `Joint tape needed: **${tape} rolls** (60ft rolls)`,
          `Joint compound: **~${mud} lbs**`,
        ],
        tips: [
          'Use 5/8" drywall for fire-rated assemblies',
          'Stagger joints for a stronger finished wall',
        ]
      }
    }
    case 'fencing': {
      const panels = val
      const posts = Math.ceil(panels) + 1
      return {
        summary: `Panels needed: **${Math.ceil(panels)}**`,
        details: [
          `Total linear feet: **${(inputs.length || 0).toFixed(0)} ft**`,
          `Fence posts needed: **${posts}** (one more than panels)`,
        ],
        tips: [
          'Set posts in concrete below frost line',
          'Gate openings require additional framing',
        ]
      }
    }
    case 'deck': {
      return {
        summary: `Deck boards needed: **${Math.ceil(val)} boards**`,
        details: [
          `Total deck area: **${(inputs.area || 0).toFixed(0)} sq ft**`,
          `With spacing and waste factored into the calculation`,
        ],
        tips: [
          'Use hidden fasteners for a cleaner look',
          'Allow 1/8" gap between boards for drainage',
        ]
      }
    }
    case 'stairs': {
      const rise = inputs.rise || 7
      const run = inputs.run || 11
      return {
        summary: `Stringers needed: **${Math.ceil(val)}**`,
        details: [
          `Rise per step: **${rise.toFixed(1)}"** (ideal: 7-7.5")`,
          `Run per step: **${run.toFixed(1)}"** (ideal: 10-11")`,
          `Stringer length based on total rise and run`,
        ],
        tips: [
          'Building code: max rise 7.75", min run 10"',
          'Comfort zone formula: 2 × rise + run = 24-25"',
        ]
      }
    }
    default: return {
      summary: `Estimated material: **${val.toFixed(1)} units**`,
      details: [
        `Area to cover: **${((inputs.length || 0) * (inputs.width || 0)).toFixed(1)} sq ft**`,
        `Waste factor (10% recommended): **${(val * 0.1).toFixed(1)} units**`,
        `Order at least **${Math.ceil(val * 1.1)} units** to account for waste`,
      ],
      tips: ['Always add 10-15% for waste and cutting errors', 'Measure twice, order once']
    }
  }
}

function explainEngineering(calcType: string, val: number, inputs: Record<string, number>) {
  switch (calcType) {
    case 'ohms-law': return {
      summary: `Calculated value: **${val.toFixed(2)}**`,
      details: ['Based on Ohm\'s Law: V = IR, P = VI, R = V/I'],
      tips: ['Verify circuit ratings before implementation', 'Consider temperature effects on resistance']
    }
    default: return { summary: `Result: **${val.toFixed(2)}**`, details: [], tips: [] }
  }
}

function explainConversion(calcType: string, val: number, inputs: Record<string, number>) {
  switch (calcType) {
    case 'length': {
      const precision = val > 1000 ? 0 : val > 1 ? 2 : 4
      return {
        summary: `Converted length: **${val.toFixed(precision)}**`,
        details: [
          `For large scales (km/mi), 0-1 decimal places are appropriate`,
          `For small scales (mm/in), 2-4 decimal places may be needed`,
        ],
        tips: [
          'Use mm for precision work and m for general construction',
          'Surveyors use chains and links for land measurement',
        ]
      }
    }
    case 'weight': {
      const rounding = val > 100 ? 0 : val > 1 ? 1 : 2
      return {
        summary: `Converted weight: **${val.toFixed(rounding)}**`,
        details: [
          `Industrial quantities (>100): round to whole numbers`,
          `Cooking and food: 1-2 decimal places are standard`,
        ],
        tips: [
          'Use grams for precision baking, kilograms for bulk ingredients',
          'Industrial scales typically round to the nearest 0.1 kg',
        ]
      }
    }
    case 'volume': {
      return {
        summary: `Converted volume: **${val.toFixed(val > 10 ? 1 : 2)}**`,
        details: [
          `Cooking volumes (cups, tbsp, ml) use US or metric standards`,
          `Industrial volumes (gallons, liters, m³) use standard conversion factors`,
        ],
        tips: [
          'Use weight instead of volume for more accurate baking',
          'Liquid and dry measuring cups differ in design',
        ]
      }
    }
    case 'temperature': {
      return {
        summary: `Converted temperature: **${val.toFixed(1)}°**`,
        details: [
          `°C to °F: (°C × 9/5) + 32`,
          `°F to °C: (°F − 32) × 5/9`,
          `K to °C: K − 273.15`,
        ],
        tips: [
          'Water freezes at 0°C / 32°F / 273.15K',
          'Water boils at 100°C / 212°F / 373.15K',
        ]
      }
    }
    case 'speed': {
      return {
        summary: `Converted speed: **${val.toFixed(2)}**`,
        details: [
          `Speed conversions use the relationship between distance and time units`,
          `Common conversions: km/h ↔ mph ↔ m/s ↔ knots`,
        ],
        tips: [
          '1 m/s = 3.6 km/h = 2.237 mph',
          'Knots are nautical miles per hour, used in aviation and marine',
        ]
      }
    }
    case 'area': {
      return {
        summary: `Converted area: **${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}**`,
        details: [
          `Real estate typically uses sq ft or sq meters`,
          `Land surveys use acres or hectares for larger areas`,
        ],
        tips: [
          '1 acre = 43,560 sq ft = 0.4047 hectares',
          'Property listings often round to the nearest sq ft',
        ]
      }
    }
    case 'pressure': {
      return {
        summary: `Converted pressure: **${val.toFixed(2)}**`,
        details: [
          `Pressure = Force ÷ Area`,
          `Common units: psi, kPa, bar, atm, mmHg`,
        ],
        tips: [
          'Standard atmospheric pressure = 14.7 psi = 101.325 kPa = 1 atm',
          'Tire pressure is typically measured in psi or bar',
        ]
      }
    }
    case 'energy': {
      return {
        summary: `Converted energy: **${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}**`,
        details: [
          `Energy conversions span mechanical, thermal, and electrical domains`,
          `Common units: J, kWh, cal, BTU, ft-lb`,
        ],
        tips: [
          '1 kWh = 3.6 MJ — the standard unit for electricity billing',
          '1 Calorie (food) = 1 kcal = 4,184 J',
        ]
      }
    }
    case 'time': {
      const hours = val * 24
      const minutes = val * 1440
      return {
        summary: `Converted time: **${val.toLocaleString(undefined, { maximumFractionDigits: 4 })}**`,
        details: [
          `Equivalent to: **${hours.toFixed(1)} hours** or **${minutes.toFixed(0)} minutes**`,
        ],
        tips: [
          'Time conversions are exact (based on SI definitions)',
          'Unix timestamps count seconds since Jan 1, 1970 UTC',
        ]
      }
    }
    case 'data': {
      return {
        summary: `Converted data: **${val.toFixed(2)}**`,
        details: [
          `Decimal (SI): 1 KB = 1,000 bytes`,
          `Binary (IEC): 1 KiB = 1,024 bytes`,
          `Drive manufacturers use decimal; OS uses binary`,
        ],
        tips: [
          'Hard drive manufacturers use decimal (1 GB = 1 billion bytes)',
          'RAM and operating systems use binary (1 GiB = 1,073,741,824 bytes)',
        ]
      }
    }
    default: return {
      summary: `Converted value: **${val.toLocaleString(undefined, { maximumFractionDigits: 4 })}**`,
      details: ['Conversion uses internationally standardized factors'],
      tips: ['Verify significant figures for your use case', 'Some conversions are approximate']
    }
  }
}

function explainStatistics(calcType: string, val: number, inputs: Record<string, number>) {
  switch (calcType) {
    case 'mean': {
      return {
        summary: `Mean (average): **${val.toFixed(4)}**`,
        details: [
          `The mean is the sum of all values divided by the count of values`,
          `It represents the central tendency of your data set`,
        ],
        tips: [
          'The mean is sensitive to outliers',
          'Use median instead of mean for skewed distributions',
        ]
      }
    }
    case 'median': {
      return {
        summary: `Median: **${val.toFixed(4)}**`,
        details: [
          `The median is the middle value when data is sorted in ascending order`,
          `For odd counts, it\'s the center value; for even, it\'s the average of two middle values`,
        ],
        tips: [
          'The median is robust to outliers',
          'Use median for income, housing prices, and other skewed data',
        ]
      }
    }
    case 'mode': {
      return {
        summary: `Mode: **${val.toFixed(4)}**`,
        details: [
          `The mode is the value that appears most frequently in your data set`,
          `A data set may have one mode, multiple modes, or no mode`,
        ],
        tips: [
          'Mode is useful for categorical and discrete data',
          'Bimodal data may indicate two distinct groups in your sample',
        ]
      }
    }
    case 'range': {
      return {
        summary: `Range: **${val.toFixed(4)}**`,
        details: [
          `Range = Maximum value − Minimum value`,
          `It measures the total spread of your data`,
        ],
        tips: [
          'Range is highly sensitive to outliers',
          'Use interquartile range (IQR) for a more robust spread measure',
        ]
      }
    }
    case 'standard-deviation': {
      const mean = inputs.mean || 0
      const cv = mean ? (val / mean) * 100 : 0
      return {
        summary: `Standard deviation: **${val.toFixed(4)}**`,
        details: [
          `Coefficient of variation: **${cv.toFixed(1)}%**`,
          `About 68% of data falls within 1σ, 95% within 2σ, 99.7% within 3σ`,
        ],
        tips: [
          'Low σ means data points are close to the mean (precise)',
          'High σ indicates wide dispersion in your data',
        ]
      }
    }
    case 'variance': {
      return {
        summary: `Variance: **${val.toFixed(4)}**`,
        details: [
          `Variance = σ² (standard deviation squared)`,
          `It measures the average squared deviation from the mean`,
        ],
        tips: [
          'Variance is in squared units — take sqrt for interpretable spread',
          'Use sample variance (n−1) when your data is a sample, not a population',
        ]
      }
    }
    case 'z-score': {
      const aboveBelow = val >= 0 ? 'above' : 'below'
      return {
        summary: `Z-score: **${val.toFixed(4)}**`,
        details: [
          `This value is **${Math.abs(val).toFixed(2)}** standard deviations ${aboveBelow} the mean`,
          `A z-score of ±1.96 corresponds to the 5% significance level`,
        ],
        tips: [
          'Z-scores standardize data for comparison across different scales',
          'Use z-tables or calculators to find the corresponding percentile',
        ]
      }
    }
    case 'correlation': {
      const strength = Math.abs(val) >= 0.8 ? 'strong' : Math.abs(val) >= 0.5 ? 'moderate' : Math.abs(val) >= 0.3 ? 'weak' : 'very weak'
      const direction = val >= 0 ? 'positive' : 'negative'
      return {
        summary: `Correlation coefficient (r): **${val.toFixed(4)}**`,
        details: [
          `**${strength.charAt(0).toUpperCase() + strength.slice(1)} ${direction}** correlation`,
          `r² = **${(val * val).toFixed(4)}** (coefficient of determination)`,
        ],
        tips: [
          'Correlation does not imply causation',
          '|r| > 0.8 indicates a strong linear relationship',
        ]
      }
    }
    case 'regression': {
      const slope = inputs.slope || 0
      const intercept = inputs.intercept || 0
      return {
        summary: `Regression result: **${val.toFixed(4)}**`,
        details: [
          `Linear equation: y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
          `R² = **${(inputs.rSquared || 0).toFixed(4)}**`,
        ],
        tips: [
          'Check residuals to verify linear regression assumptions',
          'Standardize variables when they have different units',
        ]
      }
    }
    case 'probability': {
      return {
        summary: `Probability: **${(val * 100).toFixed(2)}%**`,
        details: [
          `Probability = Favorable outcomes ÷ Total outcomes`,
          `Value range: 0 (impossible) to 1 (certain)`,
        ],
        tips: [
          'The sum of probabilities of all possible outcomes equals 1',
          'Use complementary probability: P(A) = 1 − P(not A)',
        ]
      }
    }
    case 'permutation': {
      const n = inputs.n || 0
      const r = inputs.r || 0
      return {
        summary: `Permutations: **${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}**`,
        details: [
          `Formula: P(${n},${r}) = ${n}! ÷ (${n}−${r})!`,
          `Order **matters** — different arrangements count separately`,
        ],
        tips: [
          'Use permutations when sequence/order is important',
          'Password combinations are permutations (order matters)',
        ]
      }
    }
    case 'combination': {
      const n = inputs.n || 0
      const r = inputs.r || 0
      return {
        summary: `Combinations: **${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}**`,
        details: [
          `Formula: C(${n},${r}) = ${n}! ÷ (${r}! × (${n}−${r})!)`,
          `Order **does not matter** — only selection counts`,
        ],
        tips: [
          'Use combinations when selecting a team or lottery numbers',
          'Combinations are always ≤ permutations for the same n and r',
        ]
      }
    }
    case 'factorial': {
      const n = inputs.n || 0
      const digits = Math.floor(Math.log10(val)) + 1
      return {
        summary: `**${n}! = ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}**`,
        details: [
          `${n}! = ${n} × ${n - 1} × ... × 2 × 1 = **${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}**`,
          `Result has **${digits} digits**`,
        ],
        tips: [
          '0! = 1 by definition',
          'Factorials are used in permutations, combinations, and series expansions',
        ]
      }
    }
    default: return {
      summary: `Result: **${val.toLocaleString(undefined, { maximumFractionDigits: 4 })}**`,
      details: ['Statistical measure computed from your data set'],
      tips: ['Outliers can significantly affect the mean', 'Consider median for skewed distributions']
    }
  }
}

function explainEducation(calcType: string, val: number, inputs: Record<string, number>) {
  switch (calcType) {
    case 'gpa': {
      const isWeighted = inputs.weighted === 1
      const scale = isWeighted ? 5.0 : 4.0
      let grade = ''
      if (val >= 3.7) grade = 'Excellent'
      else if (val >= 3.0) grade = 'Good'
      else if (val >= 2.0) grade = 'Satisfactory'
      else if (val >= 1.0) grade = 'Below Average'
      else grade = 'Failing'
      return {
        summary: `GPA: **${val.toFixed(2)}** / ${scale.toFixed(1)} — **${grade}**`,
        details: [
          isWeighted ? 'Weighted GPA includes extra points for AP/IB/Honors courses' : 'Unweighted GPA uses the standard 4.0 scale',
          `Based on your course grades and credit hours`,
        ],
        tips: [
          isWeighted ? 'Weighted GPAs can exceed 4.0 with advanced courses' : 'Take challenging courses to strengthen your transcript',
          'Consistency across semesters matters more than a single high score',
        ]
      }
    }
    case 'grade': {
      const percentage = inputs.percentage || 0
      let letter = ''
      if (percentage >= 90) letter = 'A'
      else if (percentage >= 80) letter = 'B'
      else if (percentage >= 70) letter = 'C'
      else if (percentage >= 60) letter = 'D'
      else letter = 'F'
      const modifier = percentage >= 97 ? '+' : percentage >= 93 ? '' : percentage >= 90 ? '−' : ''
      return {
        summary: `**${percentage.toFixed(1)}%** → **${letter}${modifier}**`,
        details: [
          `Standard scale: 90-100=A, 80-89=B, 70-79=C, 60-69=D, <60=F`,
          `Plus/minus modifiers apply within each letter range`,
        ],
        tips: [
          'Some schools use different grading scales (e.g., 93+ for A)',
          'Extra credit and weighted assignments can shift your grade',
        ]
      }
    }
    case 'test-score': {
      const raw = inputs.score || 0
      const total = inputs.total || 100
      const percentile = val
      return {
        summary: `Score: **${raw.toFixed(0)}/${total.toFixed(0)}** — **${val.toFixed(1)}%**`,
        details: [
          `Percentile rank: approximately **${percentile > 90 ? '90+' : percentile > 75 ? '75+' : percentile > 50 ? '50+' : '<50'}th**`,
          `${raw.toFixed(0)} correct out of ${total.toFixed(0)} total questions`,
        ],
        tips: [
          'Review incorrect answers systematically',
          'Focus on high-weight topics for the biggest score improvement',
        ]
      }
    }
    case 'homework': {
      const assignments = inputs.assignments || 1
      return {
        summary: `Estimated time: **${val.toFixed(1)} hours** for ${assignments.toFixed(0)} assignment(s)`,
        details: [
          `Average **${(val / Math.max(1, assignments)).toFixed(1)} hours** per assignment`,
          `Plan your study schedule accordingly`,
        ],
        tips: [
          'Break large assignments into daily 25-minute Pomodoro sessions',
          'Prioritize assignments by due date and weight',
        ]
      }
    }
    case 'study-planner': {
      return {
        summary: `Study plan: **${val.toFixed(0)} weeks** until your goal`,
        details: [
          `Recommended **${Math.ceil(val * 3)} sessions** (3×/week)`,
          `Each session: **${Math.max(30, Math.min(120, Math.round(60 / Math.max(1, val))))} minutes**`,
        ],
        tips: [
          'Spaced repetition is more effective than cramming',
          'Mix practice problems with concept review in each session',
        ]
      }
    }
    default: return {
      summary: `Your calculated result: **${val.toFixed(2)}**`,
      details: [
        `This value has been derived using standard educational formulas and methodologies`,
        `Always verify your work with a second method or peer review`,
      ],
      tips: ['Break complex problems into smaller steps', 'Practice with varied examples to build mastery']
    }
  }
}

function explainPhysics(calcType: string, val: number, inputs: Record<string, number>) {
  switch (calcType) {
    case 'force': {
      const m = inputs.mass || 0
      const a = inputs.acceleration || 0
      return {
        summary: `Force: **${val.toFixed(2)} N**`,
        details: [
          `Formula: **F = ma** = ${m} × ${a} = **${val.toFixed(2)} N**`,
          `${val > 1000 ? 'This is a substantial force — use proper safety equipment' : 'This is a manageable force for most applications'}`,
        ],
        tips: [
          'Force is a vector — direction matters',
          'The net force determines acceleration (Newton\'s 2nd Law)',
        ]
      }
    }
    case 'velocity': {
      return {
        summary: `Velocity: **${val.toFixed(2)}**`,
        details: [
          `Velocity = Displacement ÷ Time`,
          `Direction matters — velocity is a vector quantity`,
        ],
        tips: [
          'Speed is the magnitude of velocity (scalar)',
          'Constant velocity means zero acceleration',
        ]
      }
    }
    case 'acceleration': {
      return {
        summary: `Acceleration: **${val.toFixed(2)}**`,
        details: [
          `Acceleration = Change in velocity ÷ Time taken`,
          `Standard gravity on Earth: **9.81 m/s²**`,
        ],
        tips: [
          'Negative acceleration = deceleration',
          'Centripetal acceleration = v²/r for circular motion',
        ]
      }
    }
    case 'kinetic-energy': {
      const m = inputs.mass || 0
      const v = inputs.velocity || 0
      return {
        summary: `Kinetic energy: **${val.toFixed(2)} J**`,
        details: [
          `Formula: **KE = ½mv²** = ½ × ${m} × ${v}² = **${val.toFixed(2)} J**`,
          `Energy scales with the **square** of velocity`,
        ],
        tips: [
          'Doubling velocity quadruples kinetic energy',
          'KE is converted to work when an object stops',
        ]
      }
    }
    case 'potential-energy': {
      const m = inputs.mass || 0
      const h = inputs.height || 0
      return {
        summary: `Potential energy: **${val.toFixed(2)} J**`,
        details: [
          `Formula: **PE = mgh** = ${m} × 9.81 × ${h} = **${val.toFixed(2)} J**`,
          `Using g = 9.81 m/s² (standard gravity)`,
        ],
        tips: [
          'PE depends on the reference height (often ground level)',
          'PE converts to KE as the object falls (energy conservation)',
        ]
      }
    }
    case 'work': {
      const f = inputs.force || 0
      const d = inputs.distance || 0
      return {
        summary: `Work: **${val.toFixed(2)} J**`,
        details: [
          `Formula: **W = Fd** = ${f} × ${d} = **${val.toFixed(2)} J**`,
          `Work is done when force causes displacement`,
        ],
        tips: [
          'Work = 0 if force is perpendicular to displacement',
          'Work-energy theorem: net work = change in KE',
        ]
      }
    }
    case 'power': {
      const w = inputs.work || 0
      const t = inputs.time || 1
      return {
        summary: `Power: **${val.toFixed(2)} W**`,
        details: [
          `Formula: **P = W/t** = ${w} ÷ ${t} = **${val.toFixed(2)} W**`,
          `Power is the rate of doing work`,
        ],
        tips: [
          '1 horsepower = 746 watts',
          'Power consumption × time = energy used (kWh)',
        ]
      }
    }
    case 'pressure': {
      const f = inputs.force || 0
      const a = inputs.area || 1
      return {
        summary: `Pressure: **${val.toFixed(2)}**`,
        details: [
          `Formula: **P = F/A** = ${f} ÷ ${a} = **${val.toFixed(2)} Pa**`,
          `Pressure is force distributed over an area`,
        ],
        tips: [
          'A smaller area increases pressure for the same force',
          'Atmospheric pressure = 101,325 Pa at sea level',
        ]
      }
    }
    case 'density': {
      const m = inputs.mass || 0
      const v = inputs.volume || 1
      return {
        summary: `Density: **${val.toFixed(2)}**`,
        details: [
          `Formula: **ρ = m/V** = ${m} ÷ ${v} = **${val.toFixed(2)}**`,
          `Density determines whether an object floats or sinks`,
        ],
        tips: [
          'Water density = 1 g/cm³ = 1,000 kg/m³',
          'Objects with density < fluid density float',
        ]
      }
    }
    case 'frequency': {
      return {
        summary: `Frequency: **${val.toFixed(4)} Hz**`,
        details: [
          `Period: **${(1 / Math.max(val, 0.0001)).toFixed(4)} s**`,
          `Formula: **f = 1/T** (frequency = 1 ÷ period)`,
        ],
        tips: [
          'Human hearing range: 20 Hz to 20,000 Hz',
          'Higher frequency = higher pitch in sound',
        ]
      }
    }
    case 'wavelength': {
      const f = inputs.frequency || 0
      const speed = inputs.speed || 299792458
      const speedLabel = speed > 10000 ? 'speed of light (3 × 10⁸ m/s)' : `${speed.toFixed(0)} m/s`
      return {
        summary: `Wavelength: **${val.toFixed(4)}**`,
        details: [
          `Formula: **λ = v/f** = ${speedLabel} ÷ ${f} = **${val.toFixed(4)}**`,
          `Using wave speed v = ${speedLabel}`,
        ],
        tips: [
          'Visible light: ~380–750 nm wavelength',
          'Longer wavelength = lower frequency and energy',
        ]
      }
    }
    case 'ohms-law': {
      const v = inputs.voltage || 0
      const i = inputs.current || 0
      const r = inputs.resistance || 0
      return {
        summary: `Calculated value: **${val.toFixed(2)}**`,
        details: [
          `Formula: **V = IR** — ${v ? `V = ${v}` : ''} ${i ? `I = ${i}` : ''} ${r ? `R = ${r}` : ''}`,
          `Power: **P = VI = ${(v * i).toFixed(2)} W**`,
        ],
        tips: [
          'Power dissipation causes heating (P = I²R)',
          'Use proper wire gauge for the expected current',
        ]
      }
    }
    case 'momentum': {
      const m = inputs.mass || 0
      const v = inputs.velocity || 0
      return {
        summary: `Momentum: **${val.toFixed(2)} kg·m/s**`,
        details: [
          `Formula: **p = mv** = ${m} × ${v} = **${val.toFixed(2)} kg·m/s**`,
          `Momentum is conserved in collisions (no external forces)`,
        ],
        tips: [
          'Impulse = change in momentum = F × Δt',
          'Airbags increase impact time to reduce force',
        ]
      }
    }
    case 'impulse': {
      const f = inputs.force || 0
      const t = inputs.time || 0
      return {
        summary: `Impulse: **${val.toFixed(2)} N·s**`,
        details: [
          `Formula: **J = FΔt** = ${f} × ${t} = **${val.toFixed(2)} N·s**`,
          `Impulse equals the change in momentum`,
        ],
        tips: [
          'A larger impact time reduces the average force',
          'Car crumple zones are designed to increase collision time',
        ]
      }
    }
    default: return {
      summary: `Result: **${val.toLocaleString(undefined, { maximumFractionDigits: 4 })}**`,
      details: ['Calculated using fundamental physical laws and equations'],
      tips: ['Use consistent units throughout your calculation', 'Consider significant figures in your answer']
    }
  }
}

function explainChemistry(calcType: string, val: number, inputs: Record<string, number>) {
  switch (calcType) {
    case 'molar-mass': {
      return {
        summary: `Molar mass: **${val.toFixed(4)} g/mol**`,
        details: [
          `Sum of atomic masses of all atoms in the molecule`,
          `Values follow IUPAC standard atomic weights`,
        ],
        tips: [
          'Molar mass converts between grams and moles',
          'Use isotopic abundance for precise calculations',
        ]
      }
    }
    case 'dilution': {
      const c1 = inputs.initialConc || 0
      const v1 = inputs.initialVol || 0
      const c2 = inputs.finalConc || 0
      return {
        summary: `Dilution result: **${val.toFixed(4)}**`,
        details: [
          `Formula: **C₁V₁ = C₂V₂**`,
          `${c1} × ${v1} = ${c2} × **${val.toFixed(4)}**`,
        ],
        tips: [
          'Always add acid to water, never water to acid',
          'Use volumetric flasks for precise dilutions',
        ]
      }
    }
    case 'ph': {
      const hConc = inputs.concentration || 0
      let acidity = ''
      if (val < 3) acidity = 'strongly acidic'
      else if (val < 6) acidity = 'weakly acidic'
      else if (val === 7) acidity = 'neutral'
      else if (val < 10) acidity = 'weakly basic'
      else acidity = 'strongly basic'
      return {
        summary: `pH: **${val.toFixed(2)}** — **${acidity.charAt(0).toUpperCase() + acidity.slice(1)}**`,
        details: [
          `Formula: **pH = −log₁₀[H⁺]**`,
          `H⁺ concentration: **${hConc > 0 ? hConc.toExponential(2) : 'N/A'} M**`,
        ],
        tips: [
          'Pure water has pH 7 at 25°C',
          'pH is logarithmic — each unit represents a 10× change in acidity',
        ]
      }
    }
    case 'stoichiometry': {
      const moles = inputs.moles || 0
      const ratio = inputs.ratio || 1
      return {
        summary: `Product amount: **${val.toFixed(4)} moles**`,
        details: [
          `Mole ratio: **${ratio.toFixed(4)}** (from balanced equation)`,
          `${moles.toFixed(4)} × (${ratio.toFixed(4)} / 1) = **${val.toFixed(4)} moles**`,
        ],
        tips: [
          'Always balance the chemical equation first',
          'Identify the limiting reagent before calculating yield',
        ]
      }
    }
    case 'equilibrium': {
      return {
        summary: `Equilibrium constant (K): **${val.toFixed(4)}**`,
        details: [
          `K = [products] ÷ [reactants] (each raised to stoichiometric coefficient)`,
          `K > 1 favors products; K < 1 favors reactants`,
        ],
        tips: [
          'K is temperature-dependent (van\'t Hoff equation)',
          'Pure solids and liquids are omitted from K expressions',
        ]
      }
    }
    case 'reaction-rate': {
      return {
        summary: `Reaction rate: **${val.toFixed(4)}**`,
        details: [
          `Rate = Δ[concentration] / Δt`,
          `Rate depends on temperature, concentration, and catalysts`,
        ],
        tips: [
          'Rough rule: rate doubles for every 10°C temperature increase',
          'Catalysts lower activation energy without being consumed',
        ]
      }
    }
    case 'half-life': {
      return {
        summary: `Half-life: **${val.toFixed(4)}**`,
        details: [
          `After 1 half-life: **50%** remains`,
          `After 2 half-lives: **25%** remains`,
          `After 3 half-lives: **12.5%** remains`,
        ],
        tips: [
          'Half-life is constant for first-order reactions',
          'Carbon-14 dating uses a half-life of 5,730 years',
        ]
      }
    }
    default: return {
      summary: `Calculated value: **${val.toFixed(4)}**`,
      details: [
        `Computed using standard chemical equations and stoichiometric relationships`,
        `Molar masses and constants follow IUPAC recommended values`,
      ],
      tips: ['Ensure all units are consistent (preferably SI)', 'Check significant figures in your final answer']
    }
  }
}

function explainBiology(calcType: string, val: number, inputs: Record<string, number>) {
  switch (calcType) {
    case 'bmi': {
      let category = 'Normal weight'
      if (val < 18.5) category = 'Underweight'
      else if (val < 25) category = 'Normal weight'
      else if (val < 30) category = 'Overweight'
      else if (val < 35) category = 'Obese Class I'
      else if (val < 40) category = 'Obese Class II'
      else category = 'Obese Class III'
      return {
        summary: `BMI: **${val.toFixed(1)}** — **${category}**`,
        details: [
          `Formula: weight(kg) / height(m)²`,
          `Healthy range: 18.5–24.9`,
          `BMI is a population-level screening tool`,
        ],
        tips: [
          'BMI does not measure body fat directly',
          'Athletes may have high BMI due to muscle mass',
        ]
      }
    }
    case 'bmr': {
      const isMale = inputs.gender === 1
      const formula = isMale ? 'Mifflin-St Jeor (male)' : 'Mifflin-St Jeor (female)'
      return {
        summary: `BMR: **${val.toFixed(0)} kcal/day**`,
        details: [
          `Formula used: **${formula}**`,
          isMale ? 'Male: 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5' : 'Female: 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161',
          `This is the energy needed at complete rest`,
        ],
        tips: [
          'BMR accounts for 60-75% of total daily energy expenditure',
          'Muscle mass increases BMR — strength training helps',
        ]
      }
    }
    case 'body-fat': {
      let category = 'Average'
      const isMale = inputs.gender === 1
      if (isMale) {
        if (val < 6) category = 'Essential fat'
        else if (val < 14) category = 'Athletic'
        else if (val < 18) category = 'Fitness'
        else if (val < 25) category = 'Average'
        else category = 'Obese'
      } else {
        if (val < 14) category = 'Essential fat'
        else if (val < 21) category = 'Athletic'
        else if (val < 25) category = 'Fitness'
        else if (val < 32) category = 'Average'
        else category = 'Obese'
      }
      const methodLabel = inputs.method === 1 ? 'Navy circumference' : inputs.method === 2 ? 'skin fold' : 'bioelectrical impedance'
      return {
        summary: `Body fat: **${val.toFixed(1)}%** — **${category}**`,
        details: [
          `Estimated using **${methodLabel}** method`,
          `Essential fat: 3-5% (men), 10-13% (women)`,
        ],
        tips: [
          'Body fat percentage is more informative than BMI',
          'Hydration levels affect impedance-based measurements',
        ]
      }
    }
    case 'heart-rate': {
      const maxHR = 220 - (inputs.age || 30)
      const ratio = val / maxHR
      let zoneName = ''
      if (ratio < 0.5) zoneName = 'Very light'
      else if (ratio < 0.6) zoneName = 'Light (warm-up)'
      else if (ratio < 0.7) zoneName = 'Moderate (fat burn)'
      else if (ratio < 0.8) zoneName = 'Hard (aerobic)'
      else if (ratio < 0.9) zoneName = 'Very hard (anaerobic)'
      else zoneName = 'Maximum effort'
      return {
        summary: `Heart rate: **${val.toFixed(0)} bpm** — **${zoneName}**`,
        details: [
          `Max HR (220 − age): **${maxHR} bpm**`,
          `Target zone (60-80%): **${(maxHR * 0.6).toFixed(0)}–${(maxHR * 0.8).toFixed(0)} bpm**`,
        ],
        tips: [
          'Stay in zone 2 (60-70%) for endurance training',
          'HIIT workouts alternate between zones 4 and 1',
        ]
      }
    }
    case 'calorie': {
      const deficit = val - 500
      const surplus = val + 300
      return {
        summary: `Total daily energy expenditure: **${val.toFixed(0)} kcal/day**`,
        details: [
          `Weight loss (deficit −500): **${deficit.toFixed(0)} kcal/day**`,
          `Weight gain (surplus +300): **${surplus.toFixed(0)} kcal/day**`,
          `Based on BMR × activity factor`,
        ],
        tips: [
          'A safe deficit is 300-500 kcal/day (0.5-1 lb/week loss)',
          'Protein intake helps preserve muscle during a deficit',
        ]
      }
    }
    case 'water-intake': {
      return {
        summary: `Recommended water intake: **${val.toFixed(0)} ml/day**`,
        details: [
          `General guideline: 30-35 ml per kg of body weight`,
          `Activity, climate, and health status affect actual needs`,
          `That\'s about **${(val / 250).toFixed(1)} cups** of 250 ml each`,
        ],
        tips: [
          'Thirst is a late indicator of dehydration',
          'Increase intake during exercise and hot weather',
        ]
      }
    }
    case 'protein': {
      const perKg = val / (inputs.weight || 70)
      return {
        summary: `Daily protein: **${val.toFixed(0)} g** (**${perKg.toFixed(1)} g/kg**)`,
        details: [
          `Sedentary: 0.8 g/kg | Active: 1.2-1.7 g/kg | Athlete: 1.6-2.2 g/kg`,
          `Based on your activity level and fitness goals`,
        ],
        tips: [
          'Distribute protein across 3-4 meals for optimal synthesis',
          '20-40g per meal is the typical anabolic threshold',
        ]
      }
    }
    default: return {
      summary: `Result: **${val.toFixed(2)}**`,
      details: [
        `Calculated using established biological and physiological relationships`,
        `Reference values may vary based on individual factors and population data`,
      ],
      tips: ['Biological measurements can vary; consider multiple samples', 'Control for environmental factors in experimental setups']
    }
  }
}

function explainFood(calcType: string, val: number, inputs: Record<string, number>) {
  switch (calcType) {
    case 'recipe-scaling': {
      const originalServings = inputs.originalServings || 1
      const targetServings = inputs.targetServings || 1
      const factor = targetServings / originalServings
      return {
        summary: `Scaled quantity: **${val.toFixed(1)}**`,
        details: [
          `Scale factor: **${factor.toFixed(2)}×** (${originalServings} → ${targetServings} servings)`,
          `All ingredients multiplied by this factor`,
        ],
        tips: [
          'Scale by weight (grams) rather than volume for accuracy',
          'Baking times may need adjustment for scaled recipes',
        ]
      }
    }
    case 'nutrition': {
      const perServing = val / (inputs.servings || 1)
      return {
        summary: `Nutrition per serving: **${perServing.toFixed(1)}**`,
        details: [
          `Total: **${val.toFixed(1)}** across **${inputs.servings || 1} servings**`,
          `Adjust serving size to meet your dietary goals`,
        ],
        tips: [
          'Compare nutrition facts to your daily targets',
          'Focus on fiber, protein, and micronutrient density',
        ]
      }
    }
    case 'cost-per-serving': {
      return {
        summary: `Cost per serving: **$${val.toFixed(2)}**`,
        details: [
          `Total recipe cost: **$${(val * (inputs.servings || 1)).toFixed(2)}**`,
          `Across **${inputs.servings || 1} servings**`,
        ],
        tips: [
          'Buying in bulk reduces per-serving cost',
          'Seasonal ingredients are often cheaper and fresher',
        ]
      }
    }
    case 'macro-split': {
      const proteinG = inputs.proteinG || 0
      const carbsG = inputs.carbsG || 0
      const fatG = inputs.fatG || 0
      const cals = (proteinG * 4) + (carbsG * 4) + (fatG * 9)
      return {
        summary: `Macro split: **${val.toFixed(1)}**`,
        details: [
          `Protein: **${proteinG.toFixed(0)}g** (${cals > 0 ? ((proteinG * 4 / cals) * 100).toFixed(0) : 0}% of calories)`,
          `Carbs: **${carbsG.toFixed(0)}g** (${cals > 0 ? ((carbsG * 4 / cals) * 100).toFixed(0) : 0}% of calories)`,
          `Fat: **${fatG.toFixed(0)}g** (${cals > 0 ? ((fatG * 9 / cals) * 100).toFixed(0) : 0}% of calories)`,
          `Total: **${cals.toFixed(0)} kcal**`,
        ],
        tips: [
          'Protein = 4 kcal/g, Carbs = 4 kcal/g, Fat = 9 kcal/g',
          'Adjust ratios based on your fitness goals',
        ]
      }
    }
    case 'calorie-density': {
      return {
        summary: `Calorie density: **${val.toFixed(1)} kcal/g**`,
        details: [
          `Very low: <0.6 | Low: 0.6-1.5 | Medium: 1.5-4 | High: >4`,
          `Water-rich foods (vegetables, fruits) have low density`,
        ],
        tips: [
          'Low calorie-density foods promote satiety with fewer calories',
          'Oils, nuts, and processed foods have high calorie density',
        ]
      }
    }
    case 'meal-prep': {
      return {
        summary: `Meal prep plan: **${Math.ceil(val)} meals**`,
        details: [
          `For **${inputs.days || 7} day(s)**, **${(val / Math.max(1, inputs.days || 7)).toFixed(1)} meals/day**`,
          `Includes breakfast, lunch, dinner, and snacks`,
        ],
        tips: [
          'Cook grains and proteins in bulk for the week',
          'Use airtight containers to maintain freshness',
        ]
      }
    }
    default: return {
      summary: `Total: **${val.toFixed(1)}**`,
      details: [
        `Per serving: **${(inputs.servings ? val / inputs.servings : val).toFixed(1)}**`,
        `Based on ${inputs.servings || 1} serving(s) and your specified ingredients`,
      ],
      tips: ['Adjust seasoning gradually and taste as you go', 'Scale recipes by weight rather than volume for accuracy']
    }
  }
}

function explainEcology(calcType: string, val: number, inputs: Record<string, number>) {
  switch (calcType) {
    case 'biodiversity': {
      return {
        summary: `Biodiversity index: **${val.toFixed(4)}**`,
        details: [
          `Shannon index (H): typically ranges from 0 to ~5 (higher = more diverse)`,
          `Simpson index (D): ranges from 0 to 1 (higher = more diverse)`,
          `Higher values indicate greater species diversity in your sample`,
        ],
        tips: [
          'A Shannon index < 1 indicates low diversity',
          'Compare to similar habitats for meaningful interpretation',
        ]
      }
    }
    case 'carbon-footprint': {
      const annual = val * 365
      return {
        summary: `Carbon footprint: **${val.toFixed(2)} kg CO₂/day**`,
        details: [
          `Annual estimate: **${annual.toFixed(0)} kg CO₂/year**`,
          `Global average: ~**4,800 kg CO₂/year** per person`,
        ],
        tips: [
          'Reduce by choosing public transport and renewable energy',
          'Diet (especially red meat) significantly impacts your footprint',
        ]
      }
    }
    case 'population-growth': {
      const initial = inputs.initial || 0
      const rate = inputs.growthRate || 0
      const doublingTime = rate > 0 ? (70 / (rate * 100)) : Infinity
      return {
        summary: `Projected population: **${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}**`,
        details: [
          `Initial: **${initial.toLocaleString(undefined, { maximumFractionDigits: 0 })}**`,
          `Growth rate: **${(rate * 100).toFixed(2)}%** per year`,
          `Doubling time: **${doublingTime === Infinity ? 'N/A (declining)' : doublingTime.toFixed(1) + ' years'}**`,
        ],
        tips: [
          'Exponential growth models have limitations for long projections',
          'Rule of 70: doubling time ≈ 70 ÷ annual growth rate (%)',
        ]
      }
    }
    case 'water-footprint': {
      return {
        summary: `Water footprint: **${val.toLocaleString(undefined, { maximumFractionDigits: 0 })} L/day**`,
        details: [
          `Global average: ~**3,800 L/day** per person`,
          `Direct use (drinking, hygiene): ~**100-200 L/day**`,
          `Indirect use (food, products): makes up the majority`,
        ],
        tips: [
          'Food production accounts for ~70% of global water use',
          'Eating less meat significantly reduces your water footprint',
        ]
      }
    }
    case 'species-richness': {
      return {
        summary: `Species richness: **${val.toFixed(0)} species**`,
        details: [
          `Species richness counts the number of different species present`,
          `Does not account for abundance or evenness`,
        ],
        tips: [
          'Combine with evenness metrics for a complete diversity picture',
          'Larger sample areas typically yield higher richness counts',
        ]
      }
    }
    default: return {
      summary: `Estimated value: **${val.toFixed(2)}**`,
      details: [
        `Based on ecological models and environmental data inputs`,
        `Actual values may vary with local conditions and seasonal factors`,
      ],
      tips: ['Ecological measurements are estimates; use multiple data points', 'Consider temporal and spatial variation in your assessment']
    }
  }
}

function explainSports(calcType: string, val: number, inputs: Record<string, number>) {
  switch (calcType) {
    case 'pace': {
      const paceMinutes = val
      const paceStr = `${Math.floor(paceMinutes)}:${Math.round((paceMinutes % 1) * 60).toString().padStart(2, '0')}`
      const minPerMile = val * 1.60934
      const mileStr = `${Math.floor(minPerMile)}:${Math.round((minPerMile % 1) * 60).toString().padStart(2, '0')}`
      return {
        summary: `Your pace: **${paceStr} /km** (**${mileStr} /mi**)`,
        details: [
          `Speed: **${(60 / val).toFixed(1)} km/h** (${(60 / minPerMile).toFixed(1)} mph)`,
          `Over ${inputs.distance || 0} km: **${(val * (inputs.distance || 0)).toFixed(0)} minutes**`,
        ],
        tips: [
          'Pacing is key for race day success',
          'Negative splits (faster second half) are optimal',
        ]
      }
    }
    case 'vo2max': {
      let fitness = 'Below average'
      if (val > 55) fitness = 'Excellent'
      else if (val > 45) fitness = 'Good'
      else if (val > 35) fitness = 'Average'
      return {
        summary: `VO₂max: **${val.toFixed(1)} ml/kg/min** — **${fitness}**`,
        details: [
          `VO₂max measures aerobic endurance capacity`,
          `Elite endurance athletes: 60-85 ml/kg/min`,
          `Average range: 30-45 ml/kg/min`,
        ],
        tips: [
          'VO₂max can be improved by 10-20% with training',
          'HIIT and tempo runs are most effective for improvement',
        ]
      }
    }
    case '1rm': {
      const weight = inputs.weight || 0
      const reps = inputs.reps || 1
      return {
        summary: `Estimated 1RM: **${val.toFixed(0)} kg**`,
        details: [
          `Lifted **${weight} kg** for **${reps} reps**`,
          `Formula: **Epley** — 1RM = weight × (1 + reps/30)`,
        ],
        tips: [
          'Always use a spotter when testing 1RM',
          'Estimated 1RM is less accurate above 10 reps',
        ]
      }
    }
    case 'heart-rate-zones': {
      const maxHR = val
      return {
        summary: `Max heart rate: **${maxHR.toFixed(0)} bpm**`,
        details: [
          `Zone 1 (50-60%): **${(maxHR * 0.5).toFixed(0)}–${(maxHR * 0.6).toFixed(0)} bpm** — Recovery`,
          `Zone 2 (60-70%): **${(maxHR * 0.6).toFixed(0)}–${(maxHR * 0.7).toFixed(0)} bpm** — Endurance`,
          `Zone 3 (70-80%): **${(maxHR * 0.7).toFixed(0)}–${(maxHR * 0.8).toFixed(0)} bpm** — Aerobic`,
          `Zone 4 (80-90%): **${(maxHR * 0.8).toFixed(0)}–${(maxHR * 0.9).toFixed(0)} bpm** — Threshold`,
          `Zone 5 (90-100%): **${(maxHR * 0.9).toFixed(0)}–${(maxHR).toFixed(0)} bpm** — Max effort`,
        ],
        tips: [
          'Most training time should be in Zone 2',
          'Use a heart rate monitor for accurate zone tracking',
        ]
      }
    }
    case 'calories-burned': {
      const mets = inputs.met || 0
      const weight = inputs.weight || 70
      return {
        summary: `Calories burned: **${val.toFixed(0)} kcal**`,
        details: [
          `MET value: **${mets.toFixed(1)}** (${mets < 3 ? 'light' : mets < 6 ? 'moderate' : 'vigorous'} intensity)`,
          `Formula: **MET × weight(kg) × duration(h)**`,
        ],
        tips: [
          'MET = Metabolic Equivalent of Task (1 MET = resting)',
          'Heavier individuals burn more calories for the same activity',
        ]
      }
    }
    case 'race-time-prediction': {
      const totalMin = inputs.time || 0
      const dist = inputs.distance || 0
      const hours = Math.floor(val / 60)
      const mins = Math.round(val % 60)
      return {
        summary: `Predicted race time: **${hours > 0 ? hours + 'h ' : ''}${mins}min**`,
        details: [
          `Based on your **${dist} km** time of **${Math.floor(totalMin / 60)}:${(totalMin % 60).toString().padStart(2, '0')}**`,
          `Using the **Riegel formula**: T₂ = T₁ × (D₂/D₁)^1.06`,
        ],
        tips: [
          'Riegel formula is most accurate for distances 5K to marathon',
          'Weather, terrain, and nutrition significantly affect race day performance',
        ]
      }
    }
    default: {
      const paceMinutes = val
      const paceStr = `${Math.floor(paceMinutes)}:${Math.round((paceMinutes % 1) * 60).toString().padStart(2, '0')}`
      return {
        summary: `Your pace: **${paceStr} min/km**`,
        details: [
          `Speed: **${(60 / val).toFixed(1)} km/h**`,
          `Over ${inputs.distance || 0} km: **${(val * (inputs.distance || 0)).toFixed(0)} minutes**`,
        ],
        tips: ['Pacing is key for race day success', 'Negative splits (faster second half) are optimal']
      }
    }
  }
}

function explainDateTime(calcType: string, val: number, inputs: Record<string, number>) {
  const years = val / 365.25
  const months = val / 30.44
  return {
    summary: `Time span: **${val.toFixed(0)} days**`,
    details: [
      `Equivalent to **${years.toFixed(1)} years** or **${months.toFixed(1)} months**`,
      `Calculated from your specified start and end dates`,
    ],
    tips: ['Remember to account for leap years in long-range planning', 'Consider time zone differences for global scheduling']
  }
}
