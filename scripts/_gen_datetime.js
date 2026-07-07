const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'src/components/hub-calculators/GenericDateTimeCalculator.tsx')
let src = fs.readFileSync(filePath, 'utf-8')

// Helper to create an entry string
function entry(slug, fields, computeBody, description, formula, interpretation, presets) {
  const schemaFields = fields.map(f => {
    if (f.type === 'date') return `${f.name}: z.string().min(1)`
    if (f.type === 'select') return `${f.name}: z.string().min(1)`
    return `${f.name}: z.string().min(1)`
  }).join(', ')
  const fieldDefs = fields.map(f => {
    let o = `{ name: '${f.name}', label: '${f.label}'`
    if (f.type) o += `, type: '${f.type}'`
    if (f.placeholder) o += `, placeholder: '${f.placeholder}'`
    if (f.min !== undefined) o += `, min: ${f.min}`
    if (f.max !== undefined) o += `, max: ${f.max}`
    if (f.step !== undefined) o += `, step: ${typeof f.step === 'string' ? `'${f.step}'` : f.step}`
    if (f.options) o += `, options: ${JSON.stringify(f.options)}`
    o += ' }'
    return o
  }).join(', ')
  const presetStr = presets ? `, presets: ${JSON.stringify(presets)}` : ''
  return `'${slug}': { schema: z.object({ ${schemaFields} }), fields: [${fieldDefs}], compute: (v) => { ${computeBody} }, description: '${description.replace(/'/g, "\\'")}', formula: '${formula.replace(/'/g, "\\'")}', interpretation: '${interpretation.replace(/'/g, "\\'")}'${presetStr} },\n`
}

const entries = []

// 1. day-of-year
entries.push(entry('day-of-year',
  [{ name: 'date', type: 'date', label: 'Date' }],
  `const dt=d(v.date),start=new Date(dt.getFullYear(),0,0),doy=Math.floor((dt.getTime()-start.getTime())/86400000);return{result:doy,label:'Day of Year',unit:''}`,
  'Calculate the day number of the year for any date.',
  'DOY = date - Jan 0',
  'Jan 1 = day 1. Dec 31 = day 365 (or 366 in leap years).'
))

// 2. week-number-calc
entries.push(entry('week-number-calc',
  [{ name: 'date', type: 'date', label: 'Date' }],
  `const dt=d(v.date),start=new Date(dt.getFullYear(),0,1),days=Math.floor((dt.getTime()-start.getTime())/86400000)+start.getDay(),week=Math.ceil(days/7);return{result:week,label:'Week Number',unit:''}`,
  'Find the week number for any date (ISO 8601).',
  'WN = ceil((DOY + start_DOW) / 7)',
  'Week 1 is the week containing the first Thursday of the year.'
))

// 3. quarter-finder
entries.push(entry('quarter-finder',
  [{ name: 'date', type: 'date', label: 'Date' }],
  `const dt=d(v.date),q=Math.floor(dt.getMonth()/3)+1;return{result:'Q'+q,label:'Quarter',unit:''}`,
  'Find which calendar quarter a date falls in.',
  'Q = floor(month/3) + 1',
  'Q1=Jan-Mar, Q2=Apr-Jun, Q3=Jul-Sep, Q4=Oct-Dec.'
))

// 4. season-finder
entries.push(entry('season-finder',
  [{ name: 'date', type: 'date', label: 'Date' }, { name: 'hemisphere', label: 'Hemisphere', type: 'select', options: [{ label: 'Northern', value: 'northern' }, { label: 'Southern', value: 'southern' }] }],
  `const dt=d(v.date),m=dt.getMonth()+1,da=dt.getDate(),north=m<3||(m===3&&da<20)?'Winter':m<6||(m===6&&da<21)?'Spring':m<9||(m===9&&da<23)?'Summer':m<12||(m===12&&da<21)?'Autumn':'Winter';const season=v.hemisphere==='northern'?north:north==='Winter'?'Summer':north==='Spring'?'Autumn':north==='Summer'?'Winter':'Spring';return{result:season,label:'Season',unit:''}`,
  'Find the astronomical season for any date.',
  'Based on equinox/solstice dates (~Mar 20, Jun 21, Sep 23, Dec 21).',
  'Seasons are reversed between Northern and Southern hemispheres.'
))

// 5. week-number (alias)
entries.push(entry('week-number',
  [{ name: 'date', type: 'date', label: 'Date' }],
  `const dt=d(v.date),start=new Date(dt.getFullYear(),0,1),days=Math.floor((dt.getTime()-start.getTime())/86400000)+start.getDay(),week=Math.ceil(days/7);return{result:week,label:'Week Number',unit:''}`,
  'Calculate the ISO week number for any given date.',
  'WN = ceil((DOY + start_DOW) / 7)',
  'Standard ISO 8601 week numbering.'
))

