export function calculateTip(bill: number, percentage: number): number {
  return bill * (percentage / 100);
}

export function calculateDiscount(price: number, discountPercent: number): number {
  return price * (1 - discountPercent / 100);
}


