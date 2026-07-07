import { StudentLoanSimple } from '@/components/calculator/StudentLoanSimple';
import { StudentLoanRepayment } from '@/components/calculator/StudentLoanRepayment';
import { StudentLoanProjection } from '@/components/calculator/StudentLoanProjection';
import { StudentLoanArticle } from '@/components/calculator/StudentLoanArticle';
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('studentLoanTitle'),
    description: t('studentLoanDesc'),
  }
}

export default function StudentLoanPage() {
  return (
    <div className="max-w-[800px] mx-auto bg-white p-2 md:p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2 border-b pb-1">
        <div>home / financial / student loan calculator</div>
      </div>
      
      <h1 className="text-[26px] font-bold text-[#1a3a8a] mb-4 font-sans">Student Loan Calculator</h1>
      
      <StudentLoanSimple />
      <StudentLoanRepayment />
      <StudentLoanProjection />
      <StudentLoanArticle />

    </div>
  );
}
