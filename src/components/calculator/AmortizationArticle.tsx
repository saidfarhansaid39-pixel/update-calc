import { useTranslations } from 'next-intl';

export function AmortizationArticle() {
  const t = useTranslations('articles');
  return (
    <div className="text-[13px] font-sans text-gray-800 leading-relaxed mt-8 space-y-4">
      <p>While the Amortization Calculator can serve as a basic tool for most, if not all, amortization calculations, there are other calculators available on this website that are more specifically geared for common amortization calculations.</p>
      
      <div className="grid grid-cols-2 gap-2 text-blue-600 underline">
        <a href="/financial-calculators/mortgage-calculator/">Mortgage Calculator</a>
        <a href="/financial-calculators/auto-loan-calculator/">Auto Loan Calculator</a>
        <a href="/financial-calculators/investment-calculator/">Investment Calculator</a>
        <a href="/financial-calculators/loan-calculator/">Business Loan Calculator</a>
        <a href="/financial-calculators/personal-loan-calculator/">Personal Loan Calculator</a>
        <a href="/financial-calculators/fha-loan-calculator/">FHA Loan Calculator</a>
        <a href="/financial-calculators/va-mortgage-calculator/">VA Mortgage Calculator</a>
        <a href="/financial-calculators/annuity-payout-calculator/">Annuity Calculator</a>
      </div>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.whatIs')}</h3>
      <p>There are two general definitions of amortization. The first is the systematic repayment of a loan over time. The second is used in the context of business accounting and is the act of spreading the cost of an expensive and long-lived item over many periods. The two are explained in more detail in the sections below.</p>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.howItWorks')}</h3>
      <p>When a borrower takes out a mortgage, car loan, or personal loan, they usually make monthly payments to the lender; these are some of the most common uses of amortization. A part of the payment covers the interest due on the loan, and the remainder of the payment goes toward reducing the principal amount owed. Interest is computed on the current amount owed and thus will become progressively smaller as the principal decreases. It is possible to see this in action on the amortization table.</p>
      <p>Credit cards, on the other hand, are generally not amortized. They are an example of revolving debt, where the outstanding balance can be carried month-to-month, and the amount repaid each month can be varied. Please use our <a href="/financial-calculators/credit-card-payoff-calculator/" className="text-blue-600 underline">Credit Card Calculator</a> for more information or to do calculations involving credit cards, or our <a href="/financial-calculators/credit-card-payoff-calculator/" className="text-blue-600 underline">Credit Cards Payoff Calculator</a> to schedule a financially feasible way to pay off multiple credit cards. Examples of other loans that aren't amortized include interest-only loans and balloon loans. The former includes an interest-only period of payment, and the latter has a large principal payment at loan maturity.</p>

      <p className="font-bold text-[14px] text-black">Amortization Schedule</p>
      <p>An amortization schedule (sometimes called an amortization table) is a table detailing each periodic payment on an amortizing loan. Each calculation done by the calculator will also come with an annual and monthly amortization schedule above. Each repayment for an amortized loan will contain both an interest payment and payment towards the principal balance, which varies for each pay period. An amortization schedule helps indicate the specific amount that will be paid towards each, along with the interest and principal paid to date, and the remaining principal balance after each pay period.</p>
      <p>Basic amortization schedules do not account for extra payments, but this doesn't mean that borrowers can't pay extra towards their loans. Also, amortization schedules generally do not consider fees. Generally, amortization schedules only work for fixed-rate loans and not adjustable-rate mortgages, variable rate loans, or lines of credit.</p>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.howItWorks')}</h3>
      <p>Certain businesses sometimes purchase expensive items that are used for long periods of time that are classified as investments. Items that are commonly amortized for the purpose of spreading costs include machinery, buildings, and equipment. From an accounting perspective, a sudden purchase of an expensive factory during a quarterly period can skew the financials, so its value is amortized over the expected life of the factory instead. Although it can technically be considered amortizing, this is usually referred to as the depreciation expense of an asset amortized over its expected lifetime. For more information about or to do calculations involving depreciation, please visit the <a href="/financial-calculators/amortization-calculator/" className="text-blue-600 underline">Depreciation Calculator</a>.</p>
      <p>Amortization as a way of spreading business costs in accounting generally refers to intangible assets like a patent or copyright. Under Section 197 of U.S. law, the value of these assets can be deducted month-to-month or year-to-year. Just like with any other amortization, payment schedules can be forecasted by a calculated amortization schedule. The following are intangible assets that are often amortized:</p>
      
      <ol className="list-decimal pl-8 space-y-1">
        <li>Goodwill, which is the reputation of a business regarded as a quantifiable asset</li>
        <li>Going-concern value, which is the value of a business as an ongoing entity</li>
        <li>The workforce in place (current employees, including their experience, education, and training)</li>
        <li>Business books and records, operating systems, or any other information base, including lists or other information concerning current or prospective customers</li>
        <li>Patents, copyrights, formulas, processes, designs, patterns, know-hows, formats, or similar items</li>
        <li>Customer-based intangibles, including customer bases and relationships with customers</li>
        <li>Supplier-based intangibles, including the value of future purchases due to existing relationships with vendors</li>
        <li>Licenses, permits, or other rights granted by governmental units or agencies (including issuances and renewals)</li>
        <li>Covenants not to compete or non-compete agreements entered relating to acquisitions of interests in trades or businesses</li>
        <li>Franchises, trademarks, or trade names</li>
        <li>Contracts for the use of or term interests in any items on this list</li>
      </ol>

      <p>Some intangible assets, with goodwill being the most common example, that have indefinite useful lives or are "self-created" may not be legally amortized for tax purposes.</p>
      <p>According to the IRS under Section 197, some assets are not considered intangibles, including interest in businesses, contracts, land, most computer software, intangible assets not acquired in connection with the acquiring of a business or trade, interest in an existing lease or sublease of a tangible property or existing debt, rights to service residential mortgages (unless it was acquired in connection with the acquisition of a trade or business), or certain transaction costs incurred by parties in which any part of a gain or loss is not recognized.</p>

      <p className="font-bold text-[14px] text-black">Amortizing Startup Costs</p>
      <p>In the U.S., business startup costs, defined as costs incurred to investigate the potential of creating or acquiring an active business and costs to create an active business, can only be amortized under certain conditions. They must be expenses that are deducted as business expenses if incurred by an existing active business and must be incurred before the active business begins. Examples of these costs include consulting fees, financial analysis of potential acquisitions, advertising expenditures, and payments to employees, all of which must be incurred before the business is deemed active. According to IRS guidelines, initial startup costs must be amortized.</p>
    </div>
  );
}
