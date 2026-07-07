import { useTranslations } from 'next-intl';

export function InterestRateArticle() {
  const t = useTranslations('articles');
  return (
    <div className="text-[13px] font-sans text-gray-800 leading-relaxed mt-8 space-y-4">
      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.whatIs')}</h3>
      <p>Interest rate is the amount charged by lenders to borrowers for the use of money, expressed as a percentage of the principal, or original amount borrowed; it can also be described alternatively as the cost to borrow money. For instance, an 8% interest rate for borrowing $100 a year will obligate a person to pay $108 at year-end. As can be seen in this brief example, the interest rate directly affects the total interest paid on any loan. Generally, borrowers want the lowest possible interest rates because it will cost less to borrow; conversely, lenders (or investors) seek high interest rates for larger profits. Interest rates are usually expressed annually, but rates can also be expressed as monthly, daily, or any other period.</p>
      <p>Interest rates are involved in almost all formal lending and borrowing transactions. Examples of real-world applications of interest rates include mortgage rates, the charge on a person's outstanding debt on a credit card, business loans to fund capital projects, the growth of retirement funds, amortization of long-term assets, the discount offered by a supplier to a buyer for paying off an invoice earlier, and much, much more.</p>

      <h4 className="font-bold text-[15px] text-black mt-4">Simple vs. Compound Interest</h4>
      <p>There are two methods for calculating interest. Simple interest is calculated as a percentage of principal only, while compound interest is calculated as a percentage of the principal along with any accrued interest. As a result of this compounding behavior, interest earned by lenders subsequently earns interest over time. The more frequently interest compounds within a given time period, the more interest will be accrued. Most formal interest payment calculations today are compounded, including those for this calculator, and any following reference to the interest rate will refer to compound interest rather than simple interest unless otherwise specified. To do calculations or learn more about the differences between compounding frequencies, please visit the <a href="/financial-calculators/compound-interest-calculator/" className="text-[#1c4587] underline">Compound Interest Calculator</a>.</p>

      <h4 className="font-bold text-[15px] text-black mt-4">Fixed vs. Variable Interest Rates</h4>
      <p>Fixed rates are rates that are set as a certain percentage for the life of the loan and will not change. Variable rates are interest rates that can fluctuate over time. The degree of variance is generally based on factors such as another interest rate, inflation, or a market index. There are different pros and cons to each, but the Interest Rate Calculator will only display the result as a fixed interest rate.</p>

      <h4 className="font-bold text-[15px] text-black mt-4">APR</h4>
      <p>The interest rate for many types of loans is often advertised as an annual percentage rate, or APR. APRs are commonly used within the home or car-buying contexts and are slightly different from typical interest rates in that certain fees can be packaged into them. For instance, administrative fees that are usually due when buying new cars are typically rolled into the financing of the loan instead of paid upfront. APR is a more accurate representation than the interest rate when shopping and comparing similar competing. On the other hand, annual percentage yield (APY) is the interest rate that is earned at a financial institution, usually from a savings account or Certificate of Deposit (in the U.S.). For more information or to do calculations involving APR, please visit the <a href="/financial-calculators/interest-rate-calculator/" className="text-[#1c4587] underline">APR Calculator</a>.</p>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.factors')}</h3>
      <p>There are many factors that affect what interest rates people get on their mortgages and auto loans. Although these largely cannot be controlled, having knowledge of these factors may still be helpful.</p>

      <h4 className="font-bold text-[14px] text-black mt-4">Economic Policy and Inflation</h4>
      <p>In most developed countries today, interest rates fluctuate mainly due to monetary policy set by central banks. The control of inflation is the major subject of monetary policies. Inflation is defined as the general increase in the price of goods and services and the fall in the purchasing power of money. It is closely related to interest rates on a macroeconomic level, and large-scale changes in either will have an effect on the other. In the U.S., the Federal Reserve can change the rate at most up to eight times a year during the Federal Open Market Committee meetings. In general, one of their main goals is to maintain steady inflation (several percentage points a year).</p>

      <h4 className="font-bold text-[14px] text-black mt-4">Economic Activity</h4>
      <p>In an economy, as interest rates go down, more businesses and people are inclined to borrow money for business expansion and making expensive purchases such as homes or cars. This will create more jobs, push up salary levels, and boost consumer confidence, and more money will be spent within that economy. On the other hand, if interest rates increase, consumer confidence goes down, and fewer people and businesses are inclined to borrow. Based on this, the central bank uses the interest rate as one of the main tools to control the economy. The central bank typically lowers the interest rate if the economy is slow and increases it if the economy expands too fast.</p>

      <h4 className="font-bold text-[14px] text-black mt-4">Unemployment Rate</h4>
      <p>When the unemployment rate is high, consumers spend less money, and economic growth slows. However, when the unemployment rate is too low, it may lead to rampant inflation, a fast wage increase, and a high cost of doing business. As a result, interest rates and unemployment rates are normally inversely related; that is, when unemployment is high, interest rates are artificially lowered, usually in order to spur consumer spending. Conversely, when unemployment within an economy is low and there is a lot of consumer activity, interest rates will go up.</p>

      <h4 className="font-bold text-[14px] text-black mt-4">Supply and Demand</h4>
      <p>Similar to the market for goods and services, the market for credit is determined by supply and demand, albeit to a lesser extent. When there exists a surplus of demand for money or credit, lenders react by raising interest rates. When there is less demand for credit or money, they lower rates in order to entice more borrowers. With that said, banks and credit unions still have to adhere to their reserve requirements, and there is a maximum amount that they can lend out at any time.</p>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.factors')}</h3>
      <p>While many factors that affect the interest rate are uncontrollable, individuals can, to some degree, affect the interest rates they receive.</p>

      <h4 className="font-bold text-[14px] text-black mt-4">Individual Credit Standing</h4>
      <p>In the U.S., credit scores and credit reports exist to provide information about each borrower so that lenders can assess risk. A credit score is a number between 300 and 850 that represents a borrower's creditworthiness; the higher, the better. Good credit scores are built over time through timely payments, low credit utilization, and many other factors. Credit scores drop when payments are missed or late, credit utilization is high, total debt is high, and bankruptcies are involved. The average credit score in the U.S. is around 700.</p>
      <p>The higher a borrower's credit score, the more favorable the interest rate they may receive. Anything higher than 750 is considered excellent and will receive the best interest rates. From the perspective of a lender, they are more hesitant to lend to borrowers with low credit scores and/or a history of bankruptcy and missed credit card payments than they would be to borrowers with clean histories of timely mortgage and auto payments. As a result, they will either reject the lending application or charge higher rates to protect themselves from the likelihood that higher-risk borrowers default. For example, a credit card issuer can raise the interest rate on an individual's credit card if they start missing many payments.</p>

      <h4 className="font-bold text-[14px] text-black mt-4">How to Receive Better Interest Rates</h4>
      <p>Although individual credit standing is one of the most important determinants of the favorability of the interest rates borrowers receive, there are other considerations they can take note of.</p>
      
      <ul className="list-disc pl-8 space-y-2">
        <li><b>Secured loans</b>—Generally speaking, unsecured loans will carry higher interest rates than secured loans, mainly because there is no collateral involved. That is, if the borrower defaults, the lender is legally entitled to ownership of the collateral. Borrowers seeking more favorable interest rates can consider putting up collateral for a secured loan instead.</li>
        <li><b>Loan specifics</b>—Longer repayment terms can increase the interest rate because it is riskier for lenders. In addition, making too low a down payment (which is also seen as risky) can result in the borrower receiving a higher interest rate. Choosing a shorter loan term and putting more money down can lower the interest rate a borrower is subject to.</li>
        <li><b>Do not apply for credit too often</b>—Too many inquiries on a credit report tell a lender that a borrower may have trouble attaining credit, which is a sign of a high-risk borrower. A single inquiry can deduct a few points off a credit score!</li>
        <li><b>Borrow at opportune moments</b>—While borrowers have no control over economic factors, they can choose to borrow during times when economic factors are more favorable. When the economy is slow and demand for loans is low, it is possible to find lower interest rates.</li>
        <li><b>Research and shop around</b>—Different lenders have different rates. Borrowers may be able to find a lower interest rate by shopping around rather than accepting the first loan offered. It is possible to reveal to each lender that another is offering a better rate as a negotiation tactic. While getting a good rate is important, be careful about specific conditions and any additional costs.</li>
      </ul>

      <h3 className="font-bold text-lg text-black mt-6">Real Interest Rate</h3>
      <p>The relationship between real interest rate, inflation, and the nominal rate is shown by the following equation:</p>
      <p className="text-center my-4">real rate + inflation = nominal rate</p>
      <p>In this equation, the nominal rate is generally the figure being discussed when the "interest rate" is mentioned. The nominal rate is the sum of the general level of inflation and the real rate of interest that is being applied. For more information about or to do calculations involving inflation, please visit the <a href="/financial-calculators/compound-interest-calculator/" className="text-[#1c4587] underline">Inflation Calculator</a>.</p>
    </div>
  );
}
