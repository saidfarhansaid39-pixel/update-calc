param(
    [string]$FilePath = "C:\Users\store one\Pictures\calculatora\MpB2M28jkJJIYqVynKKb\Fichiers multiples\packages\calculator-registry\src\registry.ts"
)

$content = Get-Content -LiteralPath $FilePath -Raw
$lines = $content -split "`r?`n"

$existingSlugs = @{}
Select-String -Path $FilePath -Pattern "slug: '([^']+)'" | ForEach-Object {
    $existingSlugs[$_.Matches.Groups[1].Value] = $true
}
Write-Host "Found $($existingSlugs.Count) existing slugs"

$consDesc = "Get accurate construction estimates for your project with material quantities cost breakdowns and professional recommendations. Save money avoid waste and plan confidently with precise construction calculations trusted by contractors and DIYers."
$statDesc = "Compute statistical values with confidence using our intuitive statistical tool. Features data input validation visual distributions and detailed step-by-step methodology. Designed for students researchers and data analysts."
$physDesc = "Solve physics problems with our interactive physics calculator. Features formula derivation step-by-step solutions and visual simulations. Perfect for STEM students teachers and engineering professionals requiring accurate scientific computations."
$chemDesc = "Master chemistry calculations with our comprehensive chemistry tool. Includes formula balancing unit conversion and detailed methodology. Essential for chemistry students researchers and laboratory professionals."
$everyDesc = "Simplify everyday calculations for daily life. Quick accurate and easy to use with practical results you can apply immediately. Perfect for household budgeting shopping meal planning and lifestyle management."
$mathDesc = "Master math concepts with step-by-step solutions interactive graphs and detailed explanations. Perfect for students teachers and professionals who need accurate mathematical computations with visual learning aids."

function New-Entry {
    param($slug, $title, $desc, $category, $tier, $hubSlug, $hubName, $keywords)
    $kw = ($keywords | ForEach-Object { "'$_'" }) -join ', '
    return "  { slug: '$slug', title: '$title', description: 'Free $title - $desc', category: '$category', tier: '$tier', hubSlug: '$hubSlug', hubName: '$hubName', keywords: [$kw] },"
}

function Add-If-New {
    param($slug, [scriptblock]$entryBuilder)
    if (-not $existingSlugs.ContainsKey($slug)) {
        $existingSlugs[$slug] = $true
        return & $entryBuilder
    }
    return $null
}

