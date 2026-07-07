import { useTranslations } from 'next-intl';

export function SalaryArticle() {
  const t = useTranslations('articles');
  return (
    <div className="text-[13px] font-sans text-gray-800 leading-relaxed mt-8 space-y-4">
      <p>This calculator assumes the hourly and daily salary inputs to be unadjusted values. All other pay frequency inputs are assumed to be holidays and vacation days adjusted values. This calculator also assumes 52 working weeks or 260 weekdays per year in its calculations. The unadjusted results ignore the holidays and paid vacation days.</p>

      <div className="mt-6 flex items-center gap-2 font-bold text-[13px]">
        <span className="w-4 h-4 bg-[#1c4587] text-white flex items-center justify-center rounded-sm text-[10px]">L</span> Related
      </div>
      <div className="flex gap-2 mt-2 border-b pb-6">
        <button className="bg-[#1c4587] text-white px-3 py-1 text-sm rounded hover:bg-[#153465]">Take Home Pay Calculator</button>
        <button className="bg-[#1c4587] text-white px-3 py-1 text-sm rounded hover:bg-[#153465]">Income Tax Calculator</button>
      </div>

      <p className="mt-6">A salary or wage is the payment from an employer to a worker for the time and works contributed. To protect workers, many countries enforce minimum wages set by either central or local governments. Also, unions may be formed in order to set standards in certain companies or industries.</p>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.definition')}</h3>
      <p>A salary is normally paid on a regular basis, and the amount normally does not fluctuate based on the quality or quantity of work performed. An employee's salary is commonly defined as an annual figure in an employment contract that is signed upon hiring. Salary can sometimes be accompanied by additional compensation such as goods or services.</p>

      <h3 className="font-bold text-lg text-black mt-6">Wage</h3>
      <p>There are several technical differences between the terms "wage" and "salary." For starters, while the word "salary" is best associated with employee compensation on an annual basis, the word "wage" is best associated with employee compensation based on the number of hours worked multiplied by an hourly rate of pay. Also, wage-earners tend to be non-exempt, which means they are subject to overtime wage regulations set by the government to protect workers. In the U.S., these regulations are part of the Fair Labor Standards Act (FLSA). Non-exempt employees often receive 1.5 times their pay for any hours they work after surpassing 40 hours a week, also known as overtime pay, and sometimes double (and less commonly triple) their pay if they work on holidays. Salaried employees generally do not receive such benefits; if they work over 40 hours a week or on holiday, they will not be directly financially compensated for doing so. Generally speaking, wage-earners tend to earn less than salaried employees. For instance, a barista that works in a cafe may earn a "wage," while a professional that works in an office setting may earn a "salary." As a result, salaried positions often have a higher perceived status in society.</p>
      <p>Most salaries and wages are paid periodically, typically monthly, semi-monthly, bi-weekly, weekly, etc. Although it is called a Salary Calculator, wage-earners may still use the calculator to convert amounts.</p>

      <h3 className="font-bold text-[15px] text-black mt-4">{t('section_headings.benefits')}</h3>
      <p>While salary and wages are important, not all financial benefits from employment come in the form of a paycheck. Salaried employees, and to a lesser extent, wage-earners, typically have other benefits, such as employer-contributed healthcare insurance, payroll taxes (half of the Social Security and Medicare tax in the U.S.) that go towards old age and disability, unemployment tax, employer-contributed retirement plans, paid holiday/vacation days, bonuses, company discounts, and more. Part-time employees are less likely to have these benefits.</p>
      <p>Miscellaneous employee benefits can be worth a significant amount in terms of monetary value. As such, it is important to consider these benefits as well as the base wage or salary offered when choosing between jobs.</p>

      <h3 className="font-bold text-[15px] text-black mt-4">Self-employed Contractors</h3>
      <p>Self-employed contractors (freelancers who sell their goods and services as sole proprietorships) typically provide their own rates, which can be hourly, daily, or weekly, etc. Also, contractors generally do not have benefits such as paid time off, medical health insurance, or any other monetary perks typically associated with full-time employment. As a result, their pay rates should generally be higher (sometimes significantly so) than the salaries of equivalent full-time positions. Nevertheless, rates in the real world are driven by many factors, and it is not rare to see contractors take lower compensation.</p>

      <h3 className="font-bold text-lg text-black mt-6">How Unadjusted and Adjusted Salaries are calculated?</h3>
      <p>Using a $30 hourly rate, an average of eight hours worked each day, and 260 working days a year (52 weeks multiplied by 5 working days a week), the annual unadjusted salary can be calculated as:</p>
      <p className="text-center font-bold">$30 × 8 × 260 = $62,400</p>
      <p>As can be seen, the hourly rate is multiplied by the number of working days a year (unadjusted) and subsequently multiplied by the number of hours in a working day. The adjusted annual salary can be calculated as:</p>
      <p className="text-center font-bold">$30 × 8 × (260 - 25) = $56,400</p>
      <p>Using 10 holidays and 15 paid vacation days a year, subtract these non-working days from the total number of working days a year.</p>
      <p>All bi-weekly, semi-monthly, monthly, and quarterly figures are derived from these annual calculations. It is important to make the distinction between bi-weekly, which happens every two weeks, and semi-monthly, which occurs twice per month, usually on the fifteenth and final day of the month.</p>

      <h3 className="font-bold text-[15px] text-black mt-4">Different Pay Frequencies</h3>
      <p>The calculator contains options to select from a number of periods normally used to express salary amounts, but actual pay frequencies as mandated by varying countries, states, industries, and companies can differ. In the U.S., there is no federal law that mandates pay frequency, except one stating that employees must be paid in routine and predictable manners. Mandatory consistent payments give employees a lot of stability and flexibility. However, at the state level, most states have minimum pay frequency requirements except for Alabama, Florida, and South Carolina. For further details, consult state regulations regarding pay frequency.</p>
      <p>The most common pay period frequencies tend to be monthly, semi-monthly (twice a month), bi-weekly (every two weeks), weekly, and daily. They are explained in the following chart.</p>

      <table className="w-full text-[13px] border-collapse my-4 border border-gray-300">
        <tbody>
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 bg-gray-50 w-[120px]">Daily</td>
            <td className="p-2">Pays every day, usually at the end of the day. Some short-term contractors are paid this way.</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 bg-gray-50">Weekly</td>
            <td className="p-2">Pays once each week, usually on Fridays. Relatively costly for employers with 52 weeks a year, resulting in higher payroll processing costs, which is the main reason why it is less common than Bi-Weekly or Semi-Monthly.</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 bg-gray-50">Bi-Weekly</td>
            <td className="p-2">Pays every two weeks, which comes out to 26 times a year for most years.</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 bg-gray-50">Semi-Monthly</td>
            <td className="p-2">Pays twice each month, usually on the 15th and the last day of the month. Although common, it will result in inconsistent pay dates due to differences in dates from month to month.</td>
          </tr>
          <tr>
            <td className="p-2 border-r border-gray-300 bg-gray-50">Monthly</td>
            <td className="p-2">Pays once per month. Usually the most cost-friendly option for employers. Not very common in the U.S.</td>
          </tr>
        </tbody>
      </table>

      <h3 className="font-bold text-[15px] text-black mt-6">U.S. Salary Information</h3>
      <p>In the U.S., salaried employees are also often known as exempt employees, according to the Fair Labor Standards Act (FLSA). This means that they are exempt from minimum wage, overtime regulations, and certain rights and protections that are normally only granted to non-exempt employees. To be considered exempt in the U.S., employees must make at least $684 per week (or $35,568 annually), receive a salary, and perform job responsibilities as defined by the FLSA. Certain jobs are specifically excluded from FLSA regulations, including many agricultural workers and truck drivers, but the majority of workers will be classified as either exempt or non-exempt.</p>
      <p>The federal minimum wage rate is $7.25 an hour. However, states may have their own minimum wage rates that override the federal rate, as long as it is higher. For instance, the District of Columbia (DC) has the highest rate of all states at $17.95 and will use that figure for wage-earners in that jurisdiction instead of the federal rate. On the other hand, Georgia has their minimum wage rate set at $5.15, but the $7.25 federal minimum rate overrides it.</p>
      
      <p className="font-bold mt-4 text-black">Factors that Influence Salary (and Wage) in the U.S. (Most Statistics are from the U.S. Bureau of Labor in 2025)</p>
      <p>In the third quarter of 2025, the average salary of a full-time employee in the U.S. is $1,214 per week, which comes out to $63,128 per year. While this is an average, keep in mind that it will vary according to many different factors. The following are only generalizations and are not true for everyone, especially in regards to race, ethnicity, and gender.</p>
      
      <ul className="list-disc pl-8 space-y-2">
        <li><b>Age</b>—A person closer to their peak income years, which is 35-65, will generally have higher salaries. Men aged 35 to 44 had the highest annual earnings at $78,208, and women earned the most between the ages of 35 and 44 at $63,752.</li>
        <li><b>Education</b>—The higher the attained level of education of a person, the higher their salary tends to be. Workers 25 or over without a high school degree had median earnings of $40,404 compared to $50,960 for high school graduates. Workers with at least bachelor's degrees earned $95,644 annually on average.</li>
        <li><b>Experience</b>—In general, the further entrenched a person is in their career, the more experience or perceived ability they have, or the more valuable their skillset, the higher their salary tends to be.</li>
        <li><b>Race and Ethnicity</b>—Black men earned a median salary of $53,664, compared to white men at $70,824. The discrepancy is less for black women compared to white women: $48,204 and $57,254. Hispanic and Asian people of both genders earned $45,088 and $84,240, respectively.</li>
        <li><b>Gender</b>—Men earned an average salary of $69,316, and women earned $55,952. Women are generally paid less than men, and this difference is called the gender pay gap. There are many reasons that the pay gap exists, including discrimination, the specific industry, motherhood, and gender roles.</li>
        <li><b>Industry</b>—Industry affects wages paid, even in similar roles. For instance, all else being equal, an office clerk at a public school system will most likely make a lower salary than one at a private hedge fund. This also includes the relative stability of industries and companies and their forecasted trends.</li>
        <li><b>Location</b>—Different locations will have different supplies and demands for positions, and average salaries in each area will reflect this. Keep in mind that the cost of living should be noted when comparing salaries. In some cases, a job that offers a higher salary may equate to less overall once the cost of living of a different location is accounted for.</li>
        <li><b>Misc.</b>—To a lesser extent, salary is also influenced by the overall performance of companies; during years of high profits, a company may choose to pay a higher than average salary for a job applicant with excellent credentials. Also, in certain jobs, workers are expected to perform job responsibilities in dangerous working conditions, such as handling dangerous chemicals in a research facility, working in an underground mine with the presence of potential toxins, or patrolling a notoriously dangerous part of town as a police officer. Such jobs can be compensated with a higher salary in the form of hazard pay. Similarly, people who work less favorable shift hours, such as the "graveyard shift," which runs through the early hours of the morning, can sometimes earn a premium for doing so, due to the higher social and physical costs of working outside normal hours.</li>
      </ul>

      <p className="font-bold text-center mt-6 text-black">The 11 Annual Federal Holidays in the U.S.</p>
      <div className="flex justify-center">
        <table className="w-[300px] text-[13px] border-collapse border border-gray-300">
          <tbody>
            <tr className="border-b border-gray-300"><td className="p-1 border-r bg-gray-50">January</td><td className="p-1">New Year's Day, Birthday of Martin Luther King Jr.</td></tr>
            <tr className="border-b border-gray-300"><td className="p-1 border-r bg-gray-50">February</td><td className="p-1">Washington's Birthday</td></tr>
            <tr className="border-b border-gray-300"><td className="p-1 border-r bg-gray-50">May</td><td className="p-1">Memorial Day</td></tr>
            <tr className="border-b border-gray-300"><td className="p-1 border-r bg-gray-50">June</td><td className="p-1">Juneteenth National Independence Day</td></tr>
            <tr className="border-b border-gray-300"><td className="p-1 border-r bg-gray-50">July</td><td className="p-1">Independence Day</td></tr>
            <tr className="border-b border-gray-300"><td className="p-1 border-r bg-gray-50">September</td><td className="p-1">Labor Day</td></tr>
            <tr className="border-b border-gray-300"><td className="p-1 border-r bg-gray-50">October</td><td className="p-1">Columbus Day</td></tr>
            <tr className="border-b border-gray-300"><td className="p-1 border-r bg-gray-50">November</td><td className="p-1">Veterans Day, Thanksgiving Day</td></tr>
            <tr><td className="p-1 border-r bg-gray-50">December</td><td className="p-1">Christmas Day</td></tr>
          </tbody>
        </table>
      </div>

      <p>Although there are 11 federal holidays in the U.S., companies typically allow time off for 6 to 11 holidays. Generally, only employees who work in a branch of the federal government benefit from all federal holidays. Employees that work for private employers are subject to the policy of their employer. Also, unless stated in a contractual collective bargaining agreement, an employer is legally not obligated to pay an employee anything extra such as overtime for working on a federal holiday.</p>
      <p>Other countries have a varying number of public holidays. Cambodia has the most days in a year in the world set aside to be non-working days, as established by law, at 28, followed by Sri Lanka at 25. Remember to adjust the "Holidays per year" input to calculate a correct adjusted result.</p>

      <p className="font-bold text-[14px] mt-4">Vacation Days, or Paid Time Off (PTO)</p>
      <p>Traditionally in the U.S., vacation days were distinctly separate from holidays, sick leaves, and personal days. Today, it is more common to have them all integrated together into a system called paid time off (PTO). PTO provides a pool of days that an employee can use for personal pleas, sick leave, or vacation days. Most importantly, the reasons for taking time off do not have to be distinguished. There's no need to fumble over whether to designate an absence as sick or personal leave, or to have to ask the manager to use a vacation day as a sick day. There are, however, some downsides to having them combined. For instance, if an employee gets very sick for a week and has to take five days off, their total pool of PTO will be reduced by the five days absent, which may force them to reconsider the week-long vacation they had originally planned.</p>
      <p>In the U.S., the Fair Labor Standards Act (FLSA) does not require employers to give their employees any vacation time off, paid or unpaid. Therefore, when interviewing and deciding between jobs, it may be wise to ask about the PTO policy of each potential employer. With that said, the average American gets around 10 days of PTO a year; the bottom 25% of wage earners only get an average of four paid vacation days a year. Most companies tend to institute a policy that increases the amount of PTO an employee gets every several years or so as an incentive to retain workers.</p>
      <p>Most employers (over 75%) tend to provide vacation days or PTO for many beneficial reasons. They can help prevent employee burnout, maintain employee morale, or be used for any reasonable situations where leave is necessary, such as medical emergencies, family needs, and of course, actual vacations. As an aside, European countries mandate that employers offer at least 20 days a year of vacation, while some European Union countries go as far as 25 or 30 days. Some other developed countries around the world have vacation time of up to four to six weeks a year, or even more.</p>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.tips')}</h3>
      <p>There are very few people in the world who wouldn't welcome a higher salary, and there are a myriad of ways in which a person can try to do so. While it is definitely easier said than done, it is certainly possible.</p>
      <ul className="list-disc pl-8 space-y-2">
        <li><b>Education</b>—Statistics have shown that the higher the level of education a person attains, the higher their average lifetime earnings. However, becoming more educated for a higher salary does not imply that everyone should immediately go out and receive a higher degree. Proof of knowledge can come in many other different forms. For one, qualifications or certifications are a less time-consuming and financially significant undertaking that can still result in a salary increase. Simply increasing relevant knowledge or expertise that pertains to a niche profession or industry can increase salary. This may involve staying up-to-date on current events within the niche by attending relevant conferences or spending leisure time reading on the subject.</li>
        <li><b>Experience</b>—The more experience a person has within any niche industry or profession, the more likely their salary will increase over the years, given that they stay within the industry. This may be due to several reasons; for one, it shows that a person has enough interest in the industry to stay within it long-term. Secondly, by lasting within the industry long enough, there is sufficient proof that they are probably somewhat skilled. Employers see these as good signs and are more willing to increase a worker's salary.</li>
        <li><b>Network</b>—For many niche professions or industries, there are professional organizations or trade associations that help their members network. These organizations try to connect their members with other members who may share the same profession and goals, or work in the same industry, which can potentially lead to job opportunities that can improve the salary.</li>
        <li><b>Performance Reviews</b>—Most employers give out annual performance reviews to their employees. Most performance reviews usually involve a conversation between manager and employee regarding the past year and how the employee performed, the direction of the employee's role moving forward, including any new responsibilities they may have, and constructive criticism on what they could do better, among other things. Annual reviews that are, for the most part, positive are generally followed by an annual pay raise. If no raise is given, even after a glowing review, it may be in the employee's best interest to ask for a salary increase or begin considering other employment options.</li>
        <li><b>Negotiate</b>—If a performance review was mostly positive, but no mention of a pay raise is made, it may be worth considering approaching the employer to attempt to negotiate a pay raise. Highlight achievements, particularly those that may have been mentioned in a performance review, such as meeting or exceeding certain sales goals, taking on a number of new job responsibilities, or anything valuable that was contributed to the employer that might warrant a raise. When starting a new job, it is also important to negotiate a higher salary, if possible.</li>
        <li><b>Change jobs</b>—People that are stuck in a career they dislike with no salary increase and who have exhausted all other options to try to increase their salary may want to consider changing jobs. It is fairly common for some people to have a 10% or more increase in salary from doing so.</li>
      </ul>
    </div>
  );
}
