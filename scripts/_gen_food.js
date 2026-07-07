const fs = require('fs')
const path = require('path')

const missing = JSON.parse(fs.readFileSync(path.join(__dirname, 'missing_json', 'food_missing.json'), 'utf-8'))
const filePath = path.join(__dirname, '..', 'src', 'components', 'hub-calculators', 'GenericFoodCalculator.tsx')
let content = fs.readFileSync(filePath, 'utf-8')

// Build a map: slug -> entry specs
const specs = {}

function add(key, fields, compute, desc, exampleLbl, exampleVal) {
  specs[key] = { fields, compute, desc, exampleLbl, exampleVal }
}

add('protein-calculator-calc', [
  `{ name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', min: 20, step: '0.1' }`,
  `{ name: 'activity', label: 'Activity Level', type: 'select', options: [{ label: 'Sedentary (0.8)', value: '0.8' }, { label: 'Light (1.0)', value: '1' }, { label: 'Moderate (1.2)', value: '1.2' }, { label: 'Active (1.6)', value: '1.6' }, { label: 'Athlete (2.0)', value: '2' }] }`,
  `{ name: 'goal', label: 'Goal', type: 'select', options: [{ label: 'Maintain', value: '1' }, { label: 'Muscle gain', value: '1.1' }, { label: 'Lose weight', value: '0.9' }] }`,
], `const f = parseFloat(v.activity) || 1.2; const g = parseFloat(v.goal) || 1; const r = v.weight * f * g; return { result: r, label: 'Daily Protein', unit: 'g', steps: [{ label: 'Weight', value: v.weight + ' kg' }, { label: 'Activity factor', value: f + ' g/kg' }, { label: 'Goal adjustment', value: g + 'x' }, { label: 'Recommended', value: r.toFixed(0) + ' g/day' }] }`,
  'Calculate daily protein needs based on body weight, activity level, and fitness goals. Protein supports muscle repair, immune function, and overall health.',
  '70kg, active, muscle gain', '~123g protein/day')

add('carb-calculator-calc', [
  `{ name: 'calories', label: 'Daily Calories', type: 'number', min: 500, step: '50' }`,
  `{ name: 'pct', label: 'Carb % of Calories', type: 'select', options: [{ label: '40% (low carb)', value: '40' }, { label: '45% (moderate)', value: '45' }, { label: '50% (standard)', value: '50' }, { label: '55% (high carb)', value: '55' }, { label: '60% (endurance)', value: '60' }] }`,
], `const carbCal = v.calories * (parseFloat(v.pct) / 100); const r = carbCal / 4; return { result: r, label: 'Total Carbs', unit: 'g', steps: [{ label: 'Calories', value: v.calories + ' kcal' }, { label: 'Carb %', value: v.pct + '%' }, { label: 'Total carbs (4 kcal/g)', value: r.toFixed(0) + ' g' }] }`,
  'Daily carbohydrate needs as percentage of total calories. Carbs provide 4 kcal/g and are the body\'s primary fuel source.',
  '2000 kcal, 50%', '250g carbs/day')

add('fat-intake-calc', [
  `{ name: 'calories', label: 'Daily Calories', type: 'number', min: 500, step: '50' }`,
  `{ name: 'pct', label: 'Fat % of Calories', type: 'select', options: [{ label: '20% (low fat)', value: '20' }, { label: '25% (moderate)', value: '25' }, { label: '30% (standard)', value: '30' }, { label: '35% (high fat)', value: '35' }, { label: '40% (keto)', value: '40' }] }`,
], `const r = v.calories * (parseFloat(v.pct) / 100) / 9; return { result: r, label: 'Daily Fat', unit: 'g', steps: [{ label: 'Calories', value: v.calories + ' kcal' }, { label: 'Fat %', value: v.pct + '%' }, { label: 'Total fat (9 kcal/g)', value: r.toFixed(0) + ' g' }, { label: 'Sat fat (max 35%)', value: (r * 0.35).toFixed(0) + ' g' }] }`,
  'Daily fat requirements based on caloric intake. Fat provides 9 kcal/g and is essential for hormones and nutrient absorption.',
  '2000 kcal, 30% fat', '67g fat/day')

add('fiber-calculator-calc', [
  `{ name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, step: '1' }`,
  `{ name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] }`,
  `{ name: 'calories', label: 'Daily Calories', type: 'number', min: 500, step: '50' }`,
], `const b = v.gender === 'male' ? 30 : 25; const r = Math.max(b, v.calories / 1000 * 14); return { result: r, label: 'Daily Fiber', unit: 'g', steps: [{ label: 'Base', value: b + ' g (' + v.gender + ')' }, { label: 'Calorie-based (14g/1000 kcal)', value: (v.calories / 1000 * 14).toFixed(0) + ' g' }, { label: 'Recommended', value: r.toFixed(0) + ' g/day' }] }`,
  'Daily fiber needs based on age, gender, and caloric intake. Adequate fiber promotes digestive health and reduces disease risk.',
  'Male, 2200 kcal', '31g fiber/day')

add('sugar-intake-calc', [
  `{ name: 'calories', label: 'Daily Calories', type: 'number', min: 500, step: '50' }`,
  `{ name: 'limit', label: 'Guideline', type: 'select', options: [{ label: 'WHO (10% of calories)', value: '10' }, { label: 'AHA (6% — stricter)', value: '6' }, { label: 'WHO ideal (5%)', value: '5' }] }`,
], `const p = parseFloat(v.limit); const r = v.calories * (p / 100) / 4; const tsp = r / 4.2; return { result: r, label: 'Max Added Sugar', unit: 'g', steps: [{ label: 'Calories', value: v.calories + ' kcal' }, { label: 'Guideline', value: p + '%' }, { label: 'Max sugar', value: r.toFixed(0) + ' g (' + tsp.toFixed(1) + ' tsp)' }] }`,
  'Recommended daily sugar limits based on health guidelines. WHO recommends added sugar below 10% of total calories (ideally 5%).',
  '2000 kcal, WHO 10%', '50g sugar/day')

add('sodium-calculator-calc', [
  `{ name: 'meals', label: 'Meals Per Day', type: 'number', min: 1, step: '1' }`,
  `{ name: 'sodiumPerMeal', label: 'Sodium Per Meal', type: 'number', unit: 'mg', min: 0, step: '50' }`,
  `{ name: 'snacks', label: 'Snacks Sodium', type: 'number', unit: 'mg', min: 0, step: '25' }`,
], `const t = v.meals * v.sodiumPerMeal + v.snacks; const l = 2300; const p = (t / l * 100).toFixed(0); return { result: t, label: 'Total Sodium', unit: 'mg', steps: [{ label: 'Meals', value: v.meals + ' x ' + v.sodiumPerMeal + ' mg' }, { label: 'Snacks', value: v.snacks + ' mg' }, { label: 'Total', value: t.toFixed(0) + ' mg (' + p + '% DV)' }, t > l ? { label: 'Over limit', value: 'Reduce by ' + (t - l).toFixed(0) + ' mg' } : { label: 'Within limit', value: (l - t).toFixed(0) + ' mg remaining' }] }`,
  'Track daily sodium against the 2,300 mg limit. High sodium is linked to hypertension and heart disease.',
  '3 meals x 600mg + 200mg snacks', '2,000 mg (87% DV)')

add('potassium-calc', [
  `{ name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', min: 20, step: '0.1' }`,
  `{ name: 'activity', label: 'Activity', type: 'select', options: [{ label: 'Sedentary', value: '1' }, { label: 'Moderate', value: '1.2' }, { label: 'Active', value: '1.4' }, { label: 'Athlete', value: '1.6' }] }`,
], `const r = Math.min(4700, v.weight * 35 * v.activity); return { result: r, label: 'Daily Potassium', unit: 'mg', steps: [{ label: 'Weight', value: v.weight + ' kg' }, { label: 'Base (35 mg/kg)', value: (v.weight * 35).toFixed(0) + ' mg' }, { label: 'Activity multiplier', value: v.activity + 'x' }, { label: 'Recommended', value: r.toFixed(0) + ' mg (max: 4700)' }] }`,
  'Daily potassium needs based on body weight and activity. Potassium supports heart function, muscle contractions, and fluid balance.',
  '70kg, moderate', '~2,940 mg/day')

add('calcium-calculator-calc', [
  `{ name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, step: '1' }`,
  `{ name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Pregnant', value: 'pregnant' }, { label: 'Lactating', value: 'lactating' }] }`,
], `const rda = v.age < 1 ? 200 : v.age < 4 ? 700 : v.age < 9 ? 1000 : v.age < 19 ? 1300 : v.age < 51 ? 1000 : 1200; const adj = v.gender === 'pregnant' ? rda + 200 : v.gender === 'lactating' ? rda + 300 : rda; return { result: adj, label: 'Daily Calcium', unit: 'mg', steps: [{ label: 'Age', value: v.age + ' years' }, { label: 'RDA', value: rda + ' mg' }, { label: 'Adjusted', value: adj + ' mg' }] }`,
  'Daily calcium requirements based on age and life stage. Calcium is essential for bone health, muscle function, and nerve transmission.',
  '30yr female', '1,000 mg/day')

add('iron-intake-calc', [
  `{ name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, step: '1' }`,
  `{ name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female (19-50)', value: 'female' }, { label: 'Female (51+)', value: 'female51' }, { label: 'Pregnant', value: 'pregnant' }] }`,
], `let r = 8; if (v.gender === 'female') r = 18; else if (v.gender === 'female51') r = 8; else if (v.gender === 'pregnant') r = 27; return { result: r, label: 'Daily Iron', unit: 'mg', steps: [{ label: 'Age', value: v.age + ' years' }, { label: 'Life stage', value: v.gender }, { label: 'RDA', value: r + ' mg' }] }`,
  'Daily iron requirements based on age, gender, and life stage. Iron is crucial for oxygen transport and energy metabolism.',
  '30yr female', '18 mg/day')

add('vitamin-d-calc', [
  `{ name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, step: '1' }`,
  `{ name: 'sunExposure', label: 'Sun Exposure', type: 'select', options: [{ label: 'Minimal (<15 min/day)', value: '0.5' }, { label: 'Moderate (15-30 min)', value: '1' }, { label: 'Regular (>30 min)', value: '1.5' }] }`,
  `{ name: 'skin', label: 'Skin Type', type: 'select', options: [{ label: 'Light (I-II)', value: '1' }, { label: 'Medium (III-IV)', value: '0.7' }, { label: 'Dark (V-VI)', value: '0.4' }] }`,
], `const b = v.age < 1 ? 400 : v.age < 70 ? 600 : 800; const adj = Math.round(b * (1.5 - v.sunExposure * v.skin * 0.3)); const r = Math.max(200, Math.min(4000, adj)); return { result: r, label: 'Vitamin D', unit: 'IU/day', steps: [{ label: 'Base RDA', value: b + ' IU' }, { label: 'Sun factor', value: v.sunExposure + 'x' }, { label: 'Skin factor', value: v.skin + 'x' }, { label: 'Recommended', value: r + ' IU/day' }] }`,
  'Daily vitamin D needs based on age, sun exposure, and skin type. Vitamin D is essential for bone health and immune function.',
  '30yr, minimal sun, light skin', '~600 IU/day')

add('vitamin-b12-calc', [
  `{ name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, step: '1' }`,
  `{ name: 'diet', label: 'Diet Type', type: 'select', options: [{ label: 'Omnivore', value: '1' }, { label: 'Vegetarian', value: '1.5' }, { label: 'Vegan', value: '2.5' }] }`,
], `const b = v.age < 1 ? 0.4 : v.age < 4 ? 0.9 : v.age < 9 ? 1.2 : v.age < 14 ? 1.8 : 2.4; const r = b * v.diet; return { result: r, label: 'Vitamin B12', unit: 'mcg/day', steps: [{ label: 'Age RDA', value: b + ' mcg' }, { label: 'Diet adjustment', value: v.diet + 'x' }, { label: 'Recommended', value: r.toFixed(1) + ' mcg/day' }] }`,
  'Vitamin B12 needs based on age and diet. B12 is found naturally in animal products; vegans may need supplementation.',
  '30yr vegan', '6.0 mcg/day')

