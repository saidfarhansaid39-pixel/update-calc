import d_403b_calculator from './403b-calculator'
import d_457_plan from './457-plan'
import d_social_security_disability_2 from './social-security-disability-2'
import d_blanket_loan_2 from './blanket-loan-2'
import d_529_savings_plan from './529-savings-plan'
import d_529_calculator from './529-calculator'
import d_1031_exchange from './1031-exchange'
import d_72t_sepp from './72t-sepp'
import d_529_prepaid from './529-prepaid'
import d_graduated_payment_2 from './graduated-payment-2'
import d_403b_plan from './403b-plan'
import d_401k_calculator from './401k-calculator'
import d_50_30_20_budget from './50-30-20-budget'
import d_457_calculator from './457-calculator'

import type { CalcDef } from '../../../lib/generic-fallback'

export const calcDefs: Record<string, CalcDef> = {
  '403b-calculator': d_403b_calculator,
  '457-plan': d_457_plan,
  'social-security-disability-2': d_social_security_disability_2,
  'blanket-loan-2': d_blanket_loan_2,
  '529-savings-plan': d_529_savings_plan,
  '529-calculator': d_529_calculator,
  '1031-exchange': d_1031_exchange,
  '72t-sepp': d_72t_sepp,
  '529-prepaid': d_529_prepaid,
  'graduated-payment-2': d_graduated_payment_2,
  '403b-plan': d_403b_plan,
  '401k-calculator': d_401k_calculator,
  '50-30-20-budget': d_50_30_20_budget,
  '457-calculator': d_457_calculator,
}
