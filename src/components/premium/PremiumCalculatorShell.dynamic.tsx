import dynamic from 'next/dynamic';

function LoadingFallback() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}

export const PremiumCalculatorShell = dynamic(
  () => import('@/components/premium/PremiumCalculatorShell').then(m => m.PremiumCalculatorShell),
  { ssr: false, loading: LoadingFallback }
);

export type { UnitSystem } from '@/components/premium/PremiumCalculatorShell';
