'use client'

import { useExtraFields } from '@/lib/context/ExtraFieldsContext'

export interface ExtraFieldComputeValues {
  // Financial
  inflationRate?: number
  taxRate?: number
  feePercent?: number
  compoundFrequency?: number | 'continuous'
  currentAge?: number
  monthlyIncome?: number
  riskTolerance?: string
  contributeTiming?: string
  state?: string
  loanPurpose?: string
  loanType?: string
  paymentFrequency?: string
  firstPaymentDate?: string
  monthlyRecurring?: number
  employerMatchPct?: number
  bonusAnnual?: number
  capitalGainsRate?: number
  retirementAgeGoal?: number
  dependents?: number
  dtiTarget?: number

  // Salary / Work
  overtimeHours?: number
  overtimeRate?: number
  commission?: number
  vacationDays?: number
  holidaysPerYear?: number
  hoursPerWeek?: number
  daysPerWeek?: number
  payFrequency?: string
  selfEmployed?: boolean

  // Health
  activityLevel?: number
  gender?: string
  ageYears?: number
  sleepHours?: number
  stressLevel?: number
  waistCm?: number
  hipCm?: number
  neckCm?: number
  bodyFatPct?: number
  bmrFormula?: string
  goal?: string
  weightChangeRate?: number
  unitsKj?: string
  heightCm?: number
  weightKg?: number
  bloodPressureSys?: number
  bloodPressureDia?: number
  dailySteps?: number

  // Math
  decimalPlaces?: number
  significantFigures?: number
  roundingMode?: string
  notation?: string
  angleUnit?: string
  base?: string
  precisionMode?: string
  outputFormat?: string

  // Conversion
  rateSource?: string
  autoUpdate?: string
  displayFormat?: string

  // Date-Time
  timezone?: string
  weekStart?: string
  fiscalStart?: string
  includeTime?: string
  dateFormat?: string
  timeFormat?: string
  workingDaysOnly?: string
  includeHolidays?: string

  // Construction
  wasteFactor?: number
  laborRate?: number
  materialQuality?: string
  difficulty?: string
  regionFactor?: number
  projectType?: string
  contingency?: number
  permitCost?: number
  unitPreference?: string
  zipCode?: string
  markupPct?: number
  deliveryFee?: number
  cleanupCost?: number
  inspectionFee?: number

  // Education
  scaleType?: string
  rounding?: string
  creditHours?: number
  curveType?: string
  weightedGrades?: string
  extraCredit?: number
  attendanceWeight?: number
  passingGrade?: number

  // Statistics
  confidenceLevel?: string
  significanceLevel?: string
  decimals?: number
  outlierMethod?: string
  varianceMethod?: string
  hypothesisTest?: string
  effectSize?: string
  distribution?: string

  // Physics
  gravity?: number
  airResistance?: number
  temperatureC?: number
  pressureAtm?: number
  velocityMs?: number
  angleDeg?: number
  frictionCoeff?: number

  // Chemistry
  phLevel?: number
  volumeMl?: number
  molarity?: number
  massG?: number
  molarMass?: number
  reactionYield?: number

  // Engineering
  safetyFactor?: number
  tolerance?: number
  material?: string
  standards?: string
  loadType?: string
  exposure?: string
  lifespanYears?: number
  maintenanceFactor?: number
  windLoad?: number
  seismicZone?: string
  soilType?: string
  concretePsi?: number

  // Everyday
  quantity?: number
  qualityTier?: string
  region?: string
  currencyCode?: string
  roundUp?: string
  splitCount?: number
  serviceQuality?: string
  tipCustomPct?: number
  discountPct?: number
  couponAmount?: number
  rewardsPoints?: number
  loyaltyTier?: string

  // Food
  servings?: number
  diet?: string
  cuisine?: string
  cookMethod?: string
  calorieUnit?: string
  allergenFilter?: string
  prepTime?: number
  totalTime?: number
  spiceLevel?: string
  yieldServings?: number
  storageDays?: number
  nutrientFilter?: string

  // Biology
  timeHours?: number
  organismType?: string
  concentration?: number
  species?: string
  growthPhase?: string
  lightIntensity?: number
  humidityPct?: number

  // Ecology
  areaHa?: number
  timeYears?: number
  climateZone?: string
  ecosystem?: string
  disturbance?: string
  precipitationMm?: number
  soilPh?: number
  biodiversityIndex?: string
  carbonSeqRate?: number

  // Sports
  distanceUnit?: string
  terrain?: string
  elevationGain?: number
  temperatureF?: number
  experienceLevel?: string
  heartRateMax?: number
  restingHr?: number
  windSpeed?: number
  altitudeFt?: number
  paceUnit?: string
  vo2max?: number
  lactateThreshold?: number
  trainingZone?: string
}