$construction = @()
$consSlugs = @(
    @('concrete-column','Concrete Column Calculator','Calculate concrete volume and formwork for round and square columns',$consDesc,'tier2'),
    @('concrete-beam','Concrete Beam Calculator','Calculate concrete beam dimensions and reinforcement requirements for structural beams',$consDesc,'tier2'),
    @('concrete-wall','Concrete Wall Calculator','Calculate concrete volume and formwork for retaining and foundation walls',$consDesc,'tier1'),
    @('footing-calculator','Footing Calculator','Calculate concrete footing dimensions and volume for foundation support',$consDesc,'tier2'),
    @('foundation-wall','Foundation Wall Calculator','Calculate foundation wall concrete volume and reinforcing requirements',$consDesc,'tier2'),
    @('masonry-wall','Masonry Wall Calculator','Calculate masonry wall materials for brick block and stone construction',$consDesc,'tier2'),
    @('stone-veneer','Stone Veneer Calculator','Calculate stone veneer coverage and material quantities for exterior walls',$consDesc,'tier1'),
    @('grout-calculator','Grout Calculator','Calculate grout volume for tile and masonry joints',$consDesc,'tier1'),
    @('concrete-steps','Concrete Steps Calculator','Calculate concrete volume and formwork dimensions for stair construction',$consDesc,'tier1'),
    @('concrete-forms','Concrete Forms Calculator','Calculate concrete form panel layout and tie spacing',$consDesc,'tier1'),
    @('concrete-finish','Concrete Finish Calculator','Calculate concrete finishing tools and materials for surface preparation',$consDesc,'tier1'),
    @('stamped-concrete','Stamped Concrete Calculator','Calculate stamped concrete area and material requirements for decorative surfaces',$consDesc,'tier2'),
    @('concrete-sealer','Concrete Sealer Calculator','Calculate concrete sealer coverage and application quantities',$consDesc,'tier1'),
    @('concrete-crack-repair','Concrete Crack Repair Calculator','Calculate concrete crack repair material and epoxy quantities',$consDesc,'tier1'),
    @('roof-pitch','Roof Pitch Calculator','Calculate roof pitch angle slope and rise from measurements',$consDesc,'tier1'),
    @('roof-area','Roof Area Calculator','Calculate total roof area from pitch and footprint dimensions',$consDesc,'tier2'),
    @('roofing-shingle','Roofing Shingle Calculator','Calculate asphalt shingle bundles and underlayment for roof projects',$consDesc,'tier2'),
    @('roofing-metal','Roofing Metal Calculator','Calculate metal roofing panels and trim for standing seam installations',$consDesc,'tier2'),
    @('roofing-tile','Roofing Tile Calculator','Calculate clay and concrete roofing tile quantities for sloped roofs',$consDesc,'tier1'),
    @('roofing-flat','Flat Roof Calculator','Calculate flat roof membrane and insulation requirements',$consDesc,'tier1'),
    @('downspout','Downspout Calculator','Calculate downspout size and quantity for gutter drainage systems',$consDesc,'tier1'),
    @('fascia-calculator','Fascia Board Calculator','Calculate fascia board length and trim requirements for roof edges',$consDesc,'tier1'),
    @('roof-ventilation','Roof Ventilation Calculator','Calculate roof ventilation requirements for attic air circulation',$consDesc,'tier2'),
    @('ice-dam','Ice Dam Prevention Calculator','Calculate ice dam prevention measures for cold climate roofs',$consDesc,'tier1'),
    @('roof-snow-load','Roof Snow Load Calculator','Calculate roof snow load capacity based on location and roof pitch',$consDesc,'tier2'),
    @('ridge-vent','Ridge Vent Calculator','Calculate ridge vent length for continuous roof ridge ventilation',$consDesc,'tier1'),
    @('siding-vinyl','Vinyl Siding Calculator','Calculate vinyl siding panels and trim pieces for exterior walls',$consDesc,'tier2'),
    @('siding-wood','Wood Siding Calculator','Calculate wood siding boards and nails for exterior cladding',$consDesc,'tier2'),
    @('siding-fiber-cement','Fiber Cement Siding Calculator','Calculate fiber cement siding planks for exterior walls',$consDesc,'tier2'),
    @('siding-brick','Brick Siding Calculator','Calculate brick veneer siding materials for exterior walls',$consDesc,'tier1'),
    @('siding-aluminum','Aluminum Siding Calculator','Calculate aluminum siding panels for exterior home renovation',$consDesc,'tier1'),
    @('exterior-paint','Exterior Paint Calculator','Calculate exterior paint gallons for siding and trim surfaces',$consDesc,'tier1'),
    @('caulking','Caulking Calculator','Calculate caulk tubes needed for windows doors and trim',$consDesc,'tier1'),
    @('weatherstripping','Weatherstripping Calculator','Calculate weatherstripping length for doors and windows',$consDesc,'tier1'),
    @('exterior-insulation','Exterior Insulation Calculator','Calculate exterior insulation board for walls and foundations',$consDesc,'tier2'),
    @('deck-composite','Composite Deck Calculator','Calculate composite deck boards and hidden fasteners for decking projects',$consDesc,'tier2'),
    @('deck-wood','Wood Deck Calculator','Calculate pressure-treated wood deck boards and framing lumber',$consDesc,'tier2'),
    @('deck-railing','Deck Railing Calculator','Calculate deck railing sections balusters and post requirements',$consDesc,'tier1'),
    @('deck-stairs','Deck Stairs Calculator','Calculate deck stair stringers treads and riser dimensions',$consDesc,'tier1'),
    @('fence-chain-link','Chain Link Fence Calculator','Calculate chain link fence panels posts and tension wire for fencing',$consDesc,'tier1'),
    @('fence-wood','Wood Fence Calculator','Calculate wood fence pickets rails and posts for privacy fencing',$consDesc,'tier2'),
    @('fence-vinyl','Vinyl Fence Calculator','Calculate vinyl fence panels and posts for PVC fencing systems',$consDesc,'tier1'),
    @('fence-wrought-iron','Wrought Iron Fence Calculator','Calculate wrought iron fence sections and gate dimensions for decorative fencing',$consDesc,'tier1'),
    @('gate-calculator','Gate Calculator','Calculate gate dimensions for driveways walkways and entrances',$consDesc,'tier1'),
    @('driveway-asphalt','Asphalt Driveway Calculator','Calculate asphalt tonnage and base material for driveway paving',$consDesc,'tier2'),
    @('driveway-concrete','Concrete Driveway Calculator','Calculate concrete volume and reinforcement for driveway slabs',$consDesc,'tier2'),
    @('driveway-gravel','Gravel Driveway Calculator','Calculate gravel depth and tonnage for unpaved driveway surfaces',$consDesc,'tier1'),
    @('patio-concrete','Concrete Patio Calculator','Calculate concrete patio slab volume and finishing requirements',$consDesc,'tier1'),
    @('patio-stone','Stone Patio Calculator','Calculate patio stone and paver quantities for natural stone patios',$consDesc,'tier1'),
    @('walkway-calculator','Walkway Calculator','Calculate walkway pavers base material and edging for garden paths',$consDesc,'tier1'),
    @('steps-concrete','Concrete Step Calculator','Calculate concrete volume for porch and entry steps',$consDesc,'tier1'),
    @('steps-stone','Stone Step Calculator','Calculate natural stone tread quantity for landscape steps',$consDesc,'tier1'),
    @('retaining-wall-block','Retaining Wall Block Calculator','Calculate retaining wall blocks caps and drainage aggregate',$consDesc,'tier2'),
    @('mulch-calculator','Mulch Calculator','Calculate mulch volume for garden beds and landscape areas',$consDesc,'tier1'),
    @('seed-calculator','Grass Seed Calculator','Calculate grass seed pounds for lawn overseeding and new lawns',$consDesc,'tier1'),
    @('hydroseed','Hydroseed Calculator','Calculate hydroseed mix quantities for erosion control and lawn establishment',$consDesc,'tier1'),
    @('irrigation-sprinkler','Sprinkler System Calculator','Calculate sprinkler head spacing and coverage for lawn irrigation',$consDesc,'tier2'),
    @('irrigation-drip','Drip Irrigation Calculator','Calculate drip line length and emitter spacing for garden irrigation',$consDesc,'tier1'),
    @('drainage-french','French Drain Calculator','Calculate French drain pipe gravel and fabric for yard drainage',$consDesc,'tier1'),
    @('drainage-surface','Surface Drain Calculator','Calculate surface drain grate size and trench dimensions',$consDesc,'tier1'),
    @('grading-calculator','Grading Calculator','Calculate grading slope and cut-fill volumes for site preparation',$consDesc,'tier2'),
    @('excavation','Excavation Calculator','Calculate excavation volume and soil removal for foundations',$consDesc,'tier2'),
    @('backfill','Backfill Calculator','Calculate backfill volume and compaction requirements for trenches',$consDesc,'tier1'),
    @('compaction','Compaction Calculator','Calculate soil compaction test frequency and density requirements',$consDesc,'tier1'),
    @('soil-amendment','Soil Amendment Calculator','Calculate soil amendment quantities for garden bed improvement',$consDesc,'tier1'),
    @('landscape-fabric','Landscape Fabric Calculator','Calculate landscape fabric coverage for weed barrier installation',$consDesc,'tier1'),
    @('hvac-duct','HVAC Duct Calculator','Calculate HVAC duct size for heating and cooling air distribution',$consDesc,'tier2'),
    @('hvac-vent','HVAC Vent Calculator','Calculate HVAC vent grill size and airflow requirements',$consDesc,'tier1'),
    @('hvac-filter','HVAC Filter Calculator','Calculate HVAC filter size and MERV rating for air quality',$consDesc,'tier1'),
    @('furnace-size','Furnace Size Calculator','Calculate furnace BTU output for home heating requirements',$consDesc,'tier2'),
    @('ac-size','AC Size Calculator','Calculate air conditioner tonnage for home cooling requirements',$consDesc,'tier2'),
    @('heat-pump-size','Heat Pump Size Calculator','Calculate heat pump capacity for heating and cooling needs',$consDesc,'tier2'),
    @('boiler-size','Boiler Size Calculator','Calculate boiler BTU output for hot water heating systems',$consDesc,'tier2'),
    @('water-heater-size','Water Heater Size Calculator','Calculate water heater gallon capacity for household hot water demand',$consDesc,'tier1')
)