add('magnesium-calc', [
  `{ name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, step: '1' }`,
  `{ name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] }`,
  `{ name: 'activity', label: 'Activity', type: 'select', options: [{ label: 'Sedentary', value: '1' }, { label: 'Moderate', value: '1.1' }, { label: 'Athlete', value: '1.2' }] }`,
], `const rda = v.gender === 'male' ? 400 : 310; const r = Math.min(420, rda * v.activity); return { result: r, label: 'Daily Magnesium', unit: 'mg', steps: [{ label: 'Gender RDA', value: rda + ' mg' }, { label: 'Activity factor', value: v.activity + 'x' }, { label: 'Recommended', value: r.toFixed(0) + ' mg (max: 420)' }] }`,
  'Daily magnesium needs based on age, gender, and activity. Magnesium supports muscle function, energy production, and bone health.',
  '30yr male, active', '~420 mg/day')

add('zinc-calculator', [
  `{ name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, step: '1' }`,
  `{ name: 'diet', label: 'Diet', type: 'select', options: [{ label: 'Omnivore', value: '1' }, { label: 'Vegetarian/Vegan', value: '1.5' }] }`,
], `const rda = v.age < 1 ? 3 : v.age < 4 ? 3 : v.age < 9 ? 5 : v.age < 14 ? 8 : 11; const r = Math.round(rda * v.diet); return { result: r, label: 'Daily Zinc', unit: 'mg', steps: [{ label: 'Age RDA', value: rda + ' mg' }, { label: 'Diet factor', value: v.diet + 'x' }, { label: 'Recommended', value: r + ' mg' }] }`,
  'Daily zinc requirements based on age and diet. Zinc supports immune function, wound healing, and DNA synthesis.',
  '30yr vegetarian', '16 mg/day')

add('omega3-calculator', [
  `{ name: 'goal', label: 'Health Goal', type: 'select', options: [{ label: 'General (500 mg)', value: '500' }, { label: 'Heart (1000 mg)', value: '1000' }, { label: 'Inflammation (2000 mg)', value: '2000' }, { label: 'Brain (1500 mg)', value: '1500' }] }`,
  `{ name: 'diet', label: 'Diet', type: 'select', options: [{ label: 'Fish 2x/week', value: '0.5' }, { label: 'Fish rarely', value: '0.8' }, { label: 'Vegan', value: '1' }] }`,
], `const b = parseInt(v.goal); const adj = b * v.diet; return { result: adj, label: 'Omega-3 EPA+DHA', unit: 'mg', steps: [{ label: 'Target', value: b + ' mg' }, { label: 'Diet adjustment', value: v.diet + 'x' }, { label: 'Recommended', value: adj.toFixed(0) + ' mg' }, { label: 'Capsules (500 mg each)', value: Math.ceil(adj / 500) + '/day' }] }`,
  'Daily omega-3 (EPA+DHA) needs based on health goals. Supports heart, brain, and joint health.',
  'General, vegan', '500 mg (1 capsule)')

add('water-calculator', [
  `{ name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', min: 20, step: '0.1' }`,
  `{ name: 'activity', label: 'Activity', type: 'select', options: [{ label: 'Sedentary', value: '1' }, { label: 'Lightly active', value: '1.2' }, { label: 'Active', value: '1.4' }, { label: 'Very active', value: '1.6' }] }`,
  `{ name: 'climate', label: 'Climate', type: 'select', options: [{ label: 'Cool', value: '1' }, { label: 'Temperate', value: '1.1' }, { label: 'Hot', value: '1.3' }] }`,
], `const b = v.weight * 0.033; const r = b * v.activity * v.climate; return { result: r, label: 'Daily Water', unit: 'L', steps: [{ label: 'Base (33 mL/kg)', value: b.toFixed(2) + ' L' }, { label: 'Activity', value: v.activity + 'x' }, { label: 'Climate', value: v.climate + 'x' }, { label: 'Total', value: r.toFixed(2) + ' L (' + (r * 4.227).toFixed(1) + ' cups)' }] }`,
  'Daily water needs based on weight, activity, and climate. Proper hydration supports energy and health.',
  '70kg, active, hot climate', '~3.9 L/day')

add('coffee-caffeine-calc', [
  `{ name: 'cups', label: 'Cups', type: 'number', min: 0, step: '0.5' }`,
  `{ name: 'type', label: 'Coffee Type', type: 'select', options: [{ label: 'Drip (95 mg)', value: '95' }, { label: 'Espresso (63 mg)', value: '63' }, { label: 'French press (80 mg)', value: '80' }, { label: 'Cold brew (100 mg)', value: '100' }, { label: 'Instant (60 mg)', value: '60' }] }`,
  `{ name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', min: 20, step: '0.1' }`,
], `const t = v.cups * parseFloat(v.type); const s = v.weight * 6; return { result: t, label: 'Caffeine', unit: 'mg', steps: [{ label: 'Intake', value: v.cups + ' x ' + v.type + ' mg = ' + t.toFixed(0) + ' mg' }, { label: 'Safe limit (6 mg/kg)', value: s.toFixed(0) + ' mg' }, t > s ? { label: 'Over limit', value: 'Reduce by ' + (t - s).toFixed(0) + ' mg' } : { label: 'Within range', value: (s - t).toFixed(0) + ' mg below limit' }] }`,
  'Caffeine intake vs safe limits. Health authorities recommend up to 400 mg/day (6 mg/kg body weight).',
  '3 cups drip coffee, 70kg', '285 mg — within limit')

add('alcohol-calorie-calc', [
  `{ name: 'drinks', label: 'Drinks', type: 'number', min: 0, step: '0.5' }`,
  `{ name: 'type', label: 'Drink Type', type: 'select', options: [{ label: 'Beer 5% (150 kcal)', value: '150' }, { label: 'Wine 12% (125 kcal)', value: '125' }, { label: 'Cocktail (200 kcal)', value: '200' }, { label: 'Spirit 40% (97 kcal)', value: '97' }, { label: 'Light beer (100 kcal)', value: '100' }] }`,
], `const cal = parseFloat(v.type); const t = v.drinks * cal; return { result: t, label: 'Calories from Alcohol', unit: 'kcal', steps: [{ label: 'Drinks', value: v.drinks + ' x ' + cal + ' kcal' }, { label: 'Total calories', value: t.toFixed(0) + ' kcal' }, { label: 'Daily % (2000 kcal)', value: (t / 2000 * 100).toFixed(0) + '%' }] }`,
  'Calories from alcoholic beverages. Alcohol provides 7 kcal/g of empty calories.',
  '3 beers (150 kcal each)', '450 kcal')

add('meal-planner-calc', [
  `{ name: 'mealsPerDay', label: 'Meals Per Day', type: 'number', min: 1, step: '1' }`,
  `{ name: 'days', label: 'Days', type: 'number', min: 1, step: '1' }`,
  `{ name: 'targetCal', label: 'Calories/Meal', type: 'select', options: [{ label: 'Light (400 kcal)', value: '400' }, { label: 'Moderate (500 kcal)', value: '500' }, { label: 'Generous (600 kcal)', value: '600' }] }`,
], `const tm = v.mealsPerDay * v.days; const tc = tm * v.targetCal; return { result: tm, label: 'Total Meals', unit: 'meals', steps: [{ label: 'Per day', value: v.mealsPerDay + ' x ' + v.days + ' days' }, { label: 'Total meals', value: tm + ' meals' }, { label: 'Total calories', value: tc.toFixed(0) + ' kcal' }] }`,
  'Weekly meal planning with calorie targets. Batch cooking saves time and maintains consistent nutrition.',
  '3 meals/day, 7 days, moderate', '21 meals, 10,500 kcal')

add('recipe-scaler', [
  `{ name: 'original', label: 'Original Servings', type: 'number', min: 1, step: '1' }`,
  `{ name: 'desired', label: 'Desired Servings', type: 'number', min: 1, step: '1' }`,
  `{ name: 'ingredient', label: 'Ingredient Amount', type: 'number', min: 0, step: '0.25' }`,
], `const f = v.desired / v.original; const r = v.ingredient * f; return { result: r, label: 'Scaled Amount', unit: 'units', steps: [{ label: 'Original', value: v.original + ' servings' }, { label: 'Desired', value: v.desired + ' servings' }, { label: 'Factor', value: f.toFixed(2) + 'x' }, { label: 'Original amount', value: v.ingredient }, { label: 'Scaled', value: r.toFixed(2) }] }`,
  'Scale recipe ingredient quantities up or down based on desired servings.',
  '4 to 6 servings, 200g flour', '300g (1.5x)')

add('substitution-calc', [
  `{ name: 'ingredient', label: 'Substitution', type: 'select', options: [{ label: 'Butter to oil (0.8x)', value: '0.8' }, { label: 'Sugar to honey (0.75x)', value: '0.75' }, { label: 'Milk to buttermilk (1x)', value: '1' }, { label: 'Flour to almond (0.8x)', value: '0.8' }] }`,
  `{ name: 'amount', label: 'Original Amount', type: 'number', min: 0, step: '0.25' }`,
], `const r = parseFloat(v.ingredient); const result = v.amount * r; return { result, label: 'Substitute Amount', unit: 'units', steps: [{ label: 'Ratio', value: r + 'x' }, { label: 'Original', value: v.amount }, { label: 'Substitute', value: result.toFixed(2) }] }`,
  'Calculate substitute ingredient amounts based on common kitchen conversion ratios.',
  '100g butter to oil (0.8x)', '80g oil')

add('recipe-cost-calc', [
  `{ name: 'totalCost', label: 'Total Cost ($)', type: 'number', min: 0, step: '0.01' }`,
  `{ name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' }`,
  `{ name: 'waste', label: 'Waste %', type: 'select', options: [{ label: '0%', value: '1' }, { label: '5%', value: '0.95' }, { label: '10%', value: '0.9' }, { label: '15%', value: '0.85' }] }`,
], `const es = v.servings * v.waste; const r = v.totalCost / es; return { result: r, label: 'Cost/Serving', unit: '$', steps: [{ label: 'Total cost', value: '$' + v.totalCost.toFixed(2) }, { label: 'Effective servings', value: es.toFixed(1) }, { label: 'Cost per serving', value: '$' + r.toFixed(2) }] }`,
  'Recipe cost per serving with waste adjustment. Account for peels, trimmings, and spoilage.',
  '$30, 4 servings, 10% waste', '$8.33/serving')

add('cost-per-serving', [
  `{ name: 'totalCost', label: 'Total Cost ($)', type: 'number', min: 0, step: '0.01' }`,
  `{ name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' }`,
], `const r = v.totalCost / v.servings; return { result: r, label: 'Cost Per Serving', unit: '$', steps: [{ label: 'Total cost', value: '$' + v.totalCost.toFixed(2) }, { label: 'Servings', value: v.servings }, { label: 'Per serving', value: '$' + r.toFixed(2) }] }`,
  'Quick cost-per-serving for any recipe.',
  '$25, 4 servings', '$6.25/serving')

add('ingredient-substitution', [
  `{ name: 'category', label: 'Category', type: 'select', options: [{ label: 'Dairy (1:1)', value: '1_dairy' }, { label: 'Egg (1:1)', value: '1_egg' }, { label: 'Flour (0.8x)', value: '0.8_flour' }, { label: 'Sweetener (0.75x)', value: '0.75_sweet' }, { label: 'Fat (0.8x)', value: '0.8_fat' }] }`,
  `{ name: 'amount', label: 'Original Amount', type: 'number', min: 0, step: '0.25' }`,
], `const p = v.category.split('_'); const r = parseFloat(p[0]); const result = v.amount * r; return { result, label: 'Substitute Amount', unit: 'units', steps: [{ label: 'Category', value: p.slice(1).join(' ') }, { label: 'Ratio', value: r + 'x' }, { label: 'Substitute', value: result.toFixed(2) }] }`,
  'Ingredient substitutions by category with conversion ratios.',
  '100g sugar (sweetener 0.75x)', '75g honey equivalent')