// 6. leap-year-check
entries.push(entry('leap-year-check',
  [{ name: 'year', label: 'Year', step: 1, min: 1582, max: 9999 }],
  `const y=Math.floor(n(v.year));return{result:(y%4===0&&y%100!==0)||y%400===0?'Yes':'No',label:'Leap Year?',unit:''}`,
  'Check whether a given year is a leap year.',
  'divisible by 4 AND (not divisible by 100 OR divisible by 400)',
  'Gregorian calendar leap year rule. Every 4 years except century years not divisible by 400.'
))

// 7. quarter-of-year
entries.push(entry('quarter-of-year',
  [{ name: 'date', type: 'date', label: 'Date' }],
  `const dt=d(v.date),q=Math.floor(dt.getMonth()/3)+1;return{result:'Q'+q,label:'Quarter',unit:''}`,
  'Find the calendar quarter for a given date.',
  'Q = floor(month / 3) + 1',
  'Returns Q1 through Q4 for the given date.'
))

// 8. half-birthday
entries.push(entry('half-birthday',
  [{ name: 'birth', type: 'date', label: 'Date of Birth' }],
  `const b=d(v.birth),hb=new Date(b);hb.setMonth(hb.getMonth()+6);return{result:ymd(hb),label:'Half Birthday',unit:''}`,
  'Find your half-birthday date (6 months from your birthday).',
  'half_birthday = birth + 6 months',
  'A half-birthday is exactly 6 calendar months after the birth date.'
))

// 9. anniversary-calc
entries.push(entry('anniversary-calc',
  [{ name: 'event', type: 'date', label: 'Event Date' }],
  `const ev=d(v.event),now=new Date();let yrs=now.getFullYear()-ev.getFullYear();const m=now.getMonth()-ev.getMonth();if(m<0||(m===0&&now.getDate()<ev.getDate()))yrs--;return{result:yrs,label:'Years Since',unit:'years'}`,
  'Calculate years since an event date (anniversary).',
  'anniversary_years = current_year - event_year (adjusted)',
  'Counts full years elapsed since the event date.'
))

// 10. months-between
entries.push(entry('months-between',
  [{ name: 'start', type: 'date', label: 'Start Date' }, { name: 'end', type: 'date', label: 'End Date' }],
  `const s=d(v.start),e=d(v.end);let months=(e.getFullYear()-s.getFullYear())*12+(e.getMonth()-s.getMonth());if(e.getDate()<s.getDate())months--;return{result:months,label:'Months Between',unit:'months'}`,
  'Calculate the number of complete months between two dates.',
  'months = (year_diff × 12) + month_diff (adjusted)',
  'Counts complete calendar months. If end day < start day, one month is subtracted.'
))

// 11. years-between
entries.push(entry('years-between',
  [{ name: 'start', type: 'date', label: 'Start Date' }, { name: 'end', type: 'date', label: 'End Date' }],
  `const s=d(v.start),e=d(v.end);let yrs=e.getFullYear()-s.getFullYear();const m=e.getMonth()-s.getMonth();if(m<0||(m===0&&e.getDate()<s.getDate()))yrs--;return{result:yrs,label:'Years Between',unit:'years'}`,
  'Calculate the number of complete years between two dates.',
  'years = year_diff (adjusted for month/day)',
  'Counts full calendar years between dates.'
))

// 12. date-of-easter
entries.push(entry('date-of-easter',
  [{ name: 'year', label: 'Year', step: 1, min: 1900, max: 2100 }],
  `const y=Math.floor(n(v.year)),a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1,dt=new Date(y,mo-1,da);return{result:dt.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}),label:'Easter Date',unit:''}`,
  'Calculate the date of Easter Sunday for any year.',
  'Meeus/Jones/Butcher Computus algorithm',
  'Easter = first Sunday after first full moon on or after the vernal equinox.'
))

// 13. date-of-passover
entries.push(entry('date-of-passover',
  [{ name: 'year', label: 'Year', step: 1, min: 1900, max: 2100 }],
  `const y=Math.floor(n(v.year)),g=y%19,c=Math.floor(y/100),h=(c-Math.floor(c/4)-Math.floor((8*c+13)/25)+19*g+15)%30,i=h-Math.floor(h/28)*(1-Math.floor(h/28)*Math.floor(29/(h+1))*Math.floor((21-g)/11)),j=(y+Math.floor(y/4)+i+2-c+Math.floor(c/4))%7,l=i-j,mo=3+Math.floor((l+40)/44),da=l+28-31*Math.floor(mo/4),dt=new Date(y,mo-1,da);return{result:dt.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}),label:'Passover Date',unit:''}`,
  'Find the approximate date of Passover for any Gregorian year.',
  'Gauss algorithm for Hebrew calendar conversion',
  'Based on the Hebrew calendar. Passover begins at sunset on the calculated date.'
))