foreach ($item in $consSlugs) {
    $entry = Add-If-New $item[0] {
        $t = $item[1]; $d = $item[2]; $template = $item[3]; $tier = $item[4]
        New-Entry $item[0] $t "$d $template" 'construction' $tier 'construction-calculators' 'Construction Calculators' @($item[0], 'construction', 'contractor', 'build estimate', 'DIY', 'home improvement', 'contractor tool', 'remodeling')
    }
    if ($entry) { $construction += $entry }
}

$statistics = @()
$statSlugs = @(
    @('frequency-distribution','Frequency Distribution Calculator','Calculate frequency distribution tables from raw dataset values',$statDesc,'tier2'),
    @('grouped-frequency','Grouped Frequency Calculator','Calculate grouped frequency distribution for continuous data sets',$statDesc,'tier2'),
    @('cumulative-frequency','Cumulative Frequency Calculator','Calculate cumulative frequency and cumulative percentage distributions',$statDesc,'tier1'),
    @('relative-frequency','Relative Frequency Calculator','Calculate relative frequency and percentage distributions for data',$statDesc,'tier1'),
    @('cross-tabulation','Cross Tabulation Calculator','Calculate cross tabulation tables for categorical data analysis',$statDesc,'tier2'),
    @('contingency-table','Contingency Table Calculator','Calculate contingency table expected values and chi-square contribution',$statDesc,'tier2'),
    @('ordinal-measures','Ordinal Measures Calculator','Calculate measures of central tendency for ordinal data',$statDesc,'tier2'),
    @('nominal-measures','Nominal Measures Calculator','Calculate mode and frequency distributions for nominal data',$statDesc,'tier1'),
    @('ratio-measures','Ratio Measures Calculator','Calculate ratio scale descriptive statistics with geometric mean',$statDesc,'tier2'),
    @('interval-measures','Interval Measures Calculator','Calculate interval scale descriptive statistics from continuous data',$statDesc,'tier1'),
    @('central-tendency','Central Tendency Calculator','Calculate mean median and mode for grouped and ungrouped data sets',$statDesc,'tier2'),
    @('dispersion','Dispersion Calculator','Calculate range variance standard deviation and coefficient of variation',$statDesc,'tier2'),
    @('anova-repeated','Repeated Measures ANOVA Calculator','Calculate repeated measures ANOVA for within-subject experimental designs',$statDesc,'tier3'),
    @('manova','MANOVA Calculator','Calculate multivariate analysis of variance for multiple dependent variables',$statDesc,'tier3'),
    @('chi-square-homogeneity','Chi-Square Homogeneity Calculator','Calculate chi-square test for homogeneity across multiple populations',$statDesc,'tier2'),
    @('cochran-q','Cochran Q Calculator','Calculate Cochran Q test for k-related dichotomous variables',$statDesc,'tier2'),
    @('covariance-calculator','Covariance Calculator','Calculate covariance between two variables for association measurement',$statDesc,'tier1'),
    @('correlation-spearman','Spearman Correlation Calculator','Calculate Spearman rank correlation coefficient for ordinal data',$statDesc,'tier2'),
    @('correlation-kendall','Kendall Tau Correlation Calculator','Calculate Kendall tau rank correlation coefficient for ordinal data',$statDesc,'tier2'),
    @('regression-stepwise','Stepwise Regression Calculator','Calculate stepwise regression variable selection for predictive models',$statDesc,'tier3'),
    @('regression-ridge','Ridge Regression Calculator','Calculate ridge regression coefficients with L2 regularization penalty',$statDesc,'tier3'),
    @('regression-lasso','Lasso Regression Calculator','Calculate lasso regression coefficients with L1 regularization penalty',$statDesc,'tier3'),
    @('regression-elastic-net','Elastic Net Regression Calculator','Calculate elastic net regression coefficients with L1 and L2 penalties',$statDesc,'tier3'),
    @('partial-correlation','Partial Correlation Calculator','Calculate partial correlation controlling for third variable effects',$statDesc,'tier2'),
    @('semi-partial','Semi-Partial Correlation Calculator','Calculate semi-partial correlation for unique variance contribution',$statDesc,'tier2'),
    @('canonical-correlation','Canonical Correlation Calculator','Calculate canonical correlation between two sets of variables',$statDesc,'tier3'),
    @('time-series-moving-average','Moving Average Time Series Calculator','Calculate simple and weighted moving averages for time series smoothing',$statDesc,'tier2'),
    @('time-series-exponential-smoothing','Exponential Smoothing Calculator','Calculate exponential smoothing forecasts with alpha parameter optimization',$statDesc,'tier2'),
    @('time-series-arima','ARIMA Calculator','Calculate ARIMA model parameters for time series forecasting',$statDesc,'tier3'),
    @('time-series-decomposition','Time Series Decomposition Calculator','Calculate seasonal trend and residual components from time series data',$statDesc,'tier3'),
    @('forecasting-linear','Linear Forecasting Calculator','Calculate linear trend forecasts for time series data extrapolation',$statDesc,'tier2'),
    @('forecasting-exponential','Exponential Forecasting Calculator','Calculate exponential growth forecasts for time series projections',$statDesc,'tier2'),
    @('forecasting-seasonal','Seasonal Forecasting Calculator','Calculate seasonal forecasting with trend and seasonal index adjustments',$statDesc,'tier3'),
    @('holt-winters','Holt-Winters Calculator','Calculate Holt-Winters exponential smoothing forecasts with seasonality',$statDesc,'tier3'),
    @('power-analysis','Power Analysis Calculator','Calculate statistical power and required sample size for hypothesis tests',$statDesc,'tier2'),
    @('effect-size-cohens-d','Cohens d Calculator','Calculate Cohen d effect size for independent group comparisons',$statDesc,'tier2'),
    @('effect-size-etasq','Eta-Squared Calculator','Calculate eta-squared and partial eta-squared effect size from ANOVA',$statDesc,'tier2'),
    @('bayes-factor','Bayes Factor Calculator','Calculate Bayes factor for comparing competing statistical models',$statDesc,'tier3'),
    @('jackknife','Jackknife Resampling Calculator','Calculate jackknife estimates for bias reduction in statistical estimators',$statDesc,'tier2'),
    @('permutation-test','Permutation Test Calculator','Calculate permutation test p-values for nonparametric hypothesis testing',$statDesc,'tier2'),
    @('randomization-test','Randomization Test Calculator','Calculate randomization test statistics for experimental design analysis',$statDesc,'tier2'),
    @('roc-curve','ROC Curve Calculator','Calculate ROC curve sensitivity specificity and area under curve',$statDesc,'tier2'),
    @('auc-calculator','AUC Calculator','Calculate area under the ROC curve for diagnostic test accuracy',$statDesc,'tier2')
)