add('baking-conversion', [
  `{ name: 'amount', label: 'Volume', type: 'number', min: 0, step: '0.25' }`,
  `{ name: 'fromUnit', label: 'From', type: 'select', options: [{ label: 'Cups', value: 'cup' }, { label: 'Tbsp', value: 'tbsp' }, { label: 'Tsp', value: 'tsp' }] }`,
  `{ name: 'ingredient', label: 'Ingredient', type: 'select', options: [{ label: 'Flour (125g/cup)', value: '125' }, { label: 'Sugar (200g/cup)', value: '200' }, { label: 'Brown sugar (220g/cup)', value: '220' }, { label: 'Butter (227g/cup)', value: '227' }, { label: 'Honey (340g/cup)', value: '340' }] }`,
], `const tc = { cup: 1, tbsp: 1/16, tsp: 1/48 }; const cups = v.amount * (tc[v.fromUnit] || 1); const r = cups * parseFloat(v.ingredient); return { result: r, label: 'Weight', unit: 'g', steps: [{ label: 'Volume', value: v.amount + ' ' + v.fromUnit }, { label: 'Density', value: v.ingredient + ' g/cup' }, { label: 'Weight', value: r.toFixed(0) + ' g' }] }`,
  'Baking volume-to-weight conversions. Weighing is more accurate than volume measuring.',
  '2 cups flour', '250g')

add('flour-substitution', [
  `{ name: 'amount', label: 'AP Flour (g)', type: 'number', unit: 'g', min: 10, step: '10' }`,
  `{ name: 'substitute', label: 'Substitute', type: 'select', options: [{ label: 'Whole wheat (1:1)', value: '1_wholewheat' }, { label: 'Almond (0.8x)', value: '0.8_almond' }, { label: 'Coconut (0.3x)', value: '0.3_coconut' }, { label: 'GF blend (1:1)', value: '1_gf' }, { label: 'Oat (1:1)', value: '1_oat' }] }`,
], `const p = v.substitute.split('_'); const r = parseFloat(p[0]); const result = v.amount * r; return { result, label: 'Substitute Flour', unit: 'g', steps: [{ label: 'AP flour', value: v.amount + ' g' }, { label: 'Substitute', value: p.slice(1).join(' ') }, { label: 'Ratio', value: r + 'x' }, { label: 'Need', value: result.toFixed(0) + ' g' }] }`,
  'Convert all-purpose flour to alternatives. Coconut flour needs much less and requires extra eggs.',
  '200g AP to almond flour', '160g almond flour')

add('sugar-substitution', [
  `{ name: 'amount', label: 'Sugar (g)', type: 'number', unit: 'g', min: 5, step: '5' }`,
  `{ name: 'substitute', label: 'Substitute', type: 'select', options: [{ label: 'Honey (0.75x)', value: '0.75' }, { label: 'Maple syrup (0.75x)', value: '0.75' }, { label: 'Stevia (0.002x)', value: '0.002' }, { label: 'Coconut sugar (1:1)', value: '1' }, { label: 'Monk fruit (1:1)', value: '1' }] }`,
], `const r = parseFloat(v.substitute); const result = v.amount * r; return { result, label: 'Substitute', unit: 'g', steps: [{ label: 'Sugar', value: v.amount + ' g' }, { label: 'Ratio', value: r + 'x' }, { label: 'Need', value: result.toFixed(1) + ' ' + (r < 0.1 ? 'units' : 'g') }] }`,
  'Substitute sugar with alternatives. Honey/maple are 75% as sweet; stevia is 500x sweeter.',
  '100g sugar to honey', '75g honey')

add('oil-substitution', [
  `{ name: 'amount', label: 'Oil (mL)', type: 'number', unit: 'mL', min: 5, step: '5' }`,
  `{ name: 'substitute', label: 'Substitute', type: 'select', options: [{ label: 'Butter (1:1 by weight)', value: '1' }, { label: 'Applesauce (0.5x baking)', value: '0.5' }, { label: 'Yogurt (0.5x baking)', value: '0.5' }, { label: 'Avocado (1:1)', value: '1' }] }`,
], `const r = parseFloat(v.substitute); const result = v.amount * r; return { result, label: 'Substitute', unit: 'mL/g', steps: [{ label: 'Oil', value: v.amount + ' mL' }, { label: 'Ratio', value: r + 'x' }, { label: 'Need', value: result.toFixed(0) }] }`,
  'Replace oil with healthier alternatives. Applesauce and yogurt work well in baking at half the amount.',
  '100mL oil to applesauce', '50mL applesauce')

add('dairy-substitution', [
  `{ name: 'amount', label: 'Dairy (mL)', type: 'number', unit: 'mL', min: 10, step: '10' }`,
  `{ name: 'type', label: 'Dairy Type', type: 'select', options: [{ label: 'Milk (1:1 plant milk)', value: 'milk' }, { label: 'Heavy cream (coconut cream)', value: 'cream' }, { label: 'Buttermilk (milk+lemon)', value: 'buttermilk' }, { label: 'Yogurt (plant yogurt)', value: 'yogurt' }] }`,
], `const note = v.type === 'buttermilk' ? 'Add 1 tbsp lemon juice per L' : v.type === 'cream' ? 'Use full-fat coconut cream' : '1:1 swap'; return { result: v.amount, label: 'Substitute', unit: 'mL', steps: [{ label: 'Type', value: v.type }, { label: 'Amount', value: v.amount + ' mL' }, { label: 'Swap', value: '1:1 replacement' }, { label: 'Note', value: note }] }`,
  'Dairy-free alternatives for milk, cream, yogurt, and buttermilk.',
  '250mL milk to oat milk', '250mL oat milk')

add('egg-substitution', [
  `{ name: 'eggs', label: 'Number of Eggs', type: 'number', min: 1, step: '1' }`,
  `{ name: 'substitute', label: 'Substitute', type: 'select', options: [{ label: 'Flax egg (1 tbsp+3 tbsp water)', value: 'flax' }, { label: 'Chia egg (1 tbsp+3 tbsp water)', value: 'chia' }, { label: 'Mashed banana (1/4 cup)', value: 'banana' }, { label: 'Applesauce (1/4 cup)', value: 'apple' }] }`,
], `const info = { flax: '1 tbsp flax + 3 tbsp water', chia: '1 tbsp chia + 3 tbsp water', banana: '1/4 cup mashed banana', apple: '1/4 cup applesauce' }; return { result: v.eggs, label: 'Egg Substitute', unit: 'eggs', steps: [{ label: 'Eggs', value: v.eggs }, { label: 'Substitute', value: v.substitute }, { label: 'Per egg', value: info[v.substitute] }, { label: 'Total', value: 'Mix ' + v.eggs + 'x ' + info[v.substitute] }] }`,
  'Vegan egg alternatives for baking. Flax and chia eggs bind best; banana and applesauce add moisture.',
  '3 eggs to flax eggs', '3 tbsp flax + 9 tbsp water')

add('spice-substitution', [
  `{ name: 'spice', label: 'Spice', type: 'select', options: [{ label: 'Cinnamon (allspice or nutmeg)', value: 'cinnamon' }, { label: 'Paprika (chili powder)', value: 'paprika' }, { label: 'Cumin (coriander)', value: 'cumin' }, { label: 'Nutmeg (mace)', value: 'nutmeg' }, { label: 'Ginger (allspice)', value: 'ginger' }, { label: 'Turmeric (curry powder)', value: 'turmeric' }] }`,
  `{ name: 'amount', label: 'Amount', type: 'number', unit: 'tsp', min: 0.25, step: '0.25' }`,
], `const subs = { cinnamon: 'allspice or nutmeg (1:1)', paprika: 'chili powder (1:1)', cumin: 'ground coriander (1:1)', nutmeg: 'mace (1:1)', ginger: 'allspice (1:1)', turmeric: 'curry powder (1:1)' }; return { result: v.amount, label: 'Substitute', unit: 'tsp', steps: [{ label: 'Spice', value: v.spice }, { label: 'Need', value: v.amount + ' tsp' }, { label: 'Use', value: subs[v.spice] }] }`,
  'Spice substitutions when you\'re missing a specific spice. Most are 1:1 swaps.',
  '1 tsp cinnamon', '1 tsp allspice')

add('herb-substitution', [
  `{ name: 'herb', label: 'Direction', type: 'select', options: [{ label: 'Fresh to dried (3:1)', value: 'fresh' }, { label: 'Dried to fresh (1:3)', value: 'dried' }] }`,
  `{ name: 'amount', label: 'Amount', type: 'number', min: 0.25, step: '0.25', unit: 'tsp' }`,
], `const r = v.herb === 'fresh' ? 1/3 : 3; const result = v.amount * r; const from = v.herb === 'fresh' ? 'Fresh' : 'Dried'; const to = v.herb === 'fresh' ? 'Dried' : 'Fresh'; return { result, label: 'Equivalent', unit: 'tsp', steps: [{ label: from, value: v.amount + ' tsp' }, { label: 'Convert to ' + to, value: result.toFixed(2) + ' tsp' }] }`,
  'Convert fresh herbs to dried (3:1 ratio) and vice versa. Dried herbs are more concentrated.',
  '3 tsp fresh basil', '1 tsp dried basil')

add('salt-substitution', [
  `{ name: 'amount', label: 'Salt Amount', type: 'number', unit: 'tsp', min: 0.25, step: '0.25' }`,
  `{ name: 'type', label: 'Salt Type', type: 'select', options: [{ label: 'Table salt (fine)', value: '1_table' },   { label: 'Kosher (coarse)', value: '0.7_kosher' }, { label: 'Sea salt (fine)', value: '0.85_sea' }, { label: 'Himalayan pink', value: '0.9_himalayan' }, { label: 'Low sodium substitute', value: '1.2_low' }] }`,
], `const p = v.type.split('_'); const f = parseFloat(p[0]); const result = v.amount * f; return { result, label: 'Equivalent', unit: 'tsp', steps: [{ label: 'Original', value: v.amount + ' tsp table salt' }, { label: 'To ' + p.slice(1).join(' '), value: result.toFixed(2) + ' tsp' }] }`,
  'Convert between different salt types. Kosher salt is less dense so you need more by volume.',
  '1 tsp table salt to kosher', '1.43 tsp kosher')

add('gluten-free-flour', [
  `{ name: 'flour', label: 'Total Flour Needed', type: 'number', unit: 'g', min: 50, step: '10' }`,
  `{ name: 'blend', label: 'GF Blend Type', type: 'select', options: [{ label: 'Rice base (60% rice + 30% starch + 10% binder)', value: 'rice' }, { label: 'Almond base (70% almond + 30% starch)', value: 'almond' }, { label: 'Oat base (80% oat + 20% starch)', value: 'oat' }] }`,
], `const r = { rice: { b: 0.6, s: 0.3, x: 0.1 }, almond: { b: 0.7, s: 0.3, x: 0 }, oat: { b: 0.8, s: 0.2, x: 0 } }; const mix = r[v.blend]; const base = v.flour * mix.b; const starch = v.flour * mix.s; const binder = v.flour * mix.x; return { result: v.flour, label: 'GF Flour Blend', unit: 'g', steps: [{ label: 'Total', value: v.flour + ' g' }, { label: 'Base flour', value: base.toFixed(0) + ' g' }, { label: 'Starch', value: starch.toFixed(0) + ' g' }, binder > 0 ? { label: 'Binder (xanthan)', value: binder.toFixed(0) + ' g' } : { label: 'Binder', value: 'Add 1 tsp xanthan per 200g flour' }] }`,
  'Create custom gluten-free flour blends. Rice-based needs xanthan gum; almond-based is more forgiving.',
  '200g rice-based GF blend', '120g rice + 60g starch + 20g binder')

add('yeast-conversion', [
  `{ name: 'amount', label: 'Yeast Amount', type: 'number', min: 0.25, step: '0.25', unit: 'tsp' }`,
  `{ name: 'from', label: 'From', type: 'select', options: [{ label: 'Active dry', value: '1_active' }, { label: 'Instant', value: '0.75_instant' }, { label: 'Fresh', value: '3_fresh' }] }`,
  `{ name: 'to', label: 'To', type: 'select', options: [{ label: 'Active dry', value: '1_active' }, { label: 'Instant', value: '0.75_instant' }, { label: 'Fresh', value: '3_fresh' }] }`,
], `const fp = v.from.split('_'); const tp = v.to.split('_'); const fr = parseFloat(fp[0]); const tr = parseFloat(tp[0]); const r = v.amount * fr / tr; return { result: r, label: 'Converted Yeast', unit: 'tsp', steps: [{ label: 'Original', value: v.amount + ' tsp ' + fp.slice(1).join(' ') }, { label: 'To ' + tp.slice(1).join(' '), value: r.toFixed(2) + ' tsp' }] }`,
  'Convert between active dry, instant, and fresh yeast. 1 tsp active dry = 0.75 tsp instant = 3 tsp fresh.',
  '1 tsp active dry to instant', '0.75 tsp instant')