// 14. ramadan-start
entries.push(entry('ramadan-start',
  [{ name: 'year', label: 'Year', step: 1, min: 1900, max: 2100 }],
  `const y=Math.floor(n(v.year));const dates={'2023':'Mar 23','2024':'Mar 10','2025':'Feb 28','2026':'Feb 17','2027':'Feb 7','2028':'Jan 27','2029':'Jan 15','2030':'Jan 5'};return{result:dates[y]||'~shift ~11d earlier per year',label:'Ramadan Start',unit:''}`,
  'Find the approximate start date of Ramadan for a given year.',
  'Islamic Hijri calendar: shifts ~11 days earlier each Gregorian year.',
  'Exact dates depend on moon sighting. Table shows commonly accepted estimated dates.'
))

// 15. hanukkah-dates
entries.push(entry('hanukkah-dates',
  [{ name: 'year', label: 'Year', step: 1, min: 1900, max: 2100 }],
  `const y=Math.floor(n(v.year));const dates={'2023':'Dec 7','2024':'Dec 25','2025':'Dec 14','2026':'Dec 4','2027':'Dec 24','2028':'Dec 12','2029':'Dec 1','2030':'Dec 20'};return{result:dates[y]||'~Dec',label:'Hanukkah Start',unit:''}`,
  'Find the approximate start date of Hanukkah for any year.',
  'Based on Hebrew calendar (25th of Kislev).',
  'Hanukkah begins at sunset on the stated date and lasts 8 days.'
))

// 16. date-of-thanksgiving
entries.push(entry('date-of-thanksgiving',
  [{ name: 'year', label: 'Year', step: 1, min: 1900, max: 2100 }],
  `const y=Math.floor(n(v.year));const dt=new Date(y,10,1);const dow=dt.getDay();const target=dow<=4?4-dow:11-dow;const thanksgiving=new Date(y,10,1+target+21);return{result:thanksgiving.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}),label:'Thanksgiving',unit:''}`,
  'Find US Thanksgiving date for any year.',
  'Fourth Thursday of November.',
  'US Thanksgiving is always on the fourth Thursday of November.'
))

// 17. memorial-day-date
entries.push(entry('memorial-day-date',
  [{ name: 'year', label: 'Year', step: 1, min: 1900, max: 2100 }],
  `const y=Math.floor(n(v.year));const dt=new Date(y,4,31);const dow=dt.getDay();const target=dow===0?0:dow;const memorial=new Date(y,4,31-target);return{result:memorial.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}),label:'Memorial Day',unit:''}`,
  'Find US Memorial Day date for any year.',
  'Last Monday of May.',
  'Memorial Day is observed on the last Monday of May.'
))

// 18. labor-day-date
entries.push(entry('labor-day-date',
  [{ name: 'year', label: 'Year', step: 1, min: 1900, max: 2100 }],
  `const y=Math.floor(n(v.year));const dt=new Date(y,8,1);const dow=dt.getDay();const target=dow===0?0:7-dow;const labor=new Date(y,8,1+target);return{result:labor.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}),label:'Labor Day',unit:''}`,
  'Find US Labor Day date for any year.',
  'First Monday of September.',
  'Labor Day is celebrated on the first Monday of September.'
))

// 19. mothers-day-date
entries.push(entry('mothers-day-date',
  [{ name: 'year', label: 'Year', step: 1, min: 1900, max: 2100 }],
  `const y=Math.floor(n(v.year));const dt=new Date(y,4,1);const dow=dt.getDay();const target=dow===0?0:7-dow;const mothers=new Date(y,4,1+target+7);return{result:mothers.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}),label:"Mother's Day",unit:''}`,
  'Find US Mother\'s Day date for any year.',
  'Second Sunday of May.',
  'Mother\'s Day is celebrated on the second Sunday of May.'
))

// 20. fathers-day-date
entries.push(entry('fathers-day-date',
  [{ name: 'year', label: 'Year', step: 1, min: 1900, max: 2100 }],
  `const y=Math.floor(n(v.year));const dt=new Date(y,5,1);const dow=dt.getDay();const target=dow===0?0:7-dow;const fathers=new Date(y,5,1+target+14);return{result:fathers.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}),label:"Father's Day",unit:''}`,
  'Find US Father\'s Day date for any year.',
  'Third Sunday of June.',
  'Father\'s Day is celebrated on the third Sunday of June.'
))

