import type { CalculatorEntry } from '@calcuniverse/calculator-registry'

export interface TemplateContent {
  description: string
  formulaHint: string
  faqs: { question: string; answer: string }[]
  useCases: string[]
}

type HubCategory =
  | 'financial'
  | 'health'
  | 'math'
  | 'conversion'
  | 'date-time'
  | 'construction'
  | 'statistics'
  | 'education'
  | 'physics'
  | 'chemistry'
  | 'engineering'
  | 'everyday'
  | 'food'
  | 'biology'
  | 'ecology'
  | 'sports'

const HUB_FORMULAS: Record<HubCategory, string> = {
  financial: 'Compound interest: A = P(1 + r/n)^(nt). Amortization: M = P[r(1+r)^n] / [(1+r)^n - 1]. Loan payment: same amortization formula adjusted for term.',
  health: 'BMI = weight(kg) / height(m)². BMR (Mifflin-St Jeor): 10W + 6.25H - 5A + 5 (male) or -161 (female). TDEE = BMR × PAL.',
  math: 'Formula varies by operation: percentage (P = X × rate/100), quadratic (x = [-b ± √(b²-4ac)]/2a), root (√x = y where y² = x), integration (∫f(x)dx).',
  conversion: 'Base formula: result = input_value × conversion_factor. Temperature uses offset: °F = °C × 9/5 + 32.',
  'date-time': 'Date arithmetic: date₂ - date₁ = elapsed_days. Duration = end - start. Age = today - birth_date.',
  construction: 'Area = length × width. Volume = length × width × height. Concrete: cubic_yards = cubic_feet / 27.',
  statistics: 'Mean = Σx / n. Variance = Σ(x - μ)² / n. Standard deviation = √variance. z-score = (x - μ) / σ.',
  education: 'GPA = Σ(grade_points × credits) / Σ(credits). Final grade = Σ(category_score × weight).',
  physics: 'F = ma. E = mc². v = u + at. KE = ½mv². PE = mgh. W = Fd cos(θ). P = W/t.',
  chemistry: 'n = m / M (moles = mass / molar mass). PV = nRT (ideal gas law). C = n / V (molarity). pH = -log₁₀[H⁺].',
  engineering: 'Stress = F / A. Strain = ΔL / L. Power = F × v. Ohm\'s law: V = IR. Beam deflection: δ = PL³/(48EI).',
  everyday: 'Tip = bill × tip_percentage. Discount = price × discount_rate. Final = price × (1 - rate). Split = total / people.',
  food: 'Calories from macros: 4×P(g) + 4×C(g) + 9×F(g). Recipe scaling: new_qty = original_qty × (desired / original_servings).',
  biology: 'Growth rate: r = ln(N₂/N₁) / t. Density = mass / volume. Heart rate reserve: HRR = HRmax - HRrest.',
  ecology: 'Carbon footprint = consumption × emission_factor. Shannon index: H = -Σ(p_i × ln(p_i)). Simpson index: D = 1 - Σ(p_i²).',
  sports: 'Pace = time / distance. BMI = weight(kg) / height(m)². Calories burned = MET × weight_kg × hours. 1RM = weight × (1 + reps/30).',
}