add('sourdough-starter', [
  `{ name: 'starter', label: 'Existing Starter', type: 'number', unit: 'g', min: 10, step: '5' }`,
  `{ name: 'ratio', label: 'Feeding Ratio', type: 'select', options: [{ label: '1:1:1 (daily)', value: '1' }, { label: '1:2:2 (building)', value: '2' }, { label: '1:3:3 (large batch)', value: '3' }, { label: '1:5:5 (fridge)', value: '5' }] }`,
], `const r = parseFloat(v.ratio); const flour = v.starter * r; const water = v.starter * r; const total = v.starter + flour + water; return { result: total, label: 'Fed Starter', unit: 'g', steps: [{ label: 'Keep starter', value: v.starter + ' g' }, { label: 'Add flour', value: flour + ' g' }, { label: 'Add water', value: water + ' g' }, { label: 'Total', value: total + ' g' }, { label: 'Discard', value: 'Keep ' + v.starter + ' g, discard ' + (total - v.starter) + ' g' }] }`,
  'Sourdough starter feeding. 1:1:1 is daily maintenance; higher ratios build more for baking.',
  '50g starter, 1:2:2 ratio', 'Add 100g flour + 100g water = 250g')

add('sourdough-hydration', [
  `{ name: 'flour', label: 'Flour', type: 'number', unit: 'g', min: 50, step: '10' }`,
  `{ name: 'water', label: 'Water', type: 'number', unit: 'g', min: 30, step: '5' }`,
  `{ name: 'starterPct', label: 'Starter %', type: 'select', options: [{ label: '20% (long ferment)', value: '20' }, { label: '30% (standard)', value: '30' }, { label: '40% (quick rise)', value: '40' }] }`,
], `const h = v.water / v.flour * 100; const s = v.flour * (parseFloat(v.starterPct) / 100); const tf = v.flour + s * 0.5; const tw = v.water + s * 0.5; const th = tw / tf * 100; return { result: h, label: 'Hydration', unit: '%', steps: [{ label: 'Added', value: v.flour + ' g flour + ' + v.water + ' g water = ' + h.toFixed(0) + '%' }, { label: 'Starter', value: s.toFixed(0) + ' g (' + v.starterPct + '%)' }, { label: 'True hydration', value: th.toFixed(0) + '%' }] }`,
  'Dough hydration including starter contribution. Higher hydration yields more open crumb.',
  '500g flour, 375g water, 30% starter', '75% hydration')

add('baker-percentage', [
  `{ name: 'flour', label: 'Total Flour', type: 'number', unit: 'g', min: 100, step: '10' }`,
  `{ name: 'waterPct', label: 'Water %', type: 'number', min: 50, max: 100, step: '1', unit: '%' }`,
  `{ name: 'saltPct', label: 'Salt %', type: 'number', min: 1, max: 3, step: '0.1', unit: '%' }`,
  `{ name: 'yeastPct', label: 'Yeast %', type: 'number', min: 0.1, max: 3, step: '0.1', unit: '%' }`,
], `const w = v.flour * v.waterPct / 100; const sa = v.flour * v.saltPct / 100; const y = v.flour * v.yeastPct / 100; const t = v.flour + w + sa + y; return { result: t, label: 'Total Dough', unit: 'g', steps: [{ label: 'Flour (100%)', value: v.flour + ' g' }, { label: 'Water (' + v.waterPct + '%)', value: w.toFixed(0) + ' g' }, { label: 'Salt (' + v.saltPct + '%)', value: sa.toFixed(1) + ' g' }, { label: 'Yeast (' + v.yeastPct + '%)', value: y.toFixed(1) + ' g' }, { label: 'Total dough', value: t.toFixed(0) + ' g' }] }`,
  'Baker\'s percentage calculations. Flour is always 100%; other ingredients are % of flour weight.',
  '1000g flour, 70% water, 2% salt, 1% yeast', '1,730g dough')

add('dough-hydration', [
  `{ name: 'flour', label: 'Flour', type: 'number', unit: 'g', min: 50, step: '10' }`,
  `{ name: 'water', label: 'Water', type: 'number', unit: 'g', min: 30, step: '5' }`,
], `const h = v.water / v.flour * 100; return { result: h, label: 'Hydration', unit: '%', steps: [{ label: 'Flour', value: v.flour + ' g' }, { label: 'Water', value: v.water + ' g' }, { label: 'Hydration', value: h.toFixed(0) + '%' }, { label: 'Feel', value: h < 60 ? 'Firm' : h < 70 ? 'Standard' : h < 80 ? 'High (sticky)' : 'Very high (very sticky)' }] }`,
  'Dough hydration = water weight / flour weight x 100. Higher hydration = more open crumb.',
  '500g flour, 350g water', '70% hydration')

add('bread-flour-ratio', [
  `{ name: 'flour', label: 'Flour', type: 'number', unit: 'g', min: 100, step: '10' }`,
  `{ name: 'breadType', label: 'Bread Type', type: 'select', options: [{ label: 'Sandwich (65%, 2% salt, 1% yeast)', value: '65_2_1' }, { label: 'Artisan (75%, 2% salt, 0.5% yeast)', value: '75_2_0.5' }, { label: 'Whole wheat (70%, 2%, 1.5%)', value: '70_2_1.5' }, { label: 'Focaccia (80%, 2.5%, 1%)', value: '80_2.5_1' }, { label: 'Bagels (55%, 2%, 1%)', value: '55_2_1' }] }`,
], `const p = v.breadType.split('_').map(Number); const w = v.flour * p[0] / 100; const sa = v.flour * p[1] / 100; const y = v.flour * p[2] / 100; const t = v.flour + w + sa + y; return { result: t, label: 'Total Dough', unit: 'g', steps: [{ label: 'Flour', value: v.flour + ' g' }, { label: 'Water (' + p[0] + '%)', value: w.toFixed(0) + ' g' }, { label: 'Salt (' + p[1] + '%)', value: sa.toFixed(1) + ' g' }, { label: 'Yeast (' + p[2] + '%)', value: y.toFixed(2) + ' g' }, { label: 'Total', value: t.toFixed(0) + ' g' }] }`,
  'Bread ingredient ratios for popular styles. Bagels are low hydration; focaccia is high hydration.',
  '500g flour, artisan boule', '~887g dough')

add('pizza-dough-calc', [
  `{ name: 'pizzas', label: 'Number of Pizzas', type: 'number', min: 1, step: '1' }`,
  `{ name: 'size', label: 'Pizza Size', type: 'select', options: [{ label: '10" (200g ball)', value: '200' }, { label: '12" (300g ball)', value: '300' }, { label: '14" (400g ball)', value: '400' }, { label: '16" (550g ball)', value: '550' }] }`,
  `{ name: 'hydration', label: 'Hydration', type: 'select', options: [{ label: '60% (firm)', value: '60' }, { label: '65% (standard)', value: '65' }, { label: '70% (airy)', value: '70' }] }`,
], `const db = parseInt(v.size); const td = v.pizzas * db; const fl = td / (1 + parseFloat(v.hydration)/100 + 0.02 + 0.006); const wa = fl * parseFloat(v.hydration)/100; const sa = fl * 0.02; const ye = fl * 0.006; return { result: td, label: 'Total Dough', unit: 'g', steps: [{ label: 'Pizzas', value: v.pizzas + ' x ' + db + 'g' }, { label: 'Flour', value: fl.toFixed(0) + ' g' }, { label: 'Water (' + v.hydration + '%)', value: wa.toFixed(0) + ' g' }, { label: 'Salt (2%)', value: sa.toFixed(1) + ' g' }, { label: 'Yeast (0.6%)', value: ye.toFixed(1) + ' g' }] }`,
  'Pizza dough by baker\'s percentages. Higher hydration = lighter, airier crust.',
  '2 x 12" pizzas, 65% hydration', '600g dough')

add('pasta-serving', [
  `{ name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' }`,
  `{ name: 'type', label: 'Type', type: 'select', options: [{ label: 'Dry main (100g)', value: '100' }, { label: 'Fresh (150g)', value: '150' }, { label: 'Dry side (50g)', value: '50' }] }`,
], `const r = v.servings * v.type; return { result: r, label: 'Pasta Needed', unit: 'g', steps: [{ label: 'Servings', value: v.servings }, { label: 'Per serving', value: v.type + ' g' }, { label: 'Total', value: r + ' g' }] }`,
  'Pasta quantities by serving. 100g dry per main serving, 50g for sides.',
  '4 servings dry pasta', '400g')

add('rice-serving', [
  `{ name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' }`,
  `{ name: 'type', label: 'Rice Type', type: 'select', options: [{ label: 'White (75g dry)', value: '75' }, { label: 'Brown (65g dry)', value: '65' }, { label: 'Basmati (70g dry)', value: '70' }, { label: 'Sushi (80g dry)', value: '80' }] }`,
], `const dry = v.servings * v.type; const cooked = dry * 3; return { result: dry, label: 'Dry Rice', unit: 'g', steps: [{ label: 'Servings', value: v.servings }, { label: 'Per serving', value: v.type + ' g dry' }, { label: 'Total dry', value: dry + ' g' }, { label: 'Cooked yield', value: cooked + ' g' }] }`,
  'Rice quantities. Rice triples in volume when cooked. 75g dry white = ~200g cooked.',
  '4 servings white rice', '300g dry (~900g cooked)')

add('rice-water-ratio', [
  `{ name: 'rice', label: 'Rice Amount', type: 'number', unit: 'g', min: 50, step: '10' }`,
  `{ name: 'type', label: 'Rice Variety', type: 'select', options: [{ label: 'White (1:1.5)', value: '1.5' }, { label: 'Brown (1:2)', value: '2' }, { label: 'Jasmine (1:1.25)', value: '1.25' }, { label: 'Basmati (1:1.5)', value: '1.5' }, { label: 'Sushi (1:1.1)', value: '1.1' }, { label: 'Wild (1:3)', value: '3' }] }`,
], `const r = parseFloat(v.type); const water = v.rice * r; return { result: water, label: 'Water Needed', unit: 'mL', steps: [{ label: 'Rice', value: v.rice + ' g' }, { label: 'Ratio', value: '1:' + r }, { label: 'Water', value: water.toFixed(0) + ' mL' }, { label: 'Cook', value: r > 2 ? '40-50 min' : r > 1.5 ? '18-20 min' : '12-15 min' }] }`,
  'Perfect rice-to-water ratios. White 1:1.5, brown 1:2, sushi 1:1.1.',
  '200g jasmine rice', '250mL water')

add('quinoa-cooking', [
  `{ name: 'quinoa', label: 'Quinoa Per Serving', type: 'number', unit: 'g', min: 30, step: '10' }`,
  `{ name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' }`,
], `const tq = v.quinoa * v.servings; const water = tq * 2; const cooked = tq * 3; return { result: tq, label: 'Dry Quinoa', unit: 'g', steps: [{ label: 'Per serving', value: v.quinoa + ' g' }, { label: 'Servings', value: v.servings }, { label: 'Total dry', value: tq + ' g' }, { label: 'Water (2:1)', value: water + ' mL' }, { label: 'Cooked yield', value: cooked + ' g' }, { label: 'Time', value: '15-20 min + 5 min rest' }] }`,
  'Quinoa cooking: 2:1 water-to-grain ratio, 15-20 min cook time.',
  '2 servings (75g each)', '150g dry + 300mL water')

