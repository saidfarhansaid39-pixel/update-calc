export interface ExtraFieldAdjustment {
  label: string
  originalLabel?: string
  originalValue?: string
  adjustedLabel: string
  adjustedValue: string
  impact?: 'positive' | 'negative' | 'neutral'
  explanation?: string
}

export function computeAdjustments(
  hubSlug: string,
  mainValue: number | undefined,
  extraFields: Record<string, string>,
): ExtraFieldAdjustment[] {
  if (mainValue === undefined || mainValue === null) return []
  const adjustments: ExtraFieldAdjustment[] = []

  const n = (v: string | undefined) => { const p = parseFloat(v || ''); return isNaN(p) ? undefined : p }

  switch (hubSlug) {
    case 'financial-calculators': {
      const inflationRate = n(extraFields.extra_inflation_rate)
      if (inflationRate !== undefined) {
        const realReturn = mainValue * (1 - inflationRate / 100)
        adjustments.push({
          label: 'Inflation-Adjusted',
          originalLabel: 'Nominal Value',
          originalValue: formatMoney(mainValue),
          adjustedLabel: 'Real Value (after inflation)',
          adjustedValue: formatMoney(realReturn),
          impact: realReturn < mainValue ? 'negative' : 'positive',
          explanation: `Adjusted for ${inflationRate}% annual inflation. Your purchasing power is reduced by inflation over time.`,
        })
      }

      const taxRate = n(extraFields.extra_tax_rate)
      if (taxRate !== undefined) {
        const afterTax = mainValue * (1 - taxRate / 100)
        adjustments.push({
          label: 'After-Tax',
          originalLabel: 'Pre-Tax',
          originalValue: formatMoney(mainValue),
          adjustedLabel: `After ${taxRate}% Tax`,
          adjustedValue: formatMoney(afterTax),
          impact: 'negative',
          explanation: `After applying ${taxRate}% effective tax rate.`,
        })
      }

      const feePercent = n(extraFields.extra_fee_percent)
      if (feePercent !== undefined) {
        const afterFees = mainValue * (1 - feePercent / 100)
        adjustments.push({
          label: 'After Fees',
          originalLabel: 'Gross Return',
          originalValue: formatMoney(mainValue),
          adjustedLabel: `After ${feePercent}% Fees`,
          adjustedValue: formatMoney(afterFees),
          impact: 'negative',
          explanation: `After deducting ${feePercent}% in annual fees. Fees compound and significantly reduce long-term returns.`,
        })
      }

      const compoundFreq = extraFields.extra_compound_frequency
      if (compoundFreq && compoundFreq !== '12') {
        const label: Record<string, string> = { '1': 'Annually', '2': 'Semi-Annually', '4': 'Quarterly', '24': 'Semi-Monthly', '26': 'Biweekly', '52': 'Weekly', '365': 'Daily', 'continuous': 'Continuously' }
        adjustments.push({
          label: 'Compound Frequency',
          adjustedLabel: `${label[compoundFreq] || compoundFreq} Compounding`,
          adjustedValue: `n=${compoundFreq === 'continuous' ? '∞' : compoundFreq}`,
          impact: 'neutral',
          explanation: `Changing compound frequency from monthly (n=12) to ${(label[compoundFreq] || compoundFreq).toLowerCase()} (n=${compoundFreq}) affects total interest earned.`,
        })
      }

      if (mainValue > 0 && mainValue < 1_000_000_000) {
        const salaryAdjustments: ExtraFieldAdjustment[] = []

        const payFreq = extraFields.extra_pay_frequency
        if (payFreq) {
          const periods: Record<string, number> = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 }
          const nPeriods = periods[payFreq]
          if (nPeriods) {
            const perPeriod = mainValue / nPeriods
            salaryAdjustments.push({
              label: 'Pay Frequency',
              originalLabel: `Annual (${payFreq})`,
              originalValue: formatMoney(mainValue),
              adjustedLabel: `Per Pay Period`,
              adjustedValue: formatMoney(perPeriod),
              impact: 'neutral',
              explanation: `At ${payFreq} pay frequency (${nPeriods} periods/yr), each paycheck is ${formatMoney(perPeriod)}.`,
            })

            const hoursPerWeek = n(extraFields.extra_hours_per_week)
            const daysPerWeek = n(extraFields.extra_days_per_week)
            if (hoursPerWeek && daysPerWeek) {
              const workingWeeks = 52
              const totalHours = workingWeeks * hoursPerWeek
              const hourlyRate = mainValue / totalHours
              salaryAdjustments.push({
                label: 'Hourly Equivalent',
                originalLabel: `Annual (${hoursPerWeek}h/wk, ${daysPerWeek}d/wk)`,
                originalValue: formatMoney(mainValue),
                adjustedLabel: 'Hourly Rate',
                adjustedValue: formatMoney(hourlyRate),
                impact: 'neutral',
                explanation: `Based on ${hoursPerWeek} hours/week, ${daysPerWeek} days/week. Hourly rate = ${formatMoney(hourlyRate)}.`,
              })

              const vacationDays = n(extraFields.extra_vacation_days)
              const holidays = n(extraFields.extra_holidays_per_year)
              const totalDaysOff = (vacationDays || 0) + (holidays || 0)
              if (totalDaysOff > 0) {
                const paidDaysPerYear = daysPerWeek * workingWeeks - totalDaysOff
                if (paidDaysPerYear > 0) {
                  const actualDailyRate = mainValue / paidDaysPerYear
                  salaryAdjustments.push({
                    label: 'Paid Days Adjustment',
                    originalLabel: `${daysPerWeek * workingWeeks} paid days (no PTO)`,
                    originalValue: formatMoney(mainValue / (daysPerWeek * workingWeeks)),
                    adjustedLabel: `${paidDaysPerYear} paid days (w/ PTO)`,
                    adjustedValue: formatMoney(actualDailyRate),
                    impact: totalDaysOff > 0 ? 'negative' : 'neutral',
                    explanation: `With ${vacationDays || 0} vacation days and ${holidays || 0} holidays off, your effective daily rate increases to ${formatMoney(actualDailyRate)}.`,
                  })
                }
              }
            }

            const overtimeRate = n(extraFields.extra_overtime_rate)
            const overtimeHours = n(extraFields.extra_overtime_hours)
            if (overtimeRate && overtimeHours && overtimeHours > 0) {
              const hoursPerWeek = n(extraFields.extra_hours_per_week) || 40
              const regularWeeks = 52
              const baseHourly = mainValue / (regularWeeks * hoursPerWeek)
              const overtimePay = baseHourly * overtimeRate * overtimeHours * regularWeeks
              const totalWithOT = mainValue + overtimePay
              salaryAdjustments.push({
                label: 'With Overtime',
                originalLabel: `Base Annual`,
                originalValue: formatMoney(mainValue),
                adjustedLabel: `With ${overtimeHours}h/wk OT (${overtimeRate}x)`,
                adjustedValue: formatMoney(totalWithOT),
                impact: 'positive',
                explanation: `Adding ${overtimeHours} hours/week overtime at ${overtimeRate}x rate adds ${formatMoney(overtimePay)}/year.`,
              })
            }

            const commission = n(extraFields.extra_commission)
            if (commission && commission > 0) {
              const totalWithCommission = mainValue + commission
              salaryAdjustments.push({
                label: 'With Commission',
                originalLabel: 'Base Salary',
                originalValue: formatMoney(mainValue),
                adjustedLabel: 'Salary + Commission',
                adjustedValue: formatMoney(totalWithCommission),
                impact: 'positive',
                explanation: `Including ${formatMoney(commission)} annual commission brings total to ${formatMoney(totalWithCommission)}.`,
              })
            }

            const selfEmployed = extraFields.extra_self_employed
            if (selfEmployed === 'yes') {
              const seTax = mainValue * 0.153 * 0.5
              const afterSE = mainValue - seTax
              salaryAdjustments.push({
                label: 'Self-Employed Tax',
                originalLabel: 'Gross Income (1099)',
                originalValue: formatMoney(mainValue),
                adjustedLabel: `After SE Tax (7.65%)`,
                adjustedValue: formatMoney(afterSE),
                impact: 'negative',
                explanation: 'Self-employed individuals pay both employer and employee portions of Social Security/Medicare (15.3% total, 7.65% deductible).',
              })
            }
          }
        }

        adjustments.push(...salaryAdjustments)
      }
      break
    }

    case 'health-calculators': {
      const activityStr = extraFields.extra_activity_level
      if (activityStr) {
        const activityMultiplier = parseFloat(activityStr) || 1.2
        const adjusted = mainValue * activityMultiplier
        const activityLabel = activityStr === '1.2' ? 'Sedentary' : activityStr === '1.375' ? 'Light' : activityStr === '1.55' ? 'Moderate' : activityStr === '1.725' ? 'Active' : activityStr === '1.9' ? 'Very Active' : `Level ${activityStr}`
        adjustments.push({
          label: 'Activity-Adjusted',
          originalLabel: 'Base Value',
          originalValue: mainValue.toFixed(1),
          adjustedLabel: `With ${activityLabel} Activity`,
          adjustedValue: adjusted.toFixed(1),
          impact: adjusted > mainValue ? 'positive' : 'negative',
          explanation: `Adjusted for ${activityLabel.toLowerCase()} activity level. More active individuals have higher energy needs.`,
        })
      }

      const waistCm = n(extraFields.extra_waist_cm)
      if (waistCm !== undefined && mainValue > 0 && mainValue < 100) {
        const waistHeightRatio = waistCm / 170
        adjustments.push({
          label: 'Waist-to-Height',
          originalLabel: 'BMI',
          originalValue: mainValue.toFixed(1),
          adjustedLabel: 'Waist-to-Height Ratio',
          adjustedValue: waistHeightRatio.toFixed(2),
          impact: waistHeightRatio > 0.5 ? 'negative' : 'positive',
          explanation: 'Waist-to-height ratio above 0.5 indicates increased health risk.',
        })
      }

      const gender = extraFields.extra_gender
      if (gender) {
        const bmrDiff = gender === 'male' ? 5 : -161
        adjustments.push({
          label: 'Gender-Adjusted BMR',
          adjustedLabel: `${gender === 'male' ? 'Male' : 'Female'} BMR Factor`,
          adjustedValue: `${bmrDiff > 0 ? '+' : ''}${bmrDiff}`,
          impact: 'neutral',
          explanation: `${gender === 'male' ? 'Men have higher BMR due to greater muscle mass.' : 'Women have a BMR adjustment of -161 vs men +5 in the Mifflin-St Jeor equation.'}`,
        })
      }

      const bodyFat = n(extraFields.extra_body_fat_pct)
      if (bodyFat !== undefined) {
        const leanMass = 100 - bodyFat
        adjustments.push({
          label: 'Lean Body Mass',
          originalLabel: 'Body Fat',
          originalValue: `${bodyFat.toFixed(1)}%`,
          adjustedLabel: 'Lean Mass',
          adjustedValue: `${leanMass.toFixed(1)}%`,
          impact: bodyFat > 25 ? 'negative' : 'positive',
          explanation: `Higher lean mass increases BMR. At ${bodyFat.toFixed(0)}% body fat, Katch-McArdle may be more accurate.`,
        })
      }
      break
    }

    case 'construction-calculators': {
      const wasteFactor = n(extraFields.extra_waste_factor)
      if (wasteFactor !== undefined) {
        const withWaste = mainValue * (1 + wasteFactor / 100)
        adjustments.push({
          label: 'With Waste',
          originalLabel: 'Base Quantity',
          originalValue: formatNumber(mainValue),
          adjustedLabel: `With ${wasteFactor}% Waste`,
          adjustedValue: formatNumber(withWaste),
          impact: 'neutral',
          explanation: `Adding ${wasteFactor}% waste factor to account for cuts, breakage, and errors.`,
        })
      }

      const regionFactor = n(extraFields.extra_region_factor)
      if (regionFactor !== undefined && regionFactor !== 1) {
        const adjusted = mainValue * regionFactor
        adjustments.push({
          label: 'Regional Adjustment',
          originalLabel: 'Base Cost',
          originalValue: formatMoney(mainValue),
          adjustedLabel: `Regional Factor ${regionFactor.toFixed(1)}x`,
          adjustedValue: formatMoney(adjusted),
          impact: regionFactor > 1 ? 'negative' : 'positive',
          explanation: `Adjusted by ${regionFactor.toFixed(1)}x regional cost multiplier for your area.`,
        })
      }

      const contingency = n(extraFields.extra_contingency)
      if (contingency !== undefined && contingency > 0) {
        const total = mainValue * (1 + contingency / 100)
        adjustments.push({
          label: 'With Contingency',
          originalLabel: 'Base Budget',
          originalValue: formatMoney(mainValue),
          adjustedLabel: `With ${contingency}% Contingency`,
          adjustedValue: formatMoney(total),
          impact: 'neutral',
          explanation: `Adding ${contingency}% contingency budget for unexpected costs — standard practice is 10-20%.`,
        })
      }

      const permitCost = n(extraFields.extra_permit_cost)
      if (permitCost !== undefined && permitCost > 0) {
        const total = mainValue + permitCost
        adjustments.push({
          label: 'With Permit Fees',
          originalLabel: 'Labor/Materials',
          originalValue: formatMoney(mainValue),
          adjustedLabel: 'With Permit Fees',
          adjustedValue: formatMoney(total),
          impact: 'neutral',
          explanation: `Adding $${permitCost.toLocaleString()} in permit and inspection fees.`,
        })
      }
      break
    }

    case 'statistics-calculators': {
      const confidenceLevel = extraFields.extra_confidence_level
      if (confidenceLevel) {
        const zScore = confidenceLevel === '99' ? 2.576 : confidenceLevel === '95' ? 1.96 : 1.645
        const marginOfError = zScore * (mainValue * 0.1)
        adjustments.push({
          label: 'Confidence Interval',
          adjustedLabel: `${confidenceLevel}% Confidence (±)`,
          adjustedValue: `±${formatNumber(marginOfError)}`,
          impact: 'neutral',
          explanation: `At ${confidenceLevel}% confidence level, the margin of error is ±${formatNumber(marginOfError)}.`,
        })
      }
      break
    }

    case 'physics-calculators':
    case 'chemistry-calculators': {
      const sigFigs = n(extraFields.extra_significant_figures)
      if (sigFigs !== undefined) {
        adjustments.push({
          label: 'Precision',
          adjustedLabel: `${sigFigs} Significant Figures`,
          adjustedValue: mainValue.toPrecision(sigFigs),
          impact: 'neutral',
          explanation: `Value displayed with ${sigFigs} significant figures of precision.`,
        })
      }
      break
    }

    case 'engineering-calculators': {
      const safetyFactor = n(extraFields.extra_safety_factor)
      if (safetyFactor !== undefined && safetyFactor > 0) {
        const allowableStress = mainValue / safetyFactor
        adjustments.push({
          label: 'Safety Factor',
          originalLabel: 'Ultimate Value',
          originalValue: formatNumber(mainValue),
          adjustedLabel: `Allowable (SF=${safetyFactor.toFixed(1)})`,
          adjustedValue: formatNumber(allowableStress),
          impact: 'neutral',
          explanation: `Applying safety factor of ${safetyFactor.toFixed(1)}x to determine allowable design value.`,
        })
      }
      break
    }

    case 'food-calculators': {
      const servings = n(extraFields.extra_servings)
      if (servings !== undefined && servings > 0) {
        const perServing = mainValue / servings
        adjustments.push({
          label: 'Per Serving',
          originalLabel: `Total (${servings} servings)`,
          originalValue: formatNumber(mainValue),
          adjustedLabel: 'Per Serving',
          adjustedValue: formatNumber(perServing),
          impact: 'neutral',
          explanation: `Divided across ${servings} servings.`,
        })
      }
      break
    }

    case 'ecology-calculators': {
      const areaHa = n(extraFields.extra_area_ha)
      if (areaHa !== undefined && areaHa > 0) {
        const perHa = mainValue / areaHa
        adjustments.push({
          label: 'Per Hectare',
          originalLabel: `Total (${areaHa.toFixed(0)} ha)`,
          originalValue: formatNumber(mainValue),
          adjustedLabel: 'Per Hectare',
          adjustedValue: formatNumber(perHa),
          impact: 'neutral',
        })
      }
      break
    }

    case 'everyday-calculators': {
      const splitCount = n(extraFields.extra_split_count)
      if (splitCount !== undefined && splitCount > 1) {
        const perPerson = mainValue / splitCount
        adjustments.push({
          label: 'Split By',
          originalLabel: `Total (${splitCount} people)`,
          originalValue: formatMoney(mainValue),
          adjustedLabel: 'Per Person',
          adjustedValue: formatMoney(perPerson),
          impact: 'neutral',
          explanation: `Bill split ${splitCount} ways: ${formatMoney(perPerson)} each.`,
        })
      }

      const taxRate = n(extraFields.extra_tax_rate)
      if (taxRate !== undefined && taxRate > 0) {
        const withTax = mainValue * (1 + taxRate / 100)
        adjustments.push({
          label: 'With Sales Tax',
          originalLabel: 'Subtotal',
          originalValue: formatMoney(mainValue),
          adjustedLabel: `With ${taxRate}% Tax`,
          adjustedValue: formatMoney(withTax),
          impact: 'negative',
          explanation: `Adding ${taxRate}% sales tax. Total is ${formatMoney(withTax)}.`,
        })
      }

      const serviceQuality = extraFields.extra_service_quality
      if (serviceQuality && serviceQuality !== 'custom') {
        const tipPct = n(serviceQuality)
        if (tipPct !== undefined) {
          const tip = mainValue * tipPct
          adjustments.push({
            label: 'Suggested Tip',
            originalLabel: 'Bill Amount',
            originalValue: formatMoney(mainValue),
            adjustedLabel: `Tip (${(tipPct * 100).toFixed(0)}%)`,
            adjustedValue: formatMoney(tip),
            impact: 'neutral',
            explanation: `${(tipPct * 100).toFixed(0)}% tip on ${formatMoney(mainValue)} = ${formatMoney(tip)}.`,
          })
        }
      }
      break
    }

    case 'sports-calculators': {
      const distanceUnit = extraFields.extra_distance_unit
      if (distanceUnit && distanceUnit !== 'miles') {
        const conversion = distanceUnit === 'km' ? 1.609 : distanceUnit === 'meters' ? 1609 : 1
        const converted = mainValue * conversion
        adjustments.push({
          label: 'Distance Conversion',
          originalLabel: 'In Miles',
          originalValue: formatNumber(mainValue),
          adjustedLabel: `In ${distanceUnit.toUpperCase()}`,
          adjustedValue: formatNumber(converted),
          impact: 'neutral',
          explanation: `Converted to ${distanceUnit.toUpperCase()}.`,
        })
      }

      const age = n(extraFields.extra_age_years)
      if (age !== undefined) {
        const maxHR = 220 - age
        const zone = maxHR * 0.7
        adjustments.push({
          label: 'Heart Rate Zones',
          originalLabel: 'Age',
          originalValue: `${age} yrs`,
          adjustedLabel: 'Max HR (220-age)',
          adjustedValue: `${maxHR} bpm`,
          impact: 'neutral',
          explanation: `At age ${age}, estimated max heart rate is ${maxHR} bpm. Zone 2 (70%) ≈ ${zone.toFixed(0)} bpm.`,
        })
      }

      const altitude = n(extraFields.extra_altitude_ft)
      if (altitude !== undefined && altitude > 3000) {
        const perfLoss = Math.min(30, (altitude - 3000) * 0.003)
        const adjusted = mainValue * (1 - perfLoss / 100)
        adjustments.push({
          label: 'Altitude Effect',
          originalLabel: `Sea Level Pace`,
          originalValue: formatPace(mainValue),
          adjustedLabel: `At ${altitude.toFixed(0)}ft`,
          adjustedValue: formatPace(adjusted),
          impact: 'negative',
          explanation: `Above 3,000ft, performance decreases ~${perfLoss.toFixed(1)}% at ${altitude.toFixed(0)}ft due to lower oxygen.`,
        })
      }
      break
    }

    case 'math-calculators': {
      const adjustments: ExtraFieldAdjustment[] = []
      const val = typeof mainValue === 'number' ? mainValue : parseFloat(mainValue)
      if (isNaN(val)) return adjustments

      // Rounding mode adjustment
      const roundingMode = extraFields['extra_rounding_mode']
      if (roundingMode && roundingMode !== 'standard') {
        let rounded = val
        if (roundingMode === 'floor') rounded = Math.floor(val)
        else if (roundingMode === 'ceil') rounded = Math.ceil(val)
        else if (roundingMode === 'truncate') rounded = val > 0 ? Math.floor(val) : Math.ceil(val)

        const decimalPlaces = parseInt(extraFields['extra_decimal_places']) || 2
        adjustments.push({
          label: 'Rounded Result',
          originalLabel: 'Original',
          originalValue: val.toFixed(decimalPlaces),
          adjustedLabel: `${roundingMode.charAt(0).toUpperCase() + roundingMode.slice(1)}`,
          adjustedValue: rounded.toFixed(decimalPlaces),
          impact: val !== rounded ? 'neutral' : 'neutral',
          explanation: `Applied ${roundingMode} rounding mode with ${decimalPlaces} decimal places.`,
        })
      }

      // Significant figures adjustment
      const sigFigs = extraFields['extra_significant_figures']
      if (sigFigs && parseInt(sigFigs) > 0) {
        const sf = parseInt(sigFigs)
        const adjusted = parseFloat(val.toPrecision(sf))
        adjustments.push({
          label: 'Significant Figures',
          originalLabel: 'Full Precision',
          originalValue: val.toString(),
          adjustedLabel: `${sf} Significant Figures`,
          adjustedValue: adjusted.toString(),
          impact: 'neutral',
          explanation: `Rounded to ${sf} significant figures.`,
        })
      }

      return adjustments
    }

    case 'conversion-calculators': {
      const adjustments: ExtraFieldAdjustment[] = []
      const val = typeof mainValue === 'number' ? mainValue : parseFloat(mainValue)
      if (isNaN(val)) return adjustments

      // Precision adjustment
      const decimalPlaces = extraFields['extra_decimal_places']
      if (decimalPlaces && parseInt(decimalPlaces) >= 0) {
        const dp = parseInt(decimalPlaces)
        adjustments.push({
          label: 'Precision Setting',
          originalLabel: 'Full Precision',
          originalValue: val.toString(),
          adjustedLabel: `${dp} Decimal Places`,
          adjustedValue: val.toFixed(dp),
          impact: 'neutral',
          explanation: `Result displayed with ${dp} decimal place${dp !== 1 ? 's' : ''}.`,
        })
      }

      // Notation display
      const notation = extraFields['extra_notation']
      if (notation && notation !== 'decimal') {
        let display = ''
        if (notation === 'scientific') display = val.toExponential(4)
        else if (notation === 'engineering') {
          const exp = Math.floor(Math.log10(Math.abs(val)) / 3) * 3
          const coeff = val / Math.pow(10, exp)
          display = `${coeff.toFixed(3)}e${exp}`
        }
        adjustments.push({
          label: 'Number Notation',
          originalLabel: 'Decimal',
          originalValue: val.toString(),
          adjustedLabel: notation.charAt(0).toUpperCase() + notation.slice(1),
          adjustedValue: display,
          impact: 'neutral',
          explanation: `Converted to ${notation} notation for readability.`,
        })
      }

      return adjustments
    }

    case 'date-time-calculators': {
      const adjustments: ExtraFieldAdjustment[] = []
      const val = typeof mainValue === 'number' ? mainValue : parseFloat(mainValue)
      if (isNaN(val)) return adjustments

      // Timezone indicator
      const tz = extraFields['extra_timezone']
      if (tz) {
        adjustments.push({
          label: 'Timezone',
          originalLabel: 'Default Timezone',
          originalValue: 'UTC',
          adjustedLabel: 'Selected Timezone',
          adjustedValue: tz,
          impact: 'neutral',
          explanation: `Results calculated for ${tz} timezone.`,
        })
      }

      // Working days indicator
      const workingDays = extraFields['extra_working_days_only']
      if (workingDays === 'yes') {
        adjustments.push({
          label: 'Working Days Only',
          originalLabel: 'Calendar Days',
          originalValue: `${val} days`,
          adjustedLabel: 'Working Days',
          adjustedValue: `${Math.round(val * 5 / 7)} days`,
          impact: 'neutral',
          explanation: 'Excluded weekends from the total. Approximately 5/7 of calendar days.',
        })
      }

      // Include holidays
      const holidays = extraFields['extra_include_holidays']
      if (holidays === 'yes' && val > 0) {
        const holidaysCount = Math.round(val / 30 * 0.5) // Estimate ~1 holiday per 2 months
        adjustments.push({
          label: 'Public Holidays',
          originalLabel: 'Total Days',
          originalValue: `${val} days`,
          adjustedLabel: 'Excluding Holidays',
          adjustedValue: `${Math.max(0, Math.round(val - holidaysCount))} days`,
          impact: val > holidaysCount ? 'negative' : 'neutral',
          explanation: `Subtracted approximately ${holidaysCount} public holiday${holidaysCount !== 1 ? 's' : ''}.`,
        })
      }

      return adjustments
    }

    case 'education-calculators': {
      const adjustments: ExtraFieldAdjustment[] = []
      const val = typeof mainValue === 'number' ? mainValue : parseFloat(mainValue)
      if (isNaN(val)) return adjustments

      // Extra credit
      const extraCredit = extraFields['extra_extra_credit']
      if (extraCredit && parseFloat(extraCredit) > 0) {
        const ec = parseFloat(extraCredit)
        adjustments.push({
          label: 'Extra Credit',
          originalLabel: 'Base Score',
          originalValue: `${val}%`,
          adjustedLabel: 'With Extra Credit',
          adjustedValue: `${(val + ec).toFixed(1)}%`,
          impact: 'positive',
          explanation: `Added ${ec} extra credit point${ec !== 1 ? 's' : ''} to the base score.`,
        })
      }

      // Passing grade threshold
      const passingGrade = extraFields['extra_passing_grade']
      if (passingGrade && parseFloat(passingGrade) > 0) {
        const pg = parseFloat(passingGrade)
        const passed = val >= pg
        adjustments.push({
          label: 'Passing Status',
          originalLabel: 'Passing Grade',
          originalValue: `${pg}%`,
          adjustedLabel: 'Your Score',
          adjustedValue: `${val.toFixed(1)}%`,
          impact: passed ? 'positive' : 'negative',
          explanation: passed
            ? `Score of ${val.toFixed(1)}% meets the ${pg}% passing threshold.`
            : `Score of ${val.toFixed(1)}% is below the ${pg}% passing threshold.`,
        })
      }

      return adjustments
    }

    case 'biology-calculators': {
      const adjustments: ExtraFieldAdjustment[] = []
      const val = typeof mainValue === 'number' ? mainValue : parseFloat(mainValue)
      if (isNaN(val)) return adjustments

      // Temperature effect adjustment
      const temp = extraFields['extra_temperature_c']
      if (temp && parseFloat(temp) !== 37) {
        const tempC = parseFloat(temp)
        // Q10 temperature coefficient: rate change per 10°C
        const q10 = 2.0 // Typical for biological reactions
        const tempEffect = Math.pow(q10, (tempC - 37) / 10)
        const adjusted = val * tempEffect
        adjustments.push({
          label: 'Temperature Effect (Q10)',
          originalLabel: 'At 37°C',
          originalValue: val.toFixed(3),
          adjustedLabel: `At ${tempC}°C`,
          adjustedValue: adjusted.toFixed(3),
          impact: tempC > 37 ? 'positive' : 'negative',
          explanation: `Applied Q10 temperature coefficient of ${q10}. Biological reaction rates change ~2x per 10°C from physiological temperature (37°C).`,
        })
      }

      // pH adjustment
      const ph = extraFields['extra_ph_level']
      if (ph && parseFloat(ph) !== 7.4) {
        const pH = parseFloat(ph)
        const phDeviation = Math.abs(pH - 7.4)
        const phFactor = Math.max(0.5, 1 - phDeviation * 0.1) // -10% per pH unit from 7.4
        const adjusted = val * phFactor
        adjustments.push({
          label: 'pH Effect',
          originalLabel: `At pH 7.4`,
          originalValue: val.toFixed(3),
          adjustedLabel: `At pH ${pH}`,
          adjustedValue: adjusted.toFixed(3),
          impact: phFactor < 1 ? 'negative' : 'neutral',
          explanation: `Adjusted for pH deviation from physiological norm (7.4). Activity reduced by ${((1 - phFactor) * 100).toFixed(0)}% at pH ${pH}.`,
        })
      }

      return adjustments
    }
  }

  return adjustments
}

function formatPace(v: number): string {
  const min = Math.floor(v)
  const sec = Math.round((v - min) * 60)
  return `${min}:${sec.toString().padStart(2, '0')} /mi`
}

function formatMoney(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(1)}K`
  return `$${v.toFixed(2)}`
}

function formatNumber(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}K`
  return v % 1 === 0 ? v.toFixed(0) : v.toFixed(2)
}