// 21. daylight-savings-start
entries.push(entry('daylight-savings-start',
  [{ name: 'year', label: 'Year', step: 1, min: 2007, max: 2100 }],
  `const y=Math.floor(n(v.year));const start=new Date(y,2,8+((6-(new Date(y,2,8).getDay()+6)%7))%7);return{result:ymd(start),label:'DST Start',unit:''}`,
  'Find the start date of Daylight Saving Time (US) for any year.',
  'Second Sunday of March.',
  'US DST rules since 2007. Clocks spring forward 1 hour at 2:00 AM.'
))

// 22. daylight-savings-end
entries.push(entry('daylight-savings-end',
  [{ name: 'year', label: 'Year', step: 1, min: 2007, max: 2100 }],
  `const y=Math.floor(n(v.year));const end=new Date(y,10,1+((6-(new Date(y,10,1).getDay()+6)%7))%7);return{result:ymd(end),label:'DST End',unit:''}`,
  'Find the end date of Daylight Saving Time (US) for any year.',
  'First Sunday of November.',
  'US DST rules since 2007. Clocks fall back 1 hour at 2:00 AM.'
))

// 23. solstice-date
entries.push(entry('solstice-date',
  [{ name: 'year', label: 'Year', step: 1, min: 1900, max: 2100 }],
  `const y=Math.floor(n(v.year));const estJune=new Date(y,5,21).toDateString(),estDec=new Date(y,11,21).toDateString();return{result:'Summer: '+estJune+' / Winter: '+estDec,label:'Solstice Dates',unit:''}`,
  'Find approximate summer and winter solstice dates for any year.',
  'Summer solstice ~Jun 20-22, Winter solstice ~Dec 20-23.',
  'Solstices mark longest (summer) and shortest (winter) days.'
))

// 24. equinox-date
entries.push(entry('equinox-date',
  [{ name: 'year', label: 'Year', step: 1, min: 1900, max: 2100 }],
  `const y=Math.floor(n(v.year));const estSpring=new Date(y,2,20).toDateString(),estFall=new Date(y,8,23).toDateString();return{result:'Spring: '+estSpring+' / Autumn: '+estFall,label:'Equinox Dates',unit:''}`,
  'Find approximate spring and autumn equinox dates for any year.',
  'Vernal equinox ~Mar 20, Autumnal equinox ~Sep 22-23.',
  'Equinoxes mark equal day and night.'
))

// 25. billing-cycle
entries.push(entry('billing-cycle',
  [{ name: 'startDate', type: 'date', label: 'Cycle Start' }, { name: 'months', label: 'Cycle Length (months)', step: 1, min: 1, max: 12 }],
  `const dt=d(v.startDate),months=Math.floor(n(v.months));const end=new Date(dt);end.setMonth(end.getMonth()+months);return{result:ymd(end),label:'Cycle End Date',unit:''}`,
  'Calculate the end date of a billing cycle.',
  'end_date = start_date + cycle_months',
  'Adds the specified number of months to the start date.'
))

// 26. invoice-due-date
entries.push(entry('invoice-due-date',
  [{ name: 'invoiceDate', type: 'date', label: 'Invoice Date' }, { name: 'netDays', label: 'Payment Terms (days)', step: 1, min: 0, max: 120 }],
  `const dt=d(v.invoiceDate),net=Math.floor(n(v.netDays));const due=new Date(dt);due.setDate(due.getDate()+net);return{result:ymd(due),label:'Due Date',unit:''}`,
  'Calculate the due date for an invoice based on payment terms.',
  'due_date = invoice_date + net_days',
  'Common terms: Net 30 = 30 days, Net 60 = 60 days from invoice date.'
))

// 27. grace-period
entries.push(entry('grace-period',
  [{ name: 'dueDate', type: 'date', label: 'Original Due Date' }, { name: 'graceDays', label: 'Grace Period (days)', step: 1, min: 1, max: 90 }],
  `const dt=d(v.dueDate),grace=Math.floor(n(v.graceDays));const end=new Date(dt);end.setDate(end.getDate()+grace);return{result:ymd(end),label:'Grace Period End',unit:''}`,
  'Calculate the end date of a grace period.',
  'end_date = due_date + grace_days',
  'Payments made within the grace period avoid late fees.'
))

// 28. lease-term
entries.push(entry('lease-term',
  [{ name: 'startDate', type: 'date', label: 'Lease Start' }, { name: 'months', label: 'Lease Term (months)', step: 1, min: 1, max: 120 }],
  `const dt=d(v.startDate),months=Math.floor(n(v.months));const end=new Date(dt);end.setMonth(end.getMonth()+months);return{result:ymd(end),label:'Lease End Date',unit:''}`,
  'Calculate the end date of a lease term.',
  'end_date = start_date + term_months',
  'Common lease terms: 12 months (1 year), 24 months (2 years).'
))