add('oatmeal-ratio', [
  `{ name: 'oats', label: 'Oats', type: 'number', unit: 'g', min: 20, step: '10' }`,
  `{ name: 'type', label: 'Oat Type', type: 'select', options: [{ label: 'Rolled (1:2 liquid)', value: '2' }, { label: 'Steel-cut (1:3 liquid)', value: '3' }, { label: 'Quick (1:1.5 liquid)', value: '1.5' }] }`,
  `{ name: 'liquid', label: 'Liquid', type: 'select', options: [{ label: 'Water', value: 'water' }, { label: 'Milk', value: 'milk' }] }`,
], `const r = parseFloat(v.type); const l = v.oats * r; const cooked = v.oats + l; return { result: l, label: 'Liquid Needed', unit: 'mL', steps: [{ label: 'Oats', value: v.oats + ' g' }, { label: 'Ratio 1:' + r, value: l.toFixed(0) + ' mL' }, { label: 'Cooked weight', value: cooked.toFixed(0) + ' g' }, { label: 'Cook time', value: r > 2.5 ? '20-30 min' : r > 1.7 ? '5-10 min' : '1-3 min' }] }`,
  'Oatmeal ratios: rolled 1:2, steel-cut 1:3, quick 1:1.5.',
  '40g rolled oats with milk', '80mL milk, cook 5-10 min')

add('chicken-temp', [
  `{ name: 'cut', label: 'Chicken Cut', type: 'select', options: [{ label: 'Whole (74°C breast)', value: '45_74_whole' }, { label: 'Breast (74°C)', value: '20_74_breast' }, { label: 'Thigh (82°C)', value: '35_82_thigh' }, { label: 'Ground (74°C)', value: '15_74_ground' }] }`,
  `{ name: 'weight', label: 'Weight', type: 'number', unit: 'g', min: 100, step: '50' }`,
], `const p = v.cut.split('_'); const mp500 = parseFloat(p[0]); const tc = parseFloat(p[1]); const tf = tc * 9/5 + 32; const time = (v.weight / 500) * mp500; return { result: tc, label: 'Target Temp', unit: '°C', steps: [{ label: 'Cut', value: p.slice(2).join(' ') }, { label: 'Temp', value: tc + '°C / ' + tf.toFixed(0) + '°F' }, { label: 'Weight', value: v.weight + ' g' }, { label: 'Cook time', value: time.toFixed(0) + ' min' }, { label: 'Rest', value: 'Rest 5-10 min' }] }`,
  'Safe internal chicken temperatures. USDA: 74°C (165°F) for all poultry.',
  'Whole 2kg chicken', '74°C breast, ~90 min')

add('beef-temp', [
  `{ name: 'doneness', label: 'Doneness', type: 'select', options: [{ label: 'Rare (52°C)', value: '52' }, { label: 'Medium-rare (57°C)', value: '57' }, { label: 'Medium (63°C)', value: '63' }, { label: 'Medium-well (68°C)', value: '68' }, { label: 'Well done (74°C)', value: '74' }] }`,
  `{ name: 'cut', label: 'Cut', type: 'select', options: [{ label: 'Steak (2.5cm)', value: '6' }, { label: 'Roast', value: '20' }] }`,
  `{ name: 'weight', label: 'Weight', type: 'number', unit: 'g', min: 100, step: '50' }`,
], `const tc = parseFloat(v.doneness); const tf = tc * 9/5 + 32; const mp500 = parseFloat(v.cut); const time = (v.weight / 500) * mp500; return { result: tc, label: 'Target Temp', unit: '°C', steps: [{ label: 'Doneness', value: tc + '°C / ' + tf.toFixed(0) + '°F' }, { label: 'Weight', value: v.weight + ' g' }, { label: 'Cook time', value: time.toFixed(1) + ' min' }, { label: 'Rest', value: '5-10 min' }] }`,
  'Beef doneness temperatures. USDA: 63°C (145°F) for whole cuts with rest.',
  '300g steak, medium-rare', '57°C (135°F), ~4 min')

add('pork-temp', [
  `{ name: 'doneness', label: 'Doneness', type: 'select', options: [{ label: 'Medium (63°C / 145°F)', value: '63' }, { label: 'Well done (71°C / 160°F)', value: '71' }] }`,
  `{ name: 'cut', label: 'Cut', type: 'select', options: [{ label: 'Chops (2.5cm)', value: '8' }, { label: 'Roast', value: '25' }, { label: 'Ground', value: '15' }] }`,
  `{ name: 'weight', label: 'Weight', type: 'number', unit: 'g', min: 100, step: '50' }`,
], `const tc = parseFloat(v.doneness); const tf = tc * 9/5 + 32; const mp500 = parseFloat(v.cut); const time = (v.weight / 500) * mp500; return { result: tc, label: 'Target Temp', unit: '°C', steps: [{ label: 'Doneness', value: tc + '°C / ' + tf.toFixed(0) + '°F' }, { label: 'Weight', value: v.weight + ' g' }, { label: 'Cook time', value: time.toFixed(0) + ' min' }, { label: 'Rest', value: '3 min (chops) or 10 min (roast)' }] }`,
  'Pork temperatures. USDA: 63°C (145°F) with 3 min rest. Ground pork: 71°C (160°F).',
  '200g pork chop, medium', '63°C (145°F), ~3 min')

add('fish-temp', [
  `{ name: 'type', label: 'Fish Type', type: 'select', options: [{ label: 'White fish (63°C / 145°F)', value: '63_white' }, { label: 'Salmon (52-57°C / 125-135°F)', value: '57_salmon' }, { label: 'Tuna rare (47°C / 115°F)', value: '47_tuna' }, { label: 'Shellfish (63°C / 145°F)', value: '63_shellfish' }] }`,
  `{ name: 'thickness', label: 'Thickness', type: 'select', options: [{ label: '1 cm (thin)', value: '1' }, { label: '2.5 cm (med)', value: '2.5' }, { label: '4 cm+ (thick)', value: '4' }] }`,
], `const p = v.type.split('_'); const tc = parseFloat(p[0]); const tf = tc * 9/5 + 32; const time = parseFloat(v.thickness) * 6; return { result: tc, label: 'Target Temp', unit: '°C', steps: [{ label: 'Fish', value: p.slice(1).join(' ') }, { label: 'Temp', value: tc + '°C / ' + tf.toFixed(0) + '°F' }, { label: 'Thickness', value: v.thickness + ' cm' }, { label: 'Cook time', value: time.toFixed(0) + ' min' }, { label: 'Test', value: 'Flakes easily with fork' }] }`,
  'Fish cooking temperatures. Salmon is best at medium (52-57°C); white fish at 63°C.',
  '2.5cm salmon fillet', '57°C (135°F), ~15 min')

add('turkey-temp', [
  `{ name: 'weight', label: 'Turkey Weight', type: 'number', unit: 'kg', min: 2, step: '0.5' }`,
  `{ name: 'stuffing', label: 'Stuffing', type: 'select', options: [{ label: 'Unstuffed', value: '0' }, { label: 'Stuffed', value: '15' }] }`,
], `const extra = parseFloat(v.stuffing); const totalMin = v.weight * 13 + extra; return { result: totalMin, label: 'Roast Time', unit: 'min', steps: [{ label: 'Weight', value: v.weight + ' kg' }, { label: 'Base (13 min/kg)', value: (v.weight * 13).toFixed(0) + ' min' }, { label: extra > 0 ? 'Stuffed +15 min' : 'Unstuffed', value: extra > 0 ? '+15 min' : 'No adjustment' }, { label: 'Total', value: totalMin.toFixed(0) + ' min (~' + (totalMin/60).toFixed(1) + ' hrs)' }, { label: 'Target temp', value: '74°C (165°F) in thigh' }] }`,
  'Turkey roasting times. 13 min/kg unstuffed. Cook to 74°C (165°F) in the thigh.',
  '5kg turkey, unstuffed', '~65 min (~1.1 hrs)')

add('oven-cooking-time', [
  `{ name: 'weight', label: 'Food Weight', type: 'number', unit: 'g', min: 100, step: '50' }`,
  `{ name: 'type', label: 'Food Type', type: 'select', options: [{ label: 'Whole chicken (45 min/kg + 20)', value: '45_20' }, { label: 'Beef roast (30 min/kg + 15)', value: '30_15' }, { label: 'Pork roast (35 min/kg + 25)', value: '35_25' }, { label: 'Veggies (25 min at 200°C)', value: '25_0' }, { label: 'Fish (10 min at 200°C)', value: '10_0' }] }`,
], `const p = v.type.split('_'); const mpkg = parseFloat(p[0]); const extra = parseFloat(p[1]); const mins = (v.weight / 1000) * mpkg + extra; return { result: mins, label: 'Oven Time', unit: 'min', steps: [{ label: 'Weight', value: (v.weight / 1000).toFixed(2) + ' kg' }, { label: 'Base rate', value: mpkg + ' min/kg' }, { label: 'Extra', value: extra > 0 ? extra + ' min' : 'none' }, { label: 'Total', value: mins.toFixed(0) + ' min' }] }`,
  'Oven cooking times by food weight and type. Always use a meat thermometer.',
  '2kg whole chicken', '~110 min')

add('convection-conversion', [
  `{ name: 'temp', label: 'Conventional Temp', type: 'number', unit: '°C', min: 100, step: '5' }`,
  `{ name: 'time', label: 'Conventional Time', type: 'number', unit: 'min', min: 5, step: '5' }`,
], `const ct = v.temp - 20; const ctm = Math.round(v.time * 0.75); return { result: ct, label: 'Convection Temp', unit: '°C', steps: [{ label: 'Conventional', value: v.temp + '°C for ' + v.time + ' min' }, { label: 'Convection', value: ct + '°C for ' + ctm + ' min' }, { label: 'Savings', value: '-20°C, -25% time' }] }`,
  'Convert conventional to convection (fan-forced). Reduce temp 20°C and time 25%.',
  '180°C for 60 min', '160°C for 45 min')

add('air-fryer-conversion', [
  `{ name: 'temp', label: 'Oven Temp', type: 'number', unit: '°C', min: 100, step: '5' }`,
  `{ name: 'time', label: 'Oven Time', type: 'number', unit: 'min', min: 5, step: '5' }`,
], `const at = v.temp - 20; const atm = Math.round(v.time * 0.75); return { result: at, label: 'Air Fryer Temp', unit: '°C', steps: [{ label: 'Oven', value: v.temp + '°C for ' + v.time + ' min' }, { label: 'Air fryer', value: at + '°C for ' + atm + ' min' }] }`,
  'Convert oven recipes to air fryer. Reduce temp 20°C and time 25%.',
  '200°C for 20 min', '180°C for 15 min')

add('slow-cooker-conversion', [
  `{ name: 'ovenTime', label: 'Oven Time', type: 'number', unit: 'min', min: 15, step: '5' }`,
  `{ name: 'ovenTemp', label: 'Oven Temp', type: 'select', options: [{ label: '160-180°C (standard)', value: 'standard' }, { label: '190-220°C (hot)', value: 'hot' }] }`,
], `const hrs = v.ovenTime / 60; const low = v.ovenTemp === 'standard' ? Math.round(hrs * 4) : Math.round(hrs * 6); const high = v.ovenTemp === 'standard' ? Math.round(hrs * 2) : Math.round(hrs * 3); return { result: low, label: 'Slow Cooker LOW', unit: 'hrs', steps: [{ label: 'Oven', value: Math.round(hrs * 10)/10 + ' hrs' }, { label: 'LOW', value: low + ' hrs' }, { label: 'HIGH', value: high + ' hrs' }] }`,
  'Convert oven to slow cooker. 1 hr oven ≈ 4 hrs LOW or 2 hrs HIGH.',
  '1 hr oven roast', '4 hrs LOW or 2 hrs HIGH')

add('pressure-cooker-time', [
  `{ name: 'food', label: 'Food Type', type: 'select', options: [{ label: 'Chicken breast (8-12 min)', value: '10' }, { label: 'Beef stew (20-25 min)', value: '22' }, { label: 'Pork shoulder (40-50 min)', value: '45' }, { label: 'Potatoes (10-15 min)', value: '12' }, { label: 'White rice (3-5 min)', value: '4' }, { label: 'Dried beans (25-40 min)', value: '30' }, { label: 'Stock/broth (30-45 min)', value: '35' }] }`,
  `{ name: 'weight', label: 'Weight', type: 'number', unit: 'g', min: 100, step: '50' }`,
], `const bm = parseInt(v.food); const adj = Math.round(bm + (v.weight - 500) / 500 * 5); const r = Math.max(bm, adj); return { result: r, label: 'Pressure Cook Time', unit: 'min', steps: [{ label: 'Food', value: bm + ' min base' }, { label: 'Weight', value: v.weight + ' g' }, { label: 'Adjusted', value: r + ' min HIGH' }, { label: 'Release', value: 'Natural for meats/beans, Quick for veg/rice' }] }`,
  'Instant Pot/pressure cooker times. Natural release for meats; quick release for vegetables.',
  '1kg beef stew', '~27 min high pressure')

