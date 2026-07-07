export interface ExtraFieldDef {
  name: string
  label: string
  type?: 'number' | 'text' | 'select'
  min?: number
  max?: number
  step?: number | string
  placeholder?: string
  options?: { label: string; value: string }[]
  group?: string
}

const hubPools: Record<string, ExtraFieldDef[]> = {
  'financial-calculators': [
    { name: 'extra_monthly_income', label: 'Monthly Income ($)', min: 0, max: 1000000, step: 100, group: 'Income' },
    { name: 'extra_inflation_rate', label: 'Assumed Inflation Rate (%)', min: 0, max: 20, step: 0.1, group: 'Assumptions' },
    { name: 'extra_risk_tolerance', label: 'Risk Tolerance', type: 'select', options: [{ label: 'Conservative', value: 'conservative' }, { label: 'Moderate', value: 'moderate' }, { label: 'Aggressive', value: 'aggressive' }], group: 'Profile' },
    { name: 'extra_tax_rate', label: 'Effective Tax Rate (%)', min: 0, max: 50, step: 0.1, group: 'Tax' },
    { name: 'extra_fee_percent', label: 'Annual Fees (%)', min: 0, max: 5, step: 0.01, group: 'Fees' },
    { name: 'extra_contribute_timing', label: 'Contribution Timing', type: 'select', options: [{ label: 'End of Period', value: 'end' }, { label: 'Beginning of Period', value: 'beginning' }], group: 'Investments' },
    { name: 'extra_compound_frequency', label: 'Compound Frequency', type: 'select', options: [{ label: 'Annually', value: '1' }, { label: 'Semi-Annually', value: '2' }, { label: 'Quarterly', value: '4' }, { label: 'Monthly', value: '12' }, { label: 'Semi-Monthly', value: '24' }, { label: 'Biweekly', value: '26' }, { label: 'Weekly', value: '52' }, { label: 'Daily', value: '365' }, { label: 'Continuous', value: 'continuous' }], group: 'Investments' },
    { name: 'extra_current_age', label: 'Current Age', min: 1, max: 120, step: 1, group: 'Profile' },
    { name: 'extra_state', label: 'State', type: 'text', placeholder: 'e.g. California', group: 'Location' },
    { name: 'extra_pay_frequency', label: 'Pay Frequency', type: 'select', options: [
      { label: 'Weekly', value: 'weekly' }, { label: 'Biweekly', value: 'biweekly' }, { label: 'Semi-Monthly', value: 'semimonthly' }, { label: 'Monthly', value: 'monthly' }
    ], group: 'Income' },
    { name: 'extra_loan_purpose', label: 'Loan Purpose', type: 'select', options: [
      { label: 'New Purchase', value: 'new' }, { label: 'Refinance', value: 'refinance' }, { label: 'Used Purchase', value: 'used' }
    ], group: 'Loan Details' },
    { name: 'extra_loan_type', label: 'Loan Type', type: 'select', options: [
      { label: 'Fixed Rate', value: 'fixed' }, { label: 'Adjustable Rate (ARM)', value: 'arm' }
    ], group: 'Loan Details' },
    { name: 'extra_payment_frequency', label: 'Payment Frequency', type: 'select', options: [
      { label: 'Monthly', value: 'monthly' }, { label: 'Biweekly', value: 'biweekly' }, { label: 'Accelerated Biweekly', value: 'accelerated' }
    ], group: 'Payment Schedule' },
    { name: 'extra_first_payment_date', label: 'First Payment Date', type: 'select', options: [
      { label: 'Immediately', value: 'now' }, { label: 'Next Month', value: 'next' }, { label: 'In 2 Months', value: '2mo' }, { label: 'In 3 Months', value: '3mo' }
    ], group: 'Payment Schedule' },
    { name: 'extra_monthly_recurring', label: 'Monthly Recurring Expenses ($)', min: 0, max: 50000, step: 50, group: 'Budget' },
    { name: 'extra_employer_match_pct', label: 'Employer 401k Match (%)', min: 0, max: 20, step: 0.5, group: 'Benefits' },
    { name: 'extra_bonus_annual', label: 'Annual Bonus ($)', min: 0, max: 1000000, step: 1000, group: 'Income' },
    { name: 'extra_capital_gains_rate', label: 'Long-Term Capital Gains Rate (%)', min: 0, max: 30, step: 0.1, group: 'Tax' },
    { name: 'extra_retirement_age_goal', label: 'Target Retirement Age', min: 40, max: 80, step: 1, group: 'Goals' },
    { name: 'extra_dependents', label: 'Number of Dependents', min: 0, max: 20, step: 1, group: 'Profile' },
  ],
  'health-calculators': [
    { name: 'extra_activity_level', label: 'Activity Level', type: 'select', options: [
      { label: 'Sedentary', value: '1.2' }, { label: 'Light', value: '1.375' }, { label: 'Moderate', value: '1.55' }, { label: 'Active', value: '1.725' }, { label: 'Very Active', value: '1.9' }
    ], group: 'Lifestyle' },
    { name: 'extra_gender', label: 'Gender', type: 'select', options: [
      { label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }
    ], group: 'Demographics' },
    { name: 'extra_age_years', label: 'Age (years)', min: 1, max: 120, step: 1, group: 'Demographics' },
    { name: 'extra_sleep_hours', label: 'Sleep per Night (hours)', min: 0, max: 24, step: 0.5, group: 'Lifestyle' },
    { name: 'extra_stress_level', label: 'Stress Level (1-10)', min: 1, max: 10, step: 1, group: 'Wellness' },
    { name: 'extra_waist_cm', label: 'Waist Circumference (cm)', min: 20, max: 200, step: 0.5, group: 'Measurements' },
    { name: 'extra_hip_cm', label: 'Hip Circumference (cm)', min: 20, max: 200, step: 0.5, group: 'Measurements' },
    { name: 'extra_neck_cm', label: 'Neck Circumference (cm)', min: 10, max: 80, step: 0.5, group: 'Measurements' },
    { name: 'extra_body_fat_pct', label: 'Body Fat Percentage (%)', min: 1, max: 60, step: 0.1, group: 'Body Composition' },
    { name: 'extra_bmr_formula', label: 'BMR Formula', type: 'select', options: [
      { label: 'Mifflin-St Jeor', value: 'mifflin' }, { label: 'Revised Harris-Benedict', value: 'harris' }, { label: 'Katch-McArdle', value: 'katch' }
    ], group: 'Calculation Method' },
    { name: 'extra_goal', label: 'Health Goal', type: 'select', options: [
      { label: 'Maintain Weight', value: 'maintain' }, { label: 'Lose Weight', value: 'lose' }, { label: 'Gain Weight', value: 'gain' }, { label: 'Build Muscle', value: 'muscle' }
    ], group: 'Goals' },
    { name: 'extra_weight_change_rate', label: 'Target Weight Change per Week (lbs)', min: 0, max: 3, step: 0.5, group: 'Goals' },
    { name: 'extra_units_kj', label: 'Display in Kilojoules', type: 'select', options: [
      { label: 'Calories (kcal)', value: 'kcal' }, { label: 'Kilojoules (kJ)', value: 'kj' }
    ], group: 'Display' },
    { name: 'extra_height_cm', label: 'Height (cm)', min: 50, max: 300, step: 1, group: 'Demographics' },
    { name: 'extra_weight_kg', label: 'Weight (kg)', min: 10, max: 500, step: 0.5, group: 'Demographics' },
    { name: 'extra_blood_pressure_sys', label: 'Systolic BP (mmHg)', min: 60, max: 250, step: 1, group: 'Wellness' },
    { name: 'extra_blood_pressure_dia', label: 'Diastolic BP (mmHg)', min: 30, max: 150, step: 1, group: 'Wellness' },
    { name: 'extra_daily_steps', label: 'Daily Step Goal', min: 1000, max: 50000, step: 1000, group: 'Fitness' },
  ],
  'math-calculators': [
    { name: 'extra_decimal_places', label: 'Decimal Places', min: 0, max: 15, step: 1, group: 'Precision' },
    { name: 'extra_significant_figures', label: 'Significant Figures', min: 1, max: 15, step: 1, group: 'Precision' },
    { name: 'extra_rounding_mode', label: 'Rounding Mode', type: 'select', options: [
      { label: 'Standard', value: 'standard' }, { label: 'Floor', value: 'floor' }, { label: 'Ceil', value: 'ceil' }, { label: 'Truncate', value: 'truncate' }
    ], group: 'Precision' },
    { name: 'extra_notation', label: 'Number Notation', type: 'select', options: [
      { label: 'Decimal', value: 'decimal' }, { label: 'Scientific', value: 'scientific' }, { label: 'Engineering', value: 'engineering' }
    ], group: 'Display' },
    { name: 'extra_angle_unit', label: 'Angle Unit', type: 'select', options: [
      { label: 'Degrees', value: 'deg' }, { label: 'Radians', value: 'rad' }
    ], group: 'Units' },
    { name: 'extra_base', label: 'Number Base', type: 'select', options: [
      { label: 'Decimal (10)', value: 'dec' }, { label: 'Hexadecimal (16)', value: 'hex' }, { label: 'Octal (8)', value: 'oct' }, { label: 'Binary (2)', value: 'bin' }
    ], group: 'Display' },
    { name: 'extra_precision_mode', label: 'Precision Mode', type: 'select', options: [
      { label: 'Exact', value: 'exact' }, { label: 'Approximate', value: 'approx' }
    ], group: 'Precision' },
    { name: 'extra_output_format', label: 'Output Format', type: 'select', options: [
      { label: 'Decimal', value: 'decimal' }, { label: 'Fraction', value: 'fraction' }, { label: 'Percent', value: 'percent' }
    ], group: 'Display' },
  ],
  'conversion-calculators': [
    { name: 'extra_decimal_places', label: 'Decimal Places', min: 0, max: 15, step: 1, group: 'Precision' },
    { name: 'extra_significant_figures', label: 'Significant Figures', min: 1, max: 15, step: 1, group: 'Precision' },
    { name: 'extra_notation', label: 'Number Notation', type: 'select', options: [
      { label: 'Decimal', value: 'decimal' }, { label: 'Scientific', value: 'scientific' }, { label: 'Engineering', value: 'engineering' }
    ], group: 'Display' },
    { name: 'extra_rounding_mode', label: 'Rounding Mode', type: 'select', options: [
      { label: 'Standard', value: 'standard' }, { label: 'Floor', value: 'floor' }, { label: 'Ceil', value: 'ceil' }, { label: 'Truncate', value: 'truncate' }
    ], group: 'Precision' },
    { name: 'extra_precision_mode', label: 'Precision Mode', type: 'select', options: [
      { label: 'Standard', value: 'standard' }, { label: 'High Precision', value: 'high' }
    ], group: 'Precision' },
    { name: 'extra_rate_source', label: 'Exchange Rate Source', type: 'select', options: [
      { label: 'Market Rate', value: 'market' }, { label: 'Bank Rate', value: 'bank' }, { label: 'Fixed Rate', value: 'fixed' }
    ], group: 'Rates' },
    { name: 'extra_auto_update', label: 'Auto-Update Rates', type: 'select', options: [
      { label: 'Real-Time', value: 'realtime' }, { label: 'Daily', value: 'daily' }, { label: 'Manual', value: 'manual' }
    ], group: 'Rates' },
    { name: 'extra_display_format', label: 'Display Format', type: 'select', options: [
      { label: 'Standard', value: 'standard' }, { label: 'Compact', value: 'compact' }, { label: 'Scientific', value: 'scientific' }
    ], group: 'Display' },
  ],
  'date-time-calculators': [
    { name: 'extra_timezone', label: 'Timezone', type: 'select', options: [
      { label: 'UTC', value: 'UTC' }, { label: 'EST', value: 'EST' }, { label: 'CST', value: 'CST' }, { label: 'MST', value: 'MST' }, { label: 'PST', value: 'PST' }, { label: 'GMT', value: 'GMT' }, { label: 'CET', value: 'CET' }, { label: 'IST', value: 'IST' }, { label: 'JST', value: 'JST' }, { label: 'AEST', value: 'AEST' }
    ], group: 'Region' },
    { name: 'extra_week_start', label: 'Week Starts On', type: 'select', options: [
      { label: 'Sunday', value: 'sunday' }, { label: 'Monday', value: 'monday' }, { label: 'Saturday', value: 'saturday' }
    ], group: 'Preferences' },
    { name: 'extra_fiscal_start', label: 'Fiscal Year Start Month', type: 'select', options: [
      { label: 'January', value: '1' }, { label: 'April', value: '4' }, { label: 'July', value: '7' }, { label: 'October', value: '10' }
    ], group: 'Business' },
    { name: 'extra_include_time', label: 'Include Time in Results', type: 'select', options: [
      { label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }
    ], group: 'Display' },
    { name: 'extra_date_format', label: 'Date Format', type: 'select', options: [
      { label: 'MM/DD/YYYY', value: 'us' }, { label: 'DD/MM/YYYY', value: 'eu' }, { label: 'YYYY-MM-DD', value: 'iso' }
    ], group: 'Display' },
    { name: 'extra_time_format', label: 'Time Format', type: 'select', options: [
      { label: '12-Hour', value: '12h' }, { label: '24-Hour', value: '24h' }
    ], group: 'Display' },
    { name: 'extra_working_days_only', label: 'Count Working Days Only', type: 'select', options: [
      { label: 'No (All Days)', value: 'no' }, { label: 'Yes (Mon-Fri)', value: 'yes' }
    ], group: 'Calculation' },
    { name: 'extra_include_holidays', label: 'Include Public Holidays', type: 'select', options: [
      { label: 'No', value: 'no' }, { label: 'Yes (Subtract from total)', value: 'yes' }
    ], group: 'Calculation' },
  ],
  'construction-calculators': [
    { name: 'extra_waste_factor', label: 'Waste Factor (%)', min: 0, max: 50, step: 0.5, group: 'Materials' },
    { name: 'extra_labor_rate', label: 'Labor Rate ($/hr)', min: 0, max: 500, step: 5, group: 'Cost' },
    { name: 'extra_material_quality', label: 'Material Quality', type: 'select', options: [
      { label: 'Budget', value: 'budget' }, { label: 'Standard', value: 'standard' }, { label: 'Premium', value: 'premium' }
    ], group: 'Materials' },
    { name: 'extra_difficulty', label: 'Difficulty Factor', type: 'select', options: [
      { label: 'Easy', value: '1.0' }, { label: 'Moderate', value: '1.2' }, { label: 'Complex', value: '1.5' }
    ], group: 'Labor' },
    { name: 'extra_region_factor', label: 'Regional Cost Multiplier', min: 0.5, max: 3, step: 0.1, group: 'Cost' },
    { name: 'extra_project_type', label: 'Project Type', type: 'select', options: [
      { label: 'New Construction', value: 'new' }, { label: 'Renovation', value: 'renovation' }, { label: 'Addition', value: 'addition' }, { label: 'Repair', value: 'repair' }
    ], group: 'Project' },
    { name: 'extra_contingency', label: 'Contingency Budget (%)', min: 0, max: 30, step: 1, group: 'Budget' },
    { name: 'extra_permit_cost', label: 'Permit Fees ($)', min: 0, max: 50000, step: 100, group: 'Fees' },
    { name: 'extra_unit_preference', label: 'Unit System', type: 'select', options: [
      { label: 'Imperial (ft/in)', value: 'imperial' }, { label: 'Metric (m/cm)', value: 'metric' }
    ], group: 'Units' },
    { name: 'extra_zip_code', label: 'ZIP Code', type: 'text', placeholder: 'e.g. 90210', group: 'Location' },
    { name: 'extra_markup_pct', label: 'Contractor Markup (%)', min: 0, max: 50, step: 1, group: 'Cost' },
    { name: 'extra_delivery_fee', label: 'Material Delivery Fee ($)', min: 0, max: 5000, step: 25, group: 'Cost' },
    { name: 'extra_cleanup_cost', label: 'Cleanup & Disposal ($)', min: 0, max: 10000, step: 50, group: 'Cost' },
    { name: 'extra_inspection_fee', label: 'Inspection Fee ($)', min: 0, max: 5000, step: 25, group: 'Fees' },
  ],
  'statistics-calculators': [
    { name: 'extra_confidence_level', label: 'Confidence Level (%)', type: 'select', options: [
      { label: '90%', value: '90' }, { label: '95%', value: '95' }, { label: '99%', value: '99' }
    ], group: 'Inference' },
    { name: 'extra_significance_level', label: 'Significance Level (alpha)', type: 'select', options: [
      { label: '0.01', value: '0.01' }, { label: '0.05', value: '0.05' }, { label: '0.10', value: '0.10' }
    ], group: 'Inference' },
    { name: 'extra_decimals', label: 'Decimal Places in Results', min: 0, max: 10, step: 1, group: 'Display' },
    { name: 'extra_outlier_method', label: 'Outlier Removal', type: 'select', options: [
      { label: 'None', value: 'none' }, { label: 'IQR Method', value: 'iqr' }, { label: 'Z-Score (3σ)', value: 'zscore' }, { label: 'MAD Method', value: 'mad' }
    ], group: 'Data Processing' },
    { name: 'extra_variance_method', label: 'Variance Method', type: 'select', options: [
      { label: 'Sample (n-1)', value: 'sample' }, { label: 'Population (n)', value: 'population' }
    ], group: 'Calculation' },
    { name: 'extra_hypothesis_test', label: 'Hypothesis Test Type', type: 'select', options: [
      { label: 'Two-Tailed', value: 'two' }, { label: 'Left-Tailed', value: 'left' }, { label: 'Right-Tailed', value: 'right' }
    ], group: 'Inference' },
    { name: 'extra_effect_size', label: 'Effect Size Display', type: 'select', options: [
      { label: 'Cohen\'s d', value: 'cohens_d' }, { label: 'Pearson\'s r', value: 'pearson_r' }, { label: 'Odds Ratio', value: 'odds_ratio' }
    ], group: 'Display' },
    { name: 'extra_distribution', label: 'Distribution Type', type: 'select', options: [
      { label: 'Normal', value: 'normal' }, { label: 'T-Distribution', value: 't' }, { label: 'Chi-Square', value: 'chi_square' }, { label: 'F-Distribution', value: 'f' }
    ], group: 'Inference' },
  ],
  'education-calculators': [
    { name: 'extra_scale_type', label: 'Grading Scale', type: 'select', options: [
      { label: 'Standard (A-F)', value: 'standard' }, { label: 'Pass/Fail', value: 'passfail' }, { label: 'Percentage', value: 'percentage' }
    ], group: 'Scale' },
    { name: 'extra_rounding', label: 'Round Final Grade', type: 'select', options: [
      { label: 'No Rounding', value: 'none' }, { label: 'Up', value: 'up' }, { label: 'Nearest', value: 'nearest' }
    ], group: 'Scale' },
    { name: 'extra_credit_hours', label: 'Standard Credit Hours', min: 1, max: 6, step: 0.5, group: 'Course' },
    { name: 'extra_curve_type', label: 'Curve Type', type: 'select', options: [
      { label: 'No Curve', value: 'none' }, { label: 'Bell Curve', value: 'bell' }, { label: 'Linear', value: 'linear' }, { label: 'Square Root', value: 'sqrt' }
    ], group: 'Grading' },
    { name: 'extra_weighted_grades', label: 'Enable Weighted Grades', type: 'select', options: [
      { label: 'No', value: 'no' }, { label: 'Yes', value: 'yes' }
    ], group: 'Grading' },
    { name: 'extra_extra_credit', label: 'Extra Credit Points', min: 0, max: 50, step: 1, group: 'Grading' },
    { name: 'extra_attendance_weight', label: 'Attendance Weight (%)', min: 0, max: 50, step: 5, group: 'Grading' },
    { name: 'extra_passing_grade', label: 'Passing Grade (%)', min: 50, max: 80, step: 5, group: 'Scale' },
  ],
  'physics-calculators': [
    { name: 'extra_significant_figures', label: 'Significant Figures', min: 1, max: 10, step: 1, group: 'Precision' },
    { name: 'extra_gravity', label: 'Gravitational Acceleration (m/s²)', min: 0, max: 20, step: 0.01, group: 'Constants' },
    { name: 'extra_air_resistance', label: 'Air Resistance Coefficient', min: 0, max: 1, step: 0.01, group: 'Environment' },
    { name: 'extra_temperature_c', label: 'Ambient Temperature (°C)', min: -100, max: 100, step: 1, group: 'Environment' },
    { name: 'extra_pressure_atm', label: 'Atmospheric Pressure (atm)', min: 0, max: 10, step: 0.01, group: 'Environment' },
    { name: 'extra_precision_mode', label: 'Precision Mode', type: 'select', options: [
      { label: 'Standard', value: 'standard' }, { label: 'High Precision', value: 'high' }
    ], group: 'Precision' },
    { name: 'extra_velocity_ms', label: 'Initial Velocity (m/s)', min: 0, max: 100000, step: 1, group: 'Kinematics' },
    { name: 'extra_angle_deg', label: 'Launch Angle (°)', min: 0, max: 90, step: 1, group: 'Kinematics' },
    { name: 'extra_friction_coeff', label: 'Friction Coefficient', min: 0, max: 1, step: 0.01, group: 'Kinematics' },
  ],
  'chemistry-calculators': [
    { name: 'extra_significant_figures', label: 'Significant Figures', min: 1, max: 10, step: 1, group: 'Precision' },
    { name: 'extra_temperature_c', label: 'Temperature (°C)', min: -273, max: 5000, step: 1, group: 'Conditions' },
    { name: 'extra_pressure_atm', label: 'Pressure (atm)', min: 0, max: 1000, step: 0.01, group: 'Conditions' },
    { name: 'extra_ph_level', label: 'Solution pH', min: 0, max: 14, step: 0.1, group: 'Conditions' },
    { name: 'extra_volume_ml', label: 'Volume (mL)', min: 0, max: 100000, step: 1, group: 'Measurement' },
    { name: 'extra_molarity', label: 'Solution Molarity (M)', min: 0, max: 100, step: 0.01, group: 'Solutions' },
    { name: 'extra_mass_g', label: 'Mass (g)', min: 0, max: 100000, step: 0.1, group: 'Measurement' },
    { name: 'extra_molar_mass', label: 'Molar Mass (g/mol)', min: 0, max: 1000, step: 0.01, group: 'Measurement' },
    { name: 'extra_reaction_yield', label: 'Expected Reaction Yield (%)', min: 0, max: 100, step: 1, group: 'Reaction' },
  ],
  'engineering-calculators': [
    { name: 'extra_safety_factor', label: 'Safety Factor', min: 1, max: 10, step: 0.1, group: 'Design' },
    { name: 'extra_tolerance', label: 'Tolerance (%)', min: 0, max: 25, step: 0.5, group: 'Manufacturing' },
    { name: 'extra_temperature_c', label: 'Operating Temperature (°C)', min: -100, max: 1000, step: 5, group: 'Environment' },
    { name: 'extra_material', label: 'Material Type', type: 'select', options: [
      { label: 'Steel', value: 'steel' }, { label: 'Aluminum', value: 'aluminum' }, { label: 'Concrete', value: 'concrete' }, { label: 'Wood', value: 'wood' }, { label: 'Composite', value: 'composite' }
    ], group: 'Materials' },
    { name: 'extra_standards', label: 'Design Standard', type: 'select', options: [
      { label: 'ISO', value: 'iso' }, { label: 'ASTM', value: 'astm' }, { label: 'BS', value: 'bs' }, { label: 'ASME', value: 'asme' }, { label: 'ACI', value: 'aci' }
    ], group: 'Standards' },
    { name: 'extra_load_type', label: 'Load Type', type: 'select', options: [
      { label: 'Static', value: 'static' }, { label: 'Dynamic', value: 'dynamic' }, { label: 'Impact', value: 'impact' }, { label: 'Cyclic/Fatigue', value: 'cyclic' }
    ], group: 'Loading' },
    { name: 'extra_exposure', label: 'Exposure Condition', type: 'select', options: [
      { label: 'Indoor', value: 'indoor' }, { label: 'Outdoor', value: 'outdoor' }, { label: 'Corrosive', value: 'corrosive' }, { label: 'Marine', value: 'marine' }, { label: 'High Temp', value: 'high_temp' }
    ], group: 'Environment' },
    { name: 'extra_lifespan_years', label: 'Design Lifespan (years)', min: 1, max: 100, step: 5, group: 'Design' },
    { name: 'extra_maintenance_factor', label: 'Maintenance Factor', min: 0.5, max: 2, step: 0.1, group: 'Design' },
    { name: 'extra_wind_load', label: 'Wind Load (psf)', min: 0, max: 100, step: 5, group: 'Loading' },
    { name: 'extra_seismic_zone', label: 'Seismic Zone', type: 'select', options: [
      { label: 'Zone 0', value: '0' }, { label: 'Zone 1', value: '1' }, { label: 'Zone 2', value: '2' }, { label: 'Zone 3', value: '3' }, { label: 'Zone 4', value: '4' }
    ], group: 'Loading' },
    { name: 'extra_soil_type', label: 'Soil Bearing Capacity', type: 'select', options: [
      { label: 'Rock (12,000 psf)', value: 'rock' }, { label: 'Sand/Gravel (4,000 psf)', value: 'sand' }, { label: 'Clay (2,000 psf)', value: 'clay' }, { label: 'Silt (1,500 psf)', value: 'silt' }
    ], group: 'Geotechnical' },
    { name: 'extra_concrete_psi', label: 'Concrete Strength (psi)', min: 2000, max: 10000, step: 500, group: 'Materials' },
  ],
  'everyday-calculators': [
    { name: 'extra_quantity', label: 'Quantity', min: 1, max: 10000, step: 1, group: 'General' },
    { name: 'extra_quality_tier', label: 'Quality Tier', type: 'select', options: [
      { label: 'Budget', value: 'budget' }, { label: 'Standard', value: 'standard' }, { label: 'Premium', value: 'premium' }
    ], group: 'General' },
    { name: 'extra_region', label: 'Region', type: 'select', options: [
      { label: 'US', value: 'us' }, { label: 'EU', value: 'eu' }, { label: 'UK', value: 'uk' }, { label: 'Asia', value: 'asia' }, { label: 'Other', value: 'other' }
    ], group: 'Location' },
    { name: 'extra_currency_code', label: 'Currency', type: 'select', options: [
      { label: 'USD ($)', value: 'USD' }, { label: 'EUR (€)', value: 'EUR' }, { label: 'GBP (£)', value: 'GBP' }, { label: 'JPY (¥)', value: 'JPY' }, { label: 'CAD (C$)', value: 'CAD' }
    ], group: 'Currency' },
    { name: 'extra_tax_rate', label: 'Sales Tax Rate (%)', min: 0, max: 15, step: 0.1, group: 'Cost' },
    { name: 'extra_round_up', label: 'Round Up', type: 'select', options: [
      { label: 'No Rounding', value: 'none' }, { label: 'Nearest Dollar', value: 'dollar' }, { label: 'Nearest $5', value: 'five' }, { label: 'Nearest $10', value: 'ten' }
    ], group: 'Rounding' },
    { name: 'extra_split_count', label: 'Split Between People', min: 1, max: 100, step: 1, group: 'Sharing' },
    { name: 'extra_service_quality', label: 'Service Quality', type: 'select', options: [
      { label: 'Poor (10%)', value: '0.10' }, { label: 'Average (15%)', value: '0.15' }, { label: 'Good (18%)', value: '0.18' }, { label: 'Excellent (20%)', value: '0.20' }, { label: 'Custom', value: 'custom' }
    ], group: 'Tip' },
    { name: 'extra_tip_custom_pct', label: 'Custom Tip Percentage (%)', min: 0, max: 100, step: 1, group: 'Tip' },
    { name: 'extra_discount_pct', label: 'Discount Percentage (%)', min: 0, max: 100, step: 1, group: 'Savings' },
    { name: 'extra_coupon_amount', label: 'Coupon Amount ($)', min: 0, max: 5000, step: 1, group: 'Savings' },
    { name: 'extra_rewards_points', label: 'Rewards Points Balance', min: 0, max: 1000000, step: 100, group: 'Savings' },
    { name: 'extra_loyalty_tier', label: 'Loyalty Tier', type: 'select', options: [
      { label: 'Standard', value: 'standard' }, { label: 'Silver', value: 'silver' }, { label: 'Gold', value: 'gold' }, { label: 'Platinum', value: 'platinum' }
    ], group: 'Profile' },
  ],
  'food-calculators': [
    { name: 'extra_servings', label: 'Number of Servings', min: 1, max: 100, step: 1, group: 'Portion' },
    { name: 'extra_diet', label: 'Dietary Preference', type: 'select', options: [
      { label: 'None', value: 'none' }, { label: 'Vegetarian', value: 'vegetarian' }, { label: 'Vegan', value: 'vegan' }, { label: 'Keto', value: 'keto' }, { label: 'Gluten-Free', value: 'gluten-free' }
    ], group: 'Diet' },
    { name: 'extra_difficulty', label: 'Recipe Difficulty', type: 'select', options: [
      { label: 'Beginner', value: 'beginner' }, { label: 'Intermediate', value: 'intermediate' }, { label: 'Advanced', value: 'advanced' }
    ], group: 'Skill' },
    { name: 'extra_cuisine', label: 'Cuisine Type', type: 'select', options: [
      { label: 'Italian', value: 'italian' }, { label: 'Mexican', value: 'mexican' }, { label: 'Chinese', value: 'chinese' }, { label: 'Indian', value: 'indian' }, { label: 'American', value: 'american' }
    ], group: 'Recipe' },
    { name: 'extra_cook_method', label: 'Cooking Method', type: 'select', options: [
      { label: 'Bake', value: 'bake' }, { label: 'Grill', value: 'grill' }, { label: 'Stovetop', value: 'stovetop' }, { label: 'Slow Cook', value: 'slow-cook' }, { label: 'Air Fry', value: 'air-fry' }
    ], group: 'Recipe' },
    { name: 'extra_calorie_unit', label: 'Calorie Display', type: 'select', options: [
      { label: 'Calories (kcal)', value: 'kcal' }, { label: 'Kilojoules (kJ)', value: 'kj' }
    ], group: 'Display' },
    { name: 'extra_allergen_filter', label: 'Allergen Filter', type: 'select', options: [
      { label: 'None', value: 'none' }, { label: 'Nut-Free', value: 'nut' }, { label: 'Dairy-Free', value: 'dairy' }, { label: 'Egg-Free', value: 'egg' }, { label: 'Soy-Free', value: 'soy' }
    ], group: 'Diet' },
    { name: 'extra_prep_time', label: 'Max Prep Time (minutes)', min: 0, max: 480, step: 5, group: 'Time' },
    { name: 'extra_total_time', label: 'Max Total Time (minutes)', min: 0, max: 1440, step: 10, group: 'Time' },
    { name: 'extra_spice_level', label: 'Spice Level', type: 'select', options: [
      { label: 'Mild', value: 'mild' }, { label: 'Medium', value: 'medium' }, { label: 'Hot', value: 'hot' }, { label: 'Extra Hot', value: 'extra_hot' }
    ], group: 'Recipe' },
    { name: 'extra_yield_servings', label: 'Expected Yield (servings)', min: 1, max: 100, step: 1, group: 'Portion' },
    { name: 'extra_storage_days', label: 'Storage Duration (days)', min: 0, max: 365, step: 1, group: 'Time' },
    { name: 'extra_nutrient_filter', label: 'Nutrient Filter', type: 'select', options: [
      { label: 'All Nutrients', value: 'all' }, { label: 'High Protein', value: 'protein' }, { label: 'Low Carb', value: 'low_carb' }, { label: 'Low Fat', value: 'low_fat' }
    ], group: 'Display' },
  ],
  'biology-calculators': [
    { name: 'extra_temperature_c', label: 'Temperature (°C)', min: -50, max: 100, step: 1, group: 'Conditions' },
    { name: 'extra_ph_level', label: 'pH Level', min: 0, max: 14, step: 0.1, group: 'Conditions' },
    { name: 'extra_time_hours', label: 'Time (hours)', min: 0, max: 1000, step: 0.5, group: 'Time' },
    { name: 'extra_organism_type', label: 'Organism Type', type: 'select', options: [
      { label: 'Mammal', value: 'mammal' }, { label: 'Plant', value: 'plant' }, { label: 'Bacteria', value: 'bacteria' }, { label: 'Fungi', value: 'fungi' }, { label: 'Protist', value: 'protist' }
    ], group: 'Organism' },
    { name: 'extra_concentration', label: 'Concentration (mg/mL)', min: 0, max: 1000, step: 0.1, group: 'Solution' },
    { name: 'extra_species', label: 'Species/Organism', type: 'select', options: [
      { label: 'Human', value: 'human' }, { label: 'Mouse', value: 'mouse' }, { label: 'Rat', value: 'rat' }, { label: 'Zebrafish', value: 'zebrafish' }, { label: 'E. coli', value: 'ecoli' }
    ], group: 'Organism' },
    { name: 'extra_growth_phase', label: 'Growth Phase', type: 'select', options: [
      { label: 'Lag Phase', value: 'lag' }, { label: 'Log Phase', value: 'log' }, { label: 'Stationary', value: 'stationary' }, { label: 'Death Phase', value: 'death' }
    ], group: 'Growth' },
    { name: 'extra_light_intensity', label: 'Light Intensity (lux)', min: 0, max: 100000, step: 100, group: 'Conditions' },
    { name: 'extra_humidity_pct', label: 'Relative Humidity (%)', min: 0, max: 100, step: 5, group: 'Conditions' },
  ],
  'ecology-calculators': [
    { name: 'extra_area_ha', label: 'Area (hectares)', min: 0, max: 1000000, step: 1, group: 'Area' },
    { name: 'extra_time_years', label: 'Time Period (years)', min: 0, max: 1000, step: 1, group: 'Time' },
    { name: 'extra_climate_zone', label: 'Climate Zone', type: 'select', options: [
      { label: 'Tropical', value: 'tropical' }, { label: 'Temperate', value: 'temperate' }, { label: 'Boreal', value: 'boreal' }, { label: 'Arid', value: 'arid' }, { label: 'Polar', value: 'polar' }
    ], group: 'Environment' },
    { name: 'extra_ecosystem', label: 'Ecosystem Type', type: 'select', options: [
      { label: 'Forest', value: 'forest' }, { label: 'Grassland', value: 'grassland' }, { label: 'Wetland', value: 'wetland' }, { label: 'Marine', value: 'marine' }, { label: 'Freshwater', value: 'freshwater' }
    ], group: 'Habitat' },
    { name: 'extra_disturbance', label: 'Disturbance Level', type: 'select', options: [
      { label: 'None', value: 'none' }, { label: 'Low', value: 'low' }, { label: 'Moderate', value: 'moderate' }, { label: 'High', value: 'high' }
    ], group: 'Assessment' },
    { name: 'extra_precipitation_mm', label: 'Annual Precipitation (mm)', min: 0, max: 10000, step: 10, group: 'Climate' },
    { name: 'extra_soil_ph', label: 'Soil pH', min: 0, max: 14, step: 0.1, group: 'Soil' },
    { name: 'extra_biodiversity_index', label: 'Biodiversity Index', type: 'select', options: [
      { label: 'Shannon', value: 'shannon' }, { label: 'Simpson', value: 'simpson' }, { label: 'Species Richness', value: 'richness' }
    ], group: 'Assessment' },
    { name: 'extra_carbon_seq_rate', label: 'Carbon Sequestration Rate (tCO2/ha/yr)', min: 0, max: 50, step: 0.5, group: 'Climate' },
  ],
  'sports-calculators': [
    { name: 'extra_distance_unit', label: 'Distance Unit', type: 'select', options: [
      { label: 'Miles', value: 'miles' }, { label: 'Kilometers', value: 'km' }, { label: 'Meters', value: 'meters' }
    ], group: 'Units' },
    { name: 'extra_terrain', label: 'Terrain Type', type: 'select', options: [
      { label: 'Flat', value: 'flat' }, { label: 'Hilly', value: 'hilly' }, { label: 'Trail', value: 'trail' }, { label: 'Treadmill', value: 'treadmill' }
    ], group: 'Environment' },
    { name: 'extra_elevation_gain', label: 'Elevation Gain (ft)', min: 0, max: 50000, step: 50, group: 'Environment' },
    { name: 'extra_temperature_f', label: 'Temperature (°F)', min: -20, max: 130, step: 1, group: 'Weather' },
    { name: 'extra_humidity', label: 'Humidity (%)', min: 0, max: 100, step: 5, group: 'Weather' },
    { name: 'extra_gender', label: 'Gender', type: 'select', options: [
      { label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }
    ], group: 'Profile' },
    { name: 'extra_age_years', label: 'Age (years)', min: 1, max: 120, step: 1, group: 'Profile' },
    { name: 'extra_experience_level', label: 'Experience Level', type: 'select', options: [
      { label: 'Beginner', value: 'beginner' }, { label: 'Intermediate', value: 'intermediate' }, { label: 'Advanced', value: 'advanced' }, { label: 'Elite', value: 'elite' }
    ], group: 'Profile' },
    { name: 'extra_heart_rate_max', label: 'Max Heart Rate (bpm)', min: 100, max: 250, step: 1, group: 'Physiology' },
    { name: 'extra_resting_hr', label: 'Resting Heart Rate (bpm)', min: 30, max: 100, step: 1, group: 'Physiology' },
    { name: 'extra_wind_speed', label: 'Wind Speed (mph)', min: 0, max: 50, step: 1, group: 'Weather' },
    { name: 'extra_altitude_ft', label: 'Altitude (ft)', min: 0, max: 30000, step: 100, group: 'Environment' },
    { name: 'extra_pace_unit', label: 'Pace Display Unit', type: 'select', options: [
      { label: 'min/mile', value: 'min_per_mile' }, { label: 'min/km', value: 'min_per_km' }
    ], group: 'Display' },
    { name: 'extra_vo2max', label: 'VO2 Max', min: 10, max: 100, step: 1, group: 'Physiology' },
    { name: 'extra_lactate_threshold', label: 'Lactate Threshold (bpm)', min: 100, max: 220, step: 1, group: 'Physiology' },
    { name: 'extra_training_zone', label: 'Training Zone Focus', type: 'select', options: [
      { label: 'Zone 1 (Recovery)', value: 'zone1' }, { label: 'Zone 2 (Endurance)', value: 'zone2' }, { label: 'Zone 3 (Tempo)', value: 'zone3' }, { label: 'Zone 4 (Threshold)', value: 'zone4' }, { label: 'Zone 5 (VO2 Max)', value: 'zone5' }
    ], group: 'Training' },
  ],
}

