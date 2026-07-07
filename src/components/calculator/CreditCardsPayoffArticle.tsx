import React from 'react';

import { useTranslations } from 'next-intl';

export function CreditCardsPayoffArticle() {
  const t = useTranslations('articles');
  return (
    <div className="text-[13px] font-sans text-gray-800 leading-relaxed mt-8 space-y-4">
      
      <div className="flex flex-wrap gap-2 mt-2 border-b pb-6">
        <button className="bg-[#1c4587] text-white px-3 py-1 text-[13px] rounded hover:bg-[#153465]">Credit Card Calculator</button>
        <button className="bg-[#1c4587] text-white px-3 py-1 text-[13px] rounded hover:bg-[#153465]">Personal Loan Calculator</button>
      </div>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.whyUse')}</h3>
      <p>Given a qualifying credit score, it is fairly common for people to have more than one credit card; in the U.S., Americans average more than 2 cards per person. There can be many reasons why it can be beneficial to have more than one, and some are listed below:</p>
      
      <ol className="list-decimal pl-8 space-y-2">
        <li><strong>Multiple Perks</strong>—The main benefit of carrying multiple credit cards is that there are many different types with different benefits. Such as rewards credit cards that provide their users with different rewards like airline mileage, hotel bookings, or retail discounts based on spending; balance-transfer credit cards that temporarily allow the incurrence of debt without interest; or business credit cards that help separate personal expenses from business ones for tax reasons, and much more.</li>
        <li><strong>More Available Credit</strong>—Another useful advantage is that there is more available credit for the cardholder to use. While a single credit card with a credit limit of $5,000 only allows the cardholder to charge up to $5,000 at a time, having two cards each with a credit limit of $5,000 will allow the cardholder to charge up to a maximum of $10,000 at a time.</li>
        <li><strong>As Backup</strong>—It can help to have a backup card in some cases when one credit card is not accepted at a specific merchant, or is lost or stolen.</li>
        <li><strong>Diversify Spending</strong>—The higher the purchase volume on any one credit card, the greater the financial consequences of having the card hacked. Diversified spending across multiple cards can reduce the damage in case of fraud.</li>
        <li><strong>Increase Credit Score</strong>—Believe it or not, having many credit cards can actually boost a person's credit scores. Credit bureaus use a measure called credit utilization ratio (CUR), which is a number of how much is owed on all revolving accounts divided by total available credit. For example, if a person has one credit card with a credit limit of $4,000 and another with $6,000, and spends a total of $3,000 on them in a month, their CUR for that month is 30%. Low CURs affect credit scores positively.</li>
      </ol>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.limitations')}</h3>
      <p>As fruitful as the benefits of having multiple credit cards can be, there are some general disadvantages to take note of.</p>
      <p>For one, it is quite common for people to mismanage their credit card usage in some way, and the biggest culprit is overspending. Statistics have shown that credit card debt is mostly due to spending more than what is affordable on unnecessary purchases, emergency services (medical and non-medical), necessities not covered by income, and necessities during unemployment. Unnecessary purchases are the largest contributor to credit card debt in the U.S.</p>
      <p>Unfortunately, credit cards are a form of unsecured loan with relatively high interest rates with late payment fees, and the penalties become steeper if timely payments are not made consistently. More credit cards will mean more to manage, including separate monthly payments, different due dates, etc.</p>
      <p>For more information about or to do calculations involving budgets and debt payoff strategies, please visit the <a href="/financial-calculators/debt-payoff-calculator" className="text-[#1c4587] underline">Debt Payoff Calculator</a>.</p>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.howItWorks')}</h3>
      <p>There are multiple ways to approach paying off credit card debts each month. The Credit Cards Payoff Calculator uses a method known as the "Debt Avalanche method." The calculator also assumes that no further transactions are made on any of the credit cards, minimum payments stay the same, and interest rates are static. Credit card issuers are required to give 45 days' notice to raise the interest rates, and they can only do so after the first year.</p>
      <p>The debt avalanche method prioritizes the minimum monthly due on all credit cards. The "Monthly Budget Set Aside for Credit Cards" will be spent on these first. After the minimum monthly dues have been paid, any remaining funds will go to the highest interest credit card, followed by the next highest, until there are no more funds or all of the cards have been paid off.</p>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.alternatives')}</h3>
      <p>While the calculator uses the Debt Avalanche method, the Debt Snowball method is an alternative for people who cannot find success using the former. This credit card payoff strategy focuses on psychological factors like motivation and incentive to keep people on track towards paying off their credit card debt. The two methods are similar in that the first priority is always to meet the minimum payments due for each credit card in order to avoid hefty fees. After this, the Debt Snowball strategy is quite simple: pay off the credit card with the smallest balance, regardless of interest rate.</p>
      <p>Although this strategy may be less efficient in that it prioritizes motivational and psychological factors for paying off debt, rather than minimizing the amount of money spent to pay off said debt, it can be a more effective method for paying off debt for certain people. Psychologically, people are more likely to adhere to something when tangible progress is visible, whether it's the elimination of debt, shedding a certain number of pounds, getting a certain grade, or any other task. In the end, a person should choose a method that is most likely to enable them to reduce and eventually eliminate their debt rather than increase it.</p>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.tips')}</h3>
      <ol className="list-decimal pl-8 space-y-2">
        <li><strong>Change due dates</strong>—Many credit card issuers allow a person to change the monthly payment due date. Doing so allows a person to schedule multiple credit cards' due dates on the same day of each month to minimize the hassle of tracking the due dates of each card.</li>
        <li><strong>Set up automatic payments</strong>—Taking advantage of automatic payments can help reduce the possibility of missed payments.</li>
        <li><strong>Eliminate unnecessary credit cards</strong>—It'd probably be a good idea for anyone struggling to manage multiple credit cards to get rid of the cards they rarely use, especially if they carry annual fees. For instance, most people generally don't need three rewards cards with similar benefits. In addition, spending for each card should be tailored towards their perks; for example, a person with a frequent flyer card and a card with no foreign transaction fees can use the former to book a flight but use the latter for actual transactions abroad. Otherwise, all spending can just be placed on one simple card instead.</li>
      </ol>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.tips')}</h3>
      <ul className="list-disc pl-8 space-y-2 mb-8">
        <li>Apply for credit cards with lower interest rates and transfer the balances of the high interest rate cards over. Be sure to read and understand the interest rates for balance transfers, fees, and other terms that may apply.</li>
        <li>Most credit card issuers calculate interest based on the average daily balance, not the balance at the end of the month. The earlier or more that is paid towards a credit card balance, the lower the average daily balance. This means that although most people usually pay once a month at the end of the month, they can save on interest through multiple payments a month, such as every two weeks or even every week.</li>
        <li>Apply for loans with relatively low interest rates and use them to pay off credit cards with higher rates. Taking out a line of credit on your home, refinancing your home, or seeking out personal loans are good alternatives. Be sure to understand the fees and costs pertaining to loans. Use our <a href="/financial-calculators/personal-loan-calculator/" className="text-[#1c4587] underline">Personal Loan Calculator</a> to estimate the real APR of the loan, which should be at least a few points lower than the credit card interest rate for this strategy to work.</li>
        <li>Contact credit card companies to try to negotiate lower interest rates or balances. Most of the time, this won't work until a person has stopped making monthly payments, which is generally not recommended due to its negative impact on other areas of personal finance.</li>
      </ul>

    </div>
  );
}