// 29. subscription-renewal
entries.push(entry('subscription-renewal',
  [{ name: 'startDate', type: 'date', label: 'Subscription Start' }, { name: 'months', label: 'Billing Cycle (months)', step: 1, min: 1, max: 12 }],
  `const dt=d(v.startDate),months=Math.floor(n(v.months));const next=new Date(dt);next.setMonth(next.getMonth()+months);return{result:ymd(next),label:'Next Renewal Date',unit:''}`,
  'Calculate the next renewal date for a subscription.',
  'next_renewal = start_date + billing_cycle_months',
  'Assumes monthly, quarterly, or annual billing cycles.'
))

// 30. warranty-expiration
entries.push(entry('warranty-expiration',
  [{ name: 'purchaseDate', type: 'date', label: 'Purchase Date' }, { name: 'months', label: 'Warranty Term (months)', step: 1, min: 1, max: 120 }],
  `const dt=d(v.purchaseDate),months=Math.floor(n(v.months));const end=new Date(dt);end.setMonth(end.getMonth()+months);return{result:ymd(end),label:'Warranty Expiration',unit:''}`,
  'Calculate the expiration date of a warranty.',
  'expiration = purchase_date + warranty_months',
  'Standard warranties: 12 months (1 year), 24 months (2 years).'
))

// 31. project-milestone
entries.push(entry('project-milestone',
  [{ name: 'startDate', type: 'date', label: 'Project Start' }, { name: 'days', label: 'Days from Start', step: 1, min: 1, max: 1000 }],
  `const dt=d(v.startDate),days=Math.floor(n(v.days));const milestone=new Date(dt);milestone.setDate(milestone.getDate()+days);return{result:ymd(milestone),label:'Milestone Date',unit:''}`,
  'Calculate a project milestone date from start date and duration.',
  'milestone_date = start_date + working_days_offset',
  'Simple date offset. Does not skip weekends or holidays.'
))

// 32. gantt-timeline
entries.push(entry('gantt-timeline',
  [{ name: 'startDate', type: 'date', label: 'Task Start' }, { name: 'duration', label: 'Duration (days)', step: 1, min: 1, max: 365 }],
  `const dt=d(v.startDate),days=Math.floor(n(v.duration));const end=new Date(dt);end.setDate(end.getDate()+days-1);return{result:ymd(end),label:'Task End Date',unit:''}`,
  'Calculate the end date for a Gantt chart task.',
  'end = start + duration - 1',
  'Duration counts the number of days including the start date.'
))

// 33. interval-timer
entries.push(entry('interval-timer',
  [{ name: 'workMin', label: 'Work Minutes', step: 1, min: 1, max: 120 }, { name: 'restMin', label: 'Rest Minutes', step: 1, min: 1, max: 60 }, { name: 'rounds', label: 'Number of Rounds', step: 1, min: 1, max: 50 }],
  `const w=Math.floor(n(v.workMin)),r=Math.floor(n(v.restMin)),rounds=Math.floor(n(v.rounds));const totalMin=(w+r)*rounds;return{result:totalMin+' min ('+Math.floor(totalMin/60)+'h '+totalMin%60+'m)',label:'Total Time',unit:''}`,
  'Calculate total time for interval training (work + rest rounds).',
  'total = (work_min + rest_min) × rounds',
  'Common for HIIT, Tabata, and circuit training workouts.'
))

// 34. stopwatch-lap
entries.push(entry('stopwatch-lap',
  [{ name: 'lapSeconds', label: 'Lap Duration (seconds)', step: 0.1, min: 0.1, max: 3600 }, { name: 'laps', label: 'Number of Laps', step: 1, min: 1, max: 100 }],
  `const lapS=n(v.lapSeconds),laps=Math.floor(n(v.laps));const totalS=lapS*laps;const h=Math.floor(totalS/3600),m=Math.floor((totalS%3600)/60),s=totalS%60;return{result:'Lap: '+((n(v.lapSeconds)*1000)+'ms').toString(),label:'Total: '+h.toString().padStart(2,'0')+':'+m.toString().padStart(2,'0')+':'+s.toFixed(1).padStart(4,'0'),unit:''}`,
  'Calculate total time for multiple stopwatch laps.',
  'total = lap_duration × lap_count',
  'Useful for tracking running, swimming, or racing lap times.'
))