foreach ($item in $statSlugs) {
    $entry = Add-If-New $item[0] {
        New-Entry $item[0] $item[1] "$($item[2]) $($item[3])" 'statistics' $item[4] 'statistics-calculators' 'Statistics Calculators' @($item[0], 'statistics', 'data analysis', 'stats', 'statistical analysis', 'data science', 'probability')
    }
    if ($entry) { $statistics += $entry }
}

$physics = @()
$physSlugs = @(
    @('kinematics-1d','Kinematics 1D Calculator','Calculate one-dimensional kinematic motion with constant acceleration equations',$physDesc,'tier2'),
    @('kinematics-2d','Kinematics 2D Calculator','Calculate two-dimensional kinematic motion with vector components',$physDesc,'tier2'),
    @('spring-mass','Spring-Mass System Calculator','Calculate spring-mass system oscillation frequency and period',$physDesc,'tier2'),
    @('damping-calculator','Damping Calculator','Calculate damping ratio and damped oscillation for mechanical systems',$physDesc,'tier2'),
    @('resonance-calculator','Resonance Calculator','Calculate resonance frequency and amplitude for driven oscillators',$physDesc,'tier2'),
    @('moment-of-inertia','Moment of Inertia Calculator','Calculate moment of inertia for common geometric shapes and objects',$physDesc,'tier2'),
    @('wave-frequency','Wave Frequency Calculator','Calculate wave frequency from wave speed and wavelength',$physDesc,'tier1'),
    @('wave-period','Wave Period Calculator','Calculate wave period from frequency for periodic wave motion',$physDesc,'tier1'),
    @('interference','Wave Interference Calculator','Calculate constructive and destructive interference patterns from two sources',$physDesc,'tier2'),
    @('diffraction','Diffraction Calculator','Calculate single-slit and double-slit diffraction minima and maxima angles',$physDesc,'tier2'),
    @('reflection','Reflection Calculator','Calculate angle of reflection for mirrors and reflective surfaces',$physDesc,'tier1'),
    @('refraction','Refraction Calculator','Calculate refraction angle using Snell law for different media',$physDesc,'tier1'),
    @('lens-equation','Lens Equation Calculator','Calculate image position and magnification using thin lens equation',$physDesc,'tier2'),
    @('electric-potential','Electric Potential Calculator','Calculate electric potential and voltage from point charges',$physDesc,'tier2'),
    @('capacitance-calculator','Capacitance Calculator','Calculate capacitance for parallel plate and cylindrical capacitor geometries',$physDesc,'tier2'),
    @('rc-circuit','RC Circuit Calculator','Calculate RC circuit charging and discharging time constant and voltage',$physDesc,'tier2'),
    @('rl-circuit','RL Circuit Calculator','Calculate RL circuit current growth and decay time constant',$physDesc,'tier2'),
    @('magnetic-field','Magnetic Field Calculator','Calculate magnetic field from current-carrying wires and solenoids',$physDesc,'tier2'),
    @('faraday-induction','Faraday Induction Calculator','Calculate induced EMF from changing magnetic flux using Faraday law',$physDesc,'tier2'),
    @('lenz-law','Lenz Law Calculator','Calculate induced current direction using Lenz law for electromagnetic induction',$physDesc,'tier2'),
    @('inductance-calculator','Inductance Calculator','Calculate solenoid inductance from coil dimensions and core material',$physDesc,'tier2'),
    @('ac-circuit','AC Circuit Calculator','Calculate AC circuit impedance phase angle and power factor',$physDesc,'tier2'),
    @('latent-heat','Latent Heat Calculator','Calculate latent heat energy for phase change processes',$physDesc,'tier2'),
    @('thermal-expansion','Thermal Expansion Calculator','Calculate linear area and volumetric thermal expansion from temperature change',$physDesc,'tier2'),
    @('van-der-waals','Van der Waals Calculator','Calculate real gas properties using van der Waals equation of state',$physDesc,'tier2'),
    @('combined-gas-law','Combined Gas Law Calculator','Calculate gas properties using combined gas law P1V1T2 equals P2V2T1',$physDesc,'tier1')
)

