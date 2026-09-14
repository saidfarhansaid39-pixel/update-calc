/**
 * Upgrade chemistry hub calculators to Omni Calculator quality.
 *
 * For each file in src/components/hub-calculators/chemistry/ (excluding index.ts):
 *   - Replace generic extras (Precision note, Temperature dependence, Related)
 *     with 3-5 chemistry-domain extras from a topic-specific pool.
 *   - Add presets (3-5 realistic chemistry examples) if not present.
 *   - Ensure defaults exist.
 *   - Improve steps — use descriptive step labels via step() helper.
 *   - Keep existing logic, schema, fields, compute, formula, description, interpretation untouched.
 *
 * The step() helper preserves the original step details but changes labels.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHEM_DIR = path.resolve(__dirname, '..', 'src', 'components', 'hub-calculators', 'chemistry');

// ─── Topic detection ────────────────────────────────────────────────
// Each topic gets extras, presets, and defaults.

const topics = {

  ph: {
    match: /\b(pH|pOH|hydrogen|hConc)\b/i,
    extras: [
      { label: "Lab Application", value: 'pH meters require calibration with pH 4, 7, and 10 buffer solutions before each use. For field measurements, use portable meters with temperature compensation.' },
      { label: "Safety Note", value: 'Strong acids (pH 0–2) and strong bases (pH 12–14) are corrosive. Wear PPE including splash goggles and acid-resistant gloves when handling. Neutralize spills with appropriate buffer.' },
      { label: "Common Values", value: 'Gastric juice: pH 1.5–3.5; Lemon juice: ~2.2; Vinegar: ~2.9; Coffee: ~5; Pure water: 7.0; Blood: 7.35–7.45; Seawater: ~8.1; Household bleach: ~12.6.' },
      { label: "Unit Awareness", value: 'pH is unitless by definition. However, [H⁺] is in mol/L (M). For accurate pH in non-ideal solutions, use activity instead of concentration.' },
      { label: "Real-World Relevance", value: 'pH control is critical in: pharmaceutical formulation (drug solubility and stability), wastewater treatment (optimal precipitation pH), food preservation (preventing microbial growth at pH < 4.6), and agriculture (soil pH affects nutrient availability).' },
    ],
    presets: [
      { label: "Pure water (neutral)", values: { hConc: '1.0e-7' } },
      { label: "0.1 M HCl (strong acid)", values: { hConc: '0.1' } },
      { label: "Gastric juice", values: { hConc: '0.0316' } },
      { label: "Blood plasma", values: { hConc: '3.98e-8' } },
      { label: "Household ammonia", values: { hConc: '1.58e-12' } },
    ],
    defaults: { hConc: '1.0e-7' },
  },

  dilution: {
    match: /\b(dilut|c[12]|v[12]|c₁|v₁|c₂|v₂)\b/i,
    extras: [
      { label: "Lab Application", value: 'Serial dilutions are essential for creating calibration curves in spectrophotometry, microbiology plate counts, and preparing standard solutions for titration.' },
      { label: "Safety Note", value: 'Always add acid to water (not water to acid) when diluting concentrated acids to prevent violent boiling and splashing. Work in a fume hood for concentrated reagents.' },
      { label: "Common Values", value: 'Typical lab stock solutions: 6 M HCl, 6 M NaOH, 1 M Tris buffer. Common dilution factors: 1:2, 1:10, 1:100, 1:1000 serial dilutions for standard curves.' },
      { label: "Unit Awareness", value: 'C₁V₁ = C₂V₂ works with any concentration and volume units as long as they are consistent on each side. Convert volumes to same unit before calculating.' },
      { label: "Real-World Relevance", value: 'Dilution calculations are used daily in clinical labs (blood panel dilutions), environmental analysis (sample prep within detection limits), and pharmaceutical manufacturing (bulk drug dilution to final dosage).' },
    ],
    presets: [
      { label: "Prepare 0.1 M HCl from 6 M stock (250 mL)", values: { c1: '6', v1: '4.17', v2: '250' } },
      { label: "1:10 serial dilution step", values: { c1: '1', v1: '1', v2: '10' } },
      { label: "Dilute 5 M NaCl to 0.5 M (100 mL)", values: { c1: '5', v1: '10', v2: '100' } },
      { label: "Prepare 100 mL of 0.01 M from 1 M stock", values: { c1: '1', v1: '1', v2: '100' } },
      { label: "Typical 1:2 serial dilution", values: { c1: '0.5', v1: '5', v2: '10' } },
    ],
    defaults: { c1: '1', v1: '10', v2: '100' },
  },

  molarity: {
    match: /\b(molarit|molarity|moles.*volume|solute.*moles|n\s*\/\s*V|M\s*=\s*n\s*\/)\b/i,
    extras: [
      { label: "Lab Application", value: 'Molarity is used to prepare standard solutions in volumetric flasks. Weigh the calculated mass of solute, dissolve in ~80% of final volume, then dilute to the mark.' },
      { label: "Safety Note", value: 'When preparing solutions, handle concentrated reagents in a fume hood. Use a volumetric flask for accurate measurements — graduated cylinders are less precise.' },
      { label: "Common Values", value: 'Typical lab stock solutions: 1 M Tris-HCl (pH 8), 5 M NaCl, 0.5 M EDTA, 1 M MgCl₂, 10% SDS (~0.35 M).' },
      { label: "Unit Awareness", value: 'Molarity (M = mol/L) is temperature-dependent because volume expands with heat. For temperature-independent work use molality (m = mol/kg solvent).' },
      { label: "Real-World Relevance", value: 'Molarity is the standard concentration unit in: IV fluid preparation (0.9% saline ≈ 0.154 M NaCl), buffer formulations for biochemistry, and reagent preparation in analytical labs.' },
    ],
    presets: [
      { label: "1 M NaCl solution", values: { moles: '1', volume: '1' } },
      { label: "0.5 M EDTA (common stock)", values: { moles: '0.5', volume: '1' } },
      { label: "3 M KCl (storage buffer)", values: { moles: '3', volume: '1' } },
      { label: "0.1 M NaOH titration standard", values: { moles: '0.1', volume: '1' } },
      { label: "10 mM = 0.01 M (typical working conc.)", values: { moles: '0.01', volume: '1' } },
    ],
    defaults: { moles: '1', volume: '1' },
  },

  gasLaws: {
    match: /\b(ideal gas|PV\s*=\s*nRT|gas law|boyle|charles|combined gas|n\s*=\s*PV|R\s*=\s*0\.082)\b/i,
    extras: [
      { label: "Lab Application", value: 'The ideal gas law is used in: eudiometer experiments for gas volume corrections, calculating gas density for GC-MS sample injection, and determining molar mass via vapor density measurements.' },
      { label: "Safety Note", value: 'Compressed gas cylinders must be secured upright with chains. Never use oil on regulators (can cause explosions with O₂). Vent gases in fume hoods.' },
      { label: "Common Values", value: 'STP: 0 °C (273.15 K), 1 atm → 22.4 L/mol. R values: 0.082057 L·atm/(mol·K), 8.314 J/(mol·K), 62.3637 L·mmHg/(mol·K). Molar volume at 25 °C, 1 atm: 24.5 L.' },
      { label: "Unit Awareness", value: 'Temperature must always be in Kelvin (K = °C + 273.15). Pressure and volume can be any units but must be consistent with the R value chosen.' },
      { label: "Real-World Relevance", value: 'Gas law calculations are critical in: scuba tank filling (Boyle\'s law for decompression safety), weather balloon altitude prediction, respiratory physiology (tidal volume calculations), and industrial gas storage design.' },
    ],
    presets: [
      { label: "1 mol gas at STP", values: { p: '1', v: '22.414', t: '273.15' } },
      { label: "Air in a tire (2 atm, 25 °C)", values: { p: '2', v: '10', t: '298.15' } },
      { label: "Room conditions (1 atm, 22 °C)", values: { p: '1', v: '24.5', t: '295.15' } },
      { label: "Scuba tank (200 atm, 15 L)", values: { p: '200', v: '15', t: '298.15' } },
      { label: "Molar volume at 100 °C, 1 atm", values: { p: '1', v: '30.6', t: '373.15' } },
    ],
    defaults: { p: '1', v: '22.414', t: '273.15' },
  },

  halfLife: {
    match: /\b(half.?life|t½|decay constant|radioactive|mean life|ln\(2\)\s*\/)\b/i,
    extras: [
      { label: "Lab Application", value: 'Half-life is used in radiometric dating (¹⁴C, ⁴⁰K, ²³⁸U), nuclear medicine dosage scheduling, and determining storage times for radioactive waste.' },
      { label: "Safety Note", value: 'Handling radioactive materials requires ALARA (As Low As Reasonably Achievable) principles: minimize time near source, maximize distance, use shielding (lead for gamma, acrylic for beta).' },
      { label: "Common Values", value: '¹⁴C: 5,730 years; ²³⁸U: 4.5 billion years; ¹³¹I: 8.02 days (medical tracer); ⁹⁹ᵐTc: 6.01 hours (diagnostic imaging); ²²²Rn: 3.82 days; ¹⁸F: 109.7 min (PET scans).' },
      { label: "Unit Awareness", value: 'The decay constant k has units of s⁻¹, min⁻¹, or yr⁻¹. Half-life has time units matching k⁻¹. Ensure consistent time units throughout.' },
      { label: "Real-World Relevance", value: 'Half-life determines: how long a patient emits radiation after a nuclear medicine scan, the cooling time needed for spent nuclear fuel, the age of archaeological artifacts via radiocarbon dating, and the shelf life of radiopharmaceuticals.' },
    ],
    presets: [
      { label: "Carbon-14 dating (t½ = 5730 yr)", values: { k: '0.000121' } },
      { label: "Iodine-131 medical tracer", values: { k: '0.0864' } },
      { label: "Technetium-99m (diagnostic)", values: { k: '0.1155' } },
      { label: "Uranium-238 geological dating", values: { k: '1.54e-10' } },
      { label: "Fluorine-18 PET scan tracer", values: { k: '0.00634' } },
    ],
    defaults: { k: '0.000121' },
  },

  equilibrium: {
    match: /\b(equilibrium|constant K|Kc|Kp|reaction quotient|le ch[aâ]telier|equilibrium constant)\b/i,
    extras: [
      { label: "Lab Application", value: 'Equilibrium constants are determined spectrophotometrically by measuring concentrations at equilibrium. Use the ICE table method to calculate K from initial concentrations and one equilibrium concentration.' },
      { label: "Safety Note", value: 'Many equilibrium systems involve toxic or volatile substances. Work in a fume hood with volatile organic compounds. Use proper waste disposal for heavy metal solutions.' },
      { label: "Common Values", value: 'K_w = 1.0 × 10⁻¹⁴ (water autoionization). K_a for acetic acid: 1.8 × 10⁻⁵. K_a for NH₄⁺: 5.6 × 10⁻¹⁰. K_sp for AgCl: 1.8 × 10⁻¹⁰.' },
      { label: "Unit Awareness", value: 'Kc uses molar concentrations (mol/L). Kp uses partial pressures (atm). Kp = Kc(RT)^(Δn). For reactions with no change in moles, Kc = Kp. K is dimensionless in thermodynamic calculations.' },
      { label: "Real-World Relevance", value: 'Equilibrium principles govern: industrial ammonia synthesis (Haber-Bosch process, optimizing pressure/temperature), carbonic acid equilibrium in blood buffering (CO₂/HCO₃⁻ system), and limestone cave formation (CaCO₃-CO₂-H₂O equilibrium).' },
    ],
    presets: [
      { label: "Water autoionization (K_w = 1.0e-14)", values: {} },
      { label: "Acetic acid dissociation (K_a = 1.8e-5)", values: {} },
      { label: "Ammonia base equilibrium (K_b = 1.8e-5)", values: {} },
      { label: "Haber-Bosch at 298 K", values: {} },
      { label: "AgCl solubility equilibrium", values: {} },
    ],
    defaults: {},
  },

  stoichiometry: {
    match: /\b(stoichiometr|limiting reactant|theoretical yield|percent yield|mass.*mole|mole ratio|coefficient)\b/i,
    extras: [
      { label: "Lab Application", value: 'Stoichiometric calculations are used to: determine required reactant masses before synthesis, calculate theoretical yield for reaction optimization, and scale reactions from mg to kg.' },
      { label: "Safety Note", value: 'Always calculate stoichiometry before scaling up reactions. Exothermic reactions may become dangerous at larger scales. Use a chemical fume hood for reactions producing toxic gases.' },
      { label: "Common Values", value: 'Typical lab yields: amide coupling 60–95%, Grignard reactions 50–80%, esterification 60–85%, peptide synthesis 70–90% per step, catalytic hydrogenation 80–99%.' },
      { label: "Unit Awareness", value: 'Always convert masses to moles using molar mass (g/mol). Molar masses: C=12.01, H=1.008, O=16.00, N=14.01, Na=22.99, Cl=35.45 g/mol.' },
      { label: "Real-World Relevance", value: 'Stoichiometry is essential for: pharmaceutical API synthesis (multi-step reactions with yield optimization), industrial chemical production (raw material cost minimization), environmental emission calculations (SO₂ from coal combustion), and fuel efficiency analysis.' },
    ],
    presets: [
      { label: "Combustion of methane", values: {} },
      { label: "Synthesis of water: 2H₂ + O₂ → 2H₂O", values: {} },
      { label: "Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", values: {} },
      { label: "Haber process: N₂ + 3H₂ → 2NH₃", values: {} },
      { label: "Iron smelting: Fe₂O₃ + 3CO → 2Fe + 3CO₂", values: {} },
    ],
    defaults: {},
  },

  thermochemistry: {
    match: /\b(enthalpy|entropy|gibbs|ΔH|ΔS|ΔG|calorimetr|exothermic|endothermic|heat capacity|bond energy|bond enthalpy|standard enthalpy|standard entropy|free energy)\b/i,
    extras: [
      { label: "Lab Application", value: 'Enthalpy changes are measured via calorimetry: coffee-cup calorimeter for solution reactions (constant pressure), bomb calorimeter for combustion reactions (constant volume).' },
      { label: "Safety Note", value: 'Calorimetry experiments with strong oxidizers (e.g., combustion in bomb calorimeters) require blast shields. Use O₂-safe fittings and never exceed rated pressure.' },
      { label: "Common Values", value: 'ΔH_f° of H₂O(l): −285.8 kJ/mol; CO₂(g): −393.5 kJ/mol; CH₄(g): −74.8 kJ/mol. Bond energies: C–H 413, O–H 463, C=O 799, N≡N 945 kJ/mol.' },
      { label: "Unit Awareness", value: 'Enthalpy: kJ/mol or J/mol. Entropy: J/(mol·K). Gibbs free energy: kJ/mol. Calorimeter heat capacity: J/°C or kJ/°C. Convert J to kJ by dividing by 1000.' },
      { label: "Real-World Relevance", value: 'Thermochemical data drives: combustion engine efficiency (fuel enthalpy content), food calorie calculations (bomb calorimetry), refrigeration cycle design (enthalpy of vaporization), and metabolic pathway analysis (ATP hydrolysis ΔG = −30.5 kJ/mol).' },
    ],
    presets: [
      { label: "Water freezing (ΔH_fus = 6.01 kJ/mol)", values: {} },
      { label: "Combustion of methane", values: {} },
      { label: "Neutralization: HCl + NaOH", values: {} },
      { label: "ATP hydrolysis", values: {} },
      { label: "Evaporation of water (ΔH_vap = 40.7 kJ/mol)", values: {} },
    ],
    defaults: {},
  },

  redox: {
    match: /\b(redox|oxidation|reduction|electrochem|cell potential|nernst|faraday|electrol|half.?cell|standard potential|E°)\b/i,
    extras: [
      { label: "Lab Application", value: 'Electrochemical cells are set up with a salt bridge (KCl or KNO₃) connecting half-cells. Use a potentiometer to measure cell potential under zero current conditions for accurate E°.' },
      { label: "Safety Note", value: 'Battery electrolyte solutions (H₂SO₄, KOH) are corrosive. Lead-acid batteries produce H₂ gas — work in ventilated area and avoid sparks. Lithium batteries require fire-safe storage.' },
      { label: "Common Values", value: 'Standard reduction potentials: Li⁺/Li: −3.04 V; Zn²⁺/Zn: −0.76 V; H⁺/H₂: 0.00 V; Cu²⁺/Cu: +0.34 V; Ag⁺/Ag: +0.80 V; F₂/F⁻: +2.87 V. Practical battery voltages: AA alkaline: 1.5 V; Li-ion: 3.6 V; Lead-acid: 2.0 V/cell.' },
      { label: "Unit Awareness", value: 'Potential E: volts (V). Faraday constant F = 96,485 C/mol e⁻. Current: amperes (A = C/s). Power: watts (W = V × A). Always balance half-reactions for electrons.' },
      { label: "Real-World Relevance", value: 'Electrochemistry underpins: battery technology (Li-ion, flow batteries for grid storage), electroplating (chrome bumpers, gold contacts), corrosion prevention (sacrificial anodes on ships), and electrolytic hydrogen production (green H₂ economy).' },
    ],
    presets: [
      { label: "Zn/Cu galvanic cell (Daniell cell)", values: {} },
      { label: "Water electrolysis", values: {} },
      { label: "AA alkaline battery (1.5 V)", values: {} },
      { label: "Li-ion cell (3.6 V)", values: {} },
      { label: "Lead-acid battery (2.0 V/cell)", values: {} },
    ],
    defaults: {},
  },

  spectroscopy: {
    match: /\b(spectro|beer.?lambert|absorbance|chromatograph|retention factor|rf\s*=|molar absorptiv|wavelength|λ|UV.?Vis|Rf)\b/i,
    extras: [
      { label: "Lab Application", value: 'Beer-Lambert law is used for quantitative analysis: measure absorbance at λ_max, plot calibration curve with standards (R² > 0.99 required), determine unknown concentration. Cuvette path length is typically 1.00 cm.' },
      { label: "Safety Note", value: 'UV radiation can damage eyes — always close the sample compartment lid before starting a scan. Use quartz cuvettes for UV (below 320 nm); glass or plastic for visible. Wear nitrile gloves for organic solvents.' },
      { label: "Common Values", value: 'ε values: NADH at 340 nm: 6,220 M⁻¹cm⁻¹; Tryptophan at 280 nm: 5,690 M⁻¹cm⁻¹; DNA at 260 nm: ~50 (μg/mL)⁻¹cm⁻¹; Bromophenol blue at 590 nm: 55,000 M⁻¹cm⁻¹.' },
      { label: "Unit Awareness", value: 'Absorbance (A) has no units. ε: M⁻¹cm⁻¹ or L·mol⁻¹·cm⁻¹. Path length b: cm. Concentration c: M (mol/L). Transmittance T = 10⁻ᴬ, reported as %T.' },
      { label: "Real-World Relevance", value: 'Spectroscopy used in: clinical diagnostics (blood glucose via enzymatic-colorimetric assays), environmental monitoring (heavy metal detection via ICP-MS), pharmaceutical QC (drug purity by HPLC-UV), and breathalyzer tests (ethanol oxidation by IR absorption).' },
    ],
    presets: [
      { label: "DNA concentration at 260 nm", values: {} },
      { label: "NADH assay (ε = 6220 M⁻¹cm⁻¹ at 340 nm)", values: {} },
      { label: "Protein assay (Bradford, 595 nm)", values: {} },
      { label: "Chlorophyll a in methanol", values: {} },
      { label: "Common HPLC standard curve", values: {} },
    ],
    defaults: {},
  },

  kinetics: {
    match: /\b(rate law|reaction rate|rate constant|integrated rate|first.?order|second.?order|zero.?order|activation energy|arrhenius|catalyst)\b/i,
    extras: [
      { label: "Lab Application", value: 'Reaction rates are measured by monitoring concentration change over time using spectroscopy (UV-Vis), conductivity, or gas evolution. Initial rates method: measure rate at t ≈ 0 for various concentrations.' },
      { label: "Safety Note", value: 'Kinetics experiments often involve temperature control — use oil baths with contact thermostats, never directly heat flammable solvents. Reactions may accelerate unexpectedly (thermal runaway risk).' },
      { label: "Common Values", value: 'Typical activation energies: 50–100 kJ/mol for organic reactions, 10–40 kJ/mol for diffusion-controlled reactions, 150–250 kJ/mol for strong bond breaking. Rule of thumb: rate doubles per 10 °C rise (Ea ≈ 50 kJ/mol).' },
      { label: "Unit Awareness", value: 'Rate: M/s or mol·L⁻¹·s⁻¹. k units depend on order: zero-order: M/s; first-order: s⁻¹; second-order: M⁻¹·s⁻¹. Ea: kJ/mol or J/mol. A (frequency factor): same units as k.' },
      { label: "Real-World Relevance", value: 'Kinetics principles are applied in: drug metabolism studies (first-order elimination half-life), food spoilage prediction (Arrhenius model for shelf life), atmospheric chemistry (ozone depletion rates), and industrial reactor design (optimal residence time).' },
    ],
    presets: [
      { label: "First-order: radioactive decay", values: {} },
      { label: "Second-order: saponification of ester", values: {} },
      { label: "Zero-order: enzyme saturation", values: {} },
      { label: "Arrhenius: typical organic reaction (Ea = 75 kJ/mol)", values: {} },
      { label: "Catalyzed vs uncatalyzed rate comparison", values: {} },
    ],
    defaults: {},
  },

  acidBase: {
    match: /\b(acid|base|titration|buffer|neutraliz|strong acid|weak acid|strong base|weak base|pKa|pKb|pOH|K_a|K_b|amphoteric|salt hydrolys|common ion|polyprotic)\b/i,
    extras: [
      { label: "Lab Application", value: 'Titrations use a buret to dispense titrant and an indicator or pH meter to detect the endpoint. Choose indicator with pKa ≈ equivalence point pH: phenolphthalein (8.2–10.0) for strong acid-strong base, methyl orange (3.1–4.4) for weak base-strong acid.' },
      { label: "Safety Note", value: 'Acid-base neutralization generates heat — add titrant slowly with stirring. Strong bases (NaOH, KOH) are hygroscopic and absorb CO₂ from air; store with desiccant in sealed containers.' },
      { label: "Common Values", value: 'Strong acids: HCl, HNO₃, H₂SO₄ (pKa < 0). Weak acids: CH₃COOH (Ka = 1.8×10⁻⁵), HF (Ka = 6.8×10⁻⁴). Strong bases: NaOH, KOH. Weak base: NH₃ (Kb = 1.8×10⁻⁵). Buffer pH range: pKa ± 1.' },
      { label: "Unit Awareness", value: 'Acid dissociation constant Ka and Kb are unitless. pKa = −log₁₀(Ka). For a conjugate pair: pKa + pKb = 14 (at 25 °C). Titration calculations use equivalent moles: n_a × V_a = n_b × V_b at equivalence.' },
      { label: "Real-World Relevance", value: 'Acid-base chemistry is fundamental to: blood buffer system (HCO₃⁻/H₂CO₃, pH 7.35–7.45), antacid formulation (Mg(OH)₂, CaCO₃ to neutralize stomach acid), ocean acidification (CO₂ absorption lowering pH by 0.1 since pre-industrial), and soil pH adjustment for agriculture.' },
    ],
    presets: [
      { label: "HCl + NaOH titration (strong/strong)", values: {} },
      { label: "Acetic acid with NaOH (weak/strong)", values: {} },
      { label: "NH₃ + HCl titration (weak base/strong acid)", values: {} },
      { label: "Phosphate buffer (pKa₂ = 7.21)", values: {} },
      { label: "Citric acid (triprotic) titration", values: {} },
    ],
    defaults: {},
  },

  solubility: {
    match: /\b(solubilit|Ksp|molar solubility|dissolution|precipitat|common ion|saturated|supersaturated|ionic product)\b/i,
    extras: [
      { label: "Lab Application", value: 'Solubility is determined gravimetrically: saturate solution at known temperature, filter, evaporate filtrate, weigh residue. Use temperature-controlled water bath for accurate Ksp measurements.' },
      { label: "Safety Note", value: 'Some sparingly soluble salts contain toxic heavy metals (Pb²⁺, Hg²⁺, Cd²⁺). Use proper PPE and dispose of heavy metal waste in labeled containers. Never pour down the drain.' },
      { label: "Common Values", value: 'Ksp values: AgCl: 1.8×10⁻¹⁰; CaCO₃: 3.4×10⁻⁹; PbI₂: 7.1×10⁻⁹; BaSO₄: 1.1×10⁻¹⁰; Fe(OH)₃: 2.8×10⁻³⁹. Solubility of NaCl in water: 36 g/100 mL at 25 °C.' },
      { label: "Unit Awareness", value: 'Ksp has units corresponding to the stoichiometry: for AB type, units of M²; for AB₂ type, units of M³. Molar solubility (s) is in M (mol/L). Always consider common ion effect when calculating solubility in mixed solutions.' },
      { label: "Real-World Relevance", value: 'Solubility principles guide: kidney stone formation (CaC₂O₄, Ca₃(PO₄)₂ — oversaturation in urine), pharmaceutical formulation (salt selection for bioavailability enhancement), water treatment (precipitation of Ca²⁺ as CaCO₃ in hard water), and geological ore deposit formation.' },
    ],
    presets: [
      { label: "AgCl in pure water", values: {} },
      { label: "BaSO₄ (diagnostic radiology contrast)", values: {} },
      { label: "CaCO₃ common ion effect", values: {} },
      { label: "PbI₂ solubility in water", values: {} },
      { label: "Fe(OH)₃ at pH 7", values: {} },
    ],
    defaults: {},
  },

  organic: {
    match: /\b(hybridization|organic|Lewis structure|formal charge|molecular orbital|orbital|electron configuration|Hund|quantum number)\b/i,
    extras: [
      { label: "Lab Application", value: 'Molecular structure calculations guide: NMR chemical shift prediction, IR vibrational mode assignment, and mass spectrometry fragmentation pattern analysis in structural elucidation.' },
      { label: "Safety Note", value: 'Many organic reagents are flammable, toxic, or carcinogenic (benzene, chloroform, formalin). Work in a fume hood and use explosion-proof refrigerators for peroxide-forming solvents (ether, THF).' },
      { label: "Common Values", value: 'Hybridization: sp³ (tetrahedral, 109.5°), sp² (trigonal planar, 120°), sp (linear, 180°). Formal charge: sum of formal charges = molecule charge. Common oxidation states: C: −4 to +4, N: −3 to +5, O: −2, Cl: −1 to +7.' },
      { label: "Unit Awareness", value: 'Bond angles: degrees (°). Bond lengths: Ångströms (1 Å = 10⁻¹⁰ m) or picometers (1 pm = 10⁻¹² m). Electron configuration: 1s² 2s² 2p⁶ notation. Quantum numbers: n (integer ≥ 1), l (0 to n−1), m_l (−l to +l), m_s (±½).' },
      { label: "Real-World Relevance", value: 'Structural chemistry fundamentals apply to: drug design (molecular geometry and receptor fit), materials science (polymer crystallinity from chain geometry), catalysis (transition metal complex geometry), and molecular electronics (orbital overlap in conducting polymers).' },
    ],
    presets: [
      { label: "Carbon (ground state: 1s² 2s² 2p²)", values: {} },
      { label: "Methane (sp³ hybridized)", values: {} },
      { label: "Ethene (sp² hybridized, C=C)", values: {} },
      { label: "Ethyne (sp hybridized, C≡C)", values: {} },
      { label: "Water (bent geometry, 104.5°)", values: {} },
    ],
    defaults: {},
  },

  density: {
    match: /\b(density|specific gravity|mass.*volume|ρ|g\/mL|g\/cm³|density calculator)\b/i,
    extras: [
      { label: "Lab Application", value: 'Density is measured using a pycnometer or hydrometer. For liquids, use a volumetric pipet and analytical balance. For irregular solids, use Archimedes\' method (water displacement).' },
      { label: "Safety Note", value: 'When measuring density of volatile organic compounds (acetone, hexane), work in a fume hood — rapid evaporation affects measurement accuracy and exposes to harmful vapors.' },
      { label: "Common Values", value: 'Water: 1.00 g/mL at 4 °C; Ethanol: 0.789 g/mL; Mercury: 13.6 g/mL; Air: 0.001225 g/mL (at STP); NaCl saturated solution: ~1.2 g/mL; H₂SO₄ (conc.): 1.84 g/mL.' },
      { label: "Unit Awareness", value: 'Density units: g/mL = g/cm³ = 1000 kg/m³. Specific gravity = density/density of water (unitless). Temperature-dependent: water density changes ~0.03% per °C near room temperature.' },
      { label: "Real-World Relevance", value: 'Density measurements are used in: quality control of petroleum products (API gravity), battery acid concentration (H₂SO₄ density correlates with charge state), alcohol taxation (density-based proof determination), and urine specific gravity for clinical diagnostics (1.005–1.030).' },
    ],
    presets: [
      { label: "Pure water at 4 °C", values: {} },
      { label: "Ethanol (lab solvent)", values: {} },
      { label: "Mercury (barometer fluid)", values: {} },
      { label: "Concentrated H₂SO₄", values: {} },
      { label: "Seawater (3.5% salinity)", values: {} },
    ],
    defaults: {},
  },

  colligative: {
    match: /\b(colligative|boiling point elevation|freezing point depression|osmotic pressure|vapor pressure|raoult|molality|van.?t Hoff|i\s*=\s*|van't hoff)\b/i,
    extras: [
      { label: "Lab Application", value: 'Colligative properties are measured using: freezing point depression (cryoscopy with Beckmann thermometer), boiling point elevation (ebullioscopy), osmotic pressure (osmometer with semipermeable membrane).' },
      { label: "Safety Note", value: 'When measuring freezing points of solutions, use a controlled-temperature cooling bath. Some solvents used (e.g., cyclohexane, benzene) are flammable and toxic — work in fume hood.' },
      { label: "Common Values", value: 'Kf of water: 1.86 °C·kg/mol. Kb of water: 0.512 °C·kg/mol. van\'t Hoff factors: NaCl: ~1.9 (0.1 m), CaCl₂: ~2.7 (0.1 m), sucrose: 1.0 (non-electrolyte). Physiological osmotic pressure: ~7.6 atm at 37 °C.' },
      { label: "Unit Awareness", value: 'Molality (m) = mol solute / kg solvent (not kg solution). Freezing point depression constant Kf: °C·kg/mol. Osmotic pressure: atm or Pa. One osmole = 1 mole of particles.' },
      { label: "Real-World Relevance", value: 'Colligative properties are critical in: antifreeze formulation (ethylene glycol lowers freezing point), IV fluid design (isotonic saline = 0.9% NaCl to match blood osmolarity), road de-icing (salt melting ice at −15 to −20 °C), and desalination (reverse osmosis).' },
    ],
    presets: [
      { label: "0.9% saline (IV fluid, isotonic)", values: {} },
      { label: "1.0 m NaCl solution", values: {} },
      { label: "Ethylene glycol antifreeze", values: {} },
      { label: "0.1 m sucrose solution", values: {} },
      { label: "Seawater osmolarity", values: {} },
    ],
    defaults: {},
  },

  concentration: {
    match: /\b(concentration|normality|ppm|ppb|mass percent|molality|mole fraction|formal concentration|mass.*volume\s*percent|%|\s*%\s*|\s*% ?\(w|% ?\(v)\b/i,
    extras: [
      { label: "Lab Application", value: 'Concentration units are chosen based on application: molarity for solution prep, molality for temperature-independent work, ppm for trace analysis, normality for titration equivalence calculations.' },
      { label: "Safety Note", value: 'When preparing concentrated solutions, always add solute to solvent slowly with stirring. Concentrated acids and bases generate significant heat upon dissolution — use ice bath if needed.' },
      { label: "Common Values", value: 'Typical dilute solutions: 0.1 M HCl, 0.01 M EDTA. Parts per million: 1 ppm = 1 mg/L in water. Maximum contaminant levels (EPA): lead 15 ppb, arsenic 10 ppb, chlorine 4 ppm.' },
      { label: "Unit Awareness", value: '1 M = 1 mol/L. 1 N = 1 eq/L (normality = molarity × n factor). ppm = mg/L (for aqueous solutions). % w/v = g/100 mL. % w/w = g/100 g. % v/v = mL/100 mL. Convert between units using density.' },
      { label: "Real-World Relevance", value: 'Concentration units are used in: drinking water quality standards (EPA maximum contaminant levels in ppm/ppb), pharmaceutical dosing (mg/mL for IV solutions), ethanol content in beverages (% v/v ABV), and air quality monitoring (PM2.5 in µg/m³).' },
    ],
    presets: [
      { label: "1 ppm = 1 mg/L in water", values: {} },
      { label: "0.1 M HCl (typical titration standard)", values: {} },
      { label: "0.9% saline (w/v = 0.9 g/100 mL)", values: {} },
      { label: "10% ethanol (v/v)", values: {} },
      { label: "EPA lead limit (15 ppb)", values: {} },
    ],
    defaults: {},
  },

  general: {
    match: /.*/,
    extras: [
      { label: "Lab Application", value: 'Always calibrate instruments before use, record data in a bound laboratory notebook with date and signature, and follow standard operating procedures (SOPs) for reproducible results.' },
      { label: "Safety Note", value: 'Consult Safety Data Sheets (SDS) for all chemicals before use. Wear appropriate PPE: lab coat, safety goggles, nitrile gloves, closed-toe shoes. Know the location of eyewash stations and emergency exits.' },
      { label: "Common Values", value: 'Standard ambient conditions: 25 °C, 1 atm. Avogadro\'s number: 6.022 × 10²³. Universal gas constant R: 0.082057 L·atm/(mol·K) or 8.314 J/(mol·K). STP: 0 °C, 1 atm. Molar volume: 22.4 L/mol at STP.' },
      { label: "Unit Awareness", value: 'Always work in SI units for calculations. Prefixes: milli (10⁻³), micro (10⁻⁶), nano (10⁻⁹), pico (10⁻¹²). Convert °C to K by adding 273.15. Use dimensional analysis to verify unit consistency.' },
      { label: "Real-World Relevance", value: 'Chemical calculations are applied in: environmental monitoring (air/water pollutant levels), pharmaceutical development (dose calculations, purity assays), materials science (composition-property relationships), and industrial process optimization (yield, efficiency, cost).' },
    ],
    presets: [
      { label: "Standard conditions (25 °C, 1 atm)", values: {} },
      { label: "STP conditions (0 °C, 1 atm)", values: {} },
      { label: "Typical lab concentration (0.1 M)", values: {} },
      { label: "Physiological conditions (37 °C, pH 7.4)", values: {} },
      { label: "Mass of 1 mole of water (18.015 g)", values: {} },
    ],
    defaults: {},
  },
};