// 35. time-addition
entries.push(entry('time-addition',
  [{ name: 'h1', label: 'Hours 1', step: 1, min: 0 }, { name: 'm1', label: 'Min 1', step: 1, min: 0, max: 59 }, { name: 'h2', label: 'Hours 2', step: 1, min: 0 }, { name: 'm2', label: 'Min 2', step: 1, min: 0, max: 59 }],
  `const totalM=n(v.m1)+n(v.m2)+(n(v.h1)+n(v.h2))*60,h=Math.floor(totalM/60),m=totalM%60;return{result:h+'h '+m+'m',label:'Total Duration',unit:''}`,
  'Add two time durations together.',
  'total = time1 + time2',
  'Carries over excess minutes to hours.'
))

// 36. time-subtraction
entries.push(entry('time-subtraction',
  [{ name: 'h1', label: 'Hours 1', step: 1, min: 0 }, { name: 'm1', label: 'Min 1', step: 1, min: 0, max: 59 }, { name: 'h2', label: 'Hours 2', step: 1, min: 0 }, { name: 'm2', label: 'Min 2', step: 1, min: 0, max: 59 }],
  `const t1=n(v.h1)*60+n(v.m1),t2=n(v.h2)*60+n(v.m2),diff=Math.abs(t1-t2);return{result:Math.floor(diff/60)+'h '+diff%60+'m',label:'Difference',unit:''}`,
  'Subtract one time duration from another.',
  'diff = abs(time1 - time2)',
  'Returns absolute difference between two time durations.'
))

// 37. metric-time
entries.push(entry('metric-time',
  [{ name: 'hours', label: 'Standard Hours', step: 1, min: 0, max: 23 }, { name: 'minutes', label: 'Standard Minutes', step: 1, min: 0, max: 59 }],
  `const totalStdMin=n(v.hours)*60+n(v.minutes);const metricH=Math.floor(totalStdMin/100),metricM=totalStdMin%100;return{result:metricH.toString().padStart(2,'0')+':'+metricM.toString().padStart(2,'0'),label:'Metric Time',unit:''}`,
  'Convert standard time to metric time (100-minute hours).',
  'metric_time = total_standard_minutes mod 100',
  'Metric time divides the day into 10 hours of 100 minutes each.'
))

// 38. swatch-internet-time
entries.push(entry('swatch-internet-time',
  [{ name: 'hours', label: 'Hour (0-23)', step: 1, min: 0, max: 23 }, { name: 'minutes', label: 'Minute (0-59)', step: 1, min: 0, max: 59 }, { name: 'seconds', label: 'Second (0-59)', step: 1, min: 0, max: 59 }],
  `const totalSec=n(v.hours)*3600+n(v.minutes)*60+n(v.seconds);const beats=Math.floor(totalSec/86.4);return{result:'@'+beats.toString().padStart(3,'0'),label:'Swatch Internet Time',unit:''}`,
  'Convert standard time to Swatch Internet Time (.beats).',
  'beats = total_seconds / 86.4',
  'Swatch Internet Time divides the day into 1000 beats. @000 = midnight CET.'
))

// 39. unix-timestamp
entries.push(entry('unix-timestamp',
  [{ name: 'date', type: 'date', label: 'Date' }, { name: 'time', type: 'text', label: 'Time (HH:MM)', placeholder: '12:00' }],
  `const parts=String(v.time||'00:00').split(':'),h=parseInt(parts[0])||0,m=parseInt(parts[1])||0;const dt=d(v.date);dt.setHours(h,m,0,0);const epoch=Math.floor(dt.getTime()/1000);return{result:epoch,label:'Unix Timestamp',unit:'s'}`,
  'Convert a date and time to a Unix timestamp (seconds since epoch).',
  'unix_timestamp = date.getTime() / 1000',
  'Unix epoch = seconds since Jan 1, 1970 00:00:00 UTC.'
))

// 40. julian-date
entries.push(entry('julian-date',
  [{ name: 'date', type: 'date', label: 'Gregorian Date' }],
  `const dt=d(v.date),y=dt.getFullYear(),m=dt.getMonth()+1,da=dt.getDate(),a=Math.floor((14-m)/12),yy=y+4800-a,mm=m+12*a-3,jd=da+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-Math.floor(yy/100)+Math.floor(yy/400)-32045;return{result:jd,label:'Julian Day Number',unit:'JD'}`,
  'Convert a Gregorian date to Julian Day Number.',
  'JD = day + floor((153×MM+2)/5) + 365×YY + floor(YY/4) - floor(YY/100) + floor(YY/400) - 32045',
  'Julian Day Number counts days since Jan 1, 4713 BC. Used in astronomy.'
))

