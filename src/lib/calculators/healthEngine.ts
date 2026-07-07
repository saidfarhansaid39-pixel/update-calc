export function calculateBMI(weightKg: number, heightM: number): number {
  if (heightM <= 0) return 0;
  return weightKg / (heightM * heightM);
}

export function getBMICategory(bmi: number): string {
  if (bmi < 16) return 'Severe Thinness';
  if (bmi >= 16 && bmi < 17) return 'Moderate Thinness';
  if (bmi >= 17 && bmi < 18.5) return 'Mild Thinness';
  if (bmi >= 18.5 && bmi < 25) return 'Normal';
  if (bmi >= 25 && bmi < 30) return 'Overweight';
  if (bmi >= 30 && bmi < 35) return 'Obese Class I';
  if (bmi >= 35 && bmi < 40) return 'Obese Class II';
  if (bmi >= 40) return 'Obese Class III';
  return '';
}

export function calculateBMRMifflin(weightKg: number, heightCm: number, age: number, gender: 'male' | 'female'): number {
  if (gender === 'male') {
    return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
  } else {
    return (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
  }
}

export function calculateBMRHarrisBenedict(weightKg: number, heightCm: number, age: number, gender: 'male' | 'female'): number {
  if (gender === 'male') {
    return 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
  }
}

export function getActivityMultiplier(activityLevel: string): number {
  switch (activityLevel) {
    case 'sedentary': return 1.2;
    case 'light': return 1.375;
    case 'moderate': return 1.55;
    case 'active': return 1.725;
    case 'very_active': return 1.9;
    default: return 1.2;
  }
}

export function calculateUSNavyBodyFat(waistCm: number, neckCm: number, heightCm: number, hipCm: number = 0, gender: 'male' | 'female'): number {
  if (gender === 'male') {
    return 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
  } else {
    return 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
  }
}

export function calculateIdealWeight(heightCm: number, gender: 'male' | 'female'): { min: number, max: number, robinson: number, miller: number, devine: number, hamwi: number } {
  const heightInches = heightCm / 2.54;
  const inchesOver5Ft = heightInches > 60 ? heightInches - 60 : 0;
  
  // BMI Range 18.5 - 25
  const heightM = heightCm / 100;
  const min = 18.5 * (heightM * heightM);
  const max = 25 * (heightM * heightM);

  let robinson, miller, devine, hamwi;
  if (gender === 'male') {
    robinson = 52 + (1.9 * inchesOver5Ft);
    miller = 56.2 + (1.41 * inchesOver5Ft);
    devine = 50.0 + (2.3 * inchesOver5Ft);
    hamwi = 48.0 + (2.7 * inchesOver5Ft);
  } else {
    robinson = 49 + (1.7 * inchesOver5Ft);
    miller = 53.1 + (1.36 * inchesOver5Ft);
    devine = 45.5 + (2.3 * inchesOver5Ft);
    hamwi = 45.5 + (2.2 * inchesOver5Ft);
  }

  return { min, max, robinson, miller, devine, hamwi };
}