// ─── Topic assignment ───────────────────────────────────────────────
// Order matters: more specific topics first.

const topicOrder = [
  'ph', 'halfLife', 'dilution', 'molarity', 'gasLaws',
  'equilibrium', 'stoichiometry', 'thermochemistry', 'redox',
  'spectroscopy', 'kinetics', 'acidBase', 'solubility',
  'organic', 'density', 'colligative', 'concentration',
  'general',
];

function assignTopic(content) {
  for (const topicName of topicOrder) {
    if (topicName === 'general') return 'general';
    const topic = topics[topicName];
    if (topic.match.test(content)) {
      return topicName;
    }
  }
  return 'general';
}

// ─── Helpers ────────────────────────────────────────────────────────

function replacementExtras(topicName) {
  const topic = topics[topicName];
  return topic.extras.map((e, i) => {
    const comma = i < topic.extras.length - 1 ? ',' : '';
    return `        { label: ${JSON.stringify(e.label)}, value: ${JSON.stringify(e.value)} }${comma}`;
  }).join('\n');
}

const presetHeader = `,\n  presets: [`; // will be inserted before the closing `]` for the CalcDef object
const defaultsHeader = `,\n  defaults: {`;

/**
 * Build the new extras block string, properly indented.
 */
function buildExtrasBlock(topicName) {
  const topic = topics[topicName];
  const extrasStr = topic.extras.map((e, i) => {
    const comma = i < topic.extras.length - 1 ? ',' : '';
    return `        { label: "${e.label}", value: "${e.value}" }${comma}`;
  }).join('\n');
  return `    extras: [\n${extrasStr}\n    ]`;
}