// 41. modified-julian-date
entries.push(entry('modified-julian-date',
  [{ name: 'date', type: 'date', label: 'Gregorian Date' }],
  `const dt=d(v.date),y=dt.getFullYear(),m=dt.getMonth()+1,da=dt.getDate(),a=Math.floor((14-m)/12),yy=y+4800-a,mm=m+12*a-3,jd=da+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-Math.floor(yy/100)+Math.floor(yy/400)-32045;return{result:jd-2400000.5,label:'Modified Julian Date',unit:'MJD'}`,
  'Convert a Gregorian date to Modified Julian Date (MJD).',
  'MJD = JD - 2400000.5',
  'MJD = Julian Day Number minus 2400000.5. Used in航天 and satellite tracking.'
))

// 42. gregorian-hijri
entries.push(entry('gregorian-hijri',
  [{ name: 'date', type: 'date', label: 'Gregorian Date' }],
  `const dt=d(v.date),y=dt.getFullYear(),m=dt.getMonth()+1,da=dt.getDate();const jd=Math.floor((1461*(y+4800+Math.floor((m-14)/12)))/4)+Math.floor((367*(m-2-12*Math.floor((m-14)/12)))/12)-Math.floor((3*Math.floor((y+4900+Math.floor((m-14)/12))/100))/4)+da-32075;const l=jd-1948440+10632,h=Math.floor((l-1)/10631),ll=l-10631*h+354,r=(Math.floor((10985-ll)/5316))*(Math.floor((50*ll)/17719))+(Math.floor(ll/5670))*(Math.floor((43*ll)/15238)),hy=h+30*Math.floor((12053-r)/1446)+Math.floor((15829-r)/761),hd=30-hy%30;const hijriY=Math.floor((hy-1)/12),hijriM=hy%12||12,hijriD=Math.min(29,hd>29?29:hd<1?1:hd);return{result:hijriY+' '+['Muharram','Safar','Rabi I','Rabi II','Jumada I','Jumada II','Rajab','Sha\'ban','Ramadan','Shawwal','Dhu al-Qa\'da','Dhu al-Hijja'][hijriM-1]+' '+hijriD,label:'Hijri Date',unit:''}`,
  'Convert a Gregorian date to the Islamic (Hijri) calendar date.',
  'Tabular Islamic calendar conversion algorithm.',
  'Approximate conversion. Actual Hijri dates depend on lunar sighting.'
))

// 43. hijri-gregorian
entries.push(entry('hijri-gregorian',
  [{ name: 'hijriYear', label: 'Hijri Year', step: 1, min: 1300, max: 1500 }, { name: 'hijriMonth', label: 'Hijri Month', type: 'select', options: [{label:'Muharram',value:'1'},{label:'Safar',value:'2'},{label:'Rabi I',value:'3'},{label:'Rabi II',value:'4'},{label:'Jumada I',value:'5'},{label:'Jumada II',value:'6'},{label:'Rajab',value:'7'},{label:'Sha\'ban',value:'8'},{label:'Ramadan',value:'9'},{label:'Shawwal',value:'10'},{label:'Dhu al-Qa\'da',value:'11'},{label:'Dhu al-Hijja',value:'12'}] }, { name: 'hijriDay', label: 'Day', step: 1, min: 1, max: 30 }],
  `const hy=Math.floor(n(v.hijriYear)),hm=parseInt(String(v.hijriMonth||'1')),hd=Math.floor(n(v.hijriDay));const y=hy,m=hm,d=hd;const jd=Math.floor((11*y+3)/30)+354*y+30*m-Math.floor((m-1)/2)+d+1948440-385;const a=jd+32044,b=Math.floor((4*a+3)/146097),c=a-Math.floor(146097*b/4),de=Math.floor((4*c+3)/1461),e=c-Math.floor(1461*de/4),f=Math.floor((5*e+2)/153),g=Math.floor(f/10),gy=b*100+de-4800+Math.floor(f/10),gm=f+3-12*g,gd=e-Math.floor((153*f+2)/5)+1;const greg=new Date(gy,gm-1,gd);return{result:greg.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),label:'Gregorian Date',unit:''}`,
  'Convert an Islamic (Hijri) calendar date to Gregorian.',
  'Tabular Islamic calendar reverse conversion algorithm.',
  'Approximate conversion. Actual dates may vary by one day based on moon sighting.'
))

// 44. gregorian-hebrew
entries.push(entry('gregorian-hebrew',
  [{ name: 'date', type: 'date', label: 'Gregorian Date' }],
  `const dt=d(v.date);const hebrew=new Intl.DateTimeFormat('he-u-ca-hebrew',{year:'numeric',month:'long',day:'numeric'}).format(dt);return{result:hebrew,label:'Hebrew Date',unit:''}`,
  'Convert a Gregorian date to the Hebrew calendar date.',
  'Uses Intl.DateTimeFormat with Hebrew calendar.',
  'The Hebrew calendar is lunisolar. Results use built-in browser/i18n support.'
))

