import { useTranslations } from 'next-intl';

export function HouseAffordabilityArticle() {
  const t = useTranslations('articles');
  return (
    <div className="text-[13px] font-sans text-gray-800 leading-relaxed mt-8 space-y-4">
      <div className="flex flex-wrap gap-2 mt-2 border-b pb-6">
        <button className="bg-[#1c4587] text-white px-3 py-1 text-[13px] rounded hover:bg-[#153465]">Mortgage Calculator</button>
        <button className="bg-[#1c4587] text-white px-3 py-1 text-[13px] rounded hover:bg-[#153465]">Refinance Calculator</button>
        <button className="bg-[#1c4587] text-white px-3 py-1 text-[13px] rounded hover:bg-[#153465]">Mortgage Payoff Calculator</button>
      </div>

      <p className="mt-6">In the U.S., conventional, FHA, and other mortgage lenders like to use two ratios, called the front-end and back-end ratios, to determine how much money they are willing to loan. They are basic debt-to-income ratios (DTI), albeit slightly different and explained below. For more information about or to do calculations involving debt-to-income ratios, please visit the <a href="/financial-calculators/house-affordability-calculator/" className="text-[#1c4587] underline">Debt-to-Income (DTI) Ratio Calculator</a>.</p>
      <p>Because they are used by lenders to assess the risk of lending to each home-buyer, home-buyers can strive to lower their DTI in order to not only be able to qualify for a mortgage, but for a favorable one. The lower the DTI, the more likely a home-buyer is to get a good deal.</p>

      <h3 className="font-bold text-lg text-black mt-6">Front-End Ratio</h3>
      <p>The front-end debt ratio is also known as the mortgage-to-income ratio and is computed by dividing total monthly housing costs by monthly gross income.</p>
      
      <div className="flex justify-center my-4 items-center gap-2">
        <span>Front-end debt ratio =</span>
        <div className="flex flex-col items-center">
          <span className="border-b border-black px-2">monthly housing costs</span>
          <span>monthly gross income</span>
        </div>
        <span>× 100%</span>
      </div>

      <p>For our calculator, only conventional and FHA loans utilize the front-end debt ratio. The monthly housing costs not only include interest and principal of the loan, but other costs associated with housing like insurance, property taxes, and HOA/Co-Op Fee.</p>

      <h3 className="font-bold text-lg text-black mt-6">Back-End Ratio</h3>
      <p>The back-end debt ratio includes everything in the front-end ratio dealing with housing costs, along with any accrued recurring monthly debt like car loans, student loans, and credit cards.</p>

      <div className="flex justify-center my-4 items-center gap-2">
        <span>Back-end debt ratio =</span>
        <div className="flex flex-col items-center text-center">
          <span className="border-b border-black px-2">monthly housing costs + all other recurring monthly debt</span>
          <span>monthly gross income</span>
        </div>
        <span>× 100%</span>
      </div>

      <p>This ratio is known as the debt-to-income ratio and is used for all the calculations of this calculator.</p>

      <h3 className="font-bold text-lg text-black mt-6">Conventional Loans and the 28/36 Rule</h3>
      <p>In the U.S., a conventional loan is a mortgage that is not insured by the federal government directly and generally refers to a mortgage loan that follows the guidelines of government-sponsored enterprises (GSE's) like Fannie Mae or Freddie Mac. Conventional loans may be either conforming or non-conforming. Conforming loans are bought by housing agencies such as Freddie Mac and Fannie Mae and follow their terms and conditions. Non-conforming loans are any loans not bought by these housing agencies that don't follow the terms and conditions laid out by these agencies, but are generally still considered conventional loans.</p>
      <p>The 28/36 Rule is a commonly accepted guideline used in the U.S. and Canada to determine each household's risk for conventional loans. It states that a household should spend no more than 28% of its gross monthly income on the front-end debt and no more than 36% of its gross monthly income on the back-end debt. The 28/36 Rule is a qualification requirement for conforming conventional loans.</p>
      <p>While it has been adopted as one of the most widely-used methods of determining the risk associated with a borrower, as Shiller documents in his critically-acclaimed book Irrational Exuberance, the 28/36 Rule is often dismissed by lenders under heavy stress in competitive lending markets. Because it is so leniently enforced, certain lenders can sometimes lend to risky borrowers who may not actually qualify based on the 28/36 Rule.</p>

      <h3 className="font-bold text-lg text-black mt-6">FHA Loans</h3>
      <p>Please visit our <a href="/financial-calculators/fha-loan-calculator/" className="text-[#1c4587] underline">FHA Loan Calculator</a> to get more in-depth information regarding FHA loans, or to calculate estimated monthly payments on FHA loans.</p>
      <p>An FHA loan is a mortgage insured by the Federal Housing Administration. Borrowers must pay for mortgage insurance in order to protect lenders from losses in instances of defaults on loans. The insurance allows lenders to offer FHA loans at lower interest rates than usual with more flexible requirements, such as lower down payment as a percentage of the purchase price.</p>
      <p>To be approved for FHA loans, the ratio of front-end to back-end ratio of applicants needs to be better than 31/43. In other words, monthly housing costs should not exceed 31%, and all secured and non-secured monthly recurring debts should not exceed 43% of monthly gross income. FHA loans also require 1.75% upfront premiums.</p>
      <p>FHA loans have more lax debt-to-income controls than conventional loans; they allow borrowers to have 3% more front-end debt and 7% more back-end debt. The reason that FHA loans can be offered to riskier clients is the required upfront payment of mortgage insurance premiums.</p>

      <h3 className="font-bold text-lg text-black mt-6">VA Loans</h3>
      <p>Please visit our <a href="/financial-calculators/va-mortgage-calculator/" className="text-[#1c4587] underline">VA Mortgage Calculator</a> to get more in-depth information regarding VA loans, or to calculate estimated monthly payments on VA mortgages.</p>
      <p>A VA loan is a mortgage loan granted to veterans, service members on active duty, members of the national guard, reservists, or surviving spouses, and is guaranteed by the U.S. Department of Veterans Affairs (VA).</p>
      <p>To be approved for a VA loan, the back-end ratio of the applicant needs to be better than 41%. In other words, the sum of monthly housing costs and all recurring secured and non-secured debts should not exceed 41% of gross monthly income. VA loans generally do not consider front-end ratios of applicants but require funding fees.</p>

      <h3 className="font-bold text-lg text-black mt-6">Custom Debt-to-Income Ratios</h3>
      <p>The calculator also allows the user to select from debt-to-income ratios between 10% to 50% in increments of 5%. If coupled with down payments less than 20%, 0.5% of PMI insurance will automatically be added to monthly housing costs because they are assumed to be calculations for conventional loans. There are no options above 50% because that is the point at which DTI exceeds risk thresholds for nearly all mortgage lenders.</p>
      <p>In general, home-buyers should use lower percentages for more conservative estimates and higher percentages for more risky estimates. A 20% DTI is easier to pay off during stressful financial periods compared to, say, a 45% DTI. Home-buyers who are unsure of which option to use can try the Conventional Loan option, which uses the 28/36 Rule.</p>

      <h3 className="font-bold text-lg text-black mt-6">Unaffordability</h3>
      <p>If you cannot immediately afford the house you want, below are some steps that can be taken to increase house affordability, albeit with time and due diligence.</p>
      
      <ul className="list-disc pl-8 space-y-2">
        <li><b>Reduce debt in other areas</b>—This may include anything from choosing a less expensive car to paying off student loans. In essence, lowering the standard of living in other areas can make it more possible to afford a particularly sought-after house.</li>
        <li><b>Increase credit score</b>—A better credit score can help buyers find a loan with a better interest rate. A lower interest rate helps the buyer's purchasing power.</li>
        <li><b>Bigger down payment</b>—Paying more upfront accomplishes two things. One, it directly increases the amount the buyer can afford. Two, a big down payment helps the buyer find a better interest rate and therefore increases the buyer's purchasing power.</li>
        <li><b>Save more</b>—When desired DTI ratios aren't met, mortgage lenders may look at the amount of savings of each borrower as a compensating factor.</li>
        <li><b>Higher income</b>—Although increasing income is easier said than done, it can culminate in the most drastic change in a borrower's ability to purchase a certain home. A large increase in salary immediately has a large impact on DTI ratios. Acquiring a higher income usually involves different combinations of achieving higher education, improving skills, networking, constant job searching, and typically lots of hard work.</li>
      </ul>

      <p className="mt-4">Working towards achieving one or more of these will increase a household's success rate in qualifying for the purchase of a home in accordance with lenders' standards of qualifications. If these prove to be difficult, home-buyers can maybe consider less expensive homes. Some people find better luck moving to different cities. If not, there are various housing assistance programs at the local level, though these are geared more towards low-income households. Renting is a viable alternative to owning a home, and it may be helpful to rent for the time being in order to set up a better buying situation in the future. For more information about or to do calculations involving rent, please visit the <a href="/financial-calculators/rent-calculator/" className="text-[#1c4587] underline">Rent Calculator</a>.</p>
    </div>
  );
}
