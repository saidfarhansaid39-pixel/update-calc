import React from 'react';
import { useTranslations } from 'next-intl';

export function AnnuityArticle() {
  const t = useTranslations('articles');
  return (
    <div className="text-[13px] font-sans text-gray-800 leading-relaxed mt-8 space-y-4">
      
      <div className="flex flex-wrap gap-2 mt-2 border-b pb-6">
        <button className="bg-[#1c4587] text-white px-3 py-1 text-[13px] rounded hover:bg-[#153465]">Annuity Calculator</button>
        <button className="bg-[#1c4587] text-white px-3 py-1 text-[13px] rounded hover:bg-[#153465]">Retirement Calculator</button>
      </div>

      <h3 className="font-bold text-lg text-black mt-6">Qualified vs. Non-Qualified Annuities</h3>
      
      <h4 className="font-bold text-[14px] text-black mt-4">Qualified</h4>
      <p>In the U.S., a tax-qualified annuity is one used for qualified, tax-advantaged retirement plans such as an IRA or 401(k). Less common qualified retirement plans include defined benefit pension plans, 403(b)s (similar to 401(k)s), Keogh Plans, Thrift Savings Plans (TSPs), and Simplified Employee Pensions (SEPs). Contributions to qualified annuities are generally paid with pretax money, including any investments purchased for use in a qualified retirement plan, and are not included in taxable income for the year in which they are paid. This means that contributions during a tax year can be deductible, lowering taxable income. However, the eventual distributions during a future tax year are subject to ordinary income taxes.</p>
      <p>When used as a form of retirement savings, these annuities are entitled to the tax benefits and penalties of their respective plans. However, the rules of the annuity plan still govern all matters and may override certain rules. With that said, features that are unique to annuities such as guaranteed death benefits (benefits that must be paid out to beneficiaries regardless of factors such as down markets and decreases in account value) may still be included.</p>

      <h4 className="font-bold text-[14px] text-black mt-4">Non-Qualified</h4>
      <p>These annuities are purchased with after-tax dollars. In other words, the only portion of a non-qualified annuity policy that is eligible for taxation is the earnings, which are taxed as ordinary income. A big distinction to make is that, unlike qualified annuities, non-qualified annuities are not subject to minimum distribution rules after the age of 72. There is no limit on the amount of non-qualified money that can be placed into an annuity or the number of annuities that can be purchased.</p>

      <h3 className="font-bold text-lg text-black mt-6">Early Withdrawals</h3>
      <p>Withdrawals from an annuity before the age of 59 ½ will result in a 10% early withdrawal penalty on top of regular income tax. For all types of annuities, earnings are not taxable until the money is withdrawn. Because withdrawals are taxed on a "last in, first out" (LIFO) basis for a non-qualified annuity purchased after Aug. 13, 1982, earnings are paid out before principal.</p>
      <p>With that said, however, there are exceptions. Most annuity contracts allow the withdrawal of a portion of the account value each year without incurring a surrender charge. Other annuity contracts may allow the withdrawal of the gains (not principal) from an annuity without penalty. Also, as retirement accounts, annuities allow early withdrawals without penalty under certain situations. For example, the annuitants become disabled, suffer a major medical emergency, or are diagnosed with a terminal illness. In addition, some contracts offer benefits for using penalty-free withdrawals to pay for long-term care expenses.</p>

      <h3 className="font-bold text-lg text-black mt-6">Phases of an Annuity</h3>
      <p>There are several phases in the life of an annuity: the accumulation, annuitization, and payout phases.</p>

      <h4 className="font-bold text-[14px] text-black mt-4">Accumulation Phase</h4>
      <p>The accumulation phase is the first stage during which an annuity builds up cash value utilizing gathered funds. It always comes first and begins after an initial investment is made. There are several ways this can be accomplished; the most common method is to transfer funds, usually by check or bank transfer. Funds can come in the form of one lump sum or a series of payments, and there is precise reasoning for both methods. A lump sum is more commonly chosen by investors close to or already in retirement in order to start the annuitization and payout phase as quickly as possible. This allows them to start receiving distributions that are usually guaranteed for life right away. Also called "immediate annuities" because their distribution, or payout, of income is almost immediate, they have very short accumulation phases as a result. On the other hand, a series of payments might be more beneficial for younger investors who want to grow wealth over time in order to have future income in retirement. As an aside, even after the accumulation phase of an annuity ends, it does not stop increasing in value (given good economic conditions). Assets will continue to be invested well into all three phases, regardless of whether the annuity is fixed, indexed, or variable. By following annuity rules, earnings will accumulate on a tax-deferred basis until withdrawals are ready to be made.</p>

      <h4 className="font-bold text-[14px] text-black mt-4">1035 Exchange</h4>
      <p>A 1035 Exchange, taken from the Internal Revenue Code section of the same number, is an IRS provision in the tax code that allows policyholders to transfer funds from a life insurance plan, endowment, or annuity to a new policy without it being treated as a sale. As such, the payment of tax is not required.</p>
      <p>This is beneficial to policyholders for several reasons:</p>
      <ul className="list-disc pl-8 space-y-2">
        <li>Economic conditions continually change over time and can potentially adversely affect each individual and their long-term contracts.</li>
        <li>General improvements in the health and life expectancy of the entire population can lower insurance costs.</li>
        <li>Policyholders who feel they no longer need coverage may benefit from moving life insurance cash into annuities. Converting a life insurance policy into an income annuity will surrender the death benefit, but premium payments will no longer be required, and income will be secured for a specified number of years.</li>
      </ul>
      <p className="mt-2">In these scenarios, a 1035 Exchange allows policyholders to get out of sticky situations by replacing outdated contracts with new contracts that have improved benefits, higher death benefits, lower fees, and/or alternate investment options.</p>
      <p>Only the following transfers are considered tax-free by the IRS:</p>
      <ul className="list-disc pl-8 space-y-2">
        <li>Exchanging one annuity contract with another annuity contract or an annuity with long-term care benefits</li>
        <li>Exchanging one life insurance contract with another life insurance contract, endowment contract, or annuity contract</li>
        <li>Exchanging one endowment policy for an identical endowment policy that does not delay the date upon which payments will begin, or an annuity contract</li>
      </ul>
      <p className="mt-2">Anything else, such as exchanging an annuity contract for a life insurance policy, is not valid as a 1035 Exchange and will be considered by the IRS as a taxable event. In addition, for a 1035 exchange to take place, the owner, the insured, and the annuitant must be the same people listed on the old contract.</p>

      <h4 className="font-bold text-[14px] text-black mt-4">Partial 1035 Exchange of Annuity</h4>
      <p>Unlike a 1035 Exchange, which concerns the transfer of entire annuity contracts, annuity owners have the opportunity to exchange a portion of their annuity contract for another annuity contract tax-free. The basis is divided pro-rata, not income-out-first. For instance, if half the value of the annuity is exchanged for a second annuity, the new annuity will take half the cost basis.</p>
      <p>As an example, an annuity owner has a $50,000 non-qualified deferred annuity with a $40,000 basis. If they require a $10,000 distribution, it would be taxed at the full amount of $10,000. However, if they take $25,000 instead and exchange it for a second annuity, each contract will then have $25,000 with a $20,000 basis. With this rule, a $10,000 distribution from either contract will result in only $5,000 in taxable income.</p>
      <p>In order to qualify, distributions must not be taken from either contract within 180 days of the exchange. The IRS may treat a distribution during this window as being part of the original transaction resulting in the full amount of income of both contracts being taxable, as opposed to only taxing income from the contract that distributed the funds. While partial exchanges are allowed by the IRS, many insurance companies do not provide this service.</p>
      <p>1035 Exchanges (including partial 1035 exchanges) involve a complex set of tax rules and regulations. It can be helpful to work with a professional.</p>

      <h4 className="font-bold text-[14px] text-black mt-4">Annuitization Phase</h4>
      <p>The annuitization phase is more of a single, immediate event rather than a phase, acting as a separation between the accumulation and payout phases. It represents the point at which the insurance company stops receiving payments from the investor in preparation to return the accumulated assets as periodic payments to the annuitant (who was the investor). In other words, the annuity is "annuitized." In the case of a variable annuity, annuitization also represents the point at which all accumulated units purchased in the contract are converted into annuity units for payout. The decision to annuitize is final, and once made, it is not possible to request a different form of payout or access the principal.</p>

      <h4 className="font-bold text-[14px] text-black mt-4">Payout Phase</h4>
      <p>Sometimes referred to as the distribution phase, this is the final phase of an annuity, which can be calculated by this Annuity Payout Calculator. This is the phase in which the insurance company distributes payments to the investor. The length of the phase can vary widely, depending on various factors such as the payout amount and the total value accrued during the accumulation phase. Whether buying an immediate annuity or converting a deferred annuity into income payments, the options are essentially the same. Payments can be distributed over a specific period of time: monthly, quarterly, semiannually, or annually. It is important to note that regardless of which option is chosen, most options, the choice is irrevocable.</p>
      <p>In non-qualified annuities (annuities that aren't used to fund tax-advantaged retirement plans), a portion of each payment is considered either earnings or principal. The latter will be tax-free, while the former is subject to the same taxes as ordinary income. The earnings are considered withdrawn first and are therefore subject to taxation. All withdrawals are fully taxable until the account value reaches the principal invested.</p>

      <h3 className="font-bold text-lg text-black mt-6">Payout Options</h3>
      <p>There are several options for choosing how annuity payouts occur, and not all annuities offer every payout option. The Annuity Payout Calculator only calculates fixed payment or fixed length, two of the most common options. Both are represented by tabs on the calculator.</p>
      
      <h4 className="font-bold text-[14px] text-black mt-4">Lump-Sum</h4>
      <p>The lump-sum payment option allows annuitants to withdraw the entire account value of an annuity in a single withdrawal. This can be useful in many cases where the entire value of the account is desired immediately. A penalty will not be incurred as long as this is done after the age of 59 ½. However, taxes apply to the year of withdrawal. This makes it financially undesirable from a tax minimization standpoint.</p>

      <h4 className="font-bold text-[14px] text-black mt-4">Fixed Length</h4>
      <p>A fixed-length payout option, also known as fixed-period or period certain payout, allows annuitants to select a specific time period over which the annuity payments are guaranteed to last. For example, an annuitant aged 60 who selects a 10-year payout option will run out of guaranteed payments until around age 70. Fixed length payouts are usually paid in monthly installments over a chosen time period, such as 10, 15, or 20 years. It is very possible to choose too short or too long a fixed length for an annuity. If the main annuitant dies with funds left, any remaining amount will be passed to their heirs. This payout option is not affected by how long the main annuitant lives.</p>

      <h4 className="font-bold text-[14px] text-black mt-4">Fixed Payment Amount</h4>
      <p>A fixed payment amount payout option allows annuitants to select the amount they will receive in each monthly payment. These payments will continue until the annuity's balance is depleted. As the calculator shows, the duration of the payments depends on the amount chosen and the annuity's accumulated value at the time of annuitization. The fixed payment amount option shares the same risk as the fixed-length payout option; it is possible to choose too small or too large a fixed monthly payment amount, resulting in the retiree either outliving the annuity or dying with money remaining in the account. It is up to each individual to consider their situation to determine which option to choose, as there are different risks associated with all of them.</p>

      <h4 className="font-bold text-[14px] text-black mt-4">Life Only</h4>
      <p>For this option, the insurance company makes payments to the annuitant for as long as they live. Calculated life expectancy will determine the payment amount. The longer the life expectancy, the smaller the payment amount. A drawback to this option is that it is not possible to choose the payment amount, and there is no guarantee that the annuitant will receive the total value of their annuity. If they die within the first or second year, all the remaining funds in the annuity are lost. However, if the annuitant happens to live longer than the registered life expectancy, there is a possibility they receive more than the accumulated value of their annuity.</p>

      <h4 className="font-bold text-[14px] text-black mt-4">Joint and Survivor</h4>
      <p>This option ensures that retirement income provided by an annuity will continue for a spouse in the case of the death of the main annuitant. Payments are calculated and based on the life expectancy of the main annuitant and their spouse. Due to this, payments under this option will generally be lower than the life-only option. Payments will cease upon the death of the second annuitant. Another version of this payout is called the joint life with last survivor annuity, which can cover more than two people, such as the main annuitant, their spouse, and a dependent child.</p>

      <h4 className="font-bold text-[14px] text-black mt-4 mb-2">Life with Period Certain</h4>
      <p className="mb-8">This option combines features of the fixed length and life-only options. It guarantees an income for life but also allows the annuitant to select a specific time period during which the annuity pays a designated beneficiary, such as 10 years, even in the case of death before the guaranteed period ends. If the annuitant dies after the period certain, no payments are made to the beneficiary.</p>

    </div>
  );
}
