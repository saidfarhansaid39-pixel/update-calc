export function calculateGPA(grades: number[], credits: number[]): number {
  const totalCredits = credits.reduce((a, b) => a + b, 0);
  if (totalCredits === 0) return 0;
  const weightedSum = grades.reduce((sum, grade, i) => sum + grade * credits[i], 0);
  return weightedSum / totalCredits;
}

export function calculateGradeScore(earned: number, total: number): number {
  if (total === 0) return 0;
  return (earned / total) * 100;
}
