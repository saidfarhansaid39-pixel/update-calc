import React from 'react';

import { useTranslations } from 'next-intl';

export function StudentLoanArticle() {
  const t = useTranslations('articles');
  return (
    <div className="text-[13px] font-sans text-gray-800 leading-relaxed mt-8 space-y-4">
      
      <div className="flex flex-wrap gap-2 mt-2 border-b pb-6">
        <button className="bg-[#1c4587] text-white px-3 py-1 text-[13px] rounded hover:bg-[#153465]">College Cost Calculator</button>
        <button className="bg-[#1c4587] text-white px-3 py-1 text-[13px] rounded hover:bg-[#153465]">Loan Calculator</button>
      </div>

      <p className="mt-6">In the U.S., there are several types of student loan providers: government and private. Federal and state governments provide the lion's share of student loans in the country and offer the considerable advantage of being subsidized. This means that students are not required to pay interest on their student loans while they are still considered students. Therefore, the cost of public, subsidized loans is lower than those offered by the private sector. As a matter of fact, federal student loans have some of the lowest interest rates around and do not require cosignatories, simply proof of acceptance to an educational institution. For these reasons, more than 90% of student debt today is in the form of federal loans.</p>
      <p>Before delving into student loans, governmental or private, remember that there are other options to consider. Grants and scholarships do not require repayment as loans do, and some of these can cover the entirety of a student's education costs, preempting the need for a loan. Work-study programs exist for students who have financial needs and are able to work part-time. Students with extra disposable income can pay it towards schooling costs before taking out student loans to help decrease the size and length of their student loans, making them more affordable in the long run. Ideally, only after exploring these options should students resort to taking out some of the student loans described below.</p>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.howItWorks')}</h3>
      
      <h4 className="font-bold mt-4">Direct Subsidized and Direct Unsubsidized Loans (sometimes referred to as Stafford Loans)</h4>
      <p>Direct Subsidized Loans are need-based and dependent on Expected Family Contribution (EFC) to determine the loan amount. Because they are subsidized, there are 6-month grace periods after a person completes their studies before mandatory payments of the interest on the loans begin. Direct Unsubsidized Loans, on the other hand, are not need-based and interest on the loans begins accruing immediately after approval.</p>

      <h4 className="font-bold mt-4">Direct PLUS Loans</h4>
      <p>These are typically for graduate or professional students enrolled at least half-time at an eligible school or parents of dependent undergraduate students enrolled at least half-time. Borrowers should have favorable credit histories, and the maximum possible loan amount is the difference between the cost of attendance for attending a particular school and any other financial aid received, such as scholarships. The interest rate on Direct PLUS loans tends to be higher than Stafford loans. There is an up-front fee called the origination fee that hovers around 4% of the loan amount.</p>

      <h4 className="font-bold mt-4">Direct Consolidation Loans</h4>
      <p>Borrowers of multiple federal student loans can choose to consolidate them into a single Direct Consolidation Loan. The main reasons for consolidating include having one simple monthly payment instead of several, lower monthly payments but longer time period on loans, and access to additional income-driven repayment plans. Before choosing to consolidate, there are some tradeoffs to consider. For example, lengthier loans will result in more paid out for interest. Furthermore, consolidation may also negate certain benefits inherent in individual loans, such as interest rate discounts, principal rebates, or loan cancellation benefits.</p>

      <h3 className="font-bold text-lg text-black mt-6">State Student Loan</h3>
      <p>The fifty states have a wide variety of loan offers that differ immensely from state to state, usually offered by state agencies or state-chartered non-profit organizations. No two states will offer the same student loans. The list of available student loans offered by all fifty states is extensive; students should consult their state's department of post-secondary education for details about state-specific aid that is available.</p>
      <p>Similar to some federal student loans, certain state student loans may also contain forgiveness programs, though only if the student remains in the state after graduation. Whether student loans are forgivable or not will be dependent on what each state deems appropriate to forgive, which is usually reserved for pressing needs such as particular industries. Student loans for nursing or teaching are commonly forgiven for that reason.</p>
      <p>Individual state filing deadlines are frequently earlier than the federal standard, so make sure timetables reflect whichever comes first. State student loans may also have additional, unique eligibility requirements. Generally, participants must be residents of the state or must be out-of-state students enrolled in a college within the particular state.</p>

      <h3 className="font-bold text-lg text-black mt-6">Private Student Loan</h3>
      <p>Private student loans mostly originate from banks and loan companies; as a result, applicants will be expected to go through the full underwriting process that includes checking credit histories and debt-to-income ratios. Also, almost all private student loans are not subsidized; interest payments usually must be made for the life of the loan. Interest rates are higher than subsidized student loans but still relatively low in the world of private loans.</p>
      <p>Since the U.S. loan market is dominated by cheaper federal student loans, people that use private student loans in the U.S. are few and far between. However, private student loans can be used to help pay for education if federal programs are not an option or have been exhausted. Some students will find that federal loans cannot cover all the costs associated with college and will require some other form of funding. However, keep in mind that rates on these tend to be higher and are more likely to be variable rather than fixed. Some private schools may offer loans through school trust funds. Rates from these tend to be lower than loans from private lenders. Unlike federal student loans, these are heavily dependent on credit. Since parents tend to have better credit histories than their children, having a parent cosign can result in better rates. Also, note that private student loans are normally not forgivable.</p>
      <p>With that said, private student loans do carry some benefits: The application process is typically less stringent, funds are available almost immediately, and interest may be tax-deductible. Also, they aren't based on financial needs like most federal loans.</p>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.factors')}</h3>
      <p>It is not uncommon for new graduates to struggle to repay their student loans. Unfortunate circumstances such as flaccid job markets or recessions can exacerbate situations. For federal student loans, there are some alternative solutions that can aid in dwindling down student loan payments. Income-based repayment plans can potentially cap the amount that students repay each month based on available income if they find that their student loans become increasingly harder to pay off. These plans prolong the life of the loans, but they relieve the burden of large monthly payments. There are also graduate repayment plans that slowly ramp up monthly payments over time, presumably in conjunction with projected salaries as people progress through their careers. Extended graduated repayment plans allow borrowers to extend their loans for up to 25 years. For some income-linked plans, in the end, the remaining balance may be forgiven, especially for those in public services.</p>
      <p>The major repayment plans for federal student loans are listed below.</p>

      <div className="overflow-x-auto mt-4 mb-4">
        <table className="w-full text-left border-collapse text-[12px]">
          <thead>
            <tr className="bg-[#1c4587] text-white">
              <th className="p-2 font-normal border border-white">Plans</th>
              <th className="p-2 font-normal border border-white">Loan Length</th>
              <th className="p-2 font-normal border border-white">Monthly Payment</th>
              <th className="p-2 font-normal border border-white">Qualified For</th>
              <th className="p-2 font-normal border border-white">Loan Forgiveness?*</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-100 border-b border-white">
              <td className="p-2">Standard</td><td className="p-2">10 years</td><td className="p-2">Fixed</td><td className="p-2">All</td><td className="p-2">No</td>
            </tr>
            <tr className="bg-gray-200 border-b border-white">
              <td className="p-2">Graduated</td><td className="p-2">10 years</td><td className="p-2">Increase every two years</td><td className="p-2">All</td><td className="p-2">No</td>
            </tr>
            <tr className="bg-gray-100 border-b border-white">
              <td className="p-2">Extended</td><td className="p-2">25 years</td><td className="p-2">10% or 15% of discretionary income</td><td className="p-2">Direct and Federal Family Education Loans with $30,000 or more outstanding</td><td className="p-2">No</td>
            </tr>
            <tr className="bg-gray-200 border-b border-white">
              <td className="p-2">Income-Based Repayment</td><td className="p-2">20 or 25 years</td><td className="p-2">10% or 15% of discretionary income, never more than under Standard plan</td><td className="p-2">Partial financial hardship, or standard loan payments exceed 10% of discretionary income</td><td className="p-2">Yes</td>
            </tr>
            <tr className="bg-gray-100 border-b border-white">
              <td className="p-2">Pay As You Earn (PAYE)</td><td className="p-2">20 years</td><td className="p-2">10% of discretionary income, never more than under Standard Plan</td><td className="p-2">Direct Loan borrower after Oct. 1, 2007 with partial financial hardship</td><td className="p-2">Yes</td>
            </tr>
            <tr className="bg-gray-200 border-b border-white">
              <td className="p-2">Revised Pay As You Earn</td><td className="p-2">20 or 25 years</td><td className="p-2">10% of discretionary income</td><td className="p-2">Any Direct Loan borrower</td><td className="p-2">Yes</td>
            </tr>
            <tr className="bg-gray-100 border-b border-white">
              <td className="p-2">Income-Contingent Repayment</td><td className="p-2">25 years</td><td className="p-2">The lesser of 20% of discretionary income or the amount on a 12-year fixed payment plan</td><td className="p-2">Any Direct Loan Borrower</td><td className="p-2">Yes</td>
            </tr>
            <tr className="bg-gray-200 border-b border-white">
              <td className="p-2">Income-Sensitive Repayment</td><td className="p-2">10 years</td><td className="p-2">Based on annual income</td><td className="p-2">Low-income borrowers with Federal Family Education Loans</td><td className="p-2">No</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-gray-500">* Loan forgives tax-free after 120 qualifying loan payments (10 years) for these in public services. It is not income tax-free and only forgives at the end of the loan term for others.</p>

      <p className="mt-4">It is obvious through the table that many different loan repayment plans exist. However, most borrowers will end up with the standard plan when it comes time to repay the loans, which is also the default plan when no plan is chosen.</p>
      <p className="mb-8">All educational loans in the U.S., including federal and private student loans, allow for penalty-free prepayment. When graduates find themselves entrenched in their careers and financially stable, they can put more money towards the reduction of existing student loans without penalty.</p>

    </div>
  );
}
