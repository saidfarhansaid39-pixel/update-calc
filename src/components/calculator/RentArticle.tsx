import { useTranslations } from 'next-intl';

export function RentArticle() {
  const t = useTranslations('articles');
  return (
    <div className="text-[13px] font-sans text-gray-800 leading-relaxed mt-8 space-y-4">
      <div className="flex flex-wrap gap-2 mt-2 border-b pb-6">
        <button className="bg-[#1c4587] text-white px-3 py-1 text-[13px] rounded hover:bg-[#153465]">Rent vs. Buy Calculator</button>
        <button className="bg-[#1c4587] text-white px-3 py-1 text-[13px] rounded hover:bg-[#153465]">Income Tax Calculator</button>
        <button className="bg-[#1c4587] text-white px-3 py-1 text-[13px] rounded hover:bg-[#153465]">Budget Calculator</button>
      </div>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.whatIs')}</h3>
      <p>For this calculator, rent is the act of paying a landlord for the use of a residential property. Used as a noun, it can also refer to the actual payment for the temporary use of a residential property. There can be other definitions of rent, such as economic rent, but they are used in other contexts for other purposes.</p>
      <p>Although the terms "rent" and "lease" are often used interchangeably, their actual definitions differ; a lease is a contract signed in order to rent a residential property, which formally defines how much the tenant pays, the length of the rent, and all the rules the landlord and tenant agree to follow in their rental relationship. For more information about or to do calculations involving leases, please visit the <a href="/financial-calculators/rent-calculator/" className="text-[#1c4587] underline">Lease Calculator</a>. For more information about or to do calculations involving rental properties from the perspective of a landlord, please visit the <a href="/financial-calculators/rent-calculator/" className="text-[#1c4587] underline">Rental Property Calculator</a>.</p>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.howItWorks')}</h3>
      <p>It can be easy or terribly difficult to find a place to rent depending on many factors, one of which is location. Rural areas tend to be easier; many times, it's as simple as driving around searching for "For Rent" signs or an apartment complex. Then, just schedule a viewing or simply ring the doorbell of the leasing office. On the other hand, in or near some major metropolitan areas, rentals can be scarce due to factors like population density or local policy. In such situations, finding a vacant place takes a lot of hard work. Renters have to scan the Internet listing sites often or pay an agency to do the search. Once a place becomes vacant, the renters may have to race to view it, and then, if it's practicable, put in an application right away. When paying a third-party real estate agent to help find the right place, depending on how competitive the market is, either the landlord or the renter pays the agent's fee, which usually amounts to one month's rent.</p>
      <p>Once a property is decided on, the renter normally needs to submit a rental application. Not only does it involve basic information about the renter such as name, current address, driver's license, pet ownership, and personal references, but it may include financial information such as income and debt level. The landlord normally will also check the background of the renter, including credit reports, criminal reports, and eviction history. Once approved, the renter and the landlord need to agree on rent payments, the rental period, and many other terms. A lease will then be drafted of the agreed-upon terms. Once signed by both parties, the lease will act as a legal contract between the landlord and the tenant. After this step is complete, the new tenant can then move into the residential property at the tenancy start date.</p>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.related')}</h3>
      <p>It is uncommon for people to become a homeowner without renting first. Sooner or later, renters may reach a point where they are faced with the decision of continuing to rent or choosing to buy instead. Use the <a href="/financial-calculators/rent-vs-buy-calculator/" className="text-[#1c4587] underline">Rent vs. Buy Calculator</a> to evaluate whether buying vs. renting will save more money long term. Also, the <a href="/financial-calculators/house-affordability-calculator/" className="text-[#1c4587] underline">House Affordability Calculator</a> or <a href="/financial-calculators/mortgage-calculator/" className="text-[#1c4587] underline">Mortgage Calculator</a> can then help determine an affordable home and subsequent monthly mortgage payment.</p>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.factors')}</h3>
      <p>One of the most important factors regarding rent is the actual rent amount and whether or not it is affordable; there are many methods for determining what is considered affordable rent, and the calculator is simply one method that may help. Affordable is a relative term and carries a different meaning for different people. Some people think a front-end debt-to-income ratio of 25% is considered affordable, while others might think 33% of income is affordable. For more information about or to do calculations involving debt-to-income ratios, please visit the <a href="/financial-calculators/house-affordability-calculator/" className="text-[#1c4587] underline">Debt-to-Income Ratio Calculator</a>. Other considerations regarding rent generally include:</p>
      
      <ul className="list-disc pl-8 space-y-2">
        <li><b>Other Costs</b>—Aside from recurring rent payments, there are other costs associated with renting. Upfront costs such as a security deposit, application fee, insurance, and pet deposit can be mandatory. Recurring utility costs such as internet, water, gas, and electricity will need to be accounted for also (some may already be included in rent). In addition, most renters will need to furnish their new rental property.</li>
        <li><b>Location</b>—Generally, people like to live close to where they work and to their family and friends. Renters should also consider the location of their rented property in relation to places they frequent and their interests. For example, a renter who likes to hike may want to consider a property that is close to a hiking trail, while the renter who enjoys a daily coffee may want to live close to a coffee shop. Also, there may be other location preferences, such as living in a particular school district, a location with low crime rates, or having access to public transportation.</li>
        <li><b>Quality</b>—The quality of the rented property should also be considered. For most rental properties, it is possible to research the year the property was built or when it was renovated. In most cases, renters can view the rental property before actually renting to ensure it is of good quality. In addition, certain rental properties may come with amenities such as a pool, gym, doorman, or laundry facility. All appliances should be present and in working condition. For apartments or condos, online resources can provide reviews from previous tenants.</li>
        <li><b>Size</b>—There are considerations such as number of bedrooms, number of bathrooms, and square footage. In addition, renters should ensure there are enough cabinet and closet spaces for their belongings, as well as enough living space for their pets.</li>
        <li><b>Landlord</b>—A landlord can make or break a renting experience. Because a rental property is still owned by a landlord, it is possible for them to place restrictions on the tenant, such as requiring that they maintain a certain noise level and grass length, not allowing them to paint or put nails in the walls, and enforcing rules regarding pets.</li>
      </ul>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.tips')}</h3>
      <p>Many renters in the U.S. struggle to afford their monthly rent. It is possible to decrease the cost of rent in many ways concerning many different situations.</p>
      
      <ul className="list-disc pl-8 space-y-2">
        <li>Consider living with parents, family, or a friend in the meantime if possible. It would be a kind act to pay them back in the future, during more financially stable times.</li>
        <li>When shopping for an apartment, do diligent research, take ample time to decide on a place, and walk away from bad deals.</li>
        <li>Consider living in a lower rent area.</li>
        <li>Always negotiate the rent and terms of the lease. The worst case is they say no.</li>
        <li>Live with roommates. On average, shared two-bedroom apartments are roughly 30% cheaper than one-bedroom apartments. There are websites that can help match up potential roommates. The best prospects are usually the ones found through friends and family that are respectful, responsible, clean, and who share common interests.</li>
        <li>Negotiate with landlords. Some allow maintenance work in exchange for lower monthly rents.</li>
        <li>Live in a mobile home or vehicle. While mobile homes might be costly upfront relative to monthly rent, you may save more down the road.</li>
        <li>The U.S Department of Housing & Urban Development (HUD) rental assistance programs exist for people who are in dire need of housing. They are very selective, and applicants who qualify are rare. Typically, only families, people with disabilities, or the elderly are given subsidized public housing. The waiting lists can take years, and even then, tenants may have to relocate. Rent is usually 30% of the regular cost after accounting for necessary expenses. Section 8 housing, which subsidizes private landlords on behalf of low-income households, has even more stringent income and eligibility restrictions than public housing. Waiting lists will also be longer because approval is required from both housing agencies and landlords.</li>
        <li>As a last-ditch resort, seek help from local communities. Good places to start are welfare programs located in the inner city that provide various aid to the underprivileged. They can point people in the right direction for local housing assistance.</li>
      </ul>

      <h3 className="font-bold text-lg text-black mt-6">{t('section_headings.tips')}</h3>
      <ul className="list-disc pl-8 space-y-2">
        <li>Get everything in writing, such as promises made by landlords or renter responsibilities. They can become crucial during legal disputes over grey areas.</li>
        <li>When moving in, inspect the property thoroughly, create a lease inventory and condition list, and have the landlord sign it. Also, take pictures of the property that best convey the condition of it in case landlords try to charge for damages. These can be used as proof that damages were preexisting.</li>
        <li>Keep the rental property clean and in good condition. At the end of the lease, any repairs required to return the property to its pre-lease conditions that are not considered normal wear and tear will generally be charged to the renter.</li>
        <li>Consider purchasing tenant insurance. In the case of a fire or theft, personal assets fall under the responsibility of the tenant.</li>
        <li>For fixed leases, landlords cannot raise rent prices on existing renters during the life of the lease.</li>
        <li>Check for cell reception inside the unit before renting.</li>
        <li>Call a nearby pizza place that delivers. If they don't deliver to a certain address after a certain time, it can be an indicator of the crime rate and safety of the neighborhood at night.</li>
        <li>Call utility services. They can provide information on what the average monthly bill might look like.</li>
        <li>If there are train tracks nearby, ensure that the sound of passing trains isn't enough of a disturbance to lead to sleepless nights.</li>
        <li>Be nice to landlords. The relationship between landlord and renter contains a lot of grey areas, and it can work in the renter's favor to appeal to them, whether it's by always making timely payments or treating their property with respect. It is possible that the landlord might respond with more favorable treatment, such as not exorbitantly increasing rent after the lease ends.</li>
        <li>Be nice to neighbors, as they are likely to be more accommodating in return.</li>
      </ul>

    </div>
  );
}