const HUB_FAQS: Record<HubCategory, { question: string; answer: string }[]> = {
  financial: [
    { question: 'How do interest rates affect long-term loans?', answer: 'Even a 0.25% rate difference can change total interest by thousands over a 30-year mortgage. Use the calculator to compare rate scenarios side by side.' },
    { question: 'What is the difference between simple and compound interest?', answer: 'Simple interest is calculated only on the principal. Compound interest is calculated on the principal plus accumulated interest, causing exponential growth over time.' },
    { question: 'How does compounding frequency affect returns?', answer: 'More frequent compounding (daily vs yearly) yields slightly higher returns. The formula A = P(1 + r/n)^(nt) accounts for any compounding frequency.' },
  ],
  health: [
    { question: 'How accurate are BMI and BMR calculations?', answer: 'These are screening estimates accurate within 10-20% for most people. Individual metabolism varies by genetics, muscle mass, and health conditions.' },
    { question: 'Should I use metric or imperial units?', answer: 'Both are supported. Metric (kg, cm) is the scientific standard and avoids conversion errors. The calculator handles unit selection automatically.' },
    { question: 'How often should I recalculate my health metrics?', answer: 'Recalculate after significant weight changes (5+ kg / 10+ lbs) or changes in activity level. Monthly checks are sufficient for most tracking.' },
  ],
  math: [
    { question: 'What does the order of operations mean?', answer: 'PEMDAS/BODMAS: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction. The calculator applies this automatically.' },
    { question: 'How do I handle negative numbers?', answer: 'Enter negative values with a minus sign (-). The calculator supports negative inputs for all operations where they are mathematically valid.' },
    { question: 'What precision should I expect?', answer: 'Results are typically displayed to 4-6 decimal places. You can adjust rounding precision using the options provided.' },
  ],
  conversion: [
    { question: 'Why can\'t I just multiply by 1.6 for km to miles?', answer: 'The exact factor is 1.60934. Using 1.6 introduces a 0.58% error — small for casual use but significant for navigation, fuel calculations, or scientific work.' },
    { question: 'Do US and imperial units differ?', answer: 'Yes. A US gallon (3.785 L) differs from a UK gallon (4.546 L). The calculator accounts for these differences based on your selection.' },
    { question: 'Why is temperature conversion different?', answer: 'Temperature scales have different zero points and interval sizes. Celsius to Fahrenheit uses an offset formula (°F = °C × 9/5 + 32), not a simple multiplier.' },
  ],
  'date-time': [
    { question: 'Does the date calculator account for leap years?', answer: 'Yes, all date calculations automatically account for leap years (February 29th) and varying month lengths (28-31 days).' },
    { question: 'How is age calculated precisely?', answer: 'Age is computed as the exact difference between the current date and birth date in completed years, months, and days.' },
    { question: 'Can I calculate business days excluding weekends?', answer: 'Yes, the calculator supports business day calculations that exclude Saturdays and Sundays, and can optionally exclude holidays.' },
  ],
  construction: [
    { question: 'What waste factor should I include?', answer: 'Add 5-10% for most materials, 10-15% for tile and stone (due to cutting), and 3-5% for concrete. The calculator includes waste factor fields.' },
    { question: 'Should I order extra materials?', answer: 'Yes, ordering 5-10% extra ensures you have enough for cuts, breakage, and future repairs. Matching materials later can be impossible due to dye lots.' },
    { question: 'How do I measure irregular areas?', answer: 'Break irregular spaces into rectangles and triangles. Calculate each section separately and sum the totals. The calculator supports multiple shapes.' },
  ],
  statistics: [
    { question: 'When should I use sample vs population standard deviation?', answer: 'Use population (divide by N) when you have every data point. Use sample (divide by N-1) when your data estimates a larger group.' },
    { question: 'What does standard deviation tell me?', answer: 'It measures data spread. About 68% of values fall within 1 SD of the mean, 95% within 2 SD, and 99.7% within 3 SD (normal distribution).' },
    { question: 'How do outliers affect statistics?', answer: 'Outliers significantly skew the mean and standard deviation but have less effect on the median and interquartile range. Use median for skewed data.' },
  ],
  education: [
    { question: 'How is weighted GPA different from unweighted?', answer: 'Unweighted GPA uses a 0-4.0 scale regardless of course difficulty. Weighted GPA gives extra points (up to 5.0) for honors, AP, or IB courses.' },
    { question: 'Do pass/fail courses affect GPA?', answer: 'Typically no — they appear on transcripts but carry zero grade points and do not affect the GPA calculation.' },
    { question: 'How do I find what score I need on a final?', answer: 'Set your target grade, enter your current scores and weights, and the calculator solves for the required final exam score.' },
  ],
  physics: [
    { question: 'What units should I use for physics calculations?', answer: 'SI units (kg, m, s, N, J) are standard. The calculator supports both SI and imperial, but mixing units without conversion causes errors.' },
    { question: 'How do I account for friction or air resistance?', answer: 'Basic calculators assume ideal conditions. Real-world results vary. The calculator provides the theoretical result; apply efficiency factors separately.' },
    { question: 'What is the difference between mass and weight?', answer: 'Mass (kg) is the amount of matter. Weight (N) is the force of gravity on that mass: W = mg, where g = 9.81 m/s² on Earth.' },
  ],
  chemistry: [
    { question: 'What is a mole in chemistry?', answer: 'A mole is 6.022 × 10²³ particles (Avogadro\'s number). Molar mass is the mass of one mole of a substance in grams per mole (g/mol).' },
    { question: 'How do I prepare a solution of specific molarity?', answer: 'Use the formula M₁V₁ = M₂V₂ for dilutions. For preparing from solid, mass = desired_moles × molar_mass.' },
    { question: 'What is STP and why does it matter?', answer: 'STP (Standard Temperature and Pressure) is 0°C and 1 atm. Gas volumes and ideal gas law calculations reference these standard conditions.' },
  ],
  engineering: [
    { question: 'What safety factor should I use?', answer: 'Common factors: 1.5-2.0 for static loads, 3.0-4.0 for dynamic loads, 5.0+ for human safety applications. Follow applicable building codes.' },
    { question: 'How do I convert between stress and strain?', answer: 'Stress (σ) = F/A. Strain (ε) = ΔL/L. They are related by Young\'s modulus: E = σ/ε. Use consistent units throughout.' },
    { question: 'What is the difference between torque and power?', answer: 'Torque is rotational force (N·m or lb-ft). Power is work per time. They relate: Power = Torque × angular velocity.' },
  ],
  everyday: [
    { question: 'How much should I tip?', answer: 'Standard tipping: 15-20% at restaurants, $1-2 per drink at bars, 15-20% for haircuts, and $2-5 per night for hotel housekeeping.' },
    { question: 'How do I calculate a discount?', answer: 'Discount amount = original_price × discount_rate. Final price = original_price - discount. For 25% off $80: discount = $20, final = $60.' },
    { question: 'How do I split a bill unevenly?', answer: 'Enter each person\'s items separately, add tax and tip proportionally. The calculator handles both even and itemized splits.' },
  ],
  food: [
    { question: 'How do I convert grams to calories?', answer: 'Protein and carbs provide 4 calories per gram. Fat provides 9 calories per gram. Alcohol provides 7 calories per gram.' },
    { question: 'Can I scale baking recipes?', answer: 'Yes, but be cautious with leavening agents (baking soda/powder), spices, and gelatin — these do not always scale linearly.' },
    { question: 'How accurate are nutritional estimates?', answer: 'Values are based on USDA and standard food databases. Actual nutrition varies by brand, ripeness, preparation method, and specific ingredients.' },
  ],
  biology: [
    { question: 'What is exponential growth in biology?', answer: 'Exponential growth (N = N₀eʳᵗ) occurs when resources are unlimited. Real populations eventually face constraints and follow logistic growth.' },
    { question: 'How is population density calculated?', answer: 'Population density = number_of_individuals / unit_area. It is a fundamental measure in ecology for comparing populations across habitats.' },
    { question: 'What is the Hardy-Weinberg equilibrium?', answer: 'It states that allele frequencies remain constant without evolution. The equation p² + 2pq + q² = 1 predicts genotype frequencies.' },
  ],
  ecology: [
    { question: 'What is a carbon footprint?', answer: 'It is the total greenhouse gas emissions caused by an individual, organization, or product, expressed as CO₂ equivalent (CO₂e).' },
    { question: 'How is biodiversity measured?', answer: 'Common indices: Shannon (H = -Σp_i × ln(p_i)), Simpson (D = 1 - Σp_i²), and species richness (total species count). Higher values mean greater diversity.' },
    { question: 'What is carrying capacity?', answer: 'Carrying capacity (K) is the maximum population size an environment can sustain indefinitely given available resources.' },
  ],
  sports: [
    { question: 'What is a good running cadence?', answer: 'Optimal cadence is 170-180 steps per minute for most runners. Higher cadence reduces impact forces and injury risk.' },
    { question: 'How do I calculate my heart rate zones?', answer: 'Use the Karvonen formula: Target HR = (HRmax - HRrest) × intensity% + HRrest. HRmax ≈ 208 - 0.7 × age.' },
    { question: 'How accurate is the 1RM estimation formula?', answer: 'Epley and Brzycki formulas estimate 1RM within ±5% for most people. Actual 1RM may vary based on training experience and exercise type.' },
  ],
}