add('microwave-cooking', [
  `{ name: 'food', label: 'Food Type', type: 'select', options: [{ label: 'Reheat (2-3 min/cup)', value: '2.5' }, { label: 'Vegetables (4-6 min/cup)', value: '5' }, { label: 'Rice (15-20 min)', value: '17' }, { label: 'Potato (8-12 min)', value: '10' }, { label: 'Fish (3-5 min)', value: '4' }] }`,
  `{ name: 'amount', label: 'Servings/Cups', type: 'number', min: 1, step: '0.5' }`,
  `{ name: 'power', label: 'Power', type: 'select', options: [{ label: '700W', value: '1.3' }, { label: '900W', value: '1' }, { label: '1200W', value: '0.85' }] }`,
], `const b = parseFloat(v.food); const t = b * v.amount * v.power; return { result: t, label: 'Microwave Time', unit: 'min', steps: [{ label: 'Base', value: b + ' min per serving' }, { label: 'Amount', value: v.amount }, { label: 'Power adj', value: v.power + 'x' }, { label: 'Total', value: t.toFixed(1) + ' min' }] }`,
  'Microwave times adjusted for wattage. Stir halfway and let stand 1-2 min.',
  '2 cups veggies at 900W', '10 min')

add('grill-temperature', [
  `{ name: 'method', label: 'Method', type: 'select', options: [{ label: 'Direct heat', value: 'direct' }, { label: 'Indirect heat', value: 'indirect' }, { label: 'Two-zone', value: 'twozone' }] }`,
  `{ name: 'target', label: 'Heat Level', type: 'select', options: [{ label: 'High (230-290°C)', value: '230' }, { label: 'Med-high (200-230°C)', value: '200' }, { label: 'Medium (175-200°C)', value: '175' }, { label: 'Med-low (150-175°C)', value: '150' }, { label: 'Low (120-150°C)', value: '120' }] }`,
], `const uses = { direct: 'Steaks, chops, burgers', indirect: 'Whole chicken, roasts', twozone: 'Sear then indirect' }; return { result: parseInt(v.target), label: 'Grill Temp', unit: '°C', steps: [{ label: 'Method', value: v.method }, { label: 'Temp range', value: v.target + '-' + (parseInt(v.target) + 30) + '°C' }, { label: 'Best for', value: uses[v.method] || 'Various' }] }`,
  'Grill temperatures by method. Direct for quick-cooking; indirect for larger cuts.',
  'Steak, direct high heat', '230-290°C')

add('smoker-time', [
  `{ name: 'meat', label: 'Meat Type', type: 'select', options: [{ label: 'Brisket (1.5 hrs/kg at 110°C)', value: '1.5_93_brisket' }, { label: 'Pork shoulder (1.5 hrs/kg)', value: '1.5_93_pork' }, { label: 'Ribs (5-6 hrs at 110°C)', value: '5.5_93_ribs' }, { label: 'Chicken (40 min/kg at 135°C)', value: '0.67_74_chicken' }, { label: 'Fish (1 hr at 100°C)', value: '1_63_fish' }] }`,
  `{ name: 'weight', label: 'Weight', type: 'number', unit: 'kg', min: 0.5, step: '0.5' }`,
], `const p = v.meat.split('_'); const hpk = parseFloat(p[0]); const tc = parseFloat(p[1]); const isFixed = v.meat.includes('ribs') || v.meat.includes('fish'); const th = isFixed ? hpk : hpk * v.weight; return { result: th * 60, label: 'Smoke Time', unit: 'min', steps: [{ label: 'Meat', value: p.slice(2).join(' ') }, { label: 'Weight', value: isFixed ? 'Fixed' : v.weight + ' kg' }, { label: 'Time', value: th.toFixed(1) + ' hrs (' + (th * 60).toFixed(0) + ' min)' }, { label: 'Target temp', value: tc + '°C' }] }`,
  'Smoking times at 110°C (225°F). Wrap in foil at the stall (~70°C internal).',
  '5kg brisket', '~7.5 hrs at 110°C')

add('marinade-calc', [
  `{ name: 'meatWeight', label: 'Meat Weight', type: 'number', unit: 'g', min: 100, step: '50' }`,
  `{ name: 'intensity', label: 'Intensity', type: 'select', options: [{ label: 'Light (30%)', value: '0.3' }, { label: 'Medium (50%)', value: '0.5' }, { label: 'Generous (75%)', value: '0.75' }, { label: 'Full (100%)', value: '1' }] }`,
], `const t = v.meatWeight * v.intensity; const oil = t * 0.5; const acid = t * 0.25; const seas = t * 0.25; return { result: t, label: 'Total Marinade', unit: 'g', steps: [{ label: 'Meat', value: v.meatWeight + ' g' }, { label: 'Total', value: t.toFixed(0) + ' g' }, { label: 'Oil (50%)', value: oil.toFixed(0) + ' g' }, { label: 'Acid (25%)', value: acid.toFixed(0) + ' g' }, { label: 'Seasoning (25%)', value: seas.toFixed(0) + ' g' }] }`,
  'Marinade: 50% oil, 25% acid, 25% seasonings. Marinate 30 min (fish) to 12 hrs (beef).',
  '500g chicken, medium (50%)', '250g total marinade')

add('brine-calc', [
  `{ name: 'water', label: 'Water Volume', type: 'number', unit: 'L', min: 0.5, step: '0.5' }`,
  `{ name: 'type', label: 'Brine Strength', type: 'select', options: [{ label: 'Light (3% salt)', value: '3' }, { label: 'Standard (5% salt)', value: '5' }, { label: 'Strong (8% salt)', value: '8' }] }`,
  `{ name: 'sugar', label: 'Add Sugar?', type: 'select', options: [{ label: 'Yes (equal parts)', value: 'yes' }, { label: 'No', value: 'no' }] }`,
], `const sp = parseFloat(v.type); const s = v.water * 1000 * sp / 100; const su = v.sugar === 'yes' ? s : 0; return { result: s, label: 'Salt Needed', unit: 'g', steps: [{ label: 'Water', value: v.water + ' L' }, { label: sp + '% salt', value: s.toFixed(0) + ' g' }, su > 0 ? { label: 'Sugar', value: su.toFixed(0) + ' g' } : { label: 'Sugar', value: 'None' }] }`,
  'Brine percentages: 5% standard, 3% light, 8% strong. Dissolve fully before adding meat.',
  '2L water, 5% brine with sugar', '100g salt + 100g sugar')

add('rub-calc', [
  `{ name: 'meatWeight', label: 'Meat Weight', type: 'number', unit: 'g', min: 200, step: '100' }`,
  `{ name: 'intensity', label: 'Intensity', type: 'select', options: [{ label: 'Light (1 tbsp/500g)', value: '1' }, { label: 'Medium (1.5 tbsp/500g)', value: '1.5' }, { label: 'Heavy (2 tbsp/500g)', value: '2' }] }`,
], `const tbsp = (v.meatWeight / 500) * v.intensity; const g = tbsp * 15; return { result: g, label: 'Total Rub', unit: 'g', steps: [{ label: 'Meat', value: v.meatWeight + ' g' }, { label: 'Intensity', value: v.intensity + ' tbsp/500g' }, { label: 'Total', value: g.toFixed(0) + ' g (' + tbsp.toFixed(1) + ' tbsp)' }] }`,
  'Dry rub quantities. Standard mix: 1 part salt + 1 part pepper + spices. Apply 30-60 min before cooking.',
  '2kg brisket, medium', '~60g (6 tbsp) rub')

add('sauce-calc', [
  `{ name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' }`,
  `{ name: 'type', label: 'Sauce Type', type: 'select', options: [{ label: 'Pan sauce (60 mL/serving)', value: '60' }, { label: 'Pasta sauce (120 mL/serving)', value: '120' }, { label: 'Dipping (30 mL/serving)', value: '30' }, { label: 'Gravy (80 mL/serving)', value: '80' }] }`,
], `const t = v.servings * v.type; return { result: t, label: 'Total Sauce', unit: 'mL', steps: [{ label: 'Servings', value: v.servings }, { label: 'Per serving', value: v.type + ' mL' }, { label: 'Total', value: t + ' mL (' + (t / 250).toFixed(2) + ' cups)' }] }`,
  'Sauce quantities by type. Pasta sauce 120 mL/serving, pan sauce 60 mL, dipping 30 mL.',
  '4 servings pasta sauce', '480 mL')

add('portion-scaling', [
  `{ name: 'originalServings', label: 'Original Servings', type: 'number', min: 1, step: '1' }`,
  `{ name: 'desiredServings', label: 'Desired Servings', type: 'number', min: 1, step: '1' }`,
], `const f = v.desiredServings / v.originalServings; return { result: f, label: 'Scaling Factor', unit: 'x', steps: [{ label: 'Original', value: v.originalServings }, { label: 'Desired', value: v.desiredServings }, { label: 'Factor', value: f.toFixed(2) + 'x' }] }`,
  'Calculate recipe scaling factor. Multiply each ingredient by this factor.',
  '4 to 8 servings', '2.0x factor')

add('batch-scaling', [
  `{ name: 'batches', label: 'Desired Batches', type: 'number', min: 1, step: '1' }`,
  `{ name: 'ingredient', label: 'Per Batch Amount', type: 'number', min: 0, step: '0.25' }`,
], `const r = v.ingredient * v.batches; return { result: r, label: 'Total Needed', unit: 'units', steps: [{ label: 'Batches', value: v.batches }, { label: 'Per batch', value: v.ingredient }, { label: 'Total', value: r.toFixed(2) }] }`,
  'Scale for bulk cooking. Multiply per-batch amounts by desired number of batches.',
  '2x batch, 500g flour per batch', '1000g flour total')

add('sheet-pan-serving', [
  `{ name: 'pan', label: 'Pan Size', type: 'select', options: [{ label: 'Half sheet (18x13" — 8 servings)', value: '8' }, { label: 'Quarter sheet (13x9" — 4 servings)', value: '4' }, { label: 'Full sheet (26x18" — 16 servings)', value: '16' }] }`,
  `{ name: 'servings', label: 'Desired Servings', type: 'number', min: 1, step: '1' }`,
], `const ps = parseInt(v.pan); const pn = Math.ceil(v.servings / ps); return { result: pn, label: 'Pans Needed', unit: 'pans', steps: [{ label: 'Pan capacity', value: ps + ' servings' }, { label: 'Desired', value: v.servings }, { label: 'Pans needed', value: pn }] }`,
  'Sheet pan servings. Half sheet = 8 servings, quarter = 4, full = 16.',
  '24 servings, half sheet', '3 half-sheet pans')

add('cake-batter', [
  `{ name: 'pans', label: 'Number of Pans', type: 'number', min: 1, step: '1' }`,
  `{ name: 'panSize', label: 'Pan Size', type: 'select', options: [{ label: '8" round (4 cups)', value: '4' }, { label: '9" round (5 cups)', value: '5' }, { label: '8x8" square (6 cups)', value: '6' }, { label: '9x13" (10 cups)', value: '10' }, { label: 'Cupcake (12 per batch)', value: '2.5' }] }`,
], `const cups = parseFloat(v.panSize); const tc = v.pans * cups; return { result: tc, label: 'Total Batter', unit: 'cups', steps: [{ label: 'Pan type', value: cups + ' cups capacity' }, { label: 'Pans', value: v.pans }, { label: 'Total batter', value: tc.toFixed(1) + ' cups' }, { label: 'Fill rule', value: 'Fill 1/2 to 2/3 full' }] }`,
  'Cake batter quantities. Fill pans 1/2 to 2/3 full. 9" round = 5 cups.',
  '2 x 9" round pans', '10 cups batter')

