const HISTORICAL_DATA: Record<string, { title: string; paragraphs: string[] }> = {
  'mortgage-calculator': {
    title: 'History of Mortgages',
    paragraphs: [
      'Mortgages date back to ancient Rome, where the concept of a "pledge" or "fiducia" allowed creditors to hold property as security for a debt. The modern mortgage, however, emerged in 12th-century England under the common law system. The term "mortgage" comes from the Old French words "mort" (dead) and "gage" (pledge), literally meaning "dead pledge" — the pledge died when the debt was paid or the property was forfeited.',
      'The United States mortgage market evolved significantly through the 20th century. The Federal Housing Administration (FHA) was created in 1934, introducing the long-term, fixed-rate, fully amortizing mortgage that became the standard. Fannie Mae (1938) and Freddie Mac (1970) established the secondary mortgage market, providing liquidity that made homeownership accessible to millions of Americans.',
      'Today, the mortgage industry has diversified into numerous product types — fixed-rate, adjustable-rate (ARM), FHA, VA, USDA, jumbo, and reverse mortgages — each designed for different borrower profiles and financial situations.',
    ],
  },
  'bmi-calculator': {
    title: 'History of BMI',
    paragraphs: [
      'The Body Mass Index (BMI) was developed by the Belgian mathematician, astronomer, and statistician Adolphe Quetelet in the 1830s during his work on "social physics" and the concept of the "average man." Quetelet observed that body weight in adults roughly scales with the square of height, leading to the formula weight(kg) / height(m)² that we still use today.',
      "The term \"Body Mass Index\" was coined later by Ancel Keys in a 1972 paper published in the Journal of Chronic Diseases. Keys' study of 7,400 men across five countries validated Quetelet's index as a useful proxy for body fatness, finding it correlated well with more direct measurements like skinfold thickness and hydrostatic weighing.",
      'Despite its widespread use by the World Health Organization (WHO) and medical professionals worldwide since the 1980s, BMI has well-known limitations. It does not distinguish between muscle and fat mass, does not account for fat distribution, and may misclassify athletes or older adults. Modern health assessments increasingly complement BMI with waist circumference, body fat percentage, and other metabolic health markers.',
    ],
  },
  'currency-calculator': {
    title: 'History of Currency Exchange',
    paragraphs: [
      'Currency exchange has existed since ancient Mesopotamia around 3000 BCE, where different city-states used distinct forms of silver and grain as money. The first currency traders were money changers operating in temple courtyards and marketplaces, facilitating trade between regions with different monetary systems. The Bible references money changers in the Temple of Jerusalem.',
      'The modern foreign exchange (forex) market began taking shape after the Bretton Woods Agreement of 1944, which established the US dollar as the world\'s primary reserve currency pegged to gold at $35 per ounce, with other currencies pegged to the dollar. When President Richard Nixon ended dollar convertibility to gold in 1971 (the "Nixon Shock"), the system of floating exchange rates was born.',
      'Today, the forex market is the largest financial market in the world, trading over $7.5 trillion per day. Exchange rates fluctuate based on supply and demand, interest rate differentials, geopolitical events, and economic indicators — all processed instantly by our currency calculator to give you the current market rate.',
    ],
  },
}

export function HistoricalContext({ slug }: { slug: string }) {
  const data = HISTORICAL_DATA[slug]
  if (!data) return null

  return (
    <article className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{data.title}</h3>
      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {data.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  )
}