const HUB_USE_CASES: Record<HubCategory, string[]> = {
  financial: [
    'Compare loan scenarios by adjusting interest rates, terms, and down payments to find the most affordable option',
    'Project investment growth over time using compound interest to set realistic retirement or savings targets',
    'Evaluate refinance opportunities by calculating monthly savings and break-even points against closing costs',
  ],
  health: [
    'Track BMI, BMR, or calorie targets over time to monitor progress toward weight, fitness, or wellness goals',
    'Calculate personalized macronutrient and calorie needs based on age, weight, height, activity level, and goals',
    'Estimate heart rate zones, body fat percentage, or pregnancy dates for fitness planning or health screening',
  ],
  math: [
    'Solve homework problems across algebra, geometry, trigonometry, and calculus with step-by-step verification',
    'Perform quick percentage, fraction, or exponent calculations for shopping, cooking, or financial decisions',
    'Explore mathematical relationships by changing variables to understand how inputs affect outputs',
  ],
  conversion: [
    'Convert between metric and imperial units for travel, recipes, DIY projects, or international shipping',
    'Accurately convert temperature, currency, or measurement units without memorizing conversion factors',
    'Compare product specifications across different unit systems when shopping from international sellers',
  ],
  'date-time': [
    'Calculate exact duration between dates for project planning, age calculation, or event countdown tracking',
    'Determine due dates, pregnancy weeks, or business days excluding weekends and holidays',
    'Find the day of the week for any date or calculate deadlines by adding days from a start date',
  ],
  construction: [
    'Estimate material quantities (concrete, lumber, paint, tile) for home improvement or construction projects',
    'Calculate project costs including materials, waste factors, and labor to create accurate budgets and bids',
    'Compare material options and dimensions to optimize design decisions before purchasing or building',
  ],
  statistics: [
    'Analyze data sets to find mean, median, mode, standard deviation, and variance for research or reporting',
    'Calculate probability, combinations, permutations, and z-scores for statistical analysis and hypothesis testing',
    'Identify outliers and data distribution patterns to make data-driven decisions in business or research',
  ],
  education: [
    'Calculate semester and cumulative GPA to track academic progress toward graduation requirements',
    'Determine the minimum grade needed on final exams or remaining assignments to achieve a target course grade',
    'Compare weighted vs unweighted GPA and project how future course grades will affect overall standing',
  ],
  physics: [
    'Solve kinematics, force, energy, and momentum problems for homework, exam prep, or engineering design',
    'Calculate work, power, gravitational potential energy, or kinetic energy for mechanical systems analysis',
    'Explore relationships between physical quantities by varying inputs and observing how results change',
  ],
  chemistry: [
    'Calculate molar mass, solution concentrations, and dilution volumes for lab preparation and homework',
    'Determine reaction stoichiometry, limiting reagents, theoretical yields, and percent yields for experiments',
    'Solve gas law problems using PV = nRT and convert between pressure, volume, temperature, and moles',
  ],
  engineering: [
    'Perform preliminary design calculations for beams, circuits, fluid systems, and mechanical components',
    'Verify stress, strain, deflection, power, and efficiency values during the design review process',
    'Quickly compute electrical parameters (voltage, current, resistance, power) using Ohm\'s law and related formulas',
  ],
  everyday: [
    'Calculate tips, split bills, and determine discounts while shopping to manage daily expenses',
    'Budget monthly expenses including utilities, groceries, transportation, and entertainment costs',
    'Compute fuel costs, mileage, or time duration for travel planning and daily scheduling',
  ],
  food: [
    'Scale recipes up or down to match desired serving sizes while maintaining correct ingredient ratios',
    'Calculate nutritional content including calories, protein, carbs, and fat for meal planning and dietary tracking',
    'Convert between cooking measurements (cups, tablespoons, milliliters, grams) for international recipes',
  ],
  biology: [
    'Calculate population growth rates, cell division rates, and generation times from experimental data',
    'Determine allele frequencies, genotype distributions, and Hardy-Weinberg equilibrium in population genetics',
    'Compute body surface area, heart rate zones, and other physiological parameters for health science',
  ],
  ecology: [
    'Estimate personal carbon footprint from energy use, transportation, diet, and consumption patterns',
    'Calculate biodiversity indices (Shannon, Simpson) from species survey data for conservation planning',
    'Model population growth under resource constraints using carrying capacity and logistic growth equations',
  ],
  sports: [
    'Calculate running pace, race finish times, and split strategies for any distance from 100m to marathon',
    'Determine heart rate training zones using the Karvonen formula for optimized workout intensity',
    'Estimate one-rep max, calories burned during exercise, or BMI for fitness assessment and goal setting',
  ],
}