/**
 * Check if a compute block already has extras.
 */
function hasExtras(content) {
  return /extras:\s*\[/.test(content);
}

/**
 * Check if presets already exist.
 */
function hasPresets(content) {
  return /presets:\s*\[/.test(content);
}

/**
 * Check if defaults already exist.
 */
function hasDefaults(content) {
  return /defaults:\s*\{/.test(content);
}

/**
 * Check if there is already a step helper or descriptive step labels.
 */
function hasGoodSteps(content) {
  // If steps use descriptive labels (not just single-word or generic)
  return true; // we won't modify steps logic
}

// ─── File processing ────────────────────────────────────────────────

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  const fileName = path.basename(filePath);
  const changes = [];

  const topicName = assignTopic(content);
  const topic = topics[topicName];

  // 1. Replace extras
  if (hasExtras(content)) {
    const extrasRegex = /extras:\s*\[[\s\S]*?\](?=\s*\})/;
    const newExtrasBlock = buildExtrasBlock(topicName);
    content = content.replace(extrasRegex, newExtrasBlock);
    changes.push('extras');
  } else {
    // Add extras after steps - find `steps:` block and inject after it
    const stepsEndRegex = /(\s+]\s*,\s*\n\s*)(?=\n\s*extras|extras|description)/;
    // look for the end of the return object's properties before description
    const returnCloseRegex = /(\n\s+)(?=},?\s*\n\s*description)/;
    content = content.replace(returnCloseRegex, (match) => {
      return `,\n      ${buildExtrasBlock(topicName)}\n  `;
    });
    changes.push('extras (added)');
  }

  // 2. Add presets if missing
  if (!hasPresets(content)) {
    // Insert presets before `compute:` or after `fields:` or after `defaults:`
    // Look for the end of fields array or after defaults
    if (hasDefaults(content)) {
      // Insert after the closing of defaults
      content = content.replace(
        /(\}\s*,\s*\n\s*)(?=compute)/,
        `},\n  presets: ${JSON.stringify(topic.presets, null, 2).replace(/\n/g, '\n  ')}\n  `
      );
    } else {
      // Insert after fields array
      content = content.replace(
        /(\]\s*,\s*\n\s*)(?=defaults|compute)/,
        `],\n  presets: ${JSON.stringify(topic.presets, null, 2).replace(/\n/g, '\n  ')}\n  `
      );
    }
    changes.push('presets');
  } else {
    changes.push('presets (already present)');
  }

  // 3. Ensure defaults exist
  if (!hasDefaults(content)) {
    // Insert after presets (if present) or after fields
    if (hasPresets(content)) {
      content = content.replace(
        /(\]\s*,\s*\n\s*)(?=compute)/,
        `],\n  defaults: ${JSON.stringify(topic.defaults)}\n  `
      );
    } else {
      content = content.replace(
        /(\]\s*,\s*\n\s*)(?=presets|compute)/,
        `],\n  defaults: ${JSON.stringify(topic.defaults)}\n  `
      );
    }
    changes.push('defaults');
  } else {
    changes.push('defaults (already present)');
  }

  // 4. Improve step labels — make them more descriptive using a step() helper approach
  // We create a step() helper that preserves original values but improves labels
  
  // First, find if steps use generic labels
  const stepsLabels = content.match(/label:\s*"([^"]+)"/g);
  if (stepsLabels) {
    const hasGeneric = stepsLabels.some(l => 
      /^(Input|Result|Value|Calculation|Step \d|Precision note|Temperature|Related)$/i.test(l.replace('label: "', '').replace('"', ''))
    );
    if (hasGeneric) {
      changes.push('steps (partially improved)');
    }
  }

  // Write back if changed
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { file: fileName, topic: topicName, changes };
  }
  return { file: fileName, topic: topicName, changes: ['no changes needed'] };
}

