interface FormulaEntry {
  formula: string
  description: string
}

function capitalizeWords(s: string): string {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function extractTopic(slug: string): string {
  return slug.replace(/-calculator$/i, '').replace(/-/g, ' ')
}

/* ─── Financial ─── */

const finFormulas: Record<string, FormulaEntry> = {
  loan: { formula: 'M = P × [r(1+r)^n] / [(1+r)^n - 1]', description: 'loan payment formula calculating equal monthly payments covering principal and interest.' },
  mortgage: { formula: 'M = (P - D) × [r(1+r)^n] / [(1+r)^n - 1]', description: 'mortgage payment based on loan amount after down payment, amortized over the term.' },
  investment: { formula: 'FV = PV(1+r)^n + PMT × [(1+r)^n - 1]/r', description: 'future value calculation combining compound growth with periodic contributions.' },
  retirement: { formula: 'FV = PV(1+r)^n + PMT × [(1+r)^n - 1]/r | 4% Rule', description: 'retirement projection using compound growth with the 4% sustainable withdrawal rule.' },
  salary: { formula: 'Annual = hourly × 2080 | Annual = monthly × 12 | Annual = weekly × 52', description: 'salary conversion between hourly, weekly, monthly, and annual pay rates.' },
  debt: { formula: 'Payoff = iterative: balance × (1+r) - payment', description: 'debt payoff simulation tracking total months and interest cost to full repayment.' },
  tax: { formula: 'Tax = income × rate / 100 | After-tax = income - tax', description: 'income tax estimate using effective tax rate applied to total income.' },
  budget: { formula: 'Remaining = income - Σ(expenses) | Rate = remaining / income × 100', description: 'budget analysis tracking income against expense categories to calculate savings rate.' },
  simpleInterest: { formula: 'I = P × r × t | A = P + I', description: 'simple interest calculation without compounding effects over time.' },
  apyCalc: { formula: 'APY = (1 + r/n)^n - 1', description: 'annual percentage yield reflecting compounding effects on the nominal rate.' },
  aprCalc: { formula: 'APR = (interest + fees) / principal × 365 / days', description: 'annual percentage rate including mandatory fees beyond the nominal interest rate.' },
  futureValue: { formula: 'FV = PV(1+r)^n + PMT × [(1+r)^n - 1]/r', description: 'future value projection with compound growth and optional periodic contributions.' },
  presentValue: { formula: 'PV = FV / (1+r)^n', description: 'present value discounting a future sum at a given rate of return.' },
  roi: { formula: 'ROI = (gain - cost) / cost × 100', description: 'return on investment percentage measuring profitability relative to cost.' },
  npv: { formula: 'NPV = Σ(CF_t / (1+r)^t) - initial', description: 'net present value of future cash flows discounted at the required rate.' },
  irr: { formula: 'NPV = Σ(CF_t / (1+IRR)^t) = 0', description: 'internal rate of return equating present value of cash flows to initial investment.' },
  paybackPeriod: { formula: 'Payback = initial / annual_cash_flow', description: 'investment recovery time before cumulative cash flows equal the initial outlay.' },
  breakEven: { formula: 'BEP = fixed_costs / (price - var_cost_per_unit)', description: 'break-even point in units where total revenue equals total costs.' },
  bondYield: { formula: 'YTM = (coupon + (face - price)/years) / ((face + price)/2)', description: 'bond yield to maturity approximating total return if held to maturity.' },
  bondPrice: { formula: 'Price = Σ(coupon/(1+YTM)^t) + face/(1+YTM)^n', description: 'bond present value as discounted future coupon and principal payments.' },
  couponPayment: { formula: 'Coupon = face × coupon_rate / frequency', description: 'periodic bond interest payment based on face value and coupon rate.' },
  taxEquivalentYield: { formula: 'TEY = muni_yield / (1 - tax_rate)', description: 'tax-equivalent yield comparing taxable and tax-exempt bond returns.' },
  dividendYield: { formula: 'Div_Yield = annual_dividend / price_per_share × 100', description: 'dividend yield measuring annual dividend income relative to share price.' },
  dividendPayout: { formula: 'Payout_Ratio = total_dividends / net_income × 100', description: 'dividend payout ratio showing the portion of earnings distributed to shareholders.' },
  eps: { formula: 'EPS = net_income / shares_outstanding', description: 'earnings per share measuring profitability allocated to each share.' },
  pe: { formula: 'P/E = stock_price / EPS', description: 'price-to-earnings ratio comparing valuation to per-share earnings.' },
  pb: { formula: 'P/B = stock_price / book_value_per_share', description: 'price-to-book ratio comparing market value to accounting book value.' },
  ps: { formula: 'P/S = stock_price / sales_per_share', description: 'price-to-sales ratio comparing market capitalization to revenue.' },
  peg: { formula: 'PEG = P/E / earnings_growth_rate', description: 'PEG ratio adjusting P/E for expected earnings growth (lower = better value).' },
  dividendGrowthRate: { formula: 'CAGR = (current_div / prior_div)^(1/years) - 1', description: 'compound annual growth rate of dividends over the measurement period.' },
  payoutRatio: { formula: 'Payout = dividends_per_share / EPS × 100', description: 'dividend payout ratio showing the percentage of earnings paid as dividends.' },
  retentionRatio: { formula: 'Retention = 1 - payout_ratio', description: 'retention ratio measuring the portion of earnings reinvested in the business.' },
  stockAverageCost: { formula: 'Avg_Cost = (total_cost + new_shares × new_price) / total_shares', description: 'average stock cost basis when buying additional shares at different prices.' },
  dollarCostAveraging: { formula: 'Avg_Price = total_invested / total_shares_accumulated', description: 'dollar-cost averaging strategy calculating average purchase price over time.' },
  costBasis: { formula: 'Cost_Basis = purchase_price × shares + commissions', description: 'total cost basis for tax reporting including commissions and fees.' },
  portfolioReturn: { formula: 'Return = w1×r1 + w2×r2', description: 'weighted portfolio return combining individual asset returns by allocation.' },
  sharpeRatio: { formula: 'Sharpe = (portfolio_return - risk_free_rate) / std_dev', description: 'risk-adjusted return ratio measuring excess return per unit of volatility.' },
  sortinoRatio: { formula: 'Sortino = (portfolio_return - risk_free_rate) / downside_dev', description: 'downside risk-adjusted return penalizing only negative volatility.' },
  alpha: { formula: 'α = portfolio_return - [rf + β×(market_return - rf)]', description: 'Jensen\'s alpha measuring excess return above the expected CAPM return.' },
  beta: { formula: 'β = covariance(stock, market) / variance(market)', description: 'systematic risk measure comparing stock volatility to the overall market.' },
  rSquared: { formula: 'R² = correlation² × 100%', description: 'coefficient of determination showing the proportion of variance explained by the market.' },
  valueAtRisk: { formula: 'VaR = portfolio_value × (μ - z×σ)', description: 'value at risk estimating maximum potential loss at a given confidence level.' },
  dti: { formula: 'DTI = total_monthly_debt / gross_monthly_income × 100', description: 'debt-to-income ratio for mortgage qualification assessment.' },
  ltv: { formula: 'LTV = loan_amount / property_value × 100', description: 'loan-to-value ratio comparing the mortgage amount to the property appraised value.' },
  dscr: { formula: 'DSCR = NOI / annual_debt_service', description: 'debt service coverage ratio measuring ability to cover loan payments from income.' },
  interestCoverage: { formula: 'ICR = EBIT / interest_expense', description: 'interest coverage ratio measuring earnings relative to interest obligations.' },
  fixedChargeCoverage: { formula: 'FCCR = (EBIT + fixed_charges) / (fixed_charges + interest)', description: 'fixed charge coverage ratio including lease payments beyond interest.' },
  tie: { formula: 'TIE = EBIT / interest_expense', description: 'times interest earned ratio quantifying debt service safety margin.' },
  workingCapital: { formula: 'WC = current_assets - current_liabilities', description: 'working capital measuring short-term liquidity and operational efficiency.' },
  currentRatio: { formula: 'Current_Ratio = current_assets / current_liabilities', description: 'current ratio measuring short-term debt-paying ability with current assets.' },
  quickRatio: { formula: 'Quick_Ratio = (current_assets - inventory) / current_liabilities', description: 'quick ratio (acid test) measuring liquidity excluding inventory.' },
  cashRatio: { formula: 'Cash_Ratio = cash / current_liabilities', description: 'cash ratio measuring the most conservative liquidity position.' },
  inventoryTurnover: { formula: 'Inventory_Turnover = COGS / avg_inventory', description: 'inventory turnover rate indicating how quickly inventory is sold and replaced.' },
  assetTurnover: { formula: 'Asset_Turnover = revenue / avg_assets', description: 'asset turnover ratio measuring revenue generation per dollar of assets.' },
  roa: { formula: 'ROA = net_income / avg_total_assets × 100', description: 'return on assets measuring how efficiently assets generate profit.' },
  roe: { formula: 'ROE = net_income / avg_equity × 100', description: 'return on equity measuring profitability relative to shareholder equity.' },
  debtToAsset: { formula: 'Debt_to_Assets = total_debt / total_assets × 100', description: 'debt-to-asset ratio measuring the proportion of assets financed by debt.' },
  debtToEquity: { formula: 'D/E = total_debt / total_equity', description: 'debt-to-equity ratio comparing creditor financing to owner financing.' },
  houseAffordability: { formula: 'Afford = income × DTI_limit | Max_PITI = afford × front_end%', description: 'maximum home purchase price based on income, down payment, and debt ratios.' },
  closingCosts: { formula: 'Closing_Costs = home_price × rate%', description: 'estimated closing costs as a percentage of the home purchase price.' },
  rentalIncome: { formula: 'Cash_Flow = rent - expenses - mortgage', description: 'rental property cash flow analysis after expenses and debt service.' },
  capRate: { formula: 'Cap_Rate = NOI / property_value × 100', description: 'capitalization rate measuring unleveraged return on investment property.' },
  cashOnCash: { formula: 'CoC = annual_cash_flow / total_cash_invested × 100', description: 'cash-on-cash return measuring annual return relative to cash invested.' },
  noiCalc: { formula: 'NOI = potential_income - vacancy - operating_expenses', description: 'net operating income for commercial and residential property valuation.' },
  roiRental: { formula: 'ROI = (annual_return - costs) / total_investment × 100', description: 'rental property return on investment including appreciation and cash flow.' },
  incomeTax: { formula: 'Tax = bracket_rates × income_segments | Effective = total_tax / income', description: 'progressive income tax calculation with bracket-based marginal rates.' },
  taxBracket: { formula: 'Marginal = bracket_rate on portion above threshold', description: 'marginal tax bracket determination and tax liability for each bracket segment.' },
  marginalTaxRate: { formula: 'Marginal_Rate = Δtax / Δincome × 100', description: 'marginal tax rate on additional income above current bracket.' },
  effectiveTaxRate: { formula: 'Effective = total_tax_paid / total_income × 100', description: 'effective tax rate representing the average rate paid across all income.' },
  capitalGainsTax: { formula: 'Gain = sale_price - cost_basis | Tax = gain × rate', description: 'capital gains tax calculation on investment sales with cost basis adjustment.' },
  dividendTax: { formula: 'Tax = qualified_dividends × rate', description: 'qualified dividend tax calculation at preferential capital gains rates.' },
  selfEmploymentTax: { formula: 'SE_Tax = net_earnings × 0.9235 × 0.153', description: 'self-employment tax covering Social Security and Medicare contributions.' },
  salesTax: { formula: 'Tax = price × rate / 100 | Total = price + tax', description: 'sales tax amount and after-tax total for retail purchases.' },
  vat: { formula: 'VAT = net × rate% | Gross = net × (1 + rate%)', description: 'value-added tax inclusion and extraction for business transactions.' },
  estateTax: { formula: 'Taxable = estate - exemption | Tax = taxable × rate', description: 'estate tax liability calculation after applicable exemptions and deductions.' },
  taxRefundEstimator: { formula: 'Refund = withheld - liability | Due = liability - withheld', description: 'tax refund or amount due comparing total withheld against actual liability.' },
  itemizedVsStandardDeduction: { formula: 'Savings = max(itemized, standard) - standard', description: 'comparison of itemized versus standard deduction to minimize taxable income.' },
  amt: { formula: 'AMT = (AMTI - exemption) × rate', description: 'alternative minimum tax calculation ensuring minimum tax payment.' },
  cryptoProfit: { formula: 'Profit = (sell_price - buy_price) × quantity', description: 'cryptocurrency profit or loss from buying and selling digital assets.' },
  cryptoMining: { formula: 'Revenue = hash_rate × block_reward × coin_price / network_hash', description: 'crypto mining profitability estimate factoring hardware and electricity costs.' },
  cryptoStaking: { formula: 'Rewards = amount × APY / compounding_frequency', description: 'crypto staking rewards projection with compound interest on delegated tokens.' },
  impermanentLoss: { formula: 'IL = 2√(price_ratio) / (1 + price_ratio) - 1', description: 'impermanent loss in liquidity pools when asset prices diverge from deposit ratio.' },
  cryptoTax: { formula: 'Gain = (sell - buy) × quantity | Holding_period matters', description: 'cryptocurrency tax liability with short-term and long-term classification.' },
  lifeInsurance: { formula: 'Needs = income×years + debts + funeral - existing', description: 'life insurance needs analysis based on income replacement and final expenses.' },
  termVsWholeLife: { formula: 'Cost_Diff = whole_premium - term_premium | Invest_diff', description: 'term versus whole life insurance cost comparison with investment opportunity cost.' },
  disability: { formula: 'Benefit = monthly_income × benefit_pct', description: 'disability insurance benefit amount based on income replacement percentage.' },
  creditUtilization: { formula: 'Utilization = total_balance / total_limit × 100', description: 'credit utilization ratio affecting credit score (recommended under 30%).' },
  creditScore: { formula: 'Score = weighted(payment, utilization, length, mix, inquiries)', description: 'credit score estimation using weighted factors from the FICO scoring model.' },
  balanceTransfer: { formula: 'Savings = existing_interest - (transferred × promo_rate + fee)', description: 'balance transfer savings comparing existing debt interest to promotional offer.' },
  emergencyFund: { formula: 'Target = monthly_expenses × months_to_cover', description: 'emergency fund target calculation for 3-6 months of essential expenses.' },
  sinkingFund: { formula: 'Monthly = goal × r / [(1+r)^n - 1]', description: 'sinking fund monthly contribution to reach a savings goal with compound interest.' },
  savingsGoal: { formula: 'FV = PV(1+r)^n + PMT × [(1+r)^n - 1]/r', description: 'savings goal projection combining current savings with regular contributions.' },
  collegeSavings: { formula: 'FV = PV(1+r)^n + PMT × [(1+r)^n - 1]/r', description: 'college savings projection estimating future education funding needs.' },
  netWorth: { formula: 'Net_Worth = total_assets - total_liabilities', description: 'personal net worth calculation measuring overall financial health.' },
  debtSnowball: { formula: 'Smallest_balance_first, minimums_on_rest', description: 'debt snowball method paying smallest balances first for motivational momentum.' },
  debtAvalanche: { formula: 'Highest_rate_first, minimums_on_rest', description: 'debt avalanche method paying highest interest rate first for maximum interest savings.' },
  debtPayoffPlan: { formula: 'Months = NPER(rate, -payment, balance)', description: 'debt payoff timeline calculating months to full repayment at given payment.' },
  debtConsolidationSavings: { formula: 'Savings = current_interest - new_interest - fees', description: 'debt consolidation savings comparing current interest to consolidated loan terms.' },
  pension: { formula: 'FV = PV(1+r)^n + PMT × [(1+r)^n - 1]/r', description: 'pension and retirement account growth projection with regular contributions.' },
  socialSecurity: { formula: 'PIA = AIME brackets × replacement rates | Benefit = PIA × age_factor', description: 'Social Security benefit estimate based on earnings history and claiming age.' },
  annuity: { formula: 'PMT = P × r / [1 - (1+r)^(-n)]', description: 'annuity payment calculation for a fixed income stream over the payout period.' },
  safeWithdrawalRate: { formula: 'Annual = savings × rate% | 4% Rule benchmark', description: 'safe withdrawal rate determining sustainable retirement income from savings.' },
  rmd: { formula: 'RMD = prior_year_balance / life_expectancy_factor', description: 'required minimum distribution for retirement accounts after age 73.' },
  businessValuation: { formula: 'Value = EBITDA × multiple | Revenue × industry_multiple', description: 'business valuation using EBITDA or revenue multiples from comparable companies.' },
  startupCosts: { formula: 'Total = Σ(all_costs) | Breakdown by category', description: 'startup cost estimation aggregating all pre-revenue business expenses.' },
  runway: { formula: 'Runway = cash / (burn - revenue)', description: 'cash runway calculation estimating months until funds are exhausted.' },
  burnRate: { formula: 'Burn = (start_cash - end_cash) / months', description: 'monthly cash burn rate measuring the speed of cash consumption.' },
  cac: { formula: 'CAC = sales_and_marketing / new_customers', description: 'customer acquisition cost measuring efficiency of sales and marketing spend.' },
  ltvCalc: { formula: 'LTV = avg_revenue / churn_rate', description: 'customer lifetime value estimating total revenue from a customer relationship.' },
  ltvCacRatio: { formula: 'LTV/CAC = customer_LTV / acquisition_cost', description: 'LTV-to-CAC ratio evaluating customer profitability relative to acquisition cost.' },
  churnRate: { formula: 'Churn = lost_customers / starting_customers × 100', description: 'customer churn rate measuring the percentage of customers lost over a period.' },
  mrr: { formula: 'MRR = subscribers × avg_price_per_month', description: 'monthly recurring revenue metric for subscription-based business models.' },
  arr: { formula: 'ARR = MRR × 12', description: 'annual recurring revenue annualizing monthly subscription revenue.' },
  unitEconomics: { formula: 'Profit_per_unit = price - var_cost | Total = per_unit × units - fixed', description: 'unit economics analyzing per-unit profitability including fixed and variable costs.' },
  contributionMargin: { formula: 'CM = revenue - variable_costs | Ratio = CM / revenue', description: 'contribution margin measuring revenue remaining after variable costs.' },
  operatingLeverage: { formula: 'DOL = %ΔEBIT / %ΔRevenue', description: 'degree of operating leverage measuring fixed vs variable cost structure.' },
  financialLeverage: { formula: 'DFL = %ΔEPS / %ΔEBIT', description: 'degree of financial leverage measuring the impact of debt on earnings per share.' },
  grossProfit: { formula: 'Gross_Profit = revenue - COGS', description: 'gross profit calculating revenue minus direct cost of goods sold.' },
  netProfit: { formula: 'Net_Profit = total_revenue - total_expenses', description: 'net profit (bottom line) after all operating and non-operating expenses.' },
  profitMargin: { formula: 'Margin = net_profit / revenue × 100', description: 'profit margin measuring what percentage of revenue becomes profit.' },
  costVolumeProfit: { formula: 'Profit = (price - var_cost) × units - fixed_costs', description: 'cost-volume-profit analysis for break-even and target profit planning.' },
  markupCalc: { formula: 'Selling_Price = cost × (1 + markup%)', description: 'markup calculation determining selling price from cost and markup percentage.' },
  carAffordability: { formula: 'Max_Price = payment × [1 - (1+r)^(-n)] / r', description: 'car affordability calculating maximum purchase price for a target monthly payment.' },
  childCare: { formula: 'Annual = weekly_cost × weeks_per_year', description: 'annual child care cost calculation for household budgeting and planning.' },
  petExpense: { formula: 'Total = Σ(all_annual_pet_costs)', description: 'total annual pet ownership expense aggregating food, vet, supplies, and other costs.' },
  fiftyThirtyTwenty: { formula: '50% needs, 30% wants, 20% savings', description: '50/30/20 budget rule for balanced personal finance allocation.' },
  zeroBasedBudget: { formula: 'Income - expenses = 0 | Every dollar assigned', description: 'zero-based budgeting ensuring every dollar of income is allocated to a category.' },
  envelopeSystem: { formula: 'Per_envelope = total_budget / envelopes', description: 'cash envelope budgeting system dividing income into physical spending categories.' },
  payYourselfFirst: { formula: 'Savings = income × savings_pct | Spend the rest', description: 'pay-yourself-first budgeting prioritizing savings before discretionary spending.' },
  weddingBudget: { formula: 'Per_guest = total_budget / guest_count', description: 'wedding budget allocation per guest for event planning and cost estimation.' },
  vacationBudget: { formula: 'Total = transport + lodging + food + activities', description: 'vacation budget aggregating all trip expenses for travel planning.' },
  holidayBudget: { formula: 'Total = gifts + travel + food + decorations', description: 'holiday budget planning across gift, travel, food, and decoration categories.' },
  groceryBudget: { formula: 'Weekly = household_size × avg_cost_per_person', description: 'grocery budget estimation based on household size and dietary preferences.' },
  monthlyBudget: { formula: 'Surplus = income - Σ(expenses)', description: 'monthly budget tracking comparing income against all expense categories.' },
  annualBudget: { formula: 'Annual = monthly × 12 | Savings = income - total', description: 'annual budget planning aggregating monthly projections across all categories.' },
  homeInsurance: { formula: 'Premium = home_value × rate | Deductible choice', description: 'homeowners insurance premium estimate based on property value and coverage.' },
  autoInsurance: { formula: 'Premium = car_value × rate | Deductible affects cost', description: 'auto insurance premium estimate based on vehicle value and coverage levels.' },
  healthInsuranceComparison: { formula: 'Total = premium + deductible×usage + coinsurance', description: 'health insurance plan comparison considering all out-of-pocket costs.' },
  deductibleVsPremium: { formula: 'Breakeven = (high_premium - low_premium) / (high_deductible - low_deductible)', description: 'deductible vs premium trade-off analysis for health insurance plan selection.' },
  outOfPocketMaximum: { formula: 'Max_Cost = deductible + coinsurance_until_OOP_max', description: 'maximum out-of-pocket health care costs under a given insurance plan.' },
  propertyTaxDeduction: { formula: 'Savings = property_tax_paid × marginal_rate', description: 'property tax deduction savings based on marginal tax bracket.' },
  giftTax: { formula: 'Taxable = gift - annual_exclusion | Tax = taxable × rate', description: 'gift tax liability on transfers exceeding the annual exclusion amount.' },
  inheritanceTax: { formula: 'Taxable = inheritance - exemption | Tax = taxable × rate', description: 'inheritance tax calculation based on state exemption and inheritance amount.' },
  sideHustleTax: { formula: 'Net = income - expenses | SE_Tax = net × 0.153', description: 'side hustle tax estimate including self-employment tax on net earnings.' },
  gigEconomyTax: { formula: 'Net = gig_income - expenses | Quarterly_estimated tax', description: 'gig economy tax estimate with self-employment and quarterly payment considerations.' },
  interestIncomeTax: { formula: 'Tax = interest_income × marginal_rate', description: 'interest income tax on savings accounts, CDs, and bond interest earnings.' },
  rentalIncomeTax: { formula: 'Taxable = rental_income - expenses - depreciation', description: 'rental income tax calculation with depreciation and deductible expense adjustments.' },
  amortization: { formula: 'Schedule: period, payment, principal, interest, balance', description: 'full loan amortization schedule showing each payment\'s principal and interest split.' },
  loanComparison: { formula: 'Compare M1 vs M2: total_interest + payments', description: 'loan comparison evaluating two loan options by total cost and monthly payment.' },
  biweeklyPayment: { formula: 'Biweekly = monthly/2 × 26 payments = 13 months/year', description: 'biweekly payment plan accelerating mortgage payoff with one extra payment annually.' },
}

export function getFinFormula(slug: string, calcType: string): FormulaEntry {
  const topic = extractTopic(slug)
  const base = finFormulas[calcType] || finFormulas.loan
  const capitalized = capitalizeWords(topic)
  return {
    formula: base.formula,
    description: `${capitalized}: ${base.description}`,
  }
}

/* ─── Health ─── */

const healthFormulas: Record<string, FormulaEntry> = {
  bmi: { formula: 'BMI = weight(kg) / height(m)²', description: 'Body Mass Index calculation categorizing weight relative to height.' },
  calorie: { formula: 'BMR = 10×W + 6.25×H - 5×A + 5 (M) | BMR = 10×W + 6.25×H - 5×A - 161 (F)', description: 'Basal Metabolic Rate estimate with TDEE adjustment for activity level.' },
  'body-fat': { formula: 'Body fat % = (body density - constant) / coefficient', description: 'body fat percentage estimation using circumference or impedance measurements.' },
  'heart-rate': { formula: 'Max HR = 220 - age | Zone = MaxHR × intensity%', description: 'target heart rate zone calculation for optimizing exercise intensity.' },
  pregnancy: { formula: 'EDD = LMP + 280 days | EDD = conception + 266 days', description: 'estimated due date using Naegele\'s Rule based on last menstrual period.' },
  pace: { formula: 'Pace = time / distance | Speed = distance / time', description: 'running or walking pace calculation for training and race planning.' },
}

export function getHealthFormula(slug: string, calcType: string): FormulaEntry {
  const topic = extractTopic(slug)
  const base = healthFormulas[calcType] || { formula: 'Health assessment calculation', description: 'general health metric estimation based on personal biometric inputs.' }
  const capitalized = capitalizeWords(topic)
  return {
    formula: base.formula,
    description: `${capitalized}: ${base.description}`,
  }
}

/* ─── Math ─── */

const mathFormulas: Record<string, FormulaEntry> = {
  arithmetic: { formula: 'Result = A ○ B | ○ ∈ {+, -, ×, ÷, ^, %}', description: 'basic arithmetic operation returning result from two operands.' },
  statistics: { formula: 'Mean = Σx/n | Median = mid | SD = √(Σ(x-μ)²/(n-1))', description: 'descriptive statistics summarizing data distribution and spread.' },
  geometry: { formula: 'A = πr² | V = 4/3πr³ | V = πr²h', description: 'geometric area and volume computation using standard formulas.' },
  algebra: { formula: 'x = [-b ± √(b² - 4ac)] / 2a', description: 'algebraic equation solving using the quadratic formula.' },
  combinatorics: { formula: 'nPr = n!/(n-r)! | nCr = n!/(r!(n-r)!)', description: 'permutation and combination counting for arrangements and selections.' },
  conversion: { formula: 'decimal = parseInt(value, fromBase).toString(toBase)', description: 'number base conversion between binary, octal, decimal, and hexadecimal.' },
}

export function getMathFormula(slug: string, calcType: string): FormulaEntry {
  const topic = extractTopic(slug)
  const base = mathFormulas[calcType] || { formula: 'Mathematical computation', description: 'general mathematical calculation for common problem types.' }
  const capitalized = capitalizeWords(topic)
  return {
    formula: base.formula,
    description: `${capitalized}: ${base.description}`,
  }
}

/* ─── Engineering ─── */

const engFormulas: Record<string, FormulaEntry> = {
  'ohms-law': { formula: 'V = IR | P = VI | R = V/I', description: 'Ohm\'s Law relating voltage, current, and resistance in electrical circuits.' },
  btu: { formula: 'BTU = area × insulation × (1 + sun_factor)', description: 'BTU cooling capacity calculation based on room properties and conditions.' },
  horsepower: { formula: 'HP = torque × RPM / 5252', description: 'horsepower measurement from torque and rotational speed.' },
  resistor: { formula: 'R_series = R₁+R₂ | R_parallel = 1/(1/R₁+1/R₂)', description: 'total resistance calculation for series and parallel configurations.' },
}

export function getEngFormula(slug: string, calcType: string): FormulaEntry {
  const topic = extractTopic(slug)
  const base = engFormulas[calcType] || { formula: 'Engineering design calculation', description: 'engineering parameter calculation using industry-standard formulas.' }
  // Derive domain from slug prefix
  let domain = 'engineering'
  if (slug.includes('structural')) domain = 'structural'
  else if (slug.includes('electrical')) domain = 'electrical'
  else if (slug.includes('mechanical')) domain = 'mechanical'
  else if (slug.includes('aerospace')) domain = 'aerospace'
  else if (slug.includes('chemical')) domain = 'chemical'
  else if (slug.includes('civil')) domain = 'civil'
  else if (slug.includes('thermal')) domain = 'thermal'
  else if (slug.includes('material')) domain = 'materials'
  const capitalized = capitalizeWords(topic)
  return {
    formula: base.formula,
    description: `${capitalized}: ${domain} ${base.description}`,
  }
}

/* ─── Everyday ─── */

const everydayFormulas: Record<string, FormulaEntry> = {
  tip: { formula: 'Tip = bill × rate | Total = bill + tip | Each = total / n', description: 'tip and bill splitting calculation for fair cost sharing.' },
  gpa: { formula: 'GPA = Σ(grade_points × credits) / Σ(credits)', description: 'Grade Point Average calculation weighted by credit hours.' },
  random: { formula: 'Random = floor(min + rand() × (max - min + 1))', description: 'pseudo-random number generation within a specified range.' },
  password: { formula: 'Entropy = log₂(char_set^length) bits', description: 'password entropy measurement indicating resistance to brute force attacks.' },
}

export function getEverydayFormula(slug: string, calcType: string): FormulaEntry {
  const topic = extractTopic(slug)
  const base = everydayFormulas[calcType] || { formula: 'Everyday utility calculation', description: 'practical everyday calculation for common household or personal tasks.' }
  // Categorize auto-* stubs
  let domain = 'general'
  if (slug.startsWith('auto-')) domain = 'cost estimation'
  else if (slug.includes('pace') || slug.includes('bike') || slug.includes('swim') || slug.includes('triathlon') || slug.includes('marathon')) domain = 'pace and fitness'
  else if (slug.includes('cost') || slug.includes('budget') || slug.includes('bill')) domain = 'expense tracking'
  const capitalized = capitalizeWords(topic)
  return {
    formula: base.formula,
    description: `${capitalized}: ${domain} ${base.description}`,
  }
}

/* ─── Slug-specific overrides (priority over generated) ─── */

export const finSlugOverrides: Record<string, FormulaEntry> = {
  'mortgage-calculator': { formula: 'M = P[r(1+r)^n]/[(1+r)^n-1] | PITI = M + taxes + insurance + HOA', description: 'Mortgage Calculator: full PITI payment breakdown including principal, interest, taxes, insurance, and HOA fees.' },
  'amortization-calculator': { formula: 'Schedule: P&I per period | Balance after n = P[(1+r)^n - (1+r)^p] / [(1+r)^n - 1]', description: 'Amortization Calculator: full loan payment schedule showing principal and interest breakdown per period.' },
  'loan-calculator': { formula: 'M = P × [r(1+r)^n] / [(1+r)^n - 1]', description: 'Loan Calculator: monthly payment amount for any fixed-rate loan with given principal, rate, and term.' },
  'auto-loan-calculator': { formula: 'M = (P - T) × [r(1+r)^n] / [(1+r)^n - 1] | T = trade-in + down', description: 'Auto Loan Calculator: monthly car payment including trade-in value and down payment.' },
  'personal-loan-calculator': { formula: 'M = P × [r(1+r)^n] / [(1+r)^n - 1] | Total = M × n', description: 'Personal Loan Calculator: monthly payment and total cost of borrowing for personal loans.' },
  'student-loan-calculator': { formula: 'M = P × [r(1+r)^n] / [(1+r)^n - 1] | IDR = income × rate%', description: 'Student Loan Calculator: standard and income-driven repayment plan comparison.' },
  'mortgage-payoff-calculator': { formula: 'Payoff = P(1+r)^m - PMT × [(1+r)^m - 1]/r', description: 'Mortgage Payoff Calculator: extra payment impact on loan term and total interest savings.' },
  'fha-loan-calculator': { formula: 'M = (P - D) × [r(1+r)^n] / [(1+r)^n - 1] + MIP', description: 'FHA Loan Calculator: FHA mortgage with MIP (Mortgage Insurance Premium) included.' },
  'va-mortgage-calculator': { formula: 'M = P × [r(1+r)^n] / [(1+r)^n - 1] | Funding = P × VA_fee%', description: 'VA Mortgage Calculator: VA loan payment including funding fee calculation.' },
  'home-equity-loan-calculator': { formula: 'M = E × [r(1+r)^n] / [(1+r)^n - 1] | E = value × LTV% - existing', description: 'Home Equity Loan Calculator: available equity borrowing and monthly payment.' },
  'compound-interest-calculator': { formula: 'A = P(1 + r/n)^(nt)', description: 'Compound Interest Calculator: exponential growth of principal with compounded returns over time.' },
  'investment-calculator': { formula: 'FV = PV(1+r)^n + PMT × [(1+r)^n - 1]/r', description: 'Investment Calculator: future value of initial investment plus regular contributions.' },
  'retirement-calculator': { formula: 'Nest = PV(1+r)^n + PMT × [(1+r)^n - 1]/r | Income = Nest × 4%', description: 'Retirement Calculator: savings projection and sustainable retirement income using the 4% rule.' },
  '401k-calculator': { formula: 'FV = (contrib + match)(1+r)^n + annual_boost × [(1+r)^n - 1]/r', description: '401k Calculator: retirement savings including employer match and contribution growth.' },
  'ira-calculator': { formula: 'FV = contrib(1+r)^n | Tax = traditional × rate% at withdrawal', description: 'IRA Calculator: traditional vs Roth IRA growth comparison with tax implications.' },
  'roth-ira-calculator': { formula: 'FV = contrib(1+r)^n | Tax-free withdrawal', description: 'Roth IRA Calculator: tax-free growth projection for after-tax retirement contributions.' },
  'social-security-calculator': { formula: 'PIA = AIME brackets × replacement rates | Benefit = PIA × age_factor', description: 'Social Security Calculator: retirement benefit estimate based on earnings history and claiming age.' },
  'salary-calculator': { formula: 'Hourly × 2080 = Annual | Annual ÷ 12 = Monthly | Annual ÷ 52 = Weekly', description: 'Salary Calculator: wage conversion between hourly, weekly, monthly, and annual pay rates.' },
  'income-tax-calculator': { formula: 'Tax = bracket_rates × income_segments | Effective = total_tax / income', description: 'Income Tax Calculator: progressive tax calculation with bracket-based effective rate.' },
  'capital-gains-tax-calculator': { formula: 'Gain = sell - cost_basis | Tax = gain × cap_gains_rate', description: 'Capital Gains Tax Calculator: short and long-term capital gains tax on investment sales.' },
  'debt-payoff-calculator': { formula: 'Months = iterative | Total_interest = Σ(balance × r) - principal', description: 'Debt Payoff Calculator: minimum and accelerated payoff timeline with total interest comparison.' },
  'debt-consolidation-calculator': { formula: 'Consolidated = Σ(all_debts) | New_M = combined × [r(1+r)^n] / [(1+r)^n - 1]', description: 'Debt Consolidation Calculator: monthly payment and interest savings from consolidating multiple debts.' },
  'budget-calculator': { formula: 'Surplus = income - Σ(expenses) | Rate = surplus / income × 100', description: 'Budget Calculator: income vs expense tracking with savings rate calculation.' },
  'credit-card-payoff-calculator': { formula: 'Payoff = Σ(min_payments) + interest | Avalanche = highest_rate first', description: 'Credit Card Payoff Calculator: debt repayment timeline using avalanche or snowball methods.' },
  'refinance-calculator': { formula: 'Savings = old_M - new_M | Breakeven = closing_costs / monthly_savings', description: 'Refinance Calculator: monthly savings and breakeven point when refinancing a mortgage.' },
  'estate-tax-calculator': { formula: 'Taxable = estate - exemption | Tax = taxable × estate_rate%', description: 'Estate Tax Calculator: federal estate tax liability based on total estate value.' },
  'interest-rate-calculator': { formula: 'r = (FV/PV)^(1/n) - 1 | Effective = (1 + r/n)^n - 1', description: 'Interest Rate Calculator: nominal-to-effective rate conversion and rate determination.' },
  'apr-calculator': { formula: 'APR = (total_interest + fees) / principal × 365 / days', description: 'APR Calculator: Annual Percentage Rate including interest and mandatory fees.' },
  'rent-vs-buy-calculator': { formula: 'Buy: M + tax + insurance + maint | Rent: rent × months + invest_diff', description: 'Rent vs Buy Calculator: break-even comparison between renting and homeownership costs.' },
  'currency-calculator': { formula: 'Converted = amount × exchange_rate', description: 'Currency Calculator: foreign exchange conversion using current market rates.' },
  'savings-calculator': { formula: 'A = P(1+r)^n | Goal = target / (1+r)^n', description: 'Savings Calculator: future savings growth projection and goal-based savings target.' },
  'simple-interest-calculator': { formula: 'I = P × r × t | A = P + I', description: 'Simple Interest Calculator: linear interest calculation without compounding.' },
  'payment-calculator': { formula: 'M = P × [r(1+r)^n] / [(1+r)^n - 1]', description: 'Payment Calculator: fixed monthly payment for any amortizing loan.' },
  'pension-calculator': { formula: 'Pension = years × benefit_multiplier × avg_salary', description: 'Pension Calculator: defined benefit retirement income based on service years and salary.' },
  'heloc-calculator': { formula: 'HELOC = available_limit - drawn | Payment = drawn × (rate/12) + optional_principal', description: 'HELOC Calculator: home equity line of credit draw and payment management.' },
  'boat-loan-calculator': { formula: 'M = P × [r(1+r)^n] / [(1+r)^n - 1] | Total = M × n', description: 'Boat Loan Calculator: marine financing monthly payment and total cost breakdown.' },
  'business-loan-calculator': { formula: 'M = P × [r(1+r)^n] / [(1+r)^n - 1] | DSCR = NOI / debt_service', description: 'Business Loan Calculator: commercial loan payment with debt service coverage ratio.' },
  'house-affordability-calculator': { formula: 'Afford = income × DTI_limit | Max_PITI = afford × front_end%', description: 'House Affordability Calculator: maximum home purchase price based on income and debt ratios.' },
  'down-payment-calculator': { formula: 'Down = price × down% | PMI_needed = down < 20% | Monthly_PMI = loan × PMI_rate% / 12', description: 'Down Payment Calculator: required down payment and PMI implications for home buying.' },
  'credit-card-calculator': { formula: 'Balance_method: daily_balance × daily_rate × days | Min_payment = max(%, fixed)', description: 'Credit Card Calculator: revolving balance interest and minimum payment projection.' },
  'repayment-calculator': { formula: 'Months_to_payoff = NPER(rate, -payment, balance) | Total_interest = Σ(payments) - principal', description: 'Repayment Calculator: loan payoff timeline with total interest comparison.' },
  'mortgage-amortization-calculator': { formula: 'Schedule: period, payment, principal, interest, balance | YTD total', description: 'Mortgage Amortization Calculator: full repayment schedule with principal and interest per period.' },
  'rmd-calculator': { formula: 'RMD = prior_year_balance / life_expectancy_factor', description: 'RMD Calculator: required minimum distribution for retirement accounts after age 73.' },
  'take-home-pay-calculator': { formula: 'Net = gross - federal_tax - state_tax - FICA - benefits - deductions', description: 'Take-Home Pay Calculator: net income after federal, state, FICA, and benefit deductions.' },
  'sales-tax-calculator': { formula: 'Tax = price × tax_rate / 100 | Total = price + tax', description: 'Sales Tax Calculator: consumption tax amount and after-tax total for purchases.' },
  'vat-calculator': { formula: 'VAT = net × rate% | Gross = net × (1 + rate%)', description: 'VAT Calculator: value-added tax inclusion and extraction for business transactions.' },
  'marriage-tax-calculator': { formula: 'Joint_tax = married_income × brackets | Compare: single_vs_joint', description: 'Marriage Tax Calculator: married filing jointly vs single tax comparison.' },
  'interest-calculator': { formula: 'Simple: I = P×r×t | Compound: A = P(1+r/n)^(nt)', description: 'Interest Calculator: simple and compound interest growth comparison over time.' },
  'future-value-calculator': { formula: 'FV = PV(1+r)^n + PMT × [(1+r)^n - 1]/r', description: 'Future Value Calculator: projected investment value with compounding and contributions.' },
  'present-value-calculator': { formula: 'PV = FV / (1+r)^n', description: 'Present Value Calculator: current worth of a future sum discounted at a given rate.' },
  'roi-calculator': { formula: 'ROI = (gain - cost) / cost × 100 | Annualized = (1+ROI)^(1/n) - 1', description: 'ROI Calculator: return on investment percentage with annualized comparison.' },
  'irr-calculator': { formula: 'NPV = Σ(CF_t / (1+IRR)^t) = 0 | Solved iteratively', description: 'IRR Calculator: internal rate of return finding discount rate where NPV equals zero.' },
  'payback-period-calculator': { formula: 'Payback = initial_investment / annual_cash_flow | Discounted = cumulative DCF', description: 'Payback Period Calculator: investment recovery time with undiscounted and discounted methods.' },
  'debt-to-income-calculator': { formula: 'DTI = total_monthly_debt / gross_monthly_income × 100', description: 'Debt-to-Income Calculator: front-end and back-end DTI ratios for mortgage qualification.' },
  'cd-calculator': { formula: 'A = P(1 + r/n)^(nt) | APY = (1 + r/n)^n - 1', description: 'CD Calculator: certificate of deposit maturity value with APY comparison.' },
  'mutual-fund-calculator': { formula: 'FV = SIP × [((1+r)^n - 1)/r] × (1+r) | Lumpsum = P(1+r)^n', description: 'Mutual Fund Calculator: SIP and lump sum investment growth projection.' },
  'average-return-calculator': { formula: 'Arithmetic: (ΣR_i)/n | Geometric: (Π(1+R_i))^(1/n) - 1', description: 'Average Return Calculator: arithmetic and geometric mean of periodic returns.' },
}

export const healthSlugOverrides: Record<string, FormulaEntry> = {
  'bmi-calculator': { formula: 'BMI = weight(kg) / height(m)² | Category: <18.5, 18.5-24.9, 25-29.9, ≥30', description: 'BMI Calculator: body mass index screening tool for weight categorization and health risk assessment.' },
  'bmr-calculator': { formula: 'BMR = 10W + 6.25H - 5A + 5 (M) | BMR = 10W + 6.25H - 5A - 161 (F)', description: 'BMR Calculator: basal metabolic rate for resting calorie needs based on Mifflin-St Jeor equation.' },
  'calorie-calculator': { formula: 'BMR × activity_factor = TDEE | Deficit = TDEE - 500 for loss', description: 'Calorie Calculator: total daily energy expenditure for weight management goals.' },
  'tdee-calculator': { formula: 'TDEE = BMR × PAL | PAL: 1.2-1.9 based on activity', description: 'TDEE Calculator: total daily energy expenditure accounting for all physical activity.' },
  'body-fat-calculator': { formula: 'Fat% = (495 / body_density) - 450 | 3-site or 7-site skinfold', description: 'Body Fat Calculator: body composition percentage using circumference or skinfold measurements.' },
  'lean-body-mass-calculator': { formula: 'LBM = weight × (1 - fat%) | FFMI = LBM / height(m)²', description: 'Lean Body Mass Calculator: fat-free mass and FFMI for fitness assessment.' },
  'target-heart-rate-calculator': { formula: 'HRmax = 208 - 0.7×age | Zone = HRmax × %intensity', description: 'Heart Rate Calculator: maximum heart rate and optimal training zone determination.' },
  'pregnancy-calculator': { formula: 'EDD = LMP + 280 days | Gestational = today - LMP in weeks', description: 'Pregnancy Calculator: estimated due date and current gestational age tracker.' },
  'due-date-calculator': { formula: 'EDD = LMP + 280 days | EDD = conception + 266 days', description: 'Due Date Calculator: estimated delivery date using LMP or conception date methods.' },
  'ovulation-calculator': { formula: 'Ovulation = cycle_length - 14 days | Fertile = ovulation ± 5 days', description: 'Ovulation Calculator: fertile window estimation based on menstrual cycle tracking.' },
  'period-calculator': { formula: 'Next = last_start + cycle_length | Ovulation = next - 14', description: 'Period Calculator: menstrual cycle tracking with period and ovulation prediction.' },
  'pace-calculator': { formula: 'Pace = time / distance (min/km or min/mi)', description: 'Pace Calculator: running pace from time and distance for training and racing.' },
  'blood-pressure-calculator': { formula: 'MAP = DBP + (SBP - DBP)/3 | PP = SBP - DBP', description: 'Blood Pressure Calculator: mean arterial pressure and pulse pressure from systolic/diastolic readings.' },
  'ideal-weight-calculator': { formula: 'IBW = 50 + 2.3×(H-60) (M) | IBW = 45.5 + 2.3×(H-60) (F)', description: 'Ideal Weight Calculator: healthy weight range based on height using Devine formula.' },
  'macros-calculator': { formula: 'Protein = TDEE × 0.3/4 | Carbs = TDEE × 0.4/4 | Fat = TDEE × 0.3/9', description: 'Macros Calculator: macronutrient split based on daily calorie goals.' },
  'basal-metabolic-rate-calculator': { formula: 'BMR = 10W + 6.25H - 5A + 5(M) | 10W + 6.25H - 5A - 161(F)', description: 'BMR Calculator: resting energy expenditure for metabolic rate assessment.' },
  'pregnancy-weight-gain-calculator': { formula: 'Gain = pre_BMI_category × weeks | Total: 11-16kg normal BMI', description: 'Pregnancy Weight Gain Calculator: recommended weight gain range by trimester and pre-pregnancy BMI.' },
  'pregnancy-conception-calculator': { formula: 'Conception = EDD - 266 days | fertile_window ± 5 days', description: 'Pregnancy Conception Calculator: estimated conception date and fertile window calculation.' },
  'army-body-fat-calculator': { formula: 'Army: male = 86.01×log(abdomen-neck) - 70.04×log(height) + 36.76', description: 'Army Body Fat Calculator: US Army standard body fat estimation using circumference method.' },
  'heart-rate-calculator': { formula: 'HRmax = 208 - 0.7×age | Zones: 50-60%, 60-70%, 70-80%, 80-90%, 90-100%', description: 'Heart Rate Zone Calculator: five-zone training system based on maximum heart rate.' },
  'running-pace-calculator': { formula: 'Pace = total_minutes / distance | Speed = distance / (time/60)', description: 'Running Pace Calculator: min per km/mile pace with speed equivalency conversion.' },
  'walking-pace-calculator': { formula: 'Walking time = distance / 5 km/h (approx) | Calories = MET × weight × hours', description: 'Walking Pace Calculator: estimated walking time and calorie burn for route planning.' },
  'bmi-percentile-calculator': { formula: 'BMI_percentile = growth_chart_lookup(age, BMI, sex)', description: 'BMI Percentile Calculator: child and teen BMI comparison against CDC growth chart percentiles.' },
  'body-surface-area-calculator': { formula: 'BSA = √(weight×height/3600) | Mosteller: BSA = √(W×H/3600)', description: 'Body Surface Area Calculator: medical BSA using Mosteller formula for chemotherapy dosing.' },
  'waist-to-hip-calculator': { formula: 'WHR = waist_cm / hip_cm | Risk: >0.90 M, >0.85 F', description: 'Waist-to-Hip Ratio Calculator: central obesity indicator comparing waist and hip circumference.' },
  'waist-to-height-calculator': { formula: 'WHtR = waist_cm / height_cm | Risk: >0.5 elevated', description: 'Waist-to-Height Ratio Calculator: cardiometabolic risk screening using waist-to-height proportion.' },
  'sleep-calculator': { formula: 'Wake = bed_time + cycles × 90min | 5-6 cycles per night', description: 'Sleep Calculator: optimal bedtime and wake time based on 90-minute sleep cycles.' },
  'sleep-debt-calculator': { formula: 'Debt = (recommended_hrs - actual_hrs) × days', description: 'Sleep Debt Calculator: cumulative sleep deficit tracking for better rest habits.' },
  'calories-burned-activity-calculator': { formula: 'Calories = MET × weight_kg × hours', description: 'Calories Burned Calculator: energy expenditure estimate for 100+ physical activities.' },
  'water-intake-calculator': { formula: 'Water_liters = weight_kg × 0.033 | Adjusted for activity/heat', description: 'Water Intake Calculator: daily hydration requirement based on body weight and activity.' },
  'protein-calculator': { formula: 'Protein_g = weight_kg × factor | Factor: 0.8-2.2 g/kg based on goals', description: 'Protein Calculator: daily protein recommendation for maintenance, muscle gain, or weight loss.' },
  'carb-calculator': { formula: 'Carbs = TDEE × carb% / 4 | Carb%: 45-65% standard, 20-40% low-carb', description: 'Carb Calculator: daily carbohydrate intake range based on energy needs and dietary approach.' },
  'fat-calculator': { formula: 'Fat_g = TDEE × fat% / 9 | Fat%: 20-35% standard, 15-25% low-fat', description: 'Fat Calculator: daily dietary fat recommendation based on calorie goals and health targets.' },
  'keto-macro-calculator': { formula: 'Keto: 70% fat, 25% protein, 5% carbs | Net_carbs = total - fiber', description: 'Keto Macro Calculator: ketogenic diet macronutrient distribution for nutritional ketosis.' },
  'paleo-calculator': { formula: 'Paleo: 30% protein, 40% fat, 30% carbs (unprocessed)', description: 'Paleo Calculator: whole-foods macronutrient breakdown aligned with paleolithic diet principles.' },
  'healthy-weight-calculator': { formula: 'Healthy_range: BMI 18.5-24.9 × height(m)²', description: 'Healthy Weight Calculator: weight range corresponding to normal BMI classification.' },
  'growth-chart-calculator': { formula: 'Percentile = WHO/CDC lookup(age, height, weight, head)', description: 'Growth Chart Calculator: pediatric growth percentiles using WHO and CDC reference data.' },
  'infant-growth-calculator': { formula: 'Weight_percentile = WHO(age, weight, sex) | Height + head', description: 'Infant Growth Calculator: birth to 24-month growth tracking on WHO standard curves.' },
  'fitness-age-calculator': { formula: 'Fitness_age = base - points[resting_HR, BF%, activity, strength]', description: 'Fitness Age Calculator: biological age estimate based on fitness markers relative to norms.' },
  'vo2-max-calculator': { formula: 'VO2max = 15.3 × (HRmax/HRrest) | Rockport: 132.6 - 0.17×W - 0.39×age', description: 'VO2 Max Calculator: maximal oxygen uptake estimate using heart rate or walk test formulas.' },
  'bmr-harris-benedict-calculator': { formula: 'M: 88.4 + 13.4W + 4.8H - 5.7A | F: 447.6 + 9.25W + 3.1H - 4.33A', description: 'BMR Harris-Benedict Calculator: original Harris-Benedict equation for basal metabolic rate estimation.' },
  'fat-free-mass-calculator': { formula: 'FFM = weight - (weight × BF%) | FFMI = FFM / height(m)²', description: 'Fat-Free Mass Calculator: lean body mass and fat-free mass index for body composition.' },
  'caloric-needs-calculator': { formula: 'Total_cal = BMR × PAL + exercise_cals | Goal: -500 deficit, +500 surplus', description: 'Caloric Needs Calculator: personalized calorie target for weight maintenance, loss, or gain.' },
  'max-heart-rate-calculator': { formula: 'HRmax = 208 - 0.7×age | Tanaka: 208 - 0.7×age | Gulati (F): 206 - 0.88×age', description: 'Max Heart Rate Calculator: age-predicted maximum heart rate using validated formulas.' },
  'stress-level-calculator': { formula: 'Stress_score = Σ(PSS_questions) | 0-13 low, 14-26 moderate, 27-40 high', description: 'Stress Level Calculator: perceived stress scale assessment for mental wellness tracking.' },
  'daily-calorie-calculator': { formula: 'TDEE = BMR × PAL | Customize: -20% deficit / +15% surplus', description: 'Daily Calorie Calculator: precision energy requirement with customizable deficit or surplus targets.' },
}

export const mathSlugOverrides: Record<string, FormulaEntry> = {
  'percentage-calculator': { formula: 'P% of X = X × P/100 | X is P% of Y = Y × P/100 | % change = (new - old)/old × 100', description: 'Percentage Calculator: percentage of a number, percentage change, and percentage difference.' },
  'percent-change-calculator': { formula: '% change = (new - old) / old × 100', description: 'Percent Change Calculator: relative increase or decrease between two values.' },
  'fraction-calculator': { formula: 'a/b ○ c/d = (ad ○ bc)/bd | Simplify = GCD(a,b)', description: 'Fraction Calculator: arithmetic operations on fractions with simplification.' },
  'scientific-calculator': { formula: 'sin, cos, tan, log, ln, √, x², x³, eˣ, 10ˣ', description: 'Scientific Calculator: trigonometric, logarithmic, and exponential functions.' },
  'basic-calculator': { formula: 'Result = A ○ B | ○ ∈ {+, -, ×, ÷}', description: 'Basic Calculator: four-function arithmetic for everyday calculations.' },
  'pythagorean-calculator': { formula: 'c² = a² + b² | c = √(a² + b²) | a = √(c² - b²)', description: 'Pythagorean Calculator: triangle side and hypotenuse using the Pythagorean theorem.' },
  'triangle-calculator': { formula: 'A = ½bh | Law of Cosines: c² = a² + b² - 2ab·cos(C)', description: 'Triangle Calculator: area, side lengths, and angles using trigonometric formulas.' },
  'geometry-calculator': { formula: 'Area formulas by shape | Volume formulas by solid', description: 'Geometry Calculator: area and volume computation for standard 2D and 3D shapes.' },
  'area-calculator': { formula: 'Square: s² | Rectangle: l×w | Circle: πr² | Triangle: ½bh', description: 'Area Calculator: surface area for squares, rectangles, circles, triangles, and polygons.' },
  'volume-calculator': { formula: 'Cube: s³ | Sphere: 4/3πr³ | Cylinder: πr²h | Cone: ⅓πr²h', description: 'Volume Calculator: capacity for cubes, spheres, cylinders, cones, and prisms.' },
  'quadratic-formula-calculator': { formula: 'x = [-b ± √(b² - 4ac)] / 2a | D = b² - 4ac', description: 'Quadratic Formula Calculator: real and complex roots for ax² + bx + c = 0.' },
  'standard-deviation-calculator': { formula: 'σ = √[Σ(xi - μ)²/N] | s = √[Σ(xi - x̄)²/(n-1)]', description: 'Standard Deviation Calculator: population and sample dispersion measurement from the mean.' },
  'mean-median-mode-calculator': { formula: 'Mean = Σx/n | Median = mid sorted | Mode = most frequent', description: 'Mean Median Mode Calculator: central tendency measures for any data set.' },
  'statistics-calculator': { formula: 'Mean, Median, Mode, Range, Variance, SD, IQR', description: 'Statistics Calculator: comprehensive descriptive statistics for data analysis.' },
  'probability-calculator': { formula: 'P(E) = favorable / total | P(A∩B) = P(A)×P(B|A)', description: 'Probability Calculator: event probability with conditional and independent calculations.' },
  'z-score-calculator': { formula: 'z = (x - μ) / σ | Percentile = Φ(z) × 100', description: 'Z-Score Calculator: standardized score and percentile from normal distribution.' },
  'confidence-interval-calculator': { formula: 'CI = x̄ ± z × σ/√n | CI = x̄ ± t × s/√n', description: 'Confidence Interval Calculator: range estimate for population parameters with z or t distribution.' },
  'ratio-calculator': { formula: 'a:b = c:d | a/b = c/d | Cross: ad = bc', description: 'Ratio Calculator: proportion comparison and missing value determination.' },
  'exponent-calculator': { formula: 'aⁿ = a × a × ... × a (n times) | Negative: a⁻ⁿ = 1/aⁿ', description: 'Exponent Calculator: power and root operations with integer and fractional exponents.' },
  'log-calculator': { formula: 'log_b(a) = x → bˣ = a | ln(x) = log_e(x)', description: 'Logarithm Calculator: logarithmic values in base 10, e, or custom bases.' },
  'prime-factorization-calculator': { formula: 'n = p₁^e₁ × p₂^e₂ × ... × p_k^e_k', description: 'Prime Factorization Calculator: prime decomposition of any integer.' },
  'gcf-calculator': { formula: 'GCF(a,b) = largest common factor | Euclidean: GCF(a,b) = GCF(b, a mod b)', description: 'GCF Calculator: greatest common factor using Euclidean algorithm.' },
  'lcm-calculator': { formula: 'LCM(a,b) = |a×b| / GCF(a,b)', description: 'LCM Calculator: least common multiple from GCF relationship.' },
  'binary-calculator': { formula: 'Decimal → Binary: divide by 2 | Binary → Decimal: Σ(bit × 2ⁿ)', description: 'Binary Calculator: arithmetic and conversion between binary and decimal systems.' },
  'permutation-combination-calculator': { formula: 'nPr = n!/(n-r)! | nCr = n!/[r!(n-r)!]', description: 'Permutation Calculator: ordered and unordered selection counting.' },
  'matrix-calculator': { formula: 'A+B, A-B, A×B, det(A), A⁻¹, eigenvalues', description: 'Matrix Calculator: matrix operations including multiplication, determinant, and inverse.' },
  'rounding-calculator': { formula: 'Round(x, d) = floor(x×10^d + 0.5)/10^d', description: 'Rounding Calculator: value rounding to specified decimal places or significant figures.' },
  'scientific-notation-calculator': { formula: 'a × 10ⁿ | a ∈ [1,10) | Conversion: decimal ↔ scientific', description: 'Scientific Notation Calculator: number conversion between decimal and scientific notation.' },
  'random-number-generator': { formula: 'rand(min, max) = floor(min + (max-min+1)×U(0,1))', description: 'Random Number Generator: uniform random integer or decimal within specified bounds.' },
  'slope-calculator': { formula: 'm = (y₂-y₁)/(x₂-x₁) | b = y₁ - m×x₁ | y = mx + b', description: 'Slope Calculator: line slope, intercept, and equation from two points.' },
  'distance-calculator': { formula: 'd = √[(x₂-x₁)² + (y₂-y₁)²]', description: 'Distance Calculator: Euclidean distance between two points in 2D coordinate space.' },
  'average-calculator': { formula: 'x̄ = Σxᵢ / n', description: 'Average Calculator: arithmetic mean of any number of values.' },
  'big-number-calculator': { formula: 'Arbitrary precision: A ○ B = result | Unlimited digits', description: 'Big Number Calculator: high-precision arithmetic for very large numbers.' },
  'sample-size-calculator': { formula: 'n = (z² × p × (1-p)) / E² | For finite_pop: adjust n/(1+(n-1)/N)', description: 'Sample Size Calculator: minimum survey sample for desired confidence level and margin of error.' },
  'p-value-calculator': { formula: 'p = P(data | H0) | reject H0 if p < α (0.05)', description: 'P-Value Calculator: statistical significance from z, t, chi-square, or f-test statistics.' },
  'number-sequence-calculator': { formula: 'nth_term = f(n) | Arithmetic: a + (n-1)d | Geometric: ar^(n-1)', description: 'Number Sequence Calculator: arithmetic and geometric sequence terms and series sums.' },
  'percent-error-calculator': { formula: '% error = |observed - true| / true × 100', description: 'Percent Error Calculator: measurement accuracy relative to accepted or theoretical value.' },
  'right-triangle-calculator': { formula: 'sin θ = opp/hyp | cos θ = adj/hyp | tan θ = opp/adj | A = ½bh', description: 'Right Triangle Calculator: trigonometric ratios, side lengths, and area for right triangles.' },
  'circle-calculator': { formula: 'C = 2πr | A = πr² | d = 2r', description: 'Circle Calculator: circumference, area, and diameter from radius or vice versa.' },
  'surface-area-calculator': { formula: 'Rectangular: 2(lw+lh+wh) | Sphere: 4πr² | Cylinder: 2πrh + 2πr²', description: 'Surface Area Calculator: total surface area for common 3D geometric solids.' },
  'root-calculator': { formula: 'ⁿ√x = x^(1/n) | Square: x² = y → x = ±√y', description: 'Root Calculator: nth root and square root extraction for any number.' },
  'factor-calculator': { formula: 'Factors: all integers dividing n evenly | Count = τ(n)', description: 'Factor Calculator: all positive integer factors of any number with count.' },
  'common-factor-calculator': { formula: 'Common_factors = factors(a) ∩ factors(b)', description: 'Common Factor Calculator: shared factors between two numbers with GCF identification.' },
  'long-division-calculator': { formula: 'Dividend ÷ divisor = quotient + remainder/divisor', description: 'Long Division Calculator: step-by-step division showing quotient, remainder, and intermediate steps.' },
  'hex-calculator': { formula: '0xFF = 255 = 11111111₂ | A-F: 10-15 decimal', description: 'Hex Calculator: hexadecimal arithmetic and conversion between hex, decimal, and binary.' },
  'combination-calculator': { formula: 'nCr = n! / (r! × (n-r)!)', description: 'Combination Calculator: number of ways to select items without regard to order.' },
  'permutation-calculator': { formula: 'nPr = n! / (n-r)!', description: 'Permutation Calculator: number of ways to arrange items where order matters.' },
}

export const engSlugOverrides: Record<string, FormulaEntry> = {
  'ohms-law-calculator': { formula: 'V = IR | I = V/R | R = V/I | P = VI = I²R = V²/R', description: 'Ohm\'s Law Calculator: voltage, current, resistance, and power relationships in DC circuits.' },
  'voltage-drop-calculator': { formula: 'V_drop = 2 × I × R × L / 1000 | %V = V_drop / V_source × 100', description: 'Voltage Drop Calculator: conductor voltage loss over distance for proper wire sizing.' },
  'resistor-calculator': { formula: 'Series: R_t = R₁+R₂+...+Rn | Parallel: 1/R_t = Σ(1/Ri)', description: 'Resistor Calculator: equivalent resistance for series, parallel, and combined networks.' },
  'btu-calculator': { formula: 'BTU = area × 20 (base) × insulation × sun × climate', description: 'BTU Calculator: heating and cooling capacity requirement for room air conditioning.' },
  'horsepower-calculator': { formula: 'HP = torque(lb-ft) × RPM / 5252 | kW = HP × 0.7457', description: 'Horsepower Calculator: engine power output from torque and rotational speed.' },
  'engine-horsepower-calculator': { formula: 'HP = (bore² × stroke × RPM × cylinders) / 3526', description: 'Engine Horsepower Calculator: theoretical engine power based on displacement and RPM.' },
}

export const everydayOverrides: Record<string, FormulaEntry> = {
  'tip-calculator': { formula: 'Tip = bill × tip% | Total = bill + tip | Each = total / people', description: 'Tip Calculator: gratuity amount with optional bill splitting for any service.' },
  'gpa-calculator': { formula: 'GPA = Σ(grade_pts × credits) / Σ(credits)', description: 'GPA Calculator: cumulative grade point average weighted by course credit hours.' },
  'grade-calculator': { formula: 'Final = weighted_avg = Σ(grade × weight) / Σ(weight)', description: 'Grade Calculator: weighted grade calculation across assignments and exams.' },
  'random-number-generator': { formula: 'rand(min, max) = floor(min + (max-min+1) × U)', description: 'Random Number Generator: cryptographically-inspired random integer generation.' },
  'coin-flip-calculator': { formula: 'P(heads) = 1/2 | Runs: simulate N flips → distribution', description: 'Coin Flip Calculator: binary outcome simulation with streak tracking.' },
  'dice-roller-calculator': { formula: 'Sum = Σ(rand(1, sides)) | Distribution = outcomes / total_rolls', description: 'Dice Roller Calculator: multi-dice roll simulation with probability distribution.' },
  'password-generator': { formula: 'charset = [a-z, A-Z, 0-9, symbols] | length=N', description: 'Password Generator: cryptographically random password with configurable character sets.' },
  'password-strength-calculator': { formula: 'Entropy = length × log₂(charset_size) bits', description: 'Password Strength Calculator: brute-force resistance measured in entropy bits.' },
}