foreach ($item in $physSlugs) {
    $entry = Add-If-New $item[0] {
        New-Entry $item[0] $item[1] "$($item[2]) $($item[3])" 'physics' $item[4] 'physics-calculators' 'Physics Calculators' @($item[0], 'physics', 'science', 'STEM', 'physics solver', 'scientific calculator', 'mechanics')
    }
    if ($entry) { $physics += $entry }
}

$chemistry = @()
$chemSlugs = @(
    @('atom-economy','Atom Economy Calculator','Calculate atom economy for assessing chemical reaction efficiency',$chemDesc,'tier2'),
    @('pka-pkb-calculator','pKa pKb Calculator','Calculate pKa and pKb from acid and base dissociation constants',$chemDesc,'tier1'),
    @('equivalence-point','Equivalence Point Calculator','Calculate equivalence point volume for acid-base titration analysis',$chemDesc,'tier2'),
    @('spectroscopy-beer-lambert','Beer-Lambert Calculator','Calculate concentration using Beer-Lambert law from absorbance data',$chemDesc,'tier2'),
    @('chromatography-rf','Chromatography Rf Calculator','Calculate retention factor for chromatography separation analysis',$chemDesc,'tier1'),
    @('retention-factor','Retention Factor Calculator','Calculate retention factor for analytical chromatography methods',$chemDesc,'tier1'),
    @('distillation-calc','Distillation Calculator','Calculate distillation column parameters and vapor-liquid equilibrium',$chemDesc,'tier2'),
    @('extraction-efficiency','Extraction Efficiency Calculator','Calculate liquid-liquid extraction efficiency and partition coefficient',$chemDesc,'tier2'),
    @('recrystallization','Recrystallization Calculator','Calculate recrystallization yield and solvent requirements for purification',$chemDesc,'tier2')
)