function description(calcName: string, hub: HubCategory): string {
  const hubLabel = hub.charAt(0).toUpperCase() + hub.slice(1)
  switch (hub) {
    case 'financial':
      return `Use the free ${calcName} to compute loan payments, interest costs, and amortization schedules. Plan mortgages, investments, and retirement with accurate financial formulas.`
    case 'health':
      return `Calculate your health metrics with the free ${calcName}. Get instant BMI, BMR, calorie targets, and fitness assessments using clinically validated formulas.`
    case 'math':
      return `Solve math problems instantly with the free ${calcName}. Handle percentages, fractions, roots, exponents, and advanced operations with step-by-step precision.`
    case 'conversion':
      return `Convert units instantly with the free ${calcName}. Accurately transform measurements across length, weight, volume, temperature, and more using international standards.`
    case 'date-time':
      return `Calculate dates and times with the free ${calcName}. Compute age, duration, business days, and deadlines while accounting for leap years and month lengths.`
    case 'construction':
      return `Estimate construction materials and costs with the free ${calcName}. Calculate concrete, lumber, paint, flooring, and roofing quantities for any project.`
    case 'statistics':
      return `Analyze data with the free ${calcName}. Compute mean, median, mode, standard deviation, variance, and probability distributions for any data set.`
    case 'education':
      return `Track academic performance with the free ${calcName}. Calculate GPA, final grades, and target scores using weighted or unweighted grading scales.`
    case 'physics':
      return `Solve physics problems with the free ${calcName}. Apply formulas for force, motion, energy, momentum, and waves with SI or imperial units.`
    case 'chemistry':
      return `Perform chemistry calculations with the free ${calcName}. Compute molar mass, pH, concentration, dilution, and stoichiometry for lab and study.`
    case 'engineering':
      return `Design and analyze with the free ${calcName}. Calculate stress, strain, power, circuit parameters, and fluid dynamics using engineering standards.`
    case 'everyday':
      return `Simplify daily decisions with the free ${calcName}. Calculate tips, discounts, splits, budgets, and fuel costs for practical everyday situations.`
    case 'food':
      return `Cook and eat smarter with the free ${calcName}. Scale recipes, calculate nutrition, convert measurements, and track macros for any meal.`
    case 'biology':
      return `Explore life sciences with the free ${calcName}. Compute growth rates, population parameters, genetic frequencies, and physiological metrics.`
    case 'ecology':
      return `Understand your environmental impact with the free ${calcName}. Calculate carbon footprint, biodiversity indices, and resource consumption metrics.`
    case 'sports':
      return `Optimize athletic performance with the free ${calcName}. Calculate pace, heart rate zones, calories burned, and one-rep max for any sport.`
  }
}

function formulaHint(hub: HubCategory): string {
  return HUB_FORMULAS[hub]
}

function faqs(hub: HubCategory): { question: string; answer: string }[] {
  return HUB_FAQS[hub] || []
}

function useCases(hub: HubCategory): string[] {
  return HUB_USE_CASES[hub] || []
}

export function getTemplateContent(hub: HubCategory | string, calcName: string): TemplateContent {
  const normalizedHub = hub.replace(/-calculators$/, '') as HubCategory
  const validHub: HubCategory = Object.keys(HUB_FORMULAS).includes(normalizedHub) ? normalizedHub : 'everyday'
  return {
    description: description(calcName, validHub),
    formulaHint: formulaHint(validHub),
    faqs: faqs(validHub),
    useCases: useCases(validHub),
  }
}