export function useExtraFieldCompute(): ExtraFieldComputeValues {
  const fields = useExtraFields()

  const n = (key: string) => { const v = parseFloat(fields[key] || ''); return isNaN(v) ? undefined : v }
  const s = (key: string) => fields[key] || undefined
  const bool = (key: string) => fields[key] === 'yes'

  return {
    // Financial
    inflationRate: n('extra_inflation_rate'),
    taxRate: n('extra_tax_rate'),
    feePercent: n('extra_fee_percent'),
    compoundFrequency: (() => {
      const v = fields['extra_compound_frequency']
      if (!v || v === '12') return undefined
      if (v === 'continuous') return 'continuous'
      const nv = parseInt(v)
      return isNaN(nv) ? undefined : nv
    })(),
    currentAge: n('extra_current_age'),
    monthlyIncome: n('extra_monthly_income'),
    riskTolerance: s('extra_risk_tolerance'),
    contributeTiming: s('extra_contribute_timing'),
    state: s('extra_state'),
    loanPurpose: s('extra_loan_purpose'),
    loanType: s('extra_loan_type'),
    paymentFrequency: s('extra_payment_frequency'),
    firstPaymentDate: s('extra_first_payment_date'),
    monthlyRecurring: n('extra_monthly_recurring'),
    employerMatchPct: n('extra_employer_match_pct'),
    bonusAnnual: n('extra_bonus_annual'),
    capitalGainsRate: n('extra_capital_gains_rate'),
    retirementAgeGoal: n('extra_retirement_age_goal'),
    dependents: n('extra_dependents'),
    dtiTarget: n('extra_dti_target'),

    // Salary / Work
    overtimeHours: n('extra_overtime_hours'),
    overtimeRate: n('extra_overtime_rate'),
    commission: n('extra_commission'),
    vacationDays: n('extra_vacation_days'),
    holidaysPerYear: n('extra_holidays_per_year'),
    hoursPerWeek: n('extra_hours_per_week'),
    daysPerWeek: n('extra_days_per_week'),
    payFrequency: s('extra_pay_frequency'),
    selfEmployed: bool('extra_self_employed'),

    // Health
    activityLevel: n('extra_activity_level'),
    gender: s('extra_gender'),
    ageYears: n('extra_age_years'),
    sleepHours: n('extra_sleep_hours'),
    stressLevel: n('extra_stress_level'),
    waistCm: n('extra_waist_cm'),
    hipCm: n('extra_hip_cm'),
    neckCm: n('extra_neck_cm'),
    bodyFatPct: n('extra_body_fat_pct'),
    bmrFormula: s('extra_bmr_formula'),
    goal: s('extra_goal'),
    weightChangeRate: n('extra_weight_change_rate'),
    unitsKj: s('extra_units_kj'),
    heightCm: n('extra_height_cm'),
    weightKg: n('extra_weight_kg'),
    bloodPressureSys: n('extra_blood_pressure_sys'),
    bloodPressureDia: n('extra_blood_pressure_dia'),
    dailySteps: n('extra_daily_steps'),

    // Math
    decimalPlaces: n('extra_decimal_places'),
    significantFigures: n('extra_significant_figures'),
    roundingMode: s('extra_rounding_mode'),
    notation: s('extra_notation'),
    angleUnit: s('extra_angle_unit'),
    base: s('extra_base'),
    precisionMode: s('extra_precision_mode'),
    outputFormat: s('extra_output_format'),

    // Conversion
    rateSource: s('extra_rate_source'),
    autoUpdate: s('extra_auto_update'),
    displayFormat: s('extra_display_format'),

    // Date-Time
    timezone: s('extra_timezone'),
    weekStart: s('extra_week_start'),
    fiscalStart: s('extra_fiscal_start'),
    includeTime: s('extra_include_time'),
    dateFormat: s('extra_date_format'),
    timeFormat: s('extra_time_format'),
    workingDaysOnly: s('extra_working_days_only'),
    includeHolidays: s('extra_include_holidays'),

    // Construction
    wasteFactor: n('extra_waste_factor'),
    laborRate: n('extra_labor_rate'),
    materialQuality: s('extra_material_quality'),
    difficulty: s('extra_difficulty'),
    regionFactor: n('extra_region_factor'),
    projectType: s('extra_project_type'),
    contingency: n('extra_contingency'),
    permitCost: n('extra_permit_cost'),
    unitPreference: s('extra_unit_preference'),
    zipCode: s('extra_zip_code'),
    markupPct: n('extra_markup_pct'),
    deliveryFee: n('extra_delivery_fee'),
    cleanupCost: n('extra_cleanup_cost'),
    inspectionFee: n('extra_inspection_fee'),

    // Education
    scaleType: s('extra_scale_type'),
    rounding: s('extra_rounding'),
    creditHours: n('extra_credit_hours'),
    curveType: s('extra_curve_type'),
    weightedGrades: s('extra_weighted_grades'),
    extraCredit: n('extra_extra_credit'),
    attendanceWeight: n('extra_attendance_weight'),
    passingGrade: n('extra_passing_grade'),

    // Statistics
    confidenceLevel: s('extra_confidence_level'),
    significanceLevel: s('extra_significance_level'),
    decimals: n('extra_decimals'),
    outlierMethod: s('extra_outlier_method'),
    varianceMethod: s('extra_variance_method'),
    hypothesisTest: s('extra_hypothesis_test'),
    effectSize: s('extra_effect_size'),
    distribution: s('extra_distribution'),

    // Physics
    gravity: n('extra_gravity'),
    airResistance: n('extra_air_resistance'),
    temperatureC: n('extra_temperature_c'),
    pressureAtm: n('extra_pressure_atm'),
    velocityMs: n('extra_velocity_ms'),
    angleDeg: n('extra_angle_deg'),
    frictionCoeff: n('extra_friction_coeff'),

    // Chemistry
    phLevel: n('extra_ph_level'),
    volumeMl: n('extra_volume_ml'),
    molarity: n('extra_molarity'),
    massG: n('extra_mass_g'),
    molarMass: n('extra_molar_mass'),
    reactionYield: n('extra_reaction_yield'),

    // Engineering
    safetyFactor: n('extra_safety_factor'),
    tolerance: n('extra_tolerance'),
    material: s('extra_material'),
    standards: s('extra_standards'),
    loadType: s('extra_load_type'),
    exposure: s('extra_exposure'),
    lifespanYears: n('extra_lifespan_years'),
    maintenanceFactor: n('extra_maintenance_factor'),
    windLoad: n('extra_wind_load'),
    seismicZone: s('extra_seismic_zone'),
    soilType: s('extra_soil_type'),
    concretePsi: n('extra_concrete_psi'),

    // Everyday
    quantity: n('extra_quantity'),
    qualityTier: s('extra_quality_tier'),
    region: s('extra_region'),
    currencyCode: s('extra_currency_code'),
    roundUp: s('extra_round_up'),
    splitCount: n('extra_split_count'),
    serviceQuality: s('extra_service_quality'),
    tipCustomPct: n('extra_tip_custom_pct'),
    discountPct: n('extra_discount_pct'),
    couponAmount: n('extra_coupon_amount'),
    rewardsPoints: n('extra_rewards_points'),
    loyaltyTier: s('extra_loyalty_tier'),

    // Food
    servings: n('extra_servings'),
    diet: s('extra_diet'),
    cuisine: s('extra_cuisine'),
    cookMethod: s('extra_cook_method'),
    calorieUnit: s('extra_calorie_unit'),
    allergenFilter: s('extra_allergen_filter'),
    prepTime: n('extra_prep_time'),
    totalTime: n('extra_total_time'),
    spiceLevel: s('extra_spice_level'),
    yieldServings: n('extra_yield_servings'),
    storageDays: n('extra_storage_days'),
    nutrientFilter: s('extra_nutrient_filter'),

    // Biology
    timeHours: n('extra_time_hours'),
    organismType: s('extra_organism_type'),
    concentration: n('extra_concentration'),
    species: s('extra_species'),
    growthPhase: s('extra_growth_phase'),
    lightIntensity: n('extra_light_intensity'),
    humidityPct: n('extra_humidity_pct'),

    // Ecology
    areaHa: n('extra_area_ha'),
    timeYears: n('extra_time_years'),
    climateZone: s('extra_climate_zone'),
    ecosystem: s('extra_ecosystem'),
    disturbance: s('extra_disturbance'),
    precipitationMm: n('extra_precipitation_mm'),
    soilPh: n('extra_soil_ph'),
    biodiversityIndex: s('extra_biodiversity_index'),
    carbonSeqRate: n('extra_carbon_seq_rate'),

    // Sports
    distanceUnit: s('extra_distance_unit'),
    terrain: s('extra_terrain'),
    elevationGain: n('extra_elevation_gain'),
    temperatureF: n('extra_temperature_f'),
    experienceLevel: s('extra_experience_level'),
    heartRateMax: n('extra_heart_rate_max'),
    restingHr: n('extra_resting_hr'),
    windSpeed: n('extra_wind_speed'),
    altitudeFt: n('extra_altitude_ft'),
    paceUnit: s('extra_pace_unit'),
    vo2max: n('extra_vo2max'),
    lactateThreshold: n('extra_lactate_threshold'),
    trainingZone: s('extra_training_zone'),
  }
}
