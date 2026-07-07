export function calculateCaloriesFromMacro(proteinG: number, carbG: number, fatG: number): number {
  return proteinG * 4 + carbG * 4 + fatG * 9;
}

export function calculateRecipeCost(ingredients: { price: number; quantity: number }[]): number {
  return ingredients.reduce((sum, ing) => sum + ing.price * ing.quantity, 0);
}
