const specificFAQs: Record<string, { question: string; answer: string }[]> = {
  'annealing-temperature': [
    { question: 'What is annealing temperature in PCR?', answer: 'Annealing temperature (Ta) is the temperature at which primers bind to the template DNA during PCR. It is typically 3-5°C below the melting temperature (Tm) of the primers and is critical for specific amplification.' },
    { question: 'How do I calculate the optimal annealing temperature?', answer: 'The optimal annealing temperature is calculated using the formula: Ta = 0.3 × Tm(primer) + 0.7 × Tm(product) - 14.9. Alternatively, a gradient PCR (50-68°C) can empirically determine the best Ta for your specific primer-template combination.' },
    { question: 'What happens if the annealing temperature is too high or too low?', answer: 'If Ta is too high, primers may not bind, resulting in no PCR product. If Ta is too low, non-specific binding can occur, leading to primer-dimers and non-specific amplification bands.' },
    { question: 'How does primer length and GC content affect annealing temperature?', answer: 'Longer primers and higher GC content increase Tm and thus require higher Ta. Use the nearest-neighbor thermodynamic method for the most accurate Tm calculation, especially for primers with extreme GC content or length.' },
  ],
}

const categorySpecificGenerator: Record<string, (slug: string, title: string) => { question: string; answer: string }[]> = {
  financial: (slug, title) => [
    { question: `How does the ${title} work?`, answer: `The ${title} uses standard financial formulas to compute results based on your inputs. Enter your numbers and the tool provides instant, accurate calculations to help you make informed decisions.` },
    { question: `What inputs do I need for the ${title}?`, answer: `The required inputs vary by calculator. Common inputs include loan amount, interest rate, term length, and payment frequency. All inputs are clearly labeled in the form above.` },
    { question: 'How accurate are these financial calculations?', answer: 'Our calculators use industry-standard formulas and are updated to reflect current rates where applicable. Results are estimates for educational purposes and should be verified with a financial professional for important decisions.' },
    { question: 'Can I save and compare different scenarios?', answer: 'Yes, premium tier calculators support saving multiple scenarios side-by-side. Use the "Save Scenario" button to capture different inputs and compare outcomes.' },
    { question: 'How do interest rates affect my payments?', answer: 'Higher interest rates increase your total cost over time. Even a 0.5% difference can significantly affect monthly payments and total interest paid over the life of a loan or investment. Use the calculator to compare rate scenarios.' },
    { question: 'What is the difference between APR and interest rate?', answer: 'The interest rate is the cost of borrowing the principal, while APR (Annual Percentage Rate) includes the interest rate plus other fees and costs. APR gives a more complete picture of what you will pay.' },
  ],
  health: (slug, title) => [
    { question: `What is the ${title} used for?`, answer: `The ${title} helps you assess and track health metrics relevant to your wellness goals. It provides personalized estimates based on your inputs. Always consult a healthcare professional for medical advice.` },
    { question: 'How often should I use this calculator?', answer: 'Frequency depends on your personal goals. For tracking progress, weekly or monthly use can help you monitor changes over time. Some metrics may only need occasional assessment.' },
    { question: 'What factors affect the results?', answer: 'Results depend on the accuracy of your inputs including age, weight, height, activity level, and other personal metrics. Small changes in inputs can affect outcomes.' },
    { question: 'Are these results medically validated?', answer: 'Our calculators use widely accepted medical formulas and research-backed algorithms. However, they are educational tools and not substitutes for professional medical diagnosis or advice.' },
    { question: 'What are the limitations of this health calculator?', answer: 'Health calculators provide estimates based on population averages and general formulas. Individual results may vary due to genetics, medical conditions, medications, and other personal factors not captured by the tool.' },
    { question: 'Should I share these results with my doctor?', answer: 'Yes, sharing your results with a healthcare provider can be a useful starting point for discussion. Your doctor can interpret the results in the context of your overall health history and provide personalized guidance.' },
  ],
  math: (slug, title) => [
    { question: `How do I use the ${title}?`, answer: `Enter your numbers into the input fields and the calculator will apply the correct mathematical formula to compute your result. Results update in real-time as you adjust inputs.` },
    { question: `What formula does the ${title} use?`, answer: `The calculator uses standard mathematical formulas appropriate for the calculation type. The formula is displayed in the "Formula & Calculation" section on the page.` },
    { question: 'Can this calculator handle decimal values?', answer: 'Yes, all our math calculators support decimal inputs for precise calculations. You can enter values with up to several decimal places.' },
    { question: 'What if I get an unexpected result?', answer: 'Double-check your inputs for errors. Ensure you are using the correct units and format. Our step-by-step breakdown in the Formula section can help you verify the calculation.' },
    { question: 'Does this calculator work with negative numbers?', answer: 'Yes, our math calculators handle negative numbers, fractions, and decimals. Enter values with a minus sign (-) for negative numbers as needed.' },
    { question: 'Can I see the intermediate steps?', answer: 'Yes, the Formula section breaks down each calculation step-by-step, showing how the result is derived from your inputs using the relevant mathematical formula.' },
  ],
  conversion: (slug, title) => [
    { question: `How does the ${title} work?`, answer: `Select the units you want to convert between, enter your value, and the tool instantly applies the internationally standardized conversion factor to display the result.` },
    { question: 'How accurate are the conversions?', answer: 'Our converters use internationally standardized conversion factors with high decimal precision. Results are accurate to at least 6 decimal places for most conversions.' },
    { question: 'What units are supported?', answer: 'We support a wide range of units within each category including metric, imperial, and US customary systems. Use the unit dropdown to see all available options.' },
    { question: 'Can I convert between multiple unit systems?', answer: 'Yes, you can convert between any supported units within the same category. For example, convert inches to centimeters, feet to meters, or miles to kilometers.' },
    { question: 'How do I convert between units without a calculator?', answer: 'For quick estimates, remember key conversion factors: 1 inch = 2.54 cm, 1 kg = 2.205 lbs, 1 gallon = 3.785 L. For exact results, use our calculator.' },
    { question: 'Are there any rounding issues with conversions?', answer: 'We display results with up to 6 decimal places for precision. For practical purposes, you can adjust the decimal display. Underlying calculations use full floating-point precision.' },
  ],
  'date-time': (slug, title) => [
    { question: `How do I calculate with the ${title}?`, answer: `Enter your date and time values into the input fields. The calculator handles leap years, month lengths, and time zones automatically for accurate results.` },
    { question: 'Does this account for leap years?', answer: 'Yes, our date calculators automatically account for leap years, varying month lengths, and daylight saving time transitions where applicable.' },
    { question: 'Can I calculate business days only?', answer: 'Depending on the calculator, you may be able to exclude weekends and holidays. Check the available options in the form above.' },
    { question: `What is the ${title} best used for?`, answer: `This tool is ideal for planning events, tracking durations, calculating ages, scheduling projects, and any task requiring precise date or time arithmetic.` },
    { question: 'How accurate are date calculations across time zones?', answer: 'Date calculations use UTC internally for consistency. When time zone data is available, the calculator adjusts for offsets automatically. Results display in your local time zone.' },
    { question: 'Can I calculate the difference between two dates in multiple units?', answer: 'Yes, most date calculators show the difference in years, months, weeks, days, hours, minutes, and seconds simultaneously for comprehensive results.' },
  ],
  construction: (slug, title) => [
    { question: `How do I use the ${title}?`, answer: `Enter your project measurements and material preferences. The calculator provides estimates for materials, costs, and quantities needed for your project.` },
    { question: 'How accurate are the material estimates?', answer: 'Estimates are based on standard construction formulas and typical material dimensions. Always add 5-10% for waste and verify with a contractor for final ordering.' },
    { question: 'What units are supported for measurements?', answer: 'We support both metric and imperial units. You can switch between unit systems using the toggle in the toolbar above the calculator.' },
    { question: 'Can I save my project calculations?', answer: 'Yes, premium accounts can save scenarios and export results as CSV or PDF for reference during your project.' },
    { question: 'How do I account for material waste in my estimates?', answer: 'Add 5-10% to your calculated material quantities to account for cutting waste, breakage, and measurement errors. Some calculators include a waste factor option.' },
    { question: 'Are these estimates suitable for contractor bidding?', answer: 'These estimates provide a solid starting point for budgeting. For formal contractor bids, supplement with on-site measurements and consult local material pricing.' },
  ],
  statistics: (slug, title) => [
    { question: `How is the ${title} calculated?`, answer: `The calculator applies standard statistical formulas to your data set. Results update in real-time as you enter or modify data values.` },
    { question: 'How do I enter data?', answer: 'Enter your data values separated by commas or new lines. The calculator handles any number of data points, though very large datasets may take a moment to process.' },
    { question: 'What if my data has outliers?', answer: 'Outliers can significantly affect statistics like mean and standard deviation. Our results show key metrics that help you identify potential outliers in your data.' },
    { question: 'Can I export the results?', answer: 'Yes, results can be copied, printed, or exported as CSV for further analysis in spreadsheet software.' },
    { question: 'What is the difference between population and sample standard deviation?', answer: 'Population standard deviation uses N in the denominator (entire population), while sample uses N-1 (Bessel\'s correction) to better estimate the population from a sample.' },
    { question: 'Can I calculate percentiles and quartiles?', answer: 'Yes, many statistics calculators provide quartile values, percentiles, and interquartile range (IQR) alongside mean, median, and mode for a complete data summary.' },
  ],
  education: (slug, title) => [
    { question: `How does the ${title} work?`, answer: `Enter your academic information such as grades, credit hours, or test scores. The calculator computes weighted averages, GPA, or other educational metrics using standard formulas.` },
    { question: 'What grading scale is used?', answer: 'Our calculators support multiple grading scales including standard 4.0, weighted GPA, and percentage-based systems. Select the scale that matches your institution.' },
    { question: 'Can I calculate what grade I need on a final exam?', answer: 'Yes, the grade calculator can determine the score you need on remaining assignments to achieve your target grade. This is useful for planning study strategies.' },
    { question: 'How accurate are GPA projections?', answer: 'Projections are based on entered grades and weights. Accuracy depends on correct input and consistent grading policies. Confirm with your institution for official calculations.' },
    { question: 'Do you support weighted GPA for honors and AP classes?', answer: 'Yes, our GPA calculators support weighted scales where honors and AP courses receive additional grade points (e.g., 5.0 instead of 4.0 for an A in an AP class).' },
    { question: 'Can I calculate cumulative GPA across multiple semesters?', answer: 'Yes, enter grades and credits from multiple semesters to compute your cumulative GPA. The calculator handles the weighted averaging across all courses.' },
  ],
  physics: (slug, title) => [
    { question: `What physical principle does the ${title} use?`, answer: `The calculator applies fundamental physics laws and equations. The specific formula is displayed in the Formula section for reference.` },
    { question: 'What units can I use?', answer: 'We support both SI and imperial units. Select your preferred unit system and the calculator handles conversions automatically.' },
    { question: 'How precise are the results?', answer: 'Results are calculated with high precision based on the input values. Standard physical constants (gravitational constant, speed of light, etc.) are built-in to high accuracy.' },
    { question: 'Can I see the step-by-step solution?', answer: 'Yes, the step-by-step breakdown shows how the result is derived from the inputs using the relevant physics formula.' },
    { question: 'What physical constants does the calculator use?', answer: 'We use CODATA-recommended values for fundamental constants including gravitational constant (G = 6.674×10⁻¹¹), speed of light (c = 2.998×10⁸), and Planck\'s constant.' },
    { question: 'Does the calculator handle unit conversions between SI and imperial?', answer: 'Yes, the calculator automatically converts between SI (meters, kilograms, seconds) and imperial (feet, pounds, miles) units based on your preference.' },
  ],
  chemistry: (slug, title) => [
    { question: `How does the ${title} work?`, answer: `Enter your chemical values and the calculator performs accurate computations using standardized constants like atomic weights and gas constants.` },
    { question: 'What formulas are used?', answer: 'The calculator uses standard chemical formulas and the periodic table of elements. Check the Formula section for the specific equation being applied.' },
    { question: 'How are significant figures handled?', answer: 'Results are displayed with appropriate significant figures based on your input precision. You can adjust decimal places in most calculators.' },
    { question: 'Are the atomic weights up to date?', answer: 'Yes, we use the latest IUPAC standard atomic weights. The calculator applies these values for all molecular weight and stoichiometry calculations.' },
    { question: 'Can I calculate molecular weight from a chemical formula?', answer: 'Yes, enter a chemical formula like H2SO4 or C6H12O6 and the calculator computes the molecular weight using up-to-date atomic masses multiplied by each element\'s count.' },
    { question: 'Does this calculator handle solution concentrations?', answer: 'Yes, our chemistry calculators support molarity, molality, percent concentration, and dilution calculations using standard formulas (C1V1 = C2V2).' },
  ],
  engineering: (slug, title) => [
    { question: `How does the ${title} work?`, answer: `Enter your engineering parameters and the calculator applies professional engineering formulas to compute results. The formula used is shown in the Formula section.` },
    { question: 'What standards are used?', answer: 'Our calculators follow industry-standard engineering practices and codes. Results are suitable for preliminary design and educational purposes.' },
    { question: 'What units are supported?', answer: 'We support both SI and imperial engineering units including metric, US customary, and specialized engineering units like psi, pascals, BTU, and horsepower.' },
    { question: 'Can I use these results for professional work?', answer: 'Results should be verified by a licensed professional engineer for safety-critical applications. Our tools provide estimates for planning and educational use.' },
    { question: 'What safety factors should I apply?', answer: 'Safety factors vary by application and code requirements. Typical factors range from 1.5 to 4.0 depending on the material, loading conditions, and industry standards.' },
    { question: 'Does the calculator follow ASME, ASTM, or ISO standards?', answer: 'Our engineering calculators reference standard codes and practices where applicable. Check the individual calculator description for specific code references.' },
  ],
  everyday: (slug, title) => [
    { question: `How do I use the ${title}?`, answer: `Simply enter the relevant values in the form above. The tool provides quick, practical results that you can apply immediately to everyday situations.` },
    { question: 'What can I use this calculator for?', answer: `The ${title} is designed for common everyday calculations. It helps you save time and make accurate decisions without manual math.` },
    { question: 'Is this calculator free?', answer: 'Yes, all our calculators are free to use. Premium features like scenario comparison and export are available for advanced users.' },
    { question: 'Can I access this on mobile?', answer: 'Yes, our calculators are fully responsive and work on all devices including smartphones, tablets, and desktops.' },
    { question: 'Do you have a mobile app?', answer: 'Our calculators are available as a Progressive Web App (PWA). Add Calculat to your home screen for app-like access without downloading from an app store.' },
    { question: 'Can I change the currency or unit system?', answer: 'Yes, use the settings in the toolbar to switch between metric and imperial units, and select your preferred currency for financial calculations.' },
  ],
  food: (slug, title) => [
    { question: `How does the ${title} work?`, answer: `Enter your ingredients, servings, or nutritional values. The calculator provides conversions, adjustments, or nutritional information based on your inputs.` },
    { question: 'Are the nutritional values accurate?', answer: 'Nutritional estimates are based on standard USDA food database values and common portion sizes. Actual values may vary by brand, preparation method, and specific ingredients.' },
    { question: 'Can I scale recipes?', answer: 'Yes, the recipe scaling feature adjusts ingredient quantities proportionally. Simply enter the original servings and desired servings to get adjusted measurements.' },
    { question: 'What measurement units are supported?', answer: 'We support volume (cups, tablespoons, milliliters), weight (grams, ounces, pounds), and custom units depending on the specific calculator.' },
    { question: 'Can I track my daily nutritional intake?', answer: 'Yes, use our food calculators to log and track calories, macronutrients (protein, carbs, fat), and micronutrients across multiple meals and days.' },
    { question: 'How do I convert between volume and weight for different ingredients?', answer: 'Volume-to-weight conversion depends on the ingredient\'s density. For example, 1 cup of flour weighs about 120g while 1 cup of sugar weighs about 200g. Our calculators handle these variations.' },
  ],
  biology: (slug, title) => [
    { question: `How does the ${title} work?`, answer: `Enter your biological parameters and the calculator applies standard biological formulas and constants for accurate results.` },
    { question: 'What biological principles are used?', answer: 'The calculator uses established biological formulas from genetics, microbiology, molecular biology, or anatomy depending on the specific tool.' },
    { question: 'Can I use this for research purposes?', answer: 'Our tools provide estimates for educational and preliminary research use. Always validate results with appropriate laboratory methods for critical research.' },
    { question: 'What units are supported?', answer: 'We support scientific units including metric, molar concentrations, and biological measurement units as appropriate for each calculator.' },
    { question: 'Does the calculator account for standard biological reference values?', answer: 'Yes, our calculators use widely accepted reference ranges and standard values from peer-reviewed biological literature and textbooks.' },
    { question: 'Can I save and compare experimental results?', answer: 'Yes, premium accounts can save multiple experimental scenarios, compare results side-by-side, and export data for further analysis.' },
  ],
  ecology: (slug, title) => [
    { question: `How does the ${title} work?`, answer: `Input your ecological data such as population counts, area measurements, or environmental parameters. The calculator applies ecological formulas for analysis.` },
    { question: 'What ecological models are used?', answer: 'Our calculators use standard ecological models including population growth, biodiversity indices, and environmental impact assessment formulas.' },
    { question: 'How accurate are ecological estimates?', answer: 'Accuracy depends on the quality of input data. Our tools use validated ecological formulas from peer-reviewed research for reliable estimates.' },
    { question: 'Can I use this for environmental reporting?', answer: 'Results are suitable for educational and preliminary assessment purposes. For regulatory reporting, consult environmental professionals and use validated methodologies.' },
    { question: 'What biodiversity indices are available?', answer: 'Our ecology calculators support common indices including Shannon-Wiener, Simpson\'s Diversity Index, species richness, and evenness calculations for community ecology analysis.' },
    { question: 'Can I calculate carbon footprint or environmental impact?', answer: 'Yes, our ecology calculators include tools for estimating carbon footprint, energy consumption impact, and other environmental metrics based on your inputs.' },
  ],
  sports: (slug, title) => [
    { question: `How does the ${title} work?`, answer: `Enter your performance metrics, physical statistics, or training data. The calculator provides insights and analysis using sports science formulas.` },
    { question: 'How accurate are the performance estimates?', answer: 'Results are based on standard sports science formulas and research. Individual performance may vary based on genetics, training, nutrition, and other factors.' },
    { question: 'What metrics can I track?', answer: 'Depending on the calculator, you can track speed, distance, heart rate, calories burned, strength metrics, and other sports performance indicators.' },
    { question: 'Can I use this for training plans?', answer: 'Our calculators provide estimates to help inform training decisions. For personalized training plans, work with a certified coach or trainer.' },
    { question: 'How do I calculate my target heart rate zone?', answer: 'Target heart rate zones are typically calculated as percentages of your maximum heart rate (estimated as 220 minus your age). Different zones target different fitness goals.' },
    { question: 'Can I track progress over time?', answer: 'Yes, regularly using the calculator and saving your results helps you monitor improvements in performance metrics like speed, endurance, and strength over time.' },
  ],
}

export function generateCalculatorFAQ(
  slug: string,
  category: string
): { question: string; answer: string }[] {
  if (specificFAQs[slug]) {
    return specificFAQs[slug]
  }

  const categoryKey = category as keyof typeof categorySpecificGenerator
  const generator = categorySpecificGenerator[categoryKey]
  if (generator) {
    const title = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    return generator(slug, title)
  }

  return [
    { question: 'How does this calculator work?', answer: 'Enter your values into the input fields and the tool instantly computes results using industry-standard formulas. Adjust inputs to explore different scenarios.' },
    { question: 'What inputs do I need?', answer: 'Each calculator specifies its required inputs. Common inputs include numeric values, selections from dropdowns, and measurement units.' },
    { question: 'How accurate are the results?', answer: 'Results are calculated with high precision using validated formulas. They are intended for educational and planning purposes.' },
    { question: 'Can I save my calculations?', answer: 'Yes, premium calculators offer scenario saving, history tracking, and CSV export for your convenience.' },
  ]
}