foreach ($item in $chemSlugs) {
    $entry = Add-If-New $item[0] {
        New-Entry $item[0] $item[1] "$($item[2]) $($item[3])" 'chemistry' $item[4] 'chemistry-calculators' 'Chemistry Calculators' @($item[0], 'chemistry', 'science', 'STEM', 'lab tool', 'chemical', 'reaction')
    }
    if ($entry) { $chemistry += $entry }
}

$everyday = @()
$everySlugs = @(
    @('travel-budget','Travel Budget Calculator','Calculate trip budget including transportation accommodation food and activities',$everyDesc,'tier1'),
    @('packing-list','Packing List Calculator','Calculate luggage volume and packing quantities for travel and trips',$everyDesc,'tier1'),
    @('flight-carbon','Flight Carbon Calculator','Calculate carbon footprint for flights based on distance and class',$everyDesc,'tier1'),
    @('hotel-cost','Hotel Cost Calculator','Calculate hotel stay cost including taxes fees and nightly rates',$everyDesc,'tier1'),
    @('currency-travel','Travel Currency Calculator','Convert travel money between currencies at live exchange rates',$everyDesc,'tier1'),
    @('weather-comparison','Weather Comparison Calculator','Compare weather conditions between cities for travel planning',$everyDesc,'tier1'),
    @('luggage-size','Luggage Size Calculator','Calculate luggage dimensions and volume for airline carry-on compliance',$everyDesc,'tier1'),
    @('travel-time','Travel Time Calculator','Calculate total travel time including layovers and transfers',$everyDesc,'tier1'),
    @('toll-calculator','Toll Calculator','Calculate toll road costs for road trips and daily commutes',$everyDesc,'tier1'),
    @('parking-cost','Parking Cost Calculator','Calculate parking fees for airports garages and city parking',$everyDesc,'tier1'),
    @('rental-car-calculator','Rental Car Calculator','Calculate rental car cost including insurance fees and mileage charges',$everyDesc,'tier1'),
    @('taxi-fare','Taxi Fare Calculator','Calculate taxi and rideshare fares for city transportation',$everyDesc,'tier1'),
    @('decluttering-calculator','Decluttering Calculator','Calculate decluttering progress for home organization projects',$everyDesc,'tier1'),
    @('home-inventory','Home Inventory Calculator','Calculate home inventory value for insurance and organization purposes',$everyDesc,'tier1'),
    @('moving-checklist','Moving Checklist Calculator','Calculate moving timeline and task completion for relocation planning',$everyDesc,'tier1'),
    @('apartment-search','Apartment Search Calculator','Calculate apartment search budget for rent utilities and deposits',$everyDesc,'tier1'),
    @('room-size-calculator','Room Size Calculator','Calculate room square footage for furniture layout and space planning',$everyDesc,'tier1'),
    @('curtain-size','Curtain Size Calculator','Calculate curtain panel width and drop for window treatments',$everyDesc,'tier1'),
    @('rug-size','Rug Size Calculator','Calculate rug dimensions for living room dining room and bedroom layouts',$everyDesc,'tier1'),
    @('furniture-layout','Furniture Layout Calculator','Calculate furniture arrangement spacing and traffic flow for rooms',$everyDesc,'tier1'),
    @('declutter-konmari','KonMari Decluttering Calculator','Calculate decluttering progress using KonMari method by category',$everyDesc,'tier1'),
    @('home-organization','Home Organization Calculator','Calculate closet pantry and garage organization system requirements',$everyDesc,'tier1'),
    @('storage-needs','Storage Calculator','Calculate storage unit size for household items during moving or renovation',$everyDesc,'tier1'),
    @('closet-organizer','Closet Organizer Calculator','Calculate closet shelving rod and drawer configurations for organized storage',$everyDesc,'tier1'),
    @('garage-organizer','Garage Organizer Calculator','Calculate garage storage wall systems and overhead shelves for organization',$everyDesc,'tier1'),
    @('shed-organizer','Shed Organizer Calculator','Calculate shed storage racks hooks and shelves for tool organization',$everyDesc,'tier1'),
    @('workshop-layout','Workshop Layout Calculator','Calculate workshop bench tool storage and aisle space for efficient layout',$everyDesc,'tier1'),
    @('pet-vaccination','Pet Vaccination Calculator','Calculate pet vaccination schedule and booster timing for dogs and cats',$everyDesc,'tier1'),
    @('pet-microchip','Pet Microchip Calculator','Calculate pet microchip registration and recovery information tracking',$everyDesc,'tier1'),
    @('pet-grooming','Pet Grooming Calculator','Calculate pet grooming schedule and service costs for dogs and cats',$everyDesc,'tier1'),
    @('pet-sitting','Pet Sitting Calculator','Calculate pet sitting costs and duration for travel pet care',$everyDesc,'tier1'),
    @('pet-boarding','Pet Boarding Calculator','Calculate pet boarding costs and duration for kennel and pet hotel stays',$everyDesc,'tier1'),
    @('dog-walking','Dog Walking Calculator','Calculate dog walking distance duration and calorie burn estimates',$everyDesc,'tier1'),
    @('dog-training','Dog Training Calculator','Calculate dog training schedule and progress tracking for obedience classes',$everyDesc,'tier1'),
    @('cat-tree','Cat Tree Calculator','Calculate cat tree size and platform configuration for indoor cats',$everyDesc,'tier1'),
    @('aquarium-size','Aquarium Size Calculator','Calculate aquarium volume and fish stocking levels for home aquariums',$everyDesc,'tier1'),
    @('raised-bed','Raised Garden Bed Calculator','Calculate raised bed lumber and soil requirements for vegetable gardening',$everyDesc,'tier1'),
    @('container-garden','Container Garden Calculator','Calculate pot size and soil volume for container vegetable gardening',$everyDesc,'tier1'),
    @('vertical-garden','Vertical Garden Calculator','Calculate vertical garden panel size and plant pocket spacing',$everyDesc,'tier1'),
    @('seed-starting','Seed Starting Calculator','Calculate seed starting schedule and indoor seed germination requirements',$everyDesc,'tier1'),
    @('transplanting','Transplanting Calculator','Calculate transplant timing and spacing for garden seedling placement',$everyDesc,'tier1'),
    @('crop-rotation','Crop Rotation Calculator','Calculate crop rotation plan for 4-year garden bed rotation cycles',$everyDesc,'tier1'),
    @('companion-planting','Companion Planting Calculator','Calculate companion planting combinations for vegetable garden compatibility',$everyDesc,'tier1'),
    @('trellis-calculator','Trellis Calculator','Calculate trellis dimensions and support spacing for climbing vegetables',$everyDesc,'tier1'),
    @('herb-garden','Herb Garden Calculator','Calculate herb garden layout and plant spacing for culinary herbs',$everyDesc,'tier1'),
    @('indoor-herbs','Indoor Herb Calculator','Calculate indoor herb garden pot size and lighting requirements',$everyDesc,'tier1'),
    @('microgreens','Microgreens Calculator','Calculate microgreens tray size and seed density for indoor growing',$everyDesc,'tier1'),
    @('worm-bin','Worm Bin Calculator','Calculate worm bin size and bedding requirements for vermicomposting',$everyDesc,'tier1'),
    @('cold-frame','Cold Frame Calculator','Calculate cold frame dimensions for season extension in gardening',$everyDesc,'tier1'),
    @('greenhouse-size','Greenhouse Size Calculator','Calculate greenhouse dimensions and glazing for year-round growing',$everyDesc,'tier1')
)