add('cake-pan-size', [
  `{ name: 'shape', label: 'Shape', type: 'select', options: [{ label: 'Round', value: 'round' }, { label: 'Square', value: 'square' }, { label: 'Rectangular', value: 'rect' }] }`,
  `{ name: 'dim1', label: 'Length/Diameter', type: 'number', unit: 'in', min: 4, step: '1' }`,
  `{ name: 'dim2', label: 'Width (if rect)', type: 'number', unit: 'in', min: 4, step: '1' }`,
  `{ name: 'depth', label: 'Depth', type: 'number', unit: 'in', min: 1, step: '0.5' }`,
], `let a; if (v.shape === 'round') { a = Math.PI * Math.pow(v.dim1 / 2, 2); } else if (v.shape === 'square') { a = v.dim1 * v.dim1; } else { a = v.dim1 * v.dim2; } const vol = a * v.depth; const cups = vol * 0.069; return { result: cups, label: 'Pan Volume', unit: 'cups', steps: [{ label: 'Shape', value: v.shape }, { label: 'Area', value: a.toFixed(1) + ' sq in' }, { label: 'Volume', value: vol.toFixed(1) + ' cu in' }, { label: 'Capacity', value: cups.toFixed(1) + ' cups' }] }`,
  'Calculate cake pan volume. Helps determine batter needed and find substitute pans.',
  '9" round, 2" deep', '~6.4 cups')

add('baking-dish-volume', [
  `{ name: 'length', label: 'Length', type: 'number', unit: 'cm', min: 10, step: '1' }`,
  `{ name: 'width', label: 'Width', type: 'number', unit: 'cm', min: 10, step: '1' }`,
  `{ name: 'depth', label: 'Depth', type: 'number', unit: 'cm', min: 3, step: '0.5' }`,
], `const l = v.length * v.width * v.depth / 1000; const c = l * 4.227; return { result: l, label: 'Dish Volume', unit: 'L', steps: [{ label: 'Dimensions', value: v.length + 'x' + v.width + 'x' + v.depth + ' cm' }, { label: 'Volume', value: l.toFixed(2) + ' L' }, { label: 'Cups', value: c.toFixed(1) }] }`,
  'Baking dish volume in litres. Essential for substituting pans and adjusting recipes.',
  '30x20x5 cm dish', '3.0 L (12.7 cups)')

add('loaf-pan', [
  `{ name: 'size', label: 'Loaf Pan Size', type: 'select', options: [{ label: 'Mini (5.75x3x2" — 2 cups)', value: '2' }, { label: 'Small (7.5x3.5x2.5" — 4 cups)', value: '4' }, { label: 'Standard (8.5x4.5x2.5" — 6 cups)', value: '6' }, { label: 'Large (9x5x3" — 8 cups)', value: '8' }] }`,
  `{ name: 'loaves', label: 'Number of Loaves', type: 'number', min: 1, step: '1' }`,
], `const cpl = parseInt(v.size); const tc = cpl * v.loaves; return { result: tc, label: 'Total Batter', unit: 'cups', steps: [{ label: 'Pan', value: cpl + ' cups' }, { label: 'Loaves', value: v.loaves }, { label: 'Total', value: tc + ' cups' }] }`,
  'Loaf pan batter quantities. Standard 9x5" = 8 cups. Fill 1/2 to 2/3 full.',
  '2 standard loaves', '12 cups batter')

add('muffin-tin', [
  `{ name: 'size', label: 'Muffin Size', type: 'select', options: [{ label: 'Mini (3 tbsp)', value: '3' }, { label: 'Standard (4 tbsp)', value: '4' }, { label: 'Jumbo (8 tbsp)', value: '8' }] }`,
  `{ name: 'muffins', label: 'Number of Muffins', type: 'number', min: 1, step: '1' }`,
], `const tb = parseInt(v.size) * v.muffins; const cu = tb / 16; return { result: tb, label: 'Total Batter', unit: 'tbsp', steps: [{ label: 'Size', value: v.size + ' tbsp each' }, { label: 'Muffins', value: v.muffins }, { label: 'Total', value: tb + ' tbsp (' + cu.toFixed(1) + ' cups)' }] }`,
  'Muffin batter quantities. Standard uses 4 tbsp (1/4 cup) per muffin. Fill 2/3 full.',
  '12 standard muffins', '48 tbsp (3 cups)')

add('cupcake-icing', [
  `{ name: 'cupcakes', label: 'Number of Cupcakes', type: 'number', min: 1, step: '1' }`,
  `{ name: 'technique', label: 'Technique', type: 'select', options: [{ label: 'Spread (1 tbsp each)', value: '1' }, { label: 'Piped swirl (2 tbsp)', value: '2' }, { label: 'Rosette (3 tbsp)', value: '3' }] }`,
], `const tb = parseInt(v.technique) * v.cupcakes; const cu = tb / 16; return { result: tb, label: 'Icing Needed', unit: 'tbsp', steps: [{ label: 'Cupcakes', value: v.cupcakes }, { label: 'Per cupcake', value: v.technique + ' tbsp' }, { label: 'Total', value: tb + ' tbsp (' + cu.toFixed(1) + ' cups)' }] }`,
  'Cupcake icing quantities. Spread = 1 tbsp, piped swirl = 2 tbsp, rosette = 3 tbsp.',
  '24 cupcakes, piped swirl', '48 tbsp (3 cups)')

add('cookie-dough', [
  `{ name: 'recipe', label: 'Base Yield', type: 'select', options: [{ label: 'Standard (36 cookies, 2 tbsp)', value: '36' }, { label: 'Small (18 cookies, 2 tbsp)', value: '18' }, { label: 'Large (60 cookies, 2 tbsp)', value: '60' }] }`,
  `{ name: 'scoopSize', label: 'Scoop Size', type: 'select', options: [{ label: 'Small (1 tbsp, 0.5x)', value: '0.5' }, { label: 'Medium (2 tbsp, 1x)', value: '1' }, { label: 'Large (3 tbsp, 1.5x)', value: '1.5' }] }`,
], `const r = parseInt(v.recipe) * parseFloat(v.scoopSize); return { result: Math.round(r), label: 'Cookie Yield', unit: 'cookies', steps: [{ label: 'Base yield', value: v.recipe }, { label: 'Scoop factor', value: v.scoopSize + 'x' }, { label: 'Adjusted yield', value: Math.round(r) + ' cookies' }] }`,
  'Cookie dough yields by scoop size. Standard: 2 tbsp dough = 1 cookie.',
  'Standard batch, medium scoop', '36 cookies')

add('pie-crust', [
  `{ name: 'crusts', label: 'Crust', type: 'select', options: [{ label: 'Single 9"', value: '150_single' }, { label: 'Double 9"', value: '275_double' }, { label: 'Single 10"', value: '200_single' }, { label: 'Double 10"', value: '350_double' }] }`,
  `{ name: 'butter', label: 'Fat Type', type: 'select', options: [{ label: 'All-butter (flakiest)', value: '0.7' }, { label: 'Shortening', value: '0.6' }, { label: 'Half butter/half shortening', value: '0.65' }] }`,
], `const p = v.crusts.split('_'); const flour = parseFloat(p[0]); const fat = flour * parseFloat(v.butter); const water = flour * 0.25; return { result: flour, label: 'Flour', unit: 'g', steps: [{ label: 'Type', value: p.slice(1).join(' ') + ' crust' }, { label: 'Flour', value: flour + ' g' }, { label: 'Fat', value: fat.toFixed(0) + ' g' }, { label: 'Ice water', value: water.toFixed(0) + ' g' }] }`,
  'Pie crust: 3:2:1 ratio (flour:fat:water). Keep ingredients COLD for flaky texture.',
  'Double 9" all-butter', '275g flour, 193g butter, 69g water')

add('cream-puff', [
  `{ name: 'puffs', label: 'Number of Puffs', type: 'number', min: 6, step: '6' }`,
  `{ name: 'filling', label: 'Filling', type: 'select', options: [{ label: 'Pastry cream', value: 'cream' }, { label: 'Whipped cream', value: 'whipped' }, { label: 'Ice cream', value: 'icecream' }] }`,
], `const batches = Math.ceil(v.puffs / 6); const water = batches * 125; const butter = batches * 60; const flour = batches * 75; const eggs = batches * 2; return { result: v.puffs, label: 'Choux Pastry', unit: 'puffs', steps: [{ label: 'Puffs', value: v.puffs }, { label: 'Batches of 6', value: batches }, { label: 'Water', value: water + ' mL' }, { label: 'Butter', value: butter + ' g' }, { label: 'Flour', value: flour + ' g' }, { label: 'Eggs', value: eggs + ' large' }, { label: 'Filling', value: v.filling }] }`,
  'Choux pastry (cream puffs). Each batch of 6: 125mL water, 60g butter, 75g flour, 2 eggs.',
  '24 cream puffs', '4 batches')

add('cheesecake-batter', [
  `{ name: 'pan', label: 'Pan Size', type: 'select', options: [{ label: '6" (serves 4-6)', value: '340' }, { label: '8" (serves 8-10)', value: '680' }, { label: '9" (serves 12)', value: '900' }, { label: '10" (serves 14-16)', value: '1130' }] }`,
  `{ name: 'style', label: 'Style', type: 'select', options: [{ label: 'New York (dense)', value: 'ny' }, { label: 'Classic', value: 'classic' }, { label: 'Light/fluffy', value: 'light' }] }`,
], `const cc = parseInt(v.pan); const ratios = { ny: { s: 1/3, e: 1.5/3, c: 1/3 }, classic: { s: 1/2.5, e: 1/2.5, c: 0.75/2.5 }, light: { s: 0.75/2, e: 0.75/2, c: 0.5/2 } }; const r = ratios[v.style]; const sugar = cc * r.s; const eggs = Math.round(cc * r.e / 50); const cream = cc * r.c; return { result: cc, label: 'Cream Cheese', unit: 'g', steps: [{ label: 'Pan', value: v.pan + '"' }, { label: 'Cream cheese', value: cc + ' g' }, { label: 'Sugar', value: sugar.toFixed(0) + ' g' }, { label: 'Eggs', value: eggs + ' large' }, { label: 'Cream', value: cream.toFixed(0) + ' mL' }] }`,
  'Cheesecake batter by pan size. New York style is denser with more cream cheese and eggs.',
  '9" New York cheesecake', '900g cream cheese, 300g sugar, 6 eggs')

add('macaron-calc', [
  `{ name: 'macarons', label: 'Target Macarons', type: 'number', min: 12, step: '6' }`,
  `{ name: 'method', label: 'Method', type: 'select', options: [{ label: 'French (simpler)', value: 'french' }, { label: 'Italian (more stable)', value: 'italian' }] }`,
], `const b = Math.ceil(v.macarons / 24); const ew = b * 100; const su = b * (v.method === 'french' ? 100 : 150); const af = b * 110; const is = b * 110; return { result: v.macarons, label: 'Macaron Batch', unit: 'macarons', steps: [{ label: 'Batches of 24', value: b }, { label: 'Almond flour', value: af + ' g' }, { label: 'Icing sugar', value: is + ' g' }, { label: 'Egg whites', value: ew + ' g' }, { label: 'Sugar', value: su + ' g' }, { label: 'Method', value: v.method }] }`,
  'Macaron ingredients. Batch of 24 uses 100g egg white, 110g almond flour, 110g powdered sugar.',
  '48 macarons, French method', '2 batches')

add('ganache-ratio', [
  `{ name: 'chocolate', label: 'Chocolate Amount', type: 'number', unit: 'g', min: 50, step: '10' }`,
  `{ name: 'use', label: 'Use', type: 'select', options: [{ label: 'Glaze/pouring (2:1 choc:cream)', value: '2' }, { label: 'Filling/truffle (1:1)', value: '1' }, { label: 'Whipped ganache (1:2)', value: '0.5' }] }`,
], `const r = parseFloat(v.use); const cream = v.chocolate / r; const t = v.chocolate + cream; return { result: t, label: 'Total Ganache', unit: 'g', steps: [{ label: 'Chocolate', value: v.chocolate + ' g' }, { label: 'Cream', value: cream.toFixed(0) + ' g' }, { label: 'Ratio', value: r + ':1' }, { label: 'Total', value: t.toFixed(0) + ' g' }] }`,
  'Ganache ratios: 2:1 for glaze, 1:1 for truffles, 1:2 for whipped. Use quality chocolate.',
  '200g chocolate, truffle (1:1)', '400g total ganache')