const slugOverrides: Record<string, ExtraFieldDef[]> = {
  'mortgage-calculator': [
    { name: 'extra_property_tax', label: 'Property Taxes ($/year)', min: 0, max: 100000, step: 100, group: 'Housing Costs' },
    { name: 'extra_home_insurance', label: 'Home Insurance ($/year)', min: 0, max: 20000, step: 100, group: 'Housing Costs' },
    { name: 'extra_pmi_rate', label: 'PMI Rate (%)', min: 0, max: 5, step: 0.01, group: 'Housing Costs' },
    { name: 'extra_hoa', label: 'HOA Fees ($/mo)', min: 0, max: 10000, step: 10, group: 'Housing Costs' },
    { name: 'extra_other_costs', label: 'Other Monthly Costs ($)', min: 0, max: 10000, step: 10, group: 'Housing Costs' },
    { name: 'extra_zip_code', label: 'ZIP Code', type: 'text', placeholder: 'e.g. 90210', group: 'Location' },
    { name: 'extra_credit_score', label: 'Credit Score Range', type: 'select', options: [
      { label: 'Excellent (720+)', value: 'excellent' }, { label: 'Good (690-719)', value: 'good' }, { label: 'Fair (630-689)', value: 'fair' }, { label: 'Poor (<630)', value: 'poor' }
    ], group: 'Profile' },
    { name: 'extra_start_date', label: 'Loan Start Month', type: 'select', options: [
      { label: 'January', value: '1' }, { label: 'April', value: '4' }, { label: 'July', value: '7' }, { label: 'October', value: '10' }
    ], group: 'Schedule' },
    { name: 'extra_extra_payment', label: 'Extra Monthly Payment ($)', min: 0, max: 100000, step: 50, group: 'Payoff' },
    { name: 'extra_biweekly', label: 'Biweekly Payments', type: 'select', options: [
      { label: 'No', value: 'no' }, { label: 'Yes', value: 'yes' }
    ], group: 'Payoff' },
    { name: 'extra_loan_type', label: 'Loan Type', type: 'select', options: [
      { label: 'Fixed Rate', value: 'fixed' }, { label: 'Adjustable Rate (ARM)', value: 'arm' }
    ], group: 'Loan Details' },
    { name: 'extra_payment_frequency', label: 'Payment Frequency', type: 'select', options: [
      { label: 'Monthly', value: 'monthly' }, { label: 'Biweekly', value: 'biweekly' }, { label: 'Accelerated Biweekly', value: 'accelerated' }
    ], group: 'Schedule' },
    { name: 'extra_first_payment_date', label: 'First Payment Date', type: 'select', options: [
      { label: 'Immediately', value: 'now' }, { label: 'Next Month', value: 'next' }, { label: 'In 2 Months', value: '2mo' }, { label: 'In 3 Months', value: '3mo' }
    ], group: 'Schedule' },
    { name: 'extra_monthly_recurring', label: 'Monthly Recurring Expenses ($)', min: 0, max: 50000, step: 50, group: 'Budget' },
  ],
  'bmi-calculator': [
    { name: 'extra_waist_cm', label: 'Waist Circumference (cm)', min: 20, max: 200, step: 0.5, group: 'Body Metrics' },
    { name: 'extra_hip_cm', label: 'Hip Circumference (cm)', min: 20, max: 200, step: 0.5, group: 'Body Metrics' },
    { name: 'extra_neck_cm', label: 'Neck Circumference (cm)', min: 10, max: 80, step: 0.5, group: 'Body Metrics' },
    { name: 'extra_activity_level', label: 'Activity Level', type: 'select', options: [
      { label: 'Sedentary', value: '1.2' }, { label: 'Light', value: '1.375' }, { label: 'Moderate', value: '1.55' }, { label: 'Active', value: '1.725' }, { label: 'Athletic', value: '1.9' }
    ], group: 'Lifestyle' },
    { name: 'extra_ethnicity', label: 'Ethnicity (for adjusted risk)', type: 'select', options: [
      { label: 'General', value: 'general' }, { label: 'Asian', value: 'asian' }, { label: 'Pacific Islander', value: 'pacific' }, { label: 'Hispanic', value: 'hispanic' }
    ], group: 'Profile' },
    { name: 'extra_body_fat_pct', label: 'Estimated Body Fat (%)', min: 3, max: 60, step: 0.1, group: 'Body Metrics' },
  ],
  'retirement-calculator': [
    { name: 'extra_social_security', label: 'Social Security ($/mo)', min: 0, max: 10000, step: 50, group: 'Income' },
    { name: 'extra_pension', label: 'Pension Income ($/mo)', min: 0, max: 20000, step: 100, group: 'Income' },
    { name: 'extra_part_time', label: 'Part-Time Work ($/mo)', min: 0, max: 10000, step: 50, group: 'Income' },
    { name: 'extra_healthcare_cost', label: 'Healthcare Cost ($/mo)', min: 0, max: 5000, step: 50, group: 'Expenses' },
    { name: 'extra_inflation_rate', label: 'Custom Inflation Rate (%)', min: 0, max: 15, step: 0.1, group: 'Assumptions' },
    { name: 'extra_return_rate_pre', label: 'Pre-Retirement Return Rate (%)', min: 0, max: 20, step: 0.1, group: 'Assumptions' },
    { name: 'extra_return_rate_post', label: 'Post-Retirement Return Rate (%)', min: 0, max: 12, step: 0.1, group: 'Assumptions' },
    { name: 'extra_salary_increase', label: 'Annual Salary Increase (%)', min: 0, max: 15, step: 0.1, group: 'Assumptions' },
    { name: 'extra_current_savings', label: 'Current Retirement Savings ($)', min: 0, max: 10000000, step: 1000, group: 'Savings' },
    { name: 'extra_employer_match', label: 'Employer 401k Match (%)', min: 0, max: 20, step: 0.5, group: 'Benefits' },
  ],
  'loan-calculator': [
    { name: 'extra_origination_fee', label: 'Origination Fee ($)', min: 0, max: 50000, step: 100, group: 'Fees' },
    { name: 'extra_prepayment', label: 'Extra Monthly Payment ($)', min: 0, max: 100000, step: 50, group: 'Payments' },
    { name: 'extra_tax_insurance', label: 'Tax & Insurance ($/mo)', min: 0, max: 5000, step: 10, group: 'Costs' },
    { name: 'extra_pmi_rate', label: 'PMI Rate (%)', min: 0, max: 3, step: 0.01, group: 'Insurance' },
    { name: 'extra_credit_score', label: 'Credit Score Range', type: 'select', options: [
      { label: 'Excellent (720+)', value: 'excellent' }, { label: 'Good (690-719)', value: 'good' }, { label: 'Fair (630-689)', value: 'fair' }, { label: 'Poor (<630)', value: 'poor' }
    ], group: 'Profile' },
    { name: 'extra_start_date', label: 'Loan Start Date', type: 'select', options: [
      { label: 'Immediately', value: 'now' }, { label: 'Next Month', value: 'next' }, { label: 'In 3 Months', value: '3mo' }
    ], group: 'Schedule' },
    { name: 'extra_loan_type', label: 'Loan Type', type: 'select', options: [
      { label: 'Fixed Rate', value: 'fixed' }, { label: 'Adjustable Rate (ARM)', value: 'arm' }
    ], group: 'Loan Type' },
    { name: 'extra_payment_frequency', label: 'Payment Frequency', type: 'select', options: [
      { label: 'Monthly', value: 'monthly' }, { label: 'Biweekly', value: 'biweekly' }
    ], group: 'Schedule' },
    { name: 'extra_first_payment_date', label: 'First Payment Date', type: 'select', options: [
      { label: 'Immediately', value: 'now' }, { label: 'Next Month', value: 'next' }, { label: 'In 2 Months', value: '2mo' }, { label: 'In 3 Months', value: '3mo' }
    ], group: 'Schedule' },
  ],
  'auto-loan-calculator': [
    { name: 'extra_trade_in', label: 'Trade-In Value ($)', min: 0, max: 200000, step: 500, group: 'Trade-In' },
    { name: 'extra_trade_in_owed', label: 'Amount Owed on Trade-In ($)', min: 0, max: 100000, step: 500, group: 'Trade-In' },
    { name: 'extra_sales_tax', label: 'Sales Tax Rate (%)', min: 0, max: 15, step: 0.1, group: 'Fees & Tax' },
    { name: 'extra_registration_fees', label: 'Registration & Title Fees ($)', min: 0, max: 5000, step: 25, group: 'Fees & Tax' },
    { name: 'extra_doc_fees', label: 'Documentation Fees ($)', min: 0, max: 2000, step: 25, group: 'Fees & Tax' },
    { name: 'extra_rebate', label: 'Manufacturer Rebate ($)', min: 0, max: 20000, step: 100, group: 'Discounts' },
    { name: 'extra_down_payment_pct', label: 'Down Payment (%)', min: 0, max: 100, step: 1, group: 'Payment' },
    { name: 'extra_extra_payment', label: 'Extra Monthly Payment ($)', min: 0, max: 5000, step: 25, group: 'Payoff' },
    { name: 'extra_loan_purpose', label: 'Loan Purpose', type: 'select', options: [
      { label: 'New Purchase', value: 'new' }, { label: 'Used Purchase', value: 'used' }, { label: 'Refinance', value: 'refinance' }
    ], group: 'Details' },
    { name: 'extra_first_payment_date', label: 'First Payment Date', type: 'select', options: [
      { label: 'Immediately', value: 'now' }, { label: 'Next Month', value: 'next' }, { label: 'In 2 Months', value: '2mo' }, { label: 'In 3 Months', value: '3mo' }
    ], group: 'Schedule' },
    { name: 'extra_payment_frequency', label: 'Payment Frequency', type: 'select', options: [
      { label: 'Monthly', value: 'monthly' }, { label: 'Biweekly', value: 'biweekly' }
    ], group: 'Schedule' },
    { name: 'extra_credit_score', label: 'Credit Score Range', type: 'select', options: [
      { label: 'Excellent (720+)', value: 'excellent' }, { label: 'Good (690-719)', value: 'good' }, { label: 'Fair (630-689)', value: 'fair' }, { label: 'Poor (<630)', value: 'poor' }
    ], group: 'Profile' },
  ],
  'investment-calculator': [
    { name: 'extra_inflation_rate', label: 'Inflation Rate (%)', min: 0, max: 15, step: 0.1, group: 'Assumptions' },
    { name: 'extra_dividend_yield', label: 'Dividend Yield (%)', min: 0, max: 10, step: 0.01, group: 'Returns' },
    { name: 'extra_tax_rate', label: 'Capital Gains Tax Rate (%)', min: 0, max: 40, step: 0.1, group: 'Tax' },
    { name: 'extra_fee_ratio', label: 'Expense Ratio (%)', min: 0, max: 5, step: 0.01, group: 'Fees' },
    { name: 'extra_risk_profile', label: 'Risk Profile', type: 'select', options: [
      { label: 'Conservative', value: 'conservative' }, { label: 'Moderate', value: 'moderate' }, { label: 'Aggressive', value: 'aggressive' }
    ], group: 'Strategy' },
    { name: 'extra_rebalance_freq', label: 'Rebalancing Frequency', type: 'select', options: [
      { label: 'None', value: 'none' }, { label: 'Quarterly', value: 'quarterly' }, { label: 'Annually', value: 'annually' }
    ], group: 'Strategy' },
    { name: 'extra_initial_investment', label: 'Initial Lump Sum ($)', min: 0, max: 10000000, step: 1000, group: 'Contributions' },
    { name: 'extra_monthly_contribution', label: 'Monthly Contribution ($)', min: 0, max: 100000, step: 100, group: 'Contributions' },
  ],
  'salary-calculator': [
    { name: 'extra_health_insurance', label: 'Health Insurance ($/mo)', min: 0, max: 5000, step: 10, group: 'Deductions' },
    { name: 'extra_dental_vision', label: 'Dental & Vision ($/mo)', min: 0, max: 500, step: 5, group: 'Deductions' },
    { name: 'extra_retirement_match', label: '401k Match (%)', min: 0, max: 20, step: 0.5, group: 'Benefits' },
    { name: 'extra_hsa', label: 'HSA Contribution ($/mo)', min: 0, max: 5000, step: 10, group: 'Benefits' },
    { name: 'extra_fsa', label: 'FSA Contribution ($/mo)', min: 0, max: 1000, step: 10, group: 'Benefits' },
    { name: 'extra_bonus', label: 'Annual Bonus ($)', min: 0, max: 500000, step: 1000, group: 'Compensation' },
    { name: 'extra_commute_cost', label: 'Monthly Commute Cost ($)', min: 0, max: 5000, step: 10, group: 'Expenses' },
    { name: 'extra_filing_status', label: 'Filing Status', type: 'select', options: [
      { label: 'Single', value: 'single' }, { label: 'Married Joint', value: 'married_joint' }, { label: 'Married Separate', value: 'married_separate' }, { label: 'Head of Household', value: 'head' }
    ], group: 'Tax' },
    { name: 'extra_state', label: 'State', type: 'text', placeholder: 'e.g. California', group: 'Tax' },
    { name: 'extra_pay_frequency', label: 'Pay Frequency', type: 'select', options: [
      { label: 'Weekly (52/yr)', value: 'weekly' }, { label: 'Biweekly (26/yr)', value: 'biweekly' }, { label: 'Semi-Monthly (24/yr)', value: 'semimonthly' }, { label: 'Monthly (12/yr)', value: 'monthly' }
    ], group: 'Pay Schedule' },
    { name: 'extra_hours_per_week', label: 'Hours per Week', min: 1, max: 168, step: 1, group: 'Pay Schedule' },
    { name: 'extra_days_per_week', label: 'Days per Week', min: 1, max: 7, step: 1, group: 'Pay Schedule' },
    { name: 'extra_vacation_days', label: 'Vacation Days per Year', min: 0, max: 60, step: 1, group: 'Time Off' },
    { name: 'extra_holidays_per_year', label: 'Paid Holidays per Year', min: 0, max: 20, step: 1, group: 'Time Off' },
    { name: 'extra_overtime_rate', label: 'Overtime Rate (x base)', min: 1, max: 3, step: 0.5, group: 'Pay Schedule' },
    { name: 'extra_overtime_hours', label: 'Overtime Hours per Week', min: 0, max: 40, step: 1, group: 'Pay Schedule' },
    { name: 'extra_commission', label: 'Annual Commission ($)', min: 0, max: 1000000, step: 1000, group: 'Compensation' },
    { name: 'extra_self_employed', label: 'Self-Employed?', type: 'select', options: [
      { label: 'No (W-2)', value: 'no' }, { label: 'Yes (1099)', value: 'yes' }
    ], group: 'Employment Type' },
  ],
  'calorie-calculator': [
    { name: 'extra_goal_weight', label: 'Goal Weight (lbs)', min: 30, max: 500, step: 1, group: 'Goals' },
    { name: 'extra_target_date', label: 'Target Date (weeks from now)', min: 1, max: 104, step: 1, group: 'Goals' },
    { name: 'extra_meal_frequency', label: 'Meals per Day', min: 1, max: 8, step: 1, group: 'Diet' },
    { name: 'extra_protein_g', label: 'Daily Protein Target (g)', min: 0, max: 500, step: 5, group: 'Macros' },
    { name: 'extra_carbs_pct', label: 'Carbs (% of calories)', min: 0, max: 100, step: 5, group: 'Macros' },
    { name: 'extra_fat_pct', label: 'Fat (% of calories)', min: 0, max: 100, step: 5, group: 'Macros' },
    { name: 'extra_diet_type', label: 'Diet Preference', type: 'select', options: [
      { label: 'Standard', value: 'standard' }, { label: 'Keto', value: 'keto' }, { label: 'Paleo', value: 'paleo' }, { label: 'Mediterranean', value: 'mediterranean' }, { label: 'Low Carb', value: 'low_carb' }
    ], group: 'Diet' },
    { name: 'extra_activity_job', label: 'Job Activity Level', type: 'select', options: [
      { label: 'Desk Job', value: 'sedentary' }, { label: 'Light Walking', value: 'light' }, { label: 'Standing/Moving', value: 'moderate' }, { label: 'Physical Labor', value: 'active' }
    ], group: 'Lifestyle' },
  ],
  'refinance-calculator': [
    { name: 'extra_closing_costs', label: 'Closing Costs ($)', min: 0, max: 50000, step: 100, group: 'Costs' },
    { name: 'extra_origination_points', label: 'Discount Points', min: 0, max: 5, step: 0.125, group: 'Costs' },
    { name: 'extra_current_balance', label: 'Current Loan Balance ($)', min: 0, max: 2000000, step: 1000, group: 'Current Loan' },
    { name: 'extra_current_rate', label: 'Current Interest Rate (%)', min: 0, max: 20, step: 0.01, group: 'Current Loan' },
    { name: 'extra_years_remaining', label: 'Years Remaining on Current Loan', min: 1, max: 40, step: 1, group: 'Current Loan' },
    { name: 'extra_home_value', label: 'Current Home Value ($)', min: 0, max: 5000000, step: 10000, group: 'Property' },
    { name: 'extra_credit_score', label: 'Credit Score Range', type: 'select', options: [
      { label: 'Excellent (720+)', value: 'excellent' }, { label: 'Good (690-719)', value: 'good' }, { label: 'Fair (630-689)', value: 'fair' }, { label: 'Poor (<630)', value: 'poor' }
    ], group: 'Profile' },
    { name: 'extra_cash_out', label: 'Cash-Out Amount ($)', min: 0, max: 500000, step: 1000, group: 'Loan Details' },
  ],
  'compound-interest-calculator': [
    { name: 'extra_initial_investment', label: 'Initial Investment ($)', min: 0, max: 10000000, step: 100, group: 'Contributions' },
    { name: 'extra_monthly_addition', label: 'Monthly Addition ($)', min: 0, max: 100000, step: 50, group: 'Contributions' },
    { name: 'extra_annual_increase', label: 'Annual Contribution Increase (%)', min: 0, max: 20, step: 0.5, group: 'Contributions' },
    { name: 'extra_tax_rate', label: 'Tax Rate (%)', min: 0, max: 40, step: 0.1, group: 'Tax' },
    { name: 'extra_inflation_rate', label: 'Inflation Rate (%)', min: 0, max: 15, step: 0.1, group: 'Assumptions' },
    { name: 'extra_compound_frequency', label: 'Compound Frequency', type: 'select', options: [
      { label: 'Daily', value: '365' }, { label: 'Monthly', value: '12' }, { label: 'Quarterly', value: '4' }, { label: 'Semi-Annually', value: '2' }, { label: 'Annually', value: '1' }
    ], group: 'Interest' },
    { name: 'extra_withdrawal_rate', label: 'Annual Withdrawal in Retirement (%)', min: 0, max: 10, step: 0.1, group: 'Retirement' },
    { name: 'extra_retirement_age', label: 'Retirement Age', min: 40, max: 80, step: 1, group: 'Retirement' },
  ],
  'mortgage-payoff-calculator': [
    { name: 'extra_extra_monthly', label: 'Extra Monthly Payment ($)', min: 0, max: 10000, step: 25, group: 'Extra Payments' },
    { name: 'extra_extra_yearly', label: 'Extra Yearly Payment ($)', min: 0, max: 50000, step: 100, group: 'Extra Payments' },
    { name: 'extra_lump_sum', label: 'One-Time Lump Sum ($)', min: 0, max: 100000, step: 500, group: 'Extra Payments' },
    { name: 'extra_lump_sum_year', label: 'Year of Lump Sum', min: 1, max: 30, step: 1, group: 'Extra Payments' },
    { name: 'extra_biweekly', label: 'Switch to Biweekly Payments', type: 'select', options: [
      { label: 'No', value: 'no' }, { label: 'Yes', value: 'yes' }
    ], group: 'Payment Schedule' },
    { name: 'extra_current_balance', label: 'Current Balance ($)', min: 0, max: 2000000, step: 1000, group: 'Loan Status' },
    { name: 'extra_current_rate', label: 'Current Interest Rate (%)', min: 0, max: 20, step: 0.01, group: 'Loan Status' },
    { name: 'extra_years_left', label: 'Years Remaining', min: 1, max: 40, step: 1, group: 'Loan Status' },
  ],
  'fha-loan-calculator': [
    { name: 'extra_upfront_mip', label: 'Upfront MIP (%)', min: 0, max: 5, step: 0.25, group: 'FHA Specific' },
    { name: 'extra_annual_mip', label: 'Annual MIP Rate (%)', min: 0, max: 2, step: 0.05, group: 'FHA Specific' },
    { name: 'extra_property_tax', label: 'Property Taxes ($/year)', min: 0, max: 50000, step: 100, group: 'Housing Costs' },
    { name: 'extra_home_insurance', label: 'Home Insurance ($/year)', min: 0, max: 10000, step: 100, group: 'Housing Costs' },
    { name: 'extra_hoa', label: 'HOA Fees ($/mo)', min: 0, max: 5000, step: 10, group: 'Housing Costs' },
    { name: 'extra_credit_score', label: 'Credit Score Range', type: 'select', options: [
      { label: 'Excellent (720+)', value: 'excellent' }, { label: 'Good (690-719)', value: 'good' }, { label: 'Fair (630-689)', value: 'fair' }, { label: 'Poor (<580)', value: 'poor' }
    ], group: 'Profile' },
  ],
  'va-mortgage-calculator': [
    { name: 'extra_va_funding_fee', label: 'VA Funding Fee (%)', min: 0, max: 5, step: 0.25, group: 'VA Specific' },
    { name: 'extra_disability_exempt', label: 'Disability Exemption', type: 'select', options: [
      { label: 'No', value: 'no' }, { label: 'Yes (Fee Waived)', value: 'yes' }
    ], group: 'VA Specific' },
    { name: 'extra_property_tax', label: 'Property Taxes ($/year)', min: 0, max: 50000, step: 100, group: 'Housing Costs' },
    { name: 'extra_home_insurance', label: 'Home Insurance ($/year)', min: 0, max: 10000, step: 100, group: 'Housing Costs' },
    { name: 'extra_hoa', label: 'HOA Fees ($/mo)', min: 0, max: 5000, step: 10, group: 'Housing Costs' },
  ],
  'student-loan-calculator': [
    { name: 'extra_extra_payment', label: 'Extra Monthly Payment ($)', min: 0, max: 5000, step: 25, group: 'Payoff' },
    { name: 'extra_income', label: 'Annual Income ($)', min: 0, max: 500000, step: 1000, group: 'Income' },
    { name: 'extra_filing_status', label: 'Filing Status', type: 'select', options: [
      { label: 'Single', value: 'single' }, { label: 'Married', value: 'married' }
    ], group: 'Income' },
    { name: 'extra_state', label: 'State of Residence', type: 'text', placeholder: 'e.g. NY', group: 'Income' },
    { name: 'extra_loan_type', label: 'Loan Type', type: 'select', options: [
      { label: 'Federal', value: 'federal' }, { label: 'Private', value: 'private' }, { label: 'Both', value: 'both' }
    ], group: 'Loan Details' },
    { name: 'extra_repayment_plan', label: 'Repayment Plan', type: 'select', options: [
      { label: 'Standard', value: 'standard' }, { label: 'Graduated', value: 'graduated' }, { label: 'Income-Based (IBR)', value: 'ibr' }, { label: 'PAYE', value: 'paye' }, { label: 'REPAYE', value: 'repaye' }
    ], group: 'Loan Details' },
  ],
  'credit-card-payoff-calculator': [
    { name: 'extra_extra_payment', label: 'Extra Monthly Payment ($)', min: 0, max: 50000, step: 50, group: 'Payments' },
    { name: 'extra_total_debt', label: 'Total Credit Card Debt ($)', min: 0, max: 500000, step: 100, group: 'Debt' },
    { name: 'extra_avg_apr', label: 'Average APR (%)', min: 0, max: 36, step: 0.01, group: 'Debt' },
    { name: 'extra_min_payment_pct', label: 'Minimum Payment (%)', min: 1, max: 5, step: 0.5, group: 'Payments' },
    { name: 'extra_strategy', label: 'Payoff Strategy', type: 'select', options: [
      { label: 'Debt Avalanche (Highest APR)', value: 'avalanche' }, { label: 'Debt Snowball (Smallest Balance)', value: 'snowball' }
    ], group: 'Strategy' },
    { name: 'extra_balance_transfer', label: 'Balance Transfer Fee (%)', min: 0, max: 5, step: 0.5, group: 'Strategy' },
    { name: 'extra_transfer_apr', label: 'Balance Transfer Intro APR (%)', min: 0, max: 5, step: 0.01, group: 'Strategy' },
    { name: 'extra_transfer_period', label: 'Intro APR Period (months)', min: 0, max: 24, step: 1, group: 'Strategy' },
  ],
  'rent-calculator': [
    { name: 'extra_security_deposit', label: 'Security Deposit ($)', min: 0, max: 50000, step: 100, group: 'Upfront Costs' },
    { name: 'extra_application_fee', label: 'Application Fee ($)', min: 0, max: 500, step: 10, group: 'Upfront Costs' },
    { name: 'extra_pet_deposit', label: 'Pet Deposit ($)', min: 0, max: 5000, step: 50, group: 'Upfront Costs' },
    { name: 'extra_utilities', label: 'Monthly Utilities ($)', min: 0, max: 2000, step: 10, group: 'Monthly Costs' },
    { name: 'extra_parking', label: 'Parking Fee ($/mo)', min: 0, max: 1000, step: 10, group: 'Monthly Costs' },
    { name: 'extra_renters_insurance', label: 'Renters Insurance ($/mo)', min: 0, max: 100, step: 5, group: 'Monthly Costs' },
    { name: 'extra_income', label: 'Monthly Income ($)', min: 0, max: 100000, step: 100, group: 'Affordability' },
    { name: 'extra_lease_term', label: 'Lease Term (months)', min: 6, max: 24, step: 1, group: 'Lease' },
  ],
  'rent-vs-buy-calculator': [
    { name: 'extra_closing_costs', label: 'Buying Closing Costs (%)', min: 0, max: 10, step: 0.5, group: 'Buying' },
    { name: 'extra_realtor_fee', label: 'Realtor Fee When Selling (%)', min: 0, max: 10, step: 0.5, group: 'Buying' },
    { name: 'extra_maintenance_pct', label: 'Annual Maintenance (%)', min: 0, max: 5, step: 0.5, group: 'Buying' },
    { name: 'extra_property_tax_rate', label: 'Property Tax Rate (%)', min: 0, max: 3, step: 0.1, group: 'Buying' },
    { name: 'extra_home_insurance', label: 'Home Insurance ($/year)', min: 0, max: 10000, step: 100, group: 'Buying' },
    { name: 'extra_hoa', label: 'HOA Fees ($/mo)', min: 0, max: 5000, step: 10, group: 'Buying' },
    { name: 'extra_rent_increase', label: 'Annual Rent Increase (%)', min: 0, max: 10, step: 0.5, group: 'Renting' },
    { name: 'extra_renters_insurance', label: 'Renters Insurance ($/mo)', min: 0, max: 100, step: 5, group: 'Renting' },
    { name: 'extra_investment_return', label: 'Down Payment Investment Return (%)', min: 0, max: 12, step: 0.5, group: 'Opportunity Cost' },
    { name: 'extra_home_appreciation', label: 'Home Appreciation Rate (%)', min: 0, max: 10, step: 0.5, group: 'Buying' },
  ],
  'house-affordability-calculator': [
    { name: 'extra_monthly_debts', label: 'Other Monthly Debts ($)', min: 0, max: 20000, step: 50, group: 'Debt' },
    { name: 'extra_down_payment_pct', label: 'Down Payment (%)', min: 0, max: 100, step: 1, group: 'Payment' },
    { name: 'extra_annual_property_tax', label: 'Property Tax Rate (%)', min: 0, max: 3, step: 0.1, group: 'Housing Costs' },
    { name: 'extra_home_insurance', label: 'Home Insurance ($/year)', min: 0, max: 10000, step: 100, group: 'Housing Costs' },
    { name: 'extra_hoa', label: 'HOA Fees ($/mo)', min: 0, max: 5000, step: 10, group: 'Housing Costs' },
    { name: 'extra_utilities', label: 'Monthly Utilities ($)', min: 0, max: 2000, step: 10, group: 'Housing Costs' },
    { name: 'extra_credit_score', label: 'Credit Score Range', type: 'select', options: [
      { label: 'Excellent (720+)', value: 'excellent' }, { label: 'Good (690-719)', value: 'good' }, { label: 'Fair (630-689)', value: 'fair' }, { label: 'Poor (<630)', value: 'poor' }
    ], group: 'Profile' },
    { name: 'extra_zip_code', label: 'ZIP Code', type: 'text', placeholder: 'e.g. 90210', group: 'Location' },
    { name: 'extra_loan_term', label: 'Preferred Loan Term', type: 'select', options: [
      { label: '30-Year Fixed', value: '30' }, { label: '20-Year Fixed', value: '20' }, { label: '15-Year Fixed', value: '15' }, { label: '10-Year Fixed', value: '10' }
    ], group: 'Loan' },
    { name: 'extra_monthly_recurring', label: 'Monthly Recurring Expenses ($)', min: 0, max: 50000, step: 50, group: 'Budget' },
    { name: 'extra_dti_target', label: 'Target DTI Ratio (%)', min: 20, max: 50, step: 1, group: 'Loan' },
    { name: 'extra_loan_type', label: 'Loan Type', type: 'select', options: [
      { label: 'Fixed Rate', value: 'fixed' }, { label: 'Adjustable Rate (ARM)', value: 'arm' }
    ], group: 'Loan' },
  ],
  'debt-payoff-calculator': [
    { name: 'extra_extra_payment', label: 'Extra Monthly Payment ($)', min: 0, max: 50000, step: 50, group: 'Payments' },
    { name: 'extra_strategy', label: 'Payoff Strategy', type: 'select', options: [
      { label: 'Debt Avalanche (Highest APR)', value: 'avalanche' }, { label: 'Debt Snowball (Smallest Balance)', value: 'snowball' }
    ], group: 'Strategy' },
    { name: 'extra_monthly_budget', label: 'Monthly Budget for Debts ($)', min: 0, max: 100000, step: 100, group: 'Budget' },
    { name: 'extra_debt_count', label: 'Number of Debts', min: 1, max: 20, step: 1, group: 'Debts' },
  ],
  'personal-loan-calculator': [
    { name: 'extra_origination_fee', label: 'Origination Fee (%)', min: 0, max: 10, step: 0.5, group: 'Fees' },
    { name: 'extra_credit_score', label: 'Credit Score Range', type: 'select', options: [
      { label: 'Excellent (720+)', value: 'excellent' }, { label: 'Good (690-719)', value: 'good' }, { label: 'Fair (630-689)', value: 'fair' }, { label: 'Poor (<630)', value: 'poor' }
    ], group: 'Profile' },
    { name: 'extra_loan_purpose', label: 'Loan Purpose', type: 'select', options: [
      { label: 'Debt Consolidation', value: 'consolidation' }, { label: 'Home Improvement', value: 'home_improvement' }, { label: 'Medical', value: 'medical' }, { label: 'Other', value: 'other' }
    ], group: 'Details' },
    { name: 'extra_extra_payment', label: 'Extra Monthly Payment ($)', min: 0, max: 5000, step: 25, group: 'Payoff' },
  ],
  'mortgage-calculator-amortization': [
    { name: 'extra_property_tax', label: 'Property Taxes ($/year)', min: 0, max: 50000, step: 100, group: 'Costs' },
    { name: 'extra_insurance', label: 'Home Insurance ($/year)', min: 0, max: 10000, step: 100, group: 'Costs' },
    { name: 'extra_pmi', label: 'PMI ($/mo)', min: 0, max: 2000, step: 10, group: 'Costs' },
    { name: 'extra_hoa', label: 'HOA Fees ($/mo)', min: 0, max: 5000, step: 10, group: 'Costs' },
    { name: 'extra_extra_payment', label: 'Extra Monthly Payment ($)', min: 0, max: 50000, step: 50, group: 'Payoff' },
    { name: 'extra_start_date', label: 'Start Date', type: 'select', options: [
      { label: 'January', value: '1' }, { label: 'April', value: '4' }, { label: 'July', value: '7' }, { label: 'October', value: '10' }
    ], group: 'Schedule' },
  ],
  'income-tax-calculator': [
    { name: 'extra_filing_status', label: 'Filing Status', type: 'select', options: [
      { label: 'Single', value: 'single' }, { label: 'Married Joint', value: 'married_joint' }, { label: 'Married Separate', value: 'married_separate' }, { label: 'Head of Household', value: 'head' }
    ], group: 'Filing' },
    { name: 'extra_state', label: 'State', type: 'text', placeholder: 'e.g. California', group: 'Filing' },
    { name: 'extra_standard_deduction', label: 'Use Standard Deduction', type: 'select', options: [
      { label: 'Yes', value: 'yes' }, { label: 'No (Itemize)', value: 'no' }
    ], group: 'Deductions' },
    { name: 'extra_retirement_contrib', label: 'Traditional 401k/IRA ($)', min: 0, max: 500000, step: 100, group: 'Deductions' },
    { name: 'extra_hsa_contrib', label: 'HSA Contribution ($)', min: 0, max: 10000, step: 100, group: 'Deductions' },
    { name: 'extra_dependents', label: 'Number of Dependents', min: 0, max: 10, step: 1, group: 'Credits' },
    { name: 'extra_child_tax_credit', label: 'Child Tax Credit Eligible', type: 'select', options: [
      { label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }
    ], group: 'Credits' },
    { name: 'extra_health_insurance_premium', label: 'Health Insurance Premium ($/mo)', min: 0, max: 5000, step: 10, group: 'Deductions' },
  ],
  'social-security-calculator': [
    { name: 'extra_current_age', label: 'Current Age', min: 22, max: 80, step: 1, group: 'Personal' },
    { name: 'extra_current_income', label: 'Current Annual Income ($)', min: 0, max: 500000, step: 1000, group: 'Personal' },
    { name: 'extra_spouse_income', label: 'Spouse Annual Income ($)', min: 0, max: 500000, step: 1000, group: 'Spouse' },
    { name: 'extra_full_retirement_age', label: 'Full Retirement Age', min: 65, max: 67, step: 1, group: 'Personal' },
    { name: 'extra_life_expectancy', label: 'Life Expectancy', min: 65, max: 100, step: 1, group: 'Personal' },
    { name: 'extra_coLA_rate', label: 'Assumed COLA Rate (%)', min: 0, max: 5, step: 0.1, group: 'Assumptions' },
    { name: 'extra_claim_age', label: 'Planned Claiming Age', min: 62, max: 70, step: 1, group: 'Strategy' },
    { name: 'extra_continue_working', label: 'Continue Working While Claiming', type: 'select', options: [
      { label: 'No', value: 'no' }, { label: 'Yes (under FRA)', value: 'yes_under_fra' }, { label: 'Yes (at/over FRA)', value: 'yes_over_fra' }
    ], group: 'Strategy' },
  ],
  '401k-calculator': [
    { name: 'extra_current_age', label: 'Current Age', min: 18, max: 80, step: 1, group: 'Personal' },
    { name: 'extra_current_balance', label: 'Current 401k Balance ($)', min: 0, max: 5000000, step: 1000, group: 'Savings' },
    { name: 'extra_annual_income', label: 'Annual Income ($)', min: 0, max: 500000, step: 1000, group: 'Income' },
    { name: 'extra_employee_contribution_pct', label: 'Your Contribution (%)', min: 0, max: 100, step: 1, group: 'Contributions' },
    { name: 'extra_employer_match_pct', label: 'Employer Match (%)', min: 0, max: 20, step: 0.5, group: 'Contributions' },
    { name: 'extra_employer_match_limit', label: 'Employer Match Limit (%)', min: 0, max: 10, step: 0.5, group: 'Contributions' },
    { name: 'extra_investment_return', label: 'Expected Annual Return (%)', min: 0, max: 20, step: 0.5, group: 'Growth' },
    { name: 'extra_inflation_rate', label: 'Inflation Rate (%)', min: 0, max: 10, step: 0.1, group: 'Growth' },
    { name: 'extra_retirement_age', label: 'Planned Retirement Age', min: 50, max: 80, step: 1, group: 'Goals' },
    { name: 'extra_retirement_income', label: 'Desired Annual Income in Retirement ($)', min: 0, max: 500000, step: 1000, group: 'Goals' },
  ],
  'amortization-calculator': [
    { name: 'extra_extra_payment', label: 'Extra Monthly Payment ($)', min: 0, max: 100000, step: 50, group: 'Payments' },
    { name: 'extra_one_time_payment', label: 'One-Time Additional Payment ($)', min: 0, max: 500000, step: 1000, group: 'Payments' },
    { name: 'extra_one_time_month', label: 'Month of One-Time Payment', min: 1, max: 360, step: 1, group: 'Payments' },
    { name: 'extra_biweekly', label: 'Biweekly Payment Schedule', type: 'select', options: [
      { label: 'No', value: 'no' }, { label: 'Yes', value: 'yes' }
    ], group: 'Schedule' },
    { name: 'extra_start_date', label: 'Start Date Month', type: 'select', options: [
      { label: 'January', value: '1' }, { label: 'April', value: '4' }, { label: 'July', value: '7' }, { label: 'October', value: '10' }
    ], group: 'Schedule' },
    { name: 'extra_interest_only_period', label: 'Interest-Only Period (years)', min: 0, max: 10, step: 1, group: 'Loan Structure' },
    { name: 'extra_balloon_payment', label: 'Balloon Payment ($)', min: 0, max: 1000000, step: 10000, group: 'Loan Structure' },
    { name: 'extra_balloon_year', label: 'Balloon Payment Year', min: 1, max: 30, step: 1, group: 'Loan Structure' },
  ],
  'debt-consolidation-calculator': [
    { name: 'extra_consolidation_apr', label: 'Consolidation Loan APR (%)', min: 0, max: 36, step: 0.01, group: 'New Loan' },
    { name: 'extra_consolidation_term', label: 'Consolidation Loan Term (months)', min: 12, max: 84, step: 6, group: 'New Loan' },
    { name: 'extra_consolidation_fees', label: 'Consolidation Fees ($)', min: 0, max: 5000, step: 50, group: 'New Loan' },
    { name: 'extra_extra_payment', label: 'Extra Monthly Payment ($)', min: 0, max: 5000, step: 25, group: 'Payments' },
    { name: 'extra_debt_count', label: 'Number of Debts to Consolidate', min: 2, max: 15, step: 1, group: 'Current Debts' },
  ],
  'estate-tax-calculator': [
    { name: 'extra_state', label: 'State', type: 'text', placeholder: 'e.g. New York', group: 'Location' },
    { name: 'extra_filing_status', label: 'Filing Status', type: 'select', options: [
      { label: 'Single', value: 'single' }, { label: 'Married', value: 'married' }
    ], group: 'Filing' },
    { name: 'extra_lifetime_exemption', label: 'Use Federal Lifetime Exemption', type: 'select', options: [
      { label: 'Yes', value: 'yes' }, { label: 'No (Custom)', value: 'no' }
    ], group: 'Exemptions' },
    { name: 'extra_custom_exemption', label: 'Custom Exemption Amount ($)', min: 0, max: 50000000, step: 100000, group: 'Exemptions' },
    { name: 'extra_marital_deduction', label: 'Marital Deduction (%)', min: 0, max: 100, step: 10, group: 'Exemptions' },
    { name: 'extra_gift_tax_used', label: 'Lifetime Gift Tax Used ($)', min: 0, max: 50000000, step: 100000, group: 'Prior Usage' },
  ],
  'home-equity-loan-calculator': [
    { name: 'extra_home_value', label: 'Current Home Value ($)', min: 0, max: 5000000, step: 10000, group: 'Property' },
    { name: 'extra_mortgage_balance', label: 'Existing Mortgage Balance ($)', min: 0, max: 3000000, step: 10000, group: 'Property' },
    { name: 'extra_credit_score', label: 'Credit Score Range', type: 'select', options: [
      { label: 'Excellent (720+)', value: 'excellent' }, { label: 'Good (690-719)', value: 'good' }, { label: 'Fair (630-689)', value: 'fair' }, { label: 'Poor (<630)', value: 'poor' }
    ], group: 'Profile' },
    { name: 'extra_loan_purpose', label: 'Loan Purpose', type: 'select', options: [
      { label: 'Home Improvement', value: 'home_improvement' }, { label: 'Debt Consolidation', value: 'consolidation' }, { label: 'Education', value: 'education' }, { label: 'Other', value: 'other' }
    ], group: 'Details' },
    { name: 'extra_closing_costs', label: 'Closing Costs ($)', min: 0, max: 20000, step: 100, group: 'Fees' },
    { name: 'extra_origination_fee', label: 'Origination Fee (%)', min: 0, max: 5, step: 0.5, group: 'Fees' },
  ],
  'boat-loan-calculator': [
    { name: 'extra_down_payment', label: 'Down Payment ($)', min: 0, max: 500000, step: 1000, group: 'Payment' },
    { name: 'extra_sales_tax', label: 'Sales Tax Rate (%)', min: 0, max: 10, step: 0.1, group: 'Fees' },
    { name: 'extra_registration_fees', label: 'Registration Fees ($)', min: 0, max: 5000, step: 50, group: 'Fees' },
    { name: 'extra_insurance', label: 'Insurance ($/year)', min: 0, max: 10000, step: 100, group: 'Costs' },
    { name: 'extra_docking_fees', label: 'Docking/Storage Fees ($/mo)', min: 0, max: 5000, step: 50, group: 'Costs' },
    { name: 'extra_maintenance', label: 'Annual Maintenance ($)', min: 0, max: 20000, step: 100, group: 'Costs' },
  ],
}

export function getExtraFieldsForCalculator(slug: string, hubSlug: string): ExtraFieldDef[] {
  if (slugOverrides[slug]) return slugOverrides[slug]
  const pool = hubPools[hubSlug]
  if (pool) return pool
  return [
    { name: 'extra_quantity', label: 'Quantity', min: 1, max: 10000, step: 1, group: 'General' },
    { name: 'extra_precision', label: 'Decimal Places', min: 0, max: 10, step: 1, group: 'Precision' },
    { name: 'extra_notes', label: 'Notes', type: 'text', placeholder: 'Optional notes...', group: 'General' },
  ]
}