foreach ($item in $everySlugs) {
    $entry = Add-If-New $item[0] {
        New-Entry $item[0] $item[1] "$($item[2]) $($item[3])" 'everyday' $item[4] 'everyday-calculators' 'Everyday and Conversion Calculators' @($item[0], 'daily life', 'practical', 'household', 'lifestyle', 'quick calculator', 'useful tool')
    }
    if ($entry) { $everyday += $entry }
}

$math = @()
$mathSlugs = @(
    @('algebra-linear','Linear Algebra Calculator','Calculate linear equations slope and intercept from algebraic expressions',$mathDesc,'tier1'),
    @('algebra-quadratic','Quadratic Algebra Calculator','Calculate quadratic equation roots using quadratic formula and factoring',$mathDesc,'tier2'),
    @('algebra-cubic','Cubic Algebra Calculator','Calculate cubic equation roots using rational root theorem and factoring',$mathDesc,'tier2'),
    @('algebra-polynomial','Polynomial Algebra Calculator','Calculate polynomial degree and leading coefficient for algebraic expressions',$mathDesc,'tier2'),
    @('algebra-rational','Rational Algebra Calculator','Calculate rational expression simplification and partial fraction decomposition',$mathDesc,'tier2'),
    @('geometry-triangle','Triangle Geometry Calculator','Calculate triangle area angles and side lengths from given measurements',$mathDesc,'tier2'),
    @('geometry-circle','Circle Geometry Calculator','Calculate circle circumference area radius and arc measurements',$mathDesc,'tier1'),
    @('geometry-polygon','Polygon Geometry Calculator','Calculate regular polygon area perimeter and interior angles by side count',$mathDesc,'tier2'),
    @('geometry-ellipse','Ellipse Geometry Calculator','Calculate ellipse area circumference and focal point properties',$mathDesc,'tier2'),
    @('geometry-torus','Torus Geometry Calculator','Calculate torus volume surface area and cross-section properties',$mathDesc,'tier2'),
    @('trigonometry-law-of-sines','Law of Sines Calculator','Calculate triangle sides and angles using the law of sines formula',$mathDesc,'tier2'),
    @('trigonometry-law-of-cosines','Law of Cosines Calculator','Calculate triangle sides and angles using the law of cosines formula',$mathDesc,'tier2'),
    @('trig-identities','Trigonometric Identities Calculator','Calculate and verify trigonometric identity transformations step by step',$mathDesc,'tier2'),
    @('trig-graphs','Trigonometric Graphs Calculator','Calculate trigonometric function graphs amplitude period and phase shift',$mathDesc,'tier2'),
    @('inverse-trig','Inverse Trigonometry Calculator','Calculate inverse trigonometric functions arcsin arccos and arctan values',$mathDesc,'tier2'),
    @('calculus-gradient','Gradient Calculator','Calculate gradient vector of multivariable functions for calculus analysis',$mathDesc,'tier3'),
    @('calculus-curl','Curl Calculator','Calculate curl of vector fields for multivariable calculus analysis',$mathDesc,'tier3'),
    @('calculus-divergence','Divergence Calculator','Calculate divergence of vector fields for multivariable calculus analysis',$mathDesc,'tier3'),
    @('calculus-laplacian','Laplacian Calculator','Calculate Laplacian operator for scalar and vector fields in calculus',$mathDesc,'tier3'),
    @('vector-calculus','Vector Calculus Calculator','Calculate vector operations including dot product cross product and magnitude',$mathDesc,'tier2')
)

