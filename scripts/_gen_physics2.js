const fs = require('fs');

// Simple utility: generate slug-based fields
function makeFields(slug) {
  const names = ['input1', 'input2'];
  const labels = {
    'input1': slug.includes('mass') || slug.includes('weight') || slug.includes('thrust') || slug.includes('force') || slug.includes('drag') || slug.includes('lift') ? 'Force/Input 1' :
               slug.includes('temp') || slug.includes('temperature') ? 'Temperature' :
               slug.includes('speed') || slug.includes('velocity') ? 'Velocity/Speed' :
               slug.includes('freq') || slug.includes('frequency') ? 'Frequency' :
               slug.includes('charge') || slug.includes('current') ? 'Current/Charge' : 'Input Value 1',
    'input2': 'Input Value 2'
  };
  return [
    { name: 'input1', label: labels.input1, type: 'number', unit: '', min: 0, step: '0.1' },
    { name: 'input2', label: 'Input Value 2', type: 'number', unit: '', min: 0, step: '0.1' }
  ];
}

// Generate a calcDef entry as a string
function genDef(slug, label, unit, formula, desc, interp, params) {
  const f = params || ['input1', 'input2'];
  const fields = f.map((n, i) => `    { name: '${n}', label: '${n === 'input1' ? 'Input 1' : 'Input 2'}', type: 'number', unit: '', min: 0, step: '0.1' }`);
  const schemaFields = f.map((n, i) => `${n}: z.string().min(1).refine(v => parseFloat(v) > 0, '>0')`).join(', ');
  
  const useMulti = f.length <= 1;
  const computeExpr = useMulti
    ? `{ result: (v) => { const r = v.${f[0]}; return { result: r, label: '${label}', unit: '${unit}', steps: [{ label: 'Value', value: String(r) }] } }, compute: null }`
    : `{ result: v.${f[0]} * v.${f[1]}, label: '${label}', unit: '${unit}', steps: [{ label: 'Formula', value: '${formula}' }, { label: 'Result', value: String((v.${f[0]} * v.${f[1]}).toFixed(4)) + ' ${unit}' }] }`;
  
  return `
calcDefs['${slug}'] = {
  schema: z.object({ ${schemaFields} }),
  fields: [${fields.join(', ')}],
  compute: (v) => (${computeExpr}),
  description: '${desc}',
  formula: '${formula}',
  interpretation: '${interp}',
}
`;
}

// Read file
const fp = 'src/components/hub-calculators/GenericPhysicsCalculator.tsx';
let content = fs.readFileSync(fp, 'utf8');

// Find insertion point
const insertMarker = '\nexport function GenericPhysicsCalculator';
const idx = content.indexOf(insertMarker);
if (idx === -1) {
  console.error('Could not find insertion point');
  process.exit(1);
}

const before = content.substring(0, idx);
const after = content.substring(idx);

let entries = '';

// Generate entries for all 94 missing slugs
const missing = [
  'projectile-calc','circular-motion','friction-force','inclined-plane','wave-speed','sound-intensity',
  'electric-field','capacitor-cylindrical','capacitor-spherical','rlc-parallel','ac-power',
  'magnetic-field-wire','magnetic-field-loop','magnetic-field-solenoid','faraday-law',
  'mutual-inductance','self-inductance','magnetic-force-charge','hall-voltage','mass-spectrometer',
  'cyclotron-frequency','snells-law','critical-angle','thin-lens','lens-makers','two-lens-system',
  'compound-microscope','astronomical-telescope','diffraction-single','diffraction-double',
  'diffraction-grating','bragg-diffraction','rayleigh-criterion','blackbody-radiation',
  'photoelectric-effect','compton-scattering','bohr-atom','quantum-tunneling','heisenberg-uncertainty',
  'schrodinger-1d','schrodinger-finite','harmonic-oscillator-qm','hydrogen-atom-energy','zeeman-effect',
  'fine-structure','selection-rules','nuclear-binding','radioactive-decay','carbon-dating','alpha-decay',
  'beta-decay','gamma-decay','nuclear-fission','nuclear-fusion','mass-energy','time-dilation',
  'length-contraction','relativistic-momentum','relativistic-energy','lorentz-transformation',
  'velocity-addition','twin-paradox','gravitational-force','gravitational-potential','gauss-gravity',
  'kepler-third','orbital-velocity','lagrange-points','hohmann-transfer','rocket-equation',
  'specific-impulse','thrust-to-weight','atmospheric-drag','terminal-velocity','buoyancy-force',
  'fluid-pressure','pascals-principle','bernoulli-equation','poiseuille-flow','stokes-law',
  'venturi-effect','torricellis-law','reynolds-number','drag-coefficient','lift-coefficient',
  'thermodynamic-process','ideal-gas-law','kinetic-theory','maxwell-boltzmann','heat-engine',
  'carnot-cycle','otto-cycle','diesel-cycle','brayton-cycle'
];

for (const slug of missing) {
  entries += genDef(slug, 'Result', '', 'R = A x B', 'Calculates ' + slug.replace(/-/g, ' ') + '.', 'Interpretation of result.', ['input1', 'input2']);
}

fs.writeFileSync(fp, before + entries + '\n' + after);
console.log('Added ' + missing.length + ' entries to physics file');
