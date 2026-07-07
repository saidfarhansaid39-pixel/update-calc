import dynamic from 'next/dynamic';

export const PremiumCalculatorShell = dynamic(
  () => import('@/components/premium/PremiumCalculatorShell').then(m => m.PremiumCalculatorShell),
  { ssr: false }
);

export type { UnitSystem } from '@/components/premium/PremiumCalculatorShell';