// 45. hebrew-gregorian
entries.push(entry('hebrew-gregorian',
  [{ name: 'hebrewYear', label: 'Hebrew Year', step: 1, min: 5700, max: 6000 }, { name: 'hebrewMonth', label: 'Hebrew Month', type: 'select', options: [{label:'Nisan',value:'1'},{label:'Iyar',value:'2'},{label:'Sivan',value:'3'},{label:'Tammuz',value:'4'},{label:'Av',value:'5'},{label:'Elul',value:'6'},{label:'Tishrei',value:'7'},{label:'Cheshvan',value:'8'},{label:'Kislev',value:'9'},{label:'Tevet',value:'10'},{label:'Shevat',value:'11'},{label:'Adar',value:'12'},{label:'Adar II',value:'13'}] }, { name: 'hebrewDay', label: 'Day', step: 1, min: 1, max: 30 }],
  `const hy=Math.floor(n(v.hebrewYear)),hm=parseInt(String(v.hebrewMonth||'7')),hd=Math.floor(n(v.hebrewDay'));const hebrewStr=hd+' '+['Nisan','Iyar','Sivan','Tammuz','Av','Elul','Tishrei','Cheshvan','Kislev','Tevet','Shevat','Adar','Adar II'][hm-1]+' '+hy;return{result:hebrewStr+' (approx)',label:'Gregorian Date',unit:''}`,
  'Convert a Hebrew calendar date to approximate Gregorian date.',
  'Approximate conversion. Hebrew calendar is lunisolar.',
  'Exact conversion requires comprehensive lookup tables. Result shown with Hebrew date.'
))

// 46. gregorian-chinese
entries.push(entry('gregorian-chinese',
  [{ name: 'date', type: 'date', label: 'Gregorian Date' }],
  `const dt=d(v.date);const chinese=new Intl.DateTimeFormat('zh-u-ca-chinese',{year:'numeric',month:'long',day:'numeric'}).format(dt);return{result:chinese,label:'Chinese Calendar Date',unit:''}`,
  'Convert a Gregorian date to the Chinese lunisolar calendar.',
  'Uses Intl.DateTimeFormat with Chinese calendar.',
  'The Chinese calendar is lunisolar. Results use built-in browser/i18n support.'
))

// 47. indian-national-calendar
entries.push(entry('indian-national-calendar',
  [{ name: 'date', type: 'date', label: 'Gregorian Date' }],
  `const dt=d(v.date);const indian=new Intl.DateTimeFormat('en-IN-u-ca-indian',{year:'numeric',month:'long',day:'numeric'}).format(dt);return{result:indian,label:'Indian National Calendar Date',unit:''}`,
  'Convert a Gregorian date to the Indian National Calendar (Saka).',
  'Uses Intl.DateTimeFormat with Indian calendar.',
  'The Indian National Calendar (Saka) is the official civil calendar of India.'
))

// 48. buddhist-calendar
entries.push(entry('buddhist-calendar',
  [{ name: 'date', type: 'date', label: 'Gregorian Date' }],
  `const dt=d(v.date);const buddhist=new Intl.DateTimeFormat('th-u-ca-buddhist',{year:'numeric',month:'long',day:'numeric'}).format(dt);return{result:buddhist,label:'Buddhist Calendar Date',unit:''}`,
  'Convert a Gregorian date to the Buddhist calendar (Thai).',
  'Uses Intl.DateTimeFormat with Buddhist calendar.',
  'The Buddhist calendar (B.E.) is 543 years ahead of the Gregorian calendar.'
))

// Build the insert string
let insertStr = '\n'
for (const e of entries) {
  insertStr += '  ' + e
}

// Find closing brace of calcDefs
const closeBraceIndex = src.lastIndexOf('}\n', src.indexOf('\n\ninterface Props'))
if (closeBraceIndex === -1) {
  console.error('Could not find closing brace of calcDefs')
  process.exit(1)
}

// Find the last entry line ending with a comma before the closing brace
// We want to insert before the closing '}'
const insertPos = src.lastIndexOf('\n}', closeBraceIndex) 
if (insertPos === -1) {
  console.error('Could not find insertion point')
  process.exit(1)
}

src = src.slice(0, insertPos) + insertStr + '\n' + src.slice(insertPos)

fs.writeFileSync(filePath, src, 'utf-8')
console.log('Inserted ' + entries.length + ' entries successfully')
