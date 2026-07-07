import { useTranslations } from 'next-intl';
export function IncomeTaxArticle() {
  const t = useTranslations('articles');
  return (
    <div className="text-[13px] font-sans text-gray-800 leading-relaxed mt-8 space-y-4">
      <h3 className="font-bold text-lg text-black mt-6">Taxable Income</h3>
      <p>In order to find an estimated tax refund or due, it is first necessary to determine a proper taxable income. It is possible to use W-2 forms as a reference for filling out the input fields. Relevant W-2 boxes are displayed to the side if they can be taken from the form. Taking gross income, subtract deductions and exemptions such as contributions to a 401(k) or pension plan. The resulting figure should be the taxable income amount.</p>

      <h3 className="font-bold text-lg text-black mt-6">Other Taxable Income</h3>
      <p><b>Interest Income</b>–Most interest will be taxed as ordinary income, including interest earned on checking and savings accounts, CDs, and income tax refunds. However, there are certain exceptions, such as municipal bond interest and private-activity bonds.</p>
      <p><b>Short-term Capital Gains/Losses</b>–profit or loss from the sale of assets held for less than one year. It is taxed as a normal income.</p>
      <p><b>Long-term Capital Gains/Losses</b>–profit or loss from the sale of assets held for one year or longer. Taxed at lower applied rate determined by ordinary income marginal tax rate.</p>
      <p><b>Ordinary Dividends</b>–All dividends should be considered ordinary unless specifically classified as qualified. Ordinary dividends are taxed as normal income.</p>
      <p><b>Qualified Dividends</b>–These are taxed at the same rate as long-term capital gains, lower than that of ordinary dividends. There are many stringent measures in place for dividends to be legally defined as qualified.</p>
      <p><b>Passive Incomes</b>–Making the distinction between passive and active income is important because taxpayers can claim passive losses. Passive income generally comes from two places, rental properties or businesses that don't require material participation. Any excessive passive income loss can be delayed until used or deducted in the year the taxpayer disposes of the passive activity in a taxable transaction.</p>

      <h3 className="font-bold text-lg text-black mt-6">Exemptions</h3>
      <p>Broadly speaking, tax exemptions are monetary exemptions with the aim of reducing or even entirely eliminating taxable income. They do not only apply to personal income tax; for instance, charities and religious organizations are generally exempt from taxation. In some international airports, tax-exempt shopping in the form of duty-free shops is available. Other examples include state and local governments not being subject to federal income taxes.</p>

      <h3 className="font-bold text-lg text-black mt-6">Tax Deductions</h3>
      <p>Tax deductions arise from expenses. They help lower tax bills by reducing the percentage of adjusted gross income that is subject to taxes. There are two types of deductions, above-the-line (ATL) and below-the-line (BTL) itemized deductions, which reduce tax based on the marginal tax rate. The "line" in question is the adjusted gross income (AGI) of the taxpayer and is the bottom number on the front of Form 1040.</p>

      <p className="font-bold text-[14px]">Modified Adjusted Gross Income (MAGI)</p>
      <p>MAGI is mainly used to determine whether a taxpayer is qualified for certain tax deductions. It is simply AGI with some deductions added back in. These deductions are:</p>
      <ul className="list-disc pl-8 space-y-1">
        <li>Student loan interest</li>
        <li>One-half of self-employment tax</li>
        <li>Qualified tuition expenses</li>
        <li>Tuition and fees deduction</li>
        <li>Passive loss or passive income</li>
        <li>IRA contributions, taxable Social Security payments</li>
        <li>The exclusion for income from U.S. savings bonds</li>
        <li>The exclusion under 137 for adoption expenses</li>
        <li>Rental losses</li>
        <li>Any overall loss from a publicly traded company</li>
        <li>Non-taxable compensation</li>
        <li>Car loan interest</li>
        <li>Seniors</li>
      </ul>

      <p className="font-bold text-[14px] mt-4">Above-the-line Deductions</p>
      <p>ATL deductions lower AGI, which means less income to pay taxes on. They include expenses that are claimed on Schedules C, D, E, and F, and "Adjustments to Income." One advantage of ATL deductions is that they are allowed under the alternative minimum tax. ATL deductions have no effect on the BTL decision of whether to take the standard deduction or to itemize instead. Please consult the official IRS website for more detailed information regarding precise calculations of tax deductions. Below are some common examples of ATL deductions.</p>
      <ul className="list-disc pl-8 space-y-2">
        <li><b>Traditional IRA contributions</b>–Most people are eligible to make contributions to a traditional IRA, but these contributions aren't necessarily tax-deductible. If Modified Adjusted Gross Income exceeds annual limits, the taxpayer may need to reduce or eliminate their IRA deduction.</li>
        <li><b>Student loan interest</b>–The amount of interest accrued from federal student loans. It should be in box 1 of Form 1098-E, which should be sent by lenders after the first year. Those who are married but file separate returns cannot claim this deduction. This deduction also cannot be claimed if Modified Adjusted Gross Income exceeds the annual limits. In 2025, the claim limit for single, head of household, or qualifying widower is $100,000; for joint filers, the cap is $200,000.</li>
        <li><b>Qualified tuition and fees</b>–Must be qualified education expenses based on IRS definitions. This deduction cannot be claimed by those who are married but filing separate returns. This deduction cannot be claimed in conjunction with an educational tax credit.</li>
        <li><b>Moving expenses</b>–The costs of transporting household items from one residence to another for work or business purposes are usually fully deductible, as long as they are not reimbursed by the taxpayer's employer. The taxpayer's new place of employment must be at least 50 miles away from the previous residence.</li>
        <li><b>Tips</b>–For tax years 2025 through 2028, qualified tips of up to $25,000 per year may be deducted. The deduction phases out for taxpayers with a modified adjusted gross income over $150,000 ($300,000 for joint filers).</li>
        <li><b>Overtime compensation</b>–For tax years 2025 through 2028, qualified overtime compensation of up to $12,500 per year for single filers and $25,000 per year for joint filers may be deducted. The deduction phases out for taxpayers with a modified adjusted gross income over $150,000 ($300,000 for joint filers).</li>
        <li><b>Car loan interest</b>–For tax years 2025 through 2028, individuals may deduct up to $10,000 per year in interest paid on a loan used to purchase a qualified vehicle. The deduction phases out for taxpayers with a modified adjusted gross income over $100,000 ($200,000 for joint filers).</li>
        <li><b>Deduction for seniors</b>–For tax years 2025 through 2028, individuals aged 65 and older may claim an additional deduction of $6,000 per year for single filers, or a total of $12,000 per year for married couples in which both spouses qualify. The deduction phases out for taxpayers with a modified adjusted gross income over $75,000 ($150,000 for joint filers).</li>
      </ul>

      <p className="font-bold text-[14px] mt-4">Below-the-line Deductions</p>
      <p>BTL deductions refer to the Standard Deduction or Itemized Deductions from Schedule A. A BTL deduction is always limited to the amount of the actual deduction. For example, a $1,000 deduction can only reduce net taxable income by $1,000. Please consult the official IRS website for more detailed information regarding precise calculations of tax deductions. Examples of common BTL deductions (as opposed to taking the standard deduction):</p>
      <ul className="list-disc pl-8 space-y-2">
        <li><b>Mortgage interest</b>–This can apply to a regular mortgage up to a certain limit; $750,000 in 2025 and 2026, for a main residency, a second mortgage, a line of credit, or a home equity loan. Loans that aren't secured debt on a home are considered personal loans, which are not deductible. The IRS defines a "home" as anything from a house to a condo, co-op, mobile home, boat, or RV.</li>
        <li><b>Charitable donations</b>–Only donations to qualified charities can qualify as tax deductions. Handouts to the homeless or payments to local organizations that aren't classified as non-profit by the IRS cannot be deducted.</li>
        <li><b>Medical expenses</b>–Any expense paid for the prevention, diagnosis, or medical treatment of physical or mental illness or any amounts paid to treat or modify parts or functions of the body for health can be deducted. Medical expenses for cosmetic purposes do not qualify. If premiums are paid with after-tax dollars, deductions are limited only to the expenses that exceed 10% of adjusted gross income, and 7.5% for anyone 65 and older. Note that health savings account contributions are ATL deductions.</li>
        <li><b>Sales and local tax</b>–Sometimes referred to as SALT (state and local tax), this federal deduction can be either income tax or sales tax, but not both. Taxpayers who live in states that don't have an income tax are provided better off using their sales tax for the deduction. In 2025 and 2026, this deduction cannot exceed $40,000 and $40,400. The SALT cap begins to phase down to $10,000 once the Modified Adjusted Gross Income exceeds $500,000 for 2025 and $505,000 for 2026.</li>
      </ul>

      <p>Most BTL deductions are the run-of-the-mill variety above, including several others like investment interest or tax preparation fees. However, the IRS allows the deduction of certain costs that can reduce tax bills. Examples are given below, though they are not the entire package. For further information, visit the official IRS website.</p>

      <ul className="list-disc pl-8 space-y-2">
        <li><b>Out-of-pocket charitable contributions</b>–Not only are donations to charitable organizations deductible, out-of-pocket expenses for charitable work can also be deducted, for example, buying paint to paint the walls of a cathedral or buying ingredients to cook for a homeless shelter.</li>
        <li><b>Tax savings for teachers</b>–This deduction allows K-12 educators to deduct up to $250 a year for school materials.</li>
        <li><b>Paying babysitters</b>–Believe it or not, if a person performs volunteer work at a non-profit while a babysitter takes care of their kids at home, any payment to the babysitter for childcare can be deducted!</li>
        <li><b>Job searching</b>–By itemizing expenses of costs associated with searching for a new job, if the expenses accrued when searching for a new job exceed two percent of adjusted gross income, the qualifying expenses over the threshold can be deducted. Examples of such out-of-pocket expenses can include the mileage of driving to interviews, printing resumes or business cards.</li>
        <li><b>Smoking cessation</b>–Participating in a smoking cessation program can be considered a medical tax deduction. The deduction can also apply to prescription drugs used to ease nicotine withdrawal.</li>
        <li><b>Disaster recovery</b>–If a taxpayer's home is affected by a natural disaster and the taxpayer requires federal aid, uninsured costs of recovery can be deducted.</li>
      </ul>

      <p className="font-bold text-[14px] mt-4">Business expenses</p>
      <p>Any cost that is associated with carrying on a business or trade can usually be deducted if the business operates to make a profit. However, it must be both ordinary and necessary. Try to make the distinction between business expenses from other capital or personal expenses and expenses used to determine the cost of goods sold. Any business expense incurred under the operation of a sole proprietorship is considered ATL because they are deducted on Schedule C then subtracted to calculate AGI. Business-related expenses involve many different rules and are complex. Some can be either ATL or BTL based on the type and nature of it. As such, it may be a good idea to consult official IRS rules relating to the deduction of business expenses.</p>
    </div>
  );
}
