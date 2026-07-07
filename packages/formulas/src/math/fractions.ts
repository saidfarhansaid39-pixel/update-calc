export interface Fraction {
  numerator: number;
  denominator: number;
  whole?: number;
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function simplifyFraction(f: Fraction): Fraction {
  let num = f.numerator;
  let den = f.denominator;
  if (den === 0) return { numerator: 0, denominator: 1 };

  const divisor = gcd(Math.abs(num), Math.abs(den));
  num /= divisor;
  den /= divisor;

  if (den < 0) {
    num = -num;
    den = -den;
  }

  return { numerator: num, denominator: den, whole: f.whole };
}

export function addFractions(f1: Fraction, f2: Fraction): Fraction {
  const num = (f1.numerator * f2.denominator) + (f2.numerator * f1.denominator);
  const den = f1.denominator * f2.denominator;
  return simplifyFraction({ numerator: num, denominator: den });
}

export function subFractions(f1: Fraction, f2: Fraction): Fraction {
  const num = (f1.numerator * f2.denominator) - (f2.numerator * f1.denominator);
  const den = f1.denominator * f2.denominator;
  return simplifyFraction({ numerator: num, denominator: den });
}

export function mulFractions(f1: Fraction, f2: Fraction): Fraction {
  return simplifyFraction({ numerator: f1.numerator * f2.numerator, denominator: f1.denominator * f2.denominator });
}

export function divFractions(f1: Fraction, f2: Fraction): Fraction {
  return simplifyFraction({ numerator: f1.numerator * f2.denominator, denominator: f1.denominator * f2.numerator });
}