add('buttercream', [
  `{ name: 'servings', label: 'Servings', type: 'number', min: 4, step: '4' }`,
  `{ name: 'type', label: 'Type', type: 'select', options: [{ label: 'American', value: 'american' }, { label: 'Swiss meringue', value: 'swiss' }, { label: 'Italian meringue', value: 'italian' }] }`,
], `const butter = Math.ceil(v.servings / 12) * 227; const sugar = v.type === 'american' ? butter * 2 : butter * 1.5; const egg = v.type === 'american' ? 0 : Math.round(butter / 227 * 3); return { result: butter, label: 'Butter', unit: 'g', steps: [{ label: 'Servings', value: v.servings }, { label: 'Butter', value: butter + ' g' }, { label: 'Sugar', value: sugar.toFixed(0) + ' g' }, egg > 0 ? { label: 'Egg whites', value: egg + ' whites' } : { label: 'Milk', value: '2-4 tbsp' }] }`,
  'Buttercream quantities. American is quick; Swiss/Italian meringue are silkier. 1 batch per 12 servings.',
  '24 servings American', '454g butter, 908g sugar')

add('canning-time', [
  `{ name: 'food', label: 'Food Type', type: 'select', options: [{ label: 'Green beans (20 min pints, 25 min quarts)', value: '20_25' }, { label: 'Tomatoes (40 min pints or quarts)', value: '40_40' }, { label: 'Corn (55 min pints, 85 min quarts)', value: '55_85' }, { label: 'Stock/broth (20 min pints, 25 min quarts)', value: '20_25' }, { label: 'Jam/jelly (10 min half-pints)', value: '10_10' }] }`,
  `{ name: 'size', label: 'Jar Size', type: 'select', options: [{ label: 'Pint (500 mL)', value: 'pint' }, { label: 'Quart (1 L)', value: 'quart' }] }`,
  `{ name: 'altitude', label: 'Altitude Adjustment', type: 'select', options: [{ label: 'Sea level-300m (+0 min)', value: '0' }, { label: '300-900m (+5 min)', value: '5' }, { label: '900-1800m (+10 min)', value: '10' }, { label: 'Above 1800m (+15 min)', value: '15' }] }`,
], `const p = v.food.split('_'); const tm = v.size === 'quart' ? parseInt(p[1]) : parseInt(p[0]); const adj = tm + parseInt(v.altitude); return { result: adj, label: 'Processing Time', unit: 'min', steps: [{ label: 'Food', value: p.join(' ') }, { label: 'Jar size', value: v.size }, { label: 'Base time', value: tm + ' min' }, { label: 'Altitude adj', value: '+' + v.altitude + ' min' }, { label: 'Total', value: adj + ' min' }] }`,
  'Canning processing times by food type and jar size. Adjust for altitude above 300m. Use pressure canner for low-acid foods.',
  'Green beans, quarts, 500m altitude', '30 min')

add('pickling-brine', [
  `{ name: 'water', label: 'Water Volume', type: 'number', unit: 'cups', min: 1, step: '1' }`,
  `{ name: 'vinegar', label: 'Vinegar Ratio', type: 'select', options: [{ label: '50:50 (standard pickles)', value: '50' }, { label: '60:40 (less tangy)', value: '60' }, { label: '40:60 (more tangy)', value: '40' }] }`,
  `{ name: 'salt', label: 'Salt Type', type: 'select', options: [{ label: 'Pickling salt', value: '1' }, { label: 'Kosher salt', value: '1.25' }, { label: 'Table salt (not recommended)', value: '0.8' }] }`,
], `const wc = v.water * 240; const vc = wc * (v.vinegar / 100); const salt = parseFloat(v.salt) * (wc / 1000) * 30; return { result: vc + wc, label: 'Total Brine', unit: 'mL', steps: [{ label: 'Water', value: wc.toFixed(0) + ' mL' }, { label: 'Vinegar (' + v.vinegar + '%)', value: vc.toFixed(0) + ' mL' }, { label: 'Salt', value: salt.toFixed(0) + ' g' }, { label: 'Total brine', value: (vc + wc).toFixed(0) + ' mL' }] }`,
  'Pickling brine ratios. Standard: 50% water, 50% vinegar, 3% salt by water weight. Use pickling salt for clarity.',
  '2 cups water, 50% vinegar', '~960mL brine')

add('fermentation-salt', [
  `{ name: 'water', label: 'Water Volume', type: 'number', unit: 'mL', min: 100, step: '100' }`,
  `{ name: 'pct', label: 'Salt %', type: 'select', options: [{ label: '2% (sauerkraut, peppers)', value: '2' }, { label: '3% (pickles, hot sauce)', value: '3' }, { label: '5% (olives, strong brine)', value: '5' }] }`,
], `const s = v.water * parseFloat(v.pct) / 100; return { result: s, label: 'Salt Needed', unit: 'g', steps: [{ label: 'Water', value: v.water + ' mL' }, { label: v.pct + '% brine', value: s.toFixed(1) + ' g salt' }, { label: 'Tip', value: 'Use non-iodized salt. Weigh, don\'t measure by volume!' }] }`,
  'Fermentation brine salinity. 2% for most vegetables, 3% for pickles, 5% for strong brines. Use non-iodized salt.',
  '1L water, 2% brine', '20g salt')

add('cheese-making', [
  `{ name: 'milk', label: 'Milk Volume', type: 'number', unit: 'L', min: 1, step: '1' }`,
  `{ name: 'cheese', label: 'Cheese Type', type: 'select', options: [{ label: 'Fresh mozzarella (~150g/L)', value: '150' }, { label: 'Ricotta (~100g/L)', value: '100' }, { label: 'Farmers cheese (~120g/L)', value: '120' }, { label: 'Paneer (~180g/L)', value: '180' }, { label: 'Cottage cheese (~110g/L)', value: '110' }] }`,
], `const yieldG = v.milk * parseInt(v.cheese); const rennetDrops = v.milk * 4; return { result: yieldG, label: 'Cheese Yield', unit: 'g', steps: [{ label: 'Milk', value: v.milk + ' L' }, { label: 'Type', value: v.cheese + ' g/L' }, { label: 'Yield', value: yieldG + ' g' }, { label: 'Rennet', value: rennetDrops + ' drops (liquid)' }, { label: 'Culture time', value: '30-60 min at 32°C' }] }`,
  'Cheese-making yields. Most fresh cheeses yield 100-180g per litre of milk. Use whole milk for best results.',
  '4L whole milk, mozzarella', '~600g fresh mozzarella')

add('ice-cream-base', [
  `{ name: 'servings', label: 'Servings', type: 'number', min: 2, step: '2' }`,
  `{ name: 'base', label: 'Base Type', type: 'select', options: [{ label: 'Custard (French style)', value: 'custard' }, { label: 'Philadelphia (egg-free)', value: 'philly' }, { label: 'Dairy-free (coconut)', value: 'vegan' }] }`,
], `const mult = Math.ceil(v.servings / 4); const cream = mult * 250; const milk = mult * (v.base === 'custard' ? 250 : 150); const sugar = mult * 150; const eggs = v.base === 'custard' ? mult * 3 : 0; return { result: cream + milk, label: 'Total Base', unit: 'mL', steps: [{ label: 'Servings', value: v.servings + ' (1 batch per 4 servings)' }, { label: 'Heavy cream', value: cream + ' mL' }, { label: 'Milk', value: milk + ' mL' }, { label: 'Sugar', value: sugar + ' g' }, eggs > 0 ? { label: 'Egg yolks', value: eggs + ' yolks' } : { label: 'Stabilizer', value: v.base === 'vegan' ? '1 can coconut cream' : '2 tbsp cornstarch' }] }`,
  'Ice cream base ingredients. Custard = richer (egg yolks), Philadelphia = simpler (no eggs), dairy-free = coconut-based.',
  '4 servings, custard style', '500mL cream + 500mL milk + 150g sugar + 3 yolks')

add('coffee-brew-ratio', [
  `{ name: 'water', label: 'Water Volume', type: 'number', unit: 'mL', min: 50, step: '10' }`,
  `{ name: 'ratio', label: 'Brew Ratio', type: 'select', options: [{ label: '1:15 (strong)', value: '15' }, { label: '1:16 (standard pour-over)', value: '16' }, { label: '1:17 (balanced)', value: '17' }, { label: '1:18 (mild)', value: '18' }, { label: '1:12 (French press)', value: '12' }, { label: '1:5 (cold brew)', value: '5' }] }`,
], `const r = parseFloat(v.ratio); const grounds = v.water / r; return { result: grounds, label: 'Coffee Grounds', unit: 'g', steps: [{ label: 'Water', value: v.water + ' mL' }, { label: 'Ratio 1:' + r, value: grounds.toFixed(1) + ' g coffee' }, { label: 'Method', value: r <= 12 ? 'French press (4 min)' : r >= 15 ? 'Pour-over (2.5-3 min)' : 'Drip (3-4 min)' }] }`,
  'Coffee brew ratios. SCA recommends 1:16-1:18 for pour-over. French press uses 1:12, cold brew 1:5.',
  '300mL water, 1:16 ratio', '18.8g coffee grounds')

// Build insertion strings
const newDefKeys = missing.map(m => m.slug)
const newDefEntries = missing.map(m => {
  const s = specs[m.slug]
  if (!s) return `// MISSING spec: ${m.slug}`
  return `  '${m.slug}': {\n    fields: [\n      ${s.fields.join(',\n      ')}\n    ],\n    compute: (v) => {\n      ${s.compute}\n    },\n    description: '${s.desc.replace(/'/g, "\\'")}',\n    example: { label: '${s.exampleLbl.replace(/'/g, "\\'")}', value: '${s.exampleVal.replace(/'/g, "\\'")}' },\n  },`
})

// ---- Step 1: Insert into calcDefs before closing } ----
const defsClose = content.lastIndexOf('}', content.indexOf('function getMeatTemp'))
const insertBefore = content.lastIndexOf('\n', defsClose)
const defsBlock = newDefEntries.join('\n\n')
let newContent = content.slice(0, insertBefore + 1) + defsBlock + '\n' + content.slice(insertBefore + 1)

// ---- Step 2: Update CalcType union type ----
const calcTypeStart = content.indexOf("type CalcType = '")
const calcTypeEnd = content.indexOf('\n', content.indexOf("type CalcType =")) // end of type line

// Parse existing types
const typeLine = content.slice(calcTypeStart, calcTypeEnd)
const existingTypes = typeLine.replace("type CalcType = ", "").trim()
// Split by | and strip quotes and spaces
const typeList = existingTypes.split('|').map(t => t.trim().replace(/'/g, '')).filter(Boolean)

// Add new keys that don't already exist
for (const key of newDefKeys) {
  if (!typeList.includes(key)) {
    typeList.push(key)
  }
}

const newTypeLine = `type CalcType = ${typeList.map(t => `'${t}'`).join(' | ')}`
newContent = newContent.replace(typeLine, newTypeLine)

// ---- Step 3: Insert into calcTypeMap before closing } ----
const calcMapStart = newContent.indexOf('const calcTypeMap')
const cmCloseBrace = newContent.indexOf('\n}', calcMapStart)
// Find the last entry line before }
const beforeClose = newContent.lastIndexOf('\n', cmCloseBrace - 1)
const indent = '  '
const newMapLines = newDefKeys.map(k => `${indent}'${k}': '${k}',`)
const mapBlock = newMapLines.join('\n')

// Insert before the closing } line
newContent = newContent.slice(0, beforeClose + 1) + mapBlock + '\n' + newContent.slice(beforeClose + 1)

fs.writeFileSync(filePath, newContent, 'utf-8')
console.log(`Inserted ${missing.length} calcDef entries`)
console.log(`Added ${newDefKeys.length} CalcType union members`)
console.log(`Added ${newDefKeys.length} calcTypeMap entries`)
console.log('Done!')
