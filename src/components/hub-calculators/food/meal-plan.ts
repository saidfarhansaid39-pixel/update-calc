import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'mealsPerDay', label: 'Meals Per Day', type: 'number', min: 1, step: '1' },
      { name: 'days', label: 'Days to Plan', type: 'number', min: 1, step: '1' },
      { name: 'calPerMeal', label: 'Calories Per Meal', type: 'select', options: [{ label: 'Light (400 kcal)', value: '400' }, { label: 'Moderate (500 kcal)', value: '500' }, { label: 'Generous (600 kcal)', value: '600' }, { label: 'Hearty (800 kcal)', value: '800' }] },
      { name: 'prepTimePerMeal', label: 'Prep Time Per Meal', type: 'select', options: [{ label: 'Quick (15 min)', value: '15' }, { label: 'Moderate (30 min)', value: '30' }, { label: 'Long (45 min)', value: '45' }, { label: 'Elaborate (60 min)', value: '60' }] },
    ],
    compute: (v) => {
      const totalMeals = v.mealsPerDay * v.days
      const totalCalories = totalMeals * v.calPerMeal
      const totalPrepMin = totalMeals * v.prepTimePerMeal
      return { result: totalMeals, label: 'Total Meals to Plan', unit: 'meals', steps: [
        { label: 'Meals per day', value: `${v.mealsPerDay}` },
        { label: 'Days', value: `${v.days}` },
        { label: 'Total meals', value: `${totalMeals}` },
        { label: 'Total calories', value: `${totalCalories.toFixed(0)} kcal (${(totalCalories / v.days / v.mealsPerDay).toFixed(0)} kcal/meal)` },
        { label: 'Total prep time', value: `${totalPrepMin} min (${(totalPrepMin / 60).toFixed(1)} hrs)` },
      ]}
    },
    description: 'Plan your weekly meals by calculating total meals, calories, and prep time. Perfect for meal prepping and grocery planning — scale portions across the week.',
    example: { label: '3 meals/day, 7 days, moderate', value: '21 meals, 10,500 kcal, 10.5 hrs prep' }
}

export default calcDef