foreach ($item in $mathSlugs) {
    $entry = Add-If-New $item[0] {
        New-Entry $item[0] $item[1] "$($item[2]) $($item[3])" 'math' $item[4] 'math-calculators' 'Math Calculators' @($item[0], 'math', 'math solver', 'mathematics', 'algebra', 'geometry', 'calculus help')
    }
    if ($entry) { $math += $entry }
}

Write-Host "`n=== NEW ENTRIES TO ADD ==="
Write-Host "Construction: $($construction.Count)"
Write-Host "Statistics: $($statistics.Count)"
Write-Host "Physics: $($physics.Count)"
Write-Host "Chemistry: $($chemistry.Count)"
Write-Host "Everyday: $($everyday.Count)"
Write-Host "Math: $($math.Count)"
$totalNew = $construction.Count + $statistics.Count + $physics.Count + $chemistry.Count + $everyday.Count + $math.Count
Write-Host "Total new: $totalNew"

function Build-InsertBlock {
    param($entries)
    if ($entries.Count -eq 0) { return "" }
    return "`r`n" + ($entries -join "`r`n") + "`r`n"
}

$regPart1aBlock = ""
$regPart1aBlock += Build-InsertBlock $construction
$regPart1aBlock += Build-InsertBlock $statistics
$regPart1aBlock += Build-InsertBlock $physics
$regPart1aBlock += Build-InsertBlock $chemistry

$regPart1bBlock = ""
$regPart1bBlock += Build-InsertBlock $everyday
$regPart1bBlock += Build-InsertBlock $math

if ($regPart1aBlock -ne "") {
    $pattern = "  { slug: 'nail-calculator'"
    $idx = $content.IndexOf($pattern)
    if ($idx -ge 0) {
        $lineEnd = $content.IndexOf("`r`n", $idx)
        if ($lineEnd -eq -1) { $lineEnd = $content.IndexOf("`n", $idx) }
        $beforeInsert = $content.Substring(0, $lineEnd + 2)
        $afterInsert = $content.Substring($lineEnd + 2)
        $content = $beforeInsert + $regPart1aBlock + $afterInsert
        Write-Host "Inserted into regPart1a"
    } else {
        Write-Warning "Could not find insertion point in regPart1a"
    }
}

if ($regPart1bBlock -ne "") {
    $pattern = "  { slug: 'beer-calculator'"
    $idx = $content.IndexOf($pattern)
    if ($idx -ge 0) {
        $lineEnd = $content.IndexOf("`r`n", $idx)
        if ($lineEnd -eq -1) { $lineEnd = $content.IndexOf("`n", $idx) }
        $beforeInsert = $content.Substring(0, $lineEnd + 2)
        $afterInsert = $content.Substring($lineEnd + 2)
        $content = $beforeInsert + $regPart1bBlock + $afterInsert
        Write-Host "Inserted into regPart1b"
    } else {
        Write-Warning "Could not find insertion point in regPart1b"
    }
}

# hub count updates
$countUpdates = @{}
if ($construction.Count -gt 0) { $countUpdates['construction'] = 75 + $construction.Count }
if ($statistics.Count -gt 0) { $countUpdates['statistics'] = 52 + $statistics.Count }
if ($physics.Count -gt 0) { $countUpdates['physics'] = 50 + $physics.Count }
if ($chemistry.Count -gt 0) { $countUpdates['chemistry'] = 50 + $chemistry.Count }
if ($everyday.Count -gt 0) { $countUpdates['everyday'] = 174 + $everyday.Count }
if ($math.Count -gt 0) { $countUpdates['math'] = 300 + $math.Count }

foreach ($slug in $countUpdates.Keys) {
    $pattern = "(slug: '$slug'.*?calculatorCount: )\d+"
    $replacement = "`${1}$($countUpdates[$slug])"
    $content = $content -replace $pattern, $replacement
}

$content | Set-Content -LiteralPath $FilePath -NoNewline

Write-Host "`n=== DONE ==="
Write-Host "File written to $FilePath"

$finalCount = (Select-String -Path $FilePath -Pattern "slug: '" | Measure-Object).Count
Write-Host "Total slugs in file: $finalCount"
Write-Host "Expected increase: $totalNew"