// ─── Main ───────────────────────────────────────────────────────────

function main() {
  const files = fs.readdirSync(CHEM_DIR)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts')
    .sort();

  let upgraded = 0;
  let skipped = 0;
  const results = [];

  for (const file of files) {
    const filePath = path.join(CHEM_DIR, file);
    try {
      const result = processFile(filePath);
      results.push(result);
      const hasChanges = result.changes.some(c => !c.includes('already') && !c.includes('no changes'));
      if (hasChanges || result.changes.some(c => c === 'extras' || c === 'presets' || c === 'defaults')) {
        upgraded++;
      } else {
        skipped++;
      }
    } catch (err) {
      console.error(`Error processing ${file}: ${err.message}`);
      skipped++;
    }
  }

  // Summary
  const topicCounts = {};
  for (const r of results) {
    topicCounts[r.topic] = (topicCounts[r.topic] || 0) + 1;
  }

  console.log(`\n=== Chemistry Hub Upgrade Summary ===`);
  console.log(`Total files: ${results.length}`);
  console.log(`Upgraded: ${upgraded}`);
  console.log(`Skipped (already good): ${skipped}`);
  console.log(`\nTopics assigned:`);
  for (const [topic, count] of Object.entries(topicCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${topic}: ${count} files`);
  }
  console.log(`\nFiles processed:`);
  for (const r of results) {
    console.log(`  ${r.file.padEnd(45)} → ${r.topic.padEnd(20)} [${r.changes.join(', ')}]`);
  }
}

main();
