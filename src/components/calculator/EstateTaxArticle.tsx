import React from 'react';
import { useTranslations } from 'next-intl';

export function EstateTaxArticle() {
  const t = useTranslations('articles');
  return (
    <div className="text-[13px] font-sans text-gray-800 leading-relaxed mt-8 space-y-4">
      
      <h3 className="font-bold text-[18px] text-[#1c4587] mb-2 font-sans">U.S. Estate and Gift Tax Exemptions and Tax Rates</h3>
      
      <table className="w-full max-w-[300px] border-collapse text-center text-[13px] border border-gray-300 mb-6">
        <thead>
          <tr className="bg-[#466a9b] text-white">
            <th className="p-1 border border-gray-300 font-normal">Year</th>
            <th className="p-1 border border-gray-300 font-normal">Lifetime Exemption</th>
            <th className="p-1 border border-gray-300 font-normal">Tax Rates</th>
          </tr>
        </thead>
        <tbody className="bg-[#f2f2f2]">
          <tr className="border-b border-white"><td className="p-1">2001</td><td className="p-1">$675,000</td><td className="p-1">55%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2002</td><td className="p-1">$1 million</td><td className="p-1">50%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2003</td><td className="p-1">$1 million</td><td className="p-1">49%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2004</td><td className="p-1">$1.5 million</td><td className="p-1">48%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2005</td><td className="p-1">$1.5 million</td><td className="p-1">47%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2006</td><td className="p-1">$2 million</td><td className="p-1">46%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2007</td><td className="p-1">$2 million</td><td className="p-1">45%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2008</td><td className="p-1">$2 million</td><td className="p-1">45%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2009</td><td className="p-1">$3.5 million</td><td className="p-1">45%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2010</td><td className="p-1">Repealed</td><td className="p-1">0%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2011</td><td className="p-1">$5 million</td><td className="p-1">35%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2012</td><td className="p-1">$5.12 million</td><td className="p-1">35%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2013</td><td className="p-1">$5.25 million</td><td className="p-1">40%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2014</td><td className="p-1">$5.34 million</td><td className="p-1">40%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2015</td><td className="p-1">$5.43 million</td><td className="p-1">40%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2016</td><td className="p-1">$5.45 million</td><td className="p-1">40%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2017</td><td className="p-1">$5.49 million</td><td className="p-1">40%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2018</td><td className="p-1">$11.18 million</td><td className="p-1">40%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2019</td><td className="p-1">$11.4 million</td><td className="p-1">40%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2020</td><td className="p-1">$11.58 million</td><td className="p-1">40%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2021</td><td className="p-1">$11.7 million</td><td className="p-1">40%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2022</td><td className="p-1">$12.06 million</td><td className="p-1">40%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2023</td><td className="p-1">$12.92 million</td><td className="p-1">40%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2024</td><td className="p-1">$13.61 million</td><td className="p-1">40%</td></tr>
          <tr className="border-b border-white"><td className="p-1">2025</td><td className="p-1">$13.99 million</td><td className="p-1">40%</td></tr>
          <tr className="border-b border-gray-300"><td className="p-1">2026</td><td className="p-1">$15 million</td><td className="p-1">40%</td></tr>
        </tbody>
      </table>

      <h3 className="font-bold text-lg text-black mt-6">Estate Tax</h3>
      <p>An estate tax is a tax imposed on the total value of a person's estate at the time of their death. It is sometimes referred to as a "death tax." Although states may impose their own estate taxes in the United States, this calculator only estimates federal estate taxes (Click here to check state-specific laws). For the context of this calculator, the definition of "estate" should not be confused with a common alternative definition, which is an interest in real property. Depending on the taxable value of an estate, relatively low-valued estates will not require the filing of estate tax returns because they are below the tax exemptions threshold. For estates above the threshold, only the amounts that exceed the threshold for that year are taxable. The calculator can help determine this threshold. Due to marital deduction, the transfer of assets to a surviving spouse is not taxable, and only assets transferred to other heirs are taxable.</p>
      <p>In the United States, most people who have funds above the exemption amount ultimately won't end up paying much estate tax, according to the Urban-Brookings Tax Policy Center. Estate and gift taxes, the congressional budget office noted, raised only about $32 billion in federal revenue in 2024. That's about one percent of the trillions of wealth that changes hands in inheritance and gifts each year. The effective rate is low for several reasons. Firstly, as mentioned above, the estate tax only applies to the portion of the estate above the exemption. Secondly, there are various legal loopholes that allow people to shield their wealth from Uncle Sam. For instance, parents "sell" parts of their assets to children at discounted rates and take the tax hit themselves. Also, trusts, which are explained in detail below, are a common and viable method to reduce taxable estates.</p>

      <h3 className="font-bold text-lg text-black mt-6">Inheritance Tax</h3>
      <p>Upon death, a deceased person's estate is usually passed onto their heirs. An heir is said to receive an inheritance if all or part of an estate from a recently deceased person is passed onto them. An inheritance tax is usually paid by a person inheriting an estate. The major difference between estate tax and inheritance tax is who pays the tax. The estate tax is paid based on the deceased person's estate before the money is distributed, but inheritance tax is paid by the person inheriting or receiving the money. While the federal government in the U.S. does not enforce an inheritance tax, some states in the U.S. enforce their own. The level of taxation applied is mainly dependent on the relationship between the deceased and the heir, and the value of the property received by the heir. However, in all states, inheritance from a spouse or domestic partner is exempt, while most inheriting children pay little or no inheritance tax. More distant inheritors tend to pay higher inheritance taxes.</p>
      <p>The main purpose of the estate or inheritance tax is to raise government income, but it also serves a secondary purpose to redistribute wealth in society; an estate or inheritance tax can make it difficult for generations of a family to continually accumulate and concentrate wealth. The idea of an inheritance tax is a fairly old concept and dates back to the Roman Empire. However, current estate tax policies are mainly derived from feudal arrangements between heirs and sovereignty in the European Middle Ages.</p>

      <h3 className="font-bold text-lg text-black mt-6">Determining Taxable Value of an Estate</h3>
      <p>An estate is the estimated net worth of a person, which typically consists of their assets less any liabilities. Assets can be anything of value, such as cash, securities, real estate, insurance, trusts, annuities, and business interests. The value of these items is neither what was paid for them nor what their values were when acquired, but is assessed based on fair market value, which is a "reasonable amount" at which the items can be purchased by interested buyers. The total fair market value of a person's assets is called a gross estate. After the value of the estate is determined, certain liabilities or reductions may be deducted from the gross estate. Common liabilities include mortgages, unpaid debts, estate administration expenses, and assets that may be passed to surviving spouses or qualified charities. After accounting for liabilities, the value of lifetime taxable gifts (any gifts made in 1977 or later) is added to this net amount then reduced by the unified tax credit resulting in the taxable value of the estate.</p>

      <h3 className="font-bold text-lg text-black mt-6">Reducing Estate Tax</h3>
      <p>There are several things that can be done in order to reduce estate taxes.</p>
      <ol className="list-decimal pl-8 space-y-2">
        <li>Use up the accumulated wealth! This is the quickest and easiest way to reduce the value of an estate, and be wary not to spend too frivolously; it's important for people to take into consideration how long they are expected to live and how much money they will need.</li>
        <li>Donate to charity. Any assets gifted to a qualified 501(c)3 organization will avoid federal estate taxation. There is no limit on the amount that can be donated to charity.</li>
        <li>If not already, get married. Dying without a legal spouse can subject all assets to estate tax, but if there is a spouse involved, no estate tax will be imposed. Instead, all assets will fall under the ownership of the surviving widow(er). Keep in mind that gifts given to spouses must occur at least four years before death.</li>
        <li>Move to a new state. Including the District of Columbia, 19 states currently have a state estate or inheritance tax. These states are Connecticut, Delaware, Hawaii, Illinois, Iowa, Kentucky, Maine, Maryland, Massachusetts, Minnesota, Nebraska, New Jersey, New York, Oregon, Pennsylvania, Rhode Island, Tennessee, Vermont, and Washington. Anyone who currently lives in any of these states that wish to reduce their death tax can choose to move to a different state.</li>
        <li>Use an alternate valuation date. Normally, the fair market value of property in an estate is estimated on the date of death. However, there are certain situations in which the executor may choose an alternate valuation date, which is six months after the date of death. It only tends to be available if it is estimated to decrease both the gross amount of the estate and the estate tax liability, which results in a larger inheritance.</li>
      </ol>

      <h4 className="font-bold text-[14px] text-black mt-4">Annual Gift Tax Exclusion</h4>
      <p>The Gift Tax Exclusion allows any individual to gift a set amount each year (which is $19,000 for 2026) to as many individuals as they desire without incurring a gift tax. However, as soon as more than this set amount is gifted to any individual, the gift tax will be mandated. A gift can be anything of value, such as cash, investments, real estate, or jewelry. The Gift Tax Exclusion is adjusted occasionally for inflation. There are also certain types of gifts that are exempt from the gift tax:</p>
      <ul className="list-disc pl-8 space-y-1 mt-2">
        <li>Charitable gifts</li>
        <li>Gifts to spouses</li>
        <li>Gifts to political organizations</li>
        <li>Educational expense gifts concerning tuition that are paid directly to the institution</li>
        <li>Medical expense gifts that are paid directly to the medical facility</li>
      </ul>

      <h4 className="font-bold text-[14px] text-black mt-4">Unified Credit</h4>
      <p>The unified credit is a credit for the portion of estate tax due on taxable estates mandated by the Internal Service Revenue (IRS) to combine both the federal gift tax and estate tax into one. It mainly serves the purpose of preventing taxpayers from giving away too much during their lifetimes in order to avoid estate taxes.</p>
      <p>If gift taxes were paid on any gifts during a person's life, any amount over the annual gift tax exclusion would count towards the lifetime gift tax exclusion, which will then be subtracted from unified credit unless the gift tax is paid in the year it is incurred. It will then be taken as a credit against any estate tax owed. In addition, any portion of the unified credit that is unused can be used as an amount to be passed to a surviving spouse.</p>
      <p>Example: A person gives away $2,000,000 in their lifetime and dies in 2026 and is entitled to an individual federal estate tax exemption of $15,000,000. Their federal estate tax exemption is no longer $15,000,000, but $13,000,000.</p>

      <h3 className="font-bold text-lg text-black mt-6">Estate Planning</h3>
      <p>A typical first step to estate planning is to take inventory of all the assets a family owns. Try not to neglect small things, as sometimes a work of art or a piece of jewelry can have great sentimental value, even if its market value is low.</p>
      <p>The next step is to gather documents, which usually include a will that shows to whom each asset is bestowed. While a will discloses instructions, it does not avoid probate. All assets must go through the pertinent state's probate process before distribution to the heirs occurs. This process can include legal fees, executor fees, and court fees that can add up over time. Another document to consider is an assignment of power of attorney, which involves a legally authorized person acting for another person. In some situations, a living will or health-care proxy (medical power of attorney) is required so that medical decisions can be made for those who are no longer able to make them. It's very helpful to go over these with a lawyer as they must be mindful of both federal and state laws governing estates.</p>

      <div className="bg-[#f0f0f0] p-4 mt-6">
        <h4 className="font-bold text-[14px] text-black">Trusts</h4>
        <p className="mt-2">If there are sufficient assets to be distributed, the use of trusts is often recommended. A trust is a fiduciary arrangement that allows a third party, or trustee, to distribute assets according to mutually agreed-upon conditions. It also permits preconditions on how and when assets will be distributed, can protect heirs from creditors, and offer significant tax protection.</p>
        <p className="mt-2">There are two types of trusts: testamentary trusts and living trusts (also called Inter-Vivos Trusts). The main difference between the two is that the former is created by a will and takes effect when the grantor dies, whereas the latter is created and takes effect during the grantor's lifetime. One of the benefits of a living trust is that it allows the transfer of assets to beneficiaries after death without a person having to go through probate. Although similar to wills, they avoid state probate requirements, which can be considered one particular level out of many "estate taxes," assessed as probate fees. Testamentary trusts involve assets from the probate process, and as such, the distribution of cash or investments may not be aligned with the grantor's wishes.</p>
        
        <h4 className="font-bold text-[14px] text-black mt-4">Revocable Trust</h4>
        <p className="mt-2">There also exists a type of trust called a revocable trust that allows the assets to remain in the grantor's estate in a revocable trust, rather than moved out of the estate into an irrevocable trust. Testamentary trusts are irrevocable. Most revocable trusts can be dissolved entirely, allowing for some flexibility. These are best served for people who believe they don't have serious tax issues and want to maintain control of their assets.</p>
        <p className="mt-2">The downside to revocable trusts is that there are upfront costs involved, and they tend to be high. Generally, it takes more time and money to set up and fund one than to simply write a last will and testament. However, it may be beneficial in the end because loved ones avoid court after the grantor dies. Also, funding a revocable trust involves potentially cumbersome administrative tasks such as contacting sources of funds such as banks in order to transfer funds into the trust.</p>
      </div>

      <p className="mt-6">Trusts aren't the only tactic available in estate planning; there are a number of other methods that can be used to reduce estate taxes. However, careful review with professionals is important in order to ensure that these methods are within legal boundaries. Tax evasion is illegal and will result in serious repercussions. It is best to consult with professional estate planners who can help determine effective and legal ways to reduce estate taxes.</p>
      <p>Estate planning isn't only for people nearing retirement, though it gets more important the older a person is. Estate planning is not just for the wealthy either, though the larger a person's estate, the more they stand to benefit from proper estate planning. It is common for younger or less wealthy people to put off the idea of estate planning because they believe that planning an estate can or should be put off to a later time, or that their level of wealth would not benefit from estate planning. This is not necessarily true, and the benefits of estate planning for the younger or less wealthy are:</p>
      <ul className="list-disc pl-8 space-y-2">
        <li>It allows parents to legally ascribe a guardian in the event that they are no longer there for their children. Estate planning puts these plans into writing in a legal document, and authoritatively dictates who can become a guardian. A will can even specifically exclude a person from becoming a guardian.</li>
        <li>It allows persons to designate how the assets of minors will be managed. If not, the court will be forced to implement their own estate planning (which differs from state to state), which can lead to undesirable outcomes and unnecessary expenses.</li>
        <li>It allows a person to designate a specific person who would become responsible for managing their estate. Upon death, there are many responsibilities to sort out, which include managing assets such as bank accounts, paying debts, administering the estate, and much more. A trusted person can be appointed in a will.</li>
      </ul>
      <p>While the calculator can provide a brief insight into federal estate taxes due, serious consideration should eventually involve estate planning with professionals. This is complex and tends to be costly. Apart from simply reducing estate taxes, good estate planning can help ensure the smooth transition of wealth from one generation to another.</p>
    </div>
  );
}
