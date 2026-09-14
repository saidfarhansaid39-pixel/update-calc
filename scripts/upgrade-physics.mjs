import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const physicsDir = join(__dirname, '..', 'src', 'components', 'hub-calculators', 'physics')

const ALREADY_UPGRADED = new Set([
  'wavelength-calculator.ts', 'momentum-calculator.ts', 'work-calculator.ts', 'specific-heat-calculator.ts',
])

function slugFromFile(name) {
  return name.replace(/\.ts$/, '')
}

function classifyCalculator(fileName, content) {
  const lower = content.toLowerCase()
  const name = fileName.toLowerCase()

  // Newtonian Mechanics
  if (/acceleration|force|newton/.test(name)) return 'newton-mechanics'
  if (/velocity|speed|kinematics/.test(name)) return 'kinematics'
  if (/projectile|trajectory/.test(name)) return 'projectile'
  if (/circular-motion|centripetal/.test(name)) return 'circular-motion'
  if (/friction/.test(name)) return 'friction'
  if (/inclined-plane|ramp/.test(name)) return 'inclined-plane'
  if (/pulley|atwood/.test(name)) return 'pulley'
  if (/lever/.test(name)) return 'lever'
  if (/spring.*(constant|force)/.test(name)) return 'spring-force'
  if (/spring-mass|mass-spring/.test(name)) return 'spring-mass'
  if (/pendulum|simple-pendulum/.test(name)) return 'pendulum'
  if (/physical-pendulum/.test(name)) return 'physical-pendulum'
  if (/torsion-pendulum/.test(name)) return 'torsion-pendulum'
  if (/damped-harmonic|damping/.test(name)) return 'damped-harmonic'
  if (/driven-harmonic/.test(name)) return 'driven-harmonic'
  if (/coupled-oscillators/.test(name)) return 'coupled-oscillators'
  if (/torque/.test(name)) return 'torque'
  if (/angular-velocity/.test(name)) return 'angular-velocity'
  if (/moment-of-inertia/.test(name)) return 'moment-of-inertia'

  // Energy
  if (/kinetic-energy/.test(name)) return 'kinetic-energy'
  if (/potential-energy/.test(name)) return 'potential-energy'
  if (/work/.test(name)) return 'work'
  if (/power/.test(name)) return 'power'
  if (/impulse/.test(name)) return 'impulse'
  if (/impact-force/.test(name)) return 'impact'

  // Thermodynamics
  if (/specific-heat|heat-transfer|latent-heat/.test(name)) return 'thermodynamics-heat'
  if (/ideal-gas/.test(name)) return 'ideal-gas'
  if (/combined-gas/.test(name)) return 'combined-gas'
  if (/van-der-waals/.test(name)) return 'van-der-waals'
  if (/kinetic-theory|maxwell-boltzmann/.test(name)) return 'kinetic-theory'
  if (/heat-engine|carnot|otto|diesel|brayton/.test(name)) return 'heat-engine'
  if (/thermodynamic-process/.test(name)) return 'thermo-process'
  if (/thermal-expansion/.test(name)) return 'thermal-expansion'

  // Fluids
  if (/buoyancy/.test(name)) return 'buoyancy'
  if (/fluid.*(pressure|flow|rate)/.test(name)) return 'fluid-flow'
  if (/bernoulli/.test(name)) return 'bernoulli'
  if (/poiseuille/.test(name)) return 'poiseuille'
  if (/stokes/.test(name)) return 'stokes'
  if (/venturi/.test(name)) return 'venturi'
  if (/torricelli/.test(name)) return 'torricelli'
  if (/reynolds/.test(name)) return 'reynolds'
  if (/drag.*coefficient/.test(name)) return 'drag-coefficient'
  if (/lift.*coefficient/.test(name)) return 'lift-coefficient'
  if (/fluid-pressure/.test(name)) return 'fluid-pressure'
  if (/pascals-principle/.test(name)) return 'pascals-principle'

  // Waves & Optics
  if (/wave.*(speed|velocity)/.test(name)) return 'wave-speed'
  if (/wavelength/.test(name)) return 'wavelength'
  if (/wave.*(period|frequency)/.test(name)) return 'wave-frequency'
  if (/frequency/.test(name)) return 'frequency'
  if (/sound-intensity/.test(name)) return 'sound-intensity'
  if (/doppler/.test(name)) return 'doppler'
  if (/beats/.test(name)) return 'beats'
  if (/inverse-square/.test(name)) return 'inverse-square'
  if (/standing-wave/.test(name)) return 'standing-wave'
  if (/interference/.test(name)) return 'interference'
  if (/diffraction/.test(name)) return 'diffraction'
  if (/reflection/.test(name)) return 'reflection'
  if (/refraction|snell|critical-angle/.test(name)) return 'refraction'
  if (/lens.*equation|thin-lens/.test(name)) return 'lens'
  if (/lens-makers/.test(name)) return 'lens-makers'
  if (/two-lens/.test(name)) return 'two-lens'
  if (/compound-microscope/.test(name)) return 'microscope'
  if (/astronomical-telescope/.test(name)) return 'telescope'
  if (/bragg|rayleigh/.test(name)) return 'wave-optics'
  if (/resonance/.test(name)) return 'resonance'

  // Electromagnetism
  if (/ohms-law|resistance/.test(name)) return 'ohms-law'
  if (/circuit-power/.test(name)) return 'circuit-power'
  if (/electrical-force|coulomb/.test(name)) return 'coulombs-law'
  if (/electric-field/.test(name)) return 'electric-field'
  if (/electric-potential/.test(name)) return 'electric-potential'
  if (/capacitance|capacitor/.test(name)) return 'capacitance'
  if (/rc-circuit/.test(name)) return 'rc-circuit'
  if (/rl-circuit/.test(name)) return 'rl-circuit'
  if (/lc-circuit/.test(name)) return 'lc-circuit'
  if (/rlc-(series|parallel)/.test(name)) return 'rlc-circuit'
  if (/ac-circuit|ac-power/.test(name)) return 'ac-circuit'
  if (/magnetic-field/.test(name)) return 'magnetic-field'
  if (/magnetic-force/.test(name)) return 'magnetic-force'
  if (/faraday|induction/.test(name)) return 'faraday'
  if (/lenz/.test(name)) return 'lenz'
  if (/inductance/.test(name)) return 'inductance'
  if (/hall-voltage/.test(name)) return 'hall-effect'
  if (/mass-spectrometer/.test(name)) return 'mass-spectrometer'
  if (/cyclotron/.test(name)) return 'cyclotron'
  if (/self-inductance|mutual-inductance/.test(name)) return 'inductance'
  if (/resistor-color/.test(name)) return 'resistor-color'

  // Modern Physics & Quantum
  if (/blackbody/.test(name)) return 'blackbody'
  if (/photoelectric/.test(name)) return 'photoelectric'
  if (/compton/.test(name)) return 'compton'
  if (/bohr|hydrogen-atom/.test(name)) return 'bohr-model'
  if (/quantum-tunneling/.test(name)) return 'quantum-tunneling'
  if (/heisenberg/.test(name)) return 'heisenberg'
  if (/schrodinger/.test(name)) return 'schrodinger'
  if (/harmonic-oscillator-qm/.test(name)) return 'harmonic-oscillator-qm'
  if (/fine-structure/.test(name)) return 'fine-structure'
  if (/zeeman/.test(name)) return 'zeeman'
  if (/selection-rules/.test(name)) return 'selection-rules'

  // Nuclear & Particle
  if (/nuclear-binding/.test(name)) return 'nuclear-binding'
  if (/radioactive-decay|nuclear-decay/.test(name)) return 'radioactive-decay'
  if (/carbon-dating/.test(name)) return 'carbon-dating'
  if (/alpha-decay|beta-decay|gamma-decay/.test(name)) return 'nuclear-decay'
  if (/nuclear-fission/.test(name)) return 'nuclear-fission'
  if (/nuclear-fusion/.test(name)) return 'nuclear-fusion'
  if (/mass-energy/.test(name)) return 'mass-energy'

  // Relativity
  if (/relativity/.test(name)) return 'relativity'
  if (/time-dilation/.test(name)) return 'time-dilation'
  if (/length-contraction/.test(name)) return 'length-contraction'
  if (/relativistic-momentum/.test(name)) return 'relativistic-momentum'
  if (/relativistic-energy/.test(name)) return 'relativistic-energy'
  if (/lorentz/.test(name)) return 'lorentz'
  if (/velocity-addition/.test(name)) return 'velocity-addition'
  if (/twin-paradox/.test(name)) return 'twin-paradox'

  // Celestial Mechanics
  if (/gravitational-force/.test(name)) return 'gravitational-force'
  if (/gravitational-potential/.test(name)) return 'gravitational-potential'
  if (/gauss-gravity/.test(name)) return 'gauss-gravity'
  if (/kepler/.test(name)) return 'kepler'
  if (/orbital-velocity/.test(name)) return 'orbital-velocity'
  if (/lagrange/.test(name)) return 'lagrange'
  if (/hohmann/.test(name)) return 'hohmann'
  if (/escape-velocity/.test(name)) return 'escape-velocity'
  if (/free-fall/.test(name)) return 'free-fall'
  if (/density/.test(name)) return 'density'
  if (/pressure/.test(name)) return 'pressure'

  // Rocketry
  if (/rocket-equation/.test(name)) return 'rocket-equation'
  if (/specific-impulse/.test(name)) return 'specific-impulse'
  if (/thrust-to-weight/.test(name)) return 'thrust-to-weight'
  if (/atmospheric-drag/.test(name)) return 'atmospheric-drag'
  if (/terminal-velocity/.test(name)) return 'terminal-velocity'
  if (/relative-velocity/.test(name)) return 'relative-velocity'

  // Bohr model separately
  if (/bohr-atom/.test(name)) return 'bohr-atom'
  if (/photon-energy/.test(name)) return 'photon-energy'

  return 'general-physics'
}

// Domain-specific content generators
const domainGenerators = {
  'newton-mechanics': (fields) => {
    const hasForce = fields.some(f => f.name === 'force' || f.name === 'F')
    const hasMass = fields.some(f => f.name === 'mass' || f.name === 'm')
    const hasAccel = fields.some(f => f.name === 'accel' || f.name === 'acceleration' || f.name === 'a')
    return {
      presets: [
        { label: 'Car (1500 kg, 3 m/s²)', values: hasMass && hasAccel ? { mass: '1500', accel: '3' } : hasForce && hasMass ? { force: '4500', mass: '1500' } : undefined },
        { label: 'Bicycle (80 kg, 0.5 m/s²)', values: hasMass && hasAccel ? { mass: '80', accel: '0.5' } : hasForce && hasMass ? { force: '40', mass: '80' } : undefined },
        { label: 'Baseball (0.145 kg, 100 m/s²)', values: hasMass && hasAccel ? { mass: '0.145', accel: '100' } : hasForce && hasMass ? { force: '14.5', mass: '0.145' } : undefined },
      ].filter(Boolean),
      defaults: hasMass && hasAccel ? { mass: '70', accel: '9.81' } : { force: '100', mass: '10' },
      extras: [
        { label: 'Real-World Application', value: 'Newton\'s second law governs everything from vehicle acceleration to rocket launches. A 1500 kg car accelerating at 3 m/s² needs 4500 N of net force.' },
        { label: 'Precision Tip', value: 'Use net force (sum of all forces) for accurate results. Friction, drag, and other opposing forces reduce net acceleration.' },
        { label: 'Common Values', value: 'g = 9.81 m/s² (Earth gravity). Typical car acceleration: 2-4 m/s². Sports car: 5-8 m/s².' },
        { label: 'Related Formula', value: 'F = ma relates to impulse (FΔt = mΔv), work (W = Fd), and weight (W = mg). All derive from Newton\'s laws.' },
        { label: 'Unit Conversion Note', value: '1 N = 1 kg·m/s². Convert lbf to N: multiply by 4.448. Convert kgf to N: multiply by 9.807.' },
      ]
    }
  },

  'kinematics': (fields) => {
    const hasV = fields.some(f => /v|velocity|speed/.test(f.name))
    const hasU = fields.some(f => /u|initial/.test(f.name))
    const hasA = fields.some(f => /a|accel/.test(f.name))
    const hasT = fields.some(f => /t|time/.test(f.name))
    const hasS = fields.some(f => /s|d|dist|displacement/.test(f.name))
    return {
      presets: [
        { label: 'Car braking (20 m/s → 0, 5 s)', values: hasU && hasV && hasT ? { u: '20', v: '0', t: '5' } : hasV && hasT ? { velocity: '20', time: '5' } : undefined },
        { label: 'Free fall 1 s', values: hasU && hasA && hasT ? { u: '0', a: '9.81', t: '1' } : hasT ? { time: '1' } : undefined },
        { label: 'High-speed train (50 m/s, 30 s)', values: hasU && hasA && hasT ? { u: '0', a: '1.667', t: '30' } : hasV && hasT ? { velocity: '50', time: '30' } : undefined },
      ].filter(Boolean),
      defaults: hasU && hasV && hasT ? { u: '0', v: '20', t: '5' } : { velocity: '10', time: '5' },
      extras: [
        { label: 'Real-World Application', value: 'Kinematics equations describe all motion from subatomic particles to galaxies. Car safety systems use these for braking distance calculations.' },
        { label: 'Common Values', value: 'Walking speed: 1.4 m/s. Running speed: 3-6 m/s. Highway speed: 29 m/s (105 km/h). Free fall: 9.81 m/s².' },
        { label: 'Precision Tip', value: 'Define your coordinate system and sign conventions first. Velocity and acceleration can be negative depending on direction.' },
        { label: 'Related Formula', value: 'The four kinematic equations assume constant acceleration. For varying acceleration, use calculus: v = ∫a dt, s = ∫v dt.' },
        { label: 'Unit Conversion Note', value: 'Convert km/h to m/s: divide by 3.6. Convert mph to m/s: multiply by 0.447. 1 g = 9.81 m/s².' },
      ]
    }
  },

  'projectile': (fields) => ({
    presets: [
      { label: 'Cannonball (45°, 100 m/s)', values: { velocity: '100', angle: '45' } },
      { label: 'Soccer kick (30°, 20 m/s)', values: { velocity: '20', angle: '30' } },
      { label: 'Basketball shot (55°, 8 m/s)', values: { velocity: '8', angle: '55' } },
    ],
    defaults: { velocity: '50', angle: '45' },
    extras: [
      { label: 'Real-World Application', value: 'Projectile motion governs sports (basketball, soccer, golf), ballistics, and fireworks. A 45° launch angle gives maximum range in a vacuum.' },
      { label: 'Common Values', value: 'Basketball free throw: ~8 m/s at 55°. Soccer goal kick: ~25 m/s at 30-40°. Golf drive: ~70 m/s at 10-15°.' },
      { label: 'Precision Tip', value: 'Air resistance is ignored in basic models. Real projectiles have lower range and asymmetric trajectories, especially at high speeds.' },
      { label: 'Related Formula', value: 'Range R = v²sin(2θ)/g. Max height H = v²sin²(θ)/(2g). Time of flight T = 2v sin(θ)/g.' },
      { label: 'Unit Conversion Note', value: 'Angle in degrees. g = 9.81 m/s². Convert mph to m/s: multiply by 0.447. Convert km/h to m/s: divide by 3.6.' },
    ]
  }),

  'circular-motion': (fields) => {
    const hasRadius = fields.some(f => /r|radius/.test(f.name))
    const hasV = fields.some(f => /v|velocity|speed/.test(f.name))
    const hasOmega = fields.some(f => /omega|angular/.test(f.name))
    return {
      presets: [
        { label: 'Car turning (20 m/s, R=50 m)', values: hasV && hasRadius ? { velocity: '20', radius: '50' } : { speed: '20', radius: '50' } },
        { label: 'Earth orbit (29.8 km/s, 1 AU)', values: hasV && hasRadius ? { velocity: '29800', radius: '1.496e11' } : undefined },
        { label: 'Centrifuge (1000 RPM, R=0.15 m)', values: hasOmega && hasRadius ? { omega: '104.72', radius: '0.15' } : undefined },
      ].filter(Boolean),
      defaults: { velocity: '20', radius: '50' },
      extras: [
        { label: 'Real-World Application', value: 'Circular motion explains satellite orbits, centrifuges, roller coasters, and particle accelerators. Centripetal force keeps objects moving in circles.' },
        { label: 'Common Values', value: 'Earth orbital speed: 29.8 km/s at 1 AU. Car turning at 20 m/s on 50 m radius: 8 m/s² (0.82 g).' },
        { label: 'Precision Tip', value: 'Centripetal acceleration a_c = v²/r. Apparent centrifugal force is a fictitious force in the rotating reference frame.' },
        { label: 'Related Formula', value: 'F_c = mv²/r = mω²r. Period T = 2πr/v. Angular velocity ω = v/r. Centripetal acceleration a_c = ω²r.' },
        { label: 'Unit Conversion Note', value: 'Convert RPM to rad/s: multiply by 2π/60. 1 g = 9.81 m/s². Astronauts experience 3-4 g during launch.' },
      ]
    }
  },

  'kinetic-energy': (fields) => ({
    presets: [
      { label: 'Running person (70 kg, 5 m/s)', values: { mass: '70', velocity: '5' } },
      { label: 'Car (1500 kg, 27 m/s)', values: { mass: '1500', velocity: '27' } },
      { label: 'Baseball pitch (0.145 kg, 40 m/s)', values: { mass: '0.145', velocity: '40' } },
    ],
    defaults: { mass: '70', velocity: '10' },
    extras: [
      { label: 'Real-World Application', value: 'Kinetic energy determines stopping distances, impact forces, and energy efficiency. A car at 100 km/h has 4× the KE of one at 50 km/h.' },
      { label: 'Common Values', value: 'Walking: ~245 J (70 kg, 1.4 m/s). Car at 100 km/h: ~579 kJ. Rifle bullet: ~1.3 kJ. 1 kcal (food) = 4184 J.' },
      { label: 'Precision Tip', value: 'KE scales with v² — doubling speed quadruples energy. This is why highway speeds dramatically increase crash severity.' },
      { label: 'Related Formula', value: 'Work-energy theorem: W = ΔKE. Also related to momentum (p = mv): KE = p²/2m.' },
      { label: 'Unit Conversion Note', value: '1 J = 1 kg·m²/s². 1 cal = 4.184 J. 1 kWh = 3.6 MJ. Convert mph to m/s: multiply by 0.447.' },
    ]
  }),

  'potential-energy': (fields) => ({
    presets: [
      { label: 'Lift 10 kg to 2 m', values: { mass: '10', height: '2' } },
      { label: 'Climb stairs (70 kg, 10 m)', values: { mass: '70', height: '10' } },
      { label: 'Elevator (1000 kg, 50 m)', values: { mass: '1000', height: '50' } },
    ],
    defaults: { mass: '70', height: '5' },
    extras: [
      { label: 'Real-World Application', value: 'Gravitational potential energy powers hydroelectric dams. Water stored at height converts PE to KE then electricity. A 100 m dam stores ~1 MJ per m³ of water.' },
      { label: 'Common Values', value: 'Person climbing 10 m: ~6.9 kJ. 1 L water at 100 m: ~981 J. Apple on a tree (0.2 kg, 2 m): ~3.9 J.' },
      { label: 'Precision Tip', value: 'PE reference point is arbitrary. Only changes in PE matter physically. Earth surface is the usual reference, but any level works.' },
      { label: 'Related Formula', value: 'PE = mgh. Elastic PE: PE_spring = ½kx². Gravitational PE general: U = -GMm/r. Conversion: PE → KE as object falls.' },
      { label: 'Unit Conversion Note', value: 'g = 9.81 m/s² (varies slightly by location). 1 J lifts ~0.102 kg by 1 m. 1 kWh = 3.6 MJ = lifting ~367 tons 1 m.' },
    ]
  }),

  'power': (fields) => ({
    presets: [
      { label: 'Light bulb (60 J in 1 s)', values: { work: '60', time: '1' } },
      { label: 'Car engine (300 kJ in 6 s)', values: { work: '300000', time: '6' } },
      { label: 'Human output (2000 J in 10 s)', values: { work: '2000', time: '10' } },
    ],
    defaults: { work: '1000', time: '2' },
    extras: [
      { label: 'Real-World Application', value: 'Power ratings define engines, appliances, and human output. A 100 W bulb uses 100 J/s. A typical car engine produces ~100 kW (134 hp).' },
      { label: 'Common Values', value: 'Human resting: ~80 W. Cycling: 200-400 W. Microwave: 800-1200 W. Car engine: 50-300 kW. Power plant: 500-1000 MW.' },
      { label: 'Precision Tip', value: 'Power = work/time = energy/time. Electrical power: P = IV = I²R. Mechanical power: P = Fv = τω.' },
      { label: 'Related Formula', value: 'Energy = Power × time. 1 kWh = 3.6 MJ. Horsepower: 1 hp = 745.7 W. Apparent power (AC): S = VI (VA).' },
      { label: 'Unit Conversion Note', value: '1 W = 1 J/s. 1 hp = 745.7 W. 1 kW = 1.34 hp. 1 MW = 10^6 W. 1 GW = 10^9 W.' },
    ]
  }),

  'impulse': (fields) => {
    const hasForce = fields.some(f => /f|force/.test(f.name))
    const hasTime = fields.some(f => /t|time/.test(f.name))
    const hasMass = fields.some(f => /m|mass/.test(f.name))
    return {
      presets: [
        { label: 'Baseball hit (8000 N, 0.007 s)', values: hasForce && hasTime ? { force: '8000', time: '0.007' } : undefined },
        { label: 'Car crash (50000 N, 0.1 s)', values: hasForce && hasTime ? { force: '50000', time: '0.1' } : undefined },
        { label: 'Punch (2500 N, 0.05 s)', values: hasForce && hasTime ? { force: '2500', time: '0.05' } : undefined },
      ].filter(Boolean),
      defaults: { force: '1000', time: '0.1' },
      extras: [
        { label: 'Real-World Application', value: 'Impulse explains why airbags save lives — they increase crash time, reducing force. J = FΔt = Δp. Longer time = lower force for same momentum change.' },
        { label: 'Common Values', value: 'Baseball bat contact: ~0.007 s, force ~8000 N. Golf club contact: ~0.0005 s. Car crash: ~0.1 s. Boxing punch: ~0.05 s.' },
        { label: 'Precision Tip', value: 'Impulse equals the area under a force-time graph. For varying forces, use average force or integrate.' },
        { label: 'Related Formula', value: 'Impulse-momentum theorem: FΔt = mΔv. Rocket thrust: F = v_exhaust × dm/dt. Specific impulse: I_sp = F/(dm/dt × g).' },
        { label: 'Unit Conversion Note', value: 'Impulse in N·s = kg·m/s. Convert lbf·s to N·s: multiply by 4.448.' },
      ]
    }
  },

  'friction': (fields) => {
    const hasNormal = fields.some(f => /n|normal/.test(f.name))
    const hasMu = fields.some(f => /mu|coeff|friction/.test(f.name))
    const hasMass = fields.some(f => /m|mass/.test(f.name))
    return {
      presets: [
        { label: 'Wood on wood (μ=0.4, 10 kg)', values: hasMass && hasMu ? { mass: '10', mu: '0.4' } : undefined },
        { label: 'Rubber on concrete (μ=0.8, 1500 kg)', values: hasMass && hasMu ? { mass: '1500', mu: '0.8' } : undefined },
        { label: 'Ice on ice (μ=0.03, 70 kg)', values: hasMass && hasMu ? { mass: '70', mu: '0.03' } : undefined },
      ].filter(Boolean),
      defaults: { mass: '10', mu: '0.4' },
      extras: [
        { label: 'Real-World Application', value: 'Friction enables walking, braking, and gripping. Tire design optimizes friction. ABS brakes prevent skidding by maintaining static friction.' },
        { label: 'Common Values', value: 'Rubber on dry concrete: μ_s = 0.8-1.0. Steel on steel: μ_s = 0.74. Teflon on Teflon: μ_k = 0.04. Ice on ice: μ_k ≈ 0.03.' },
        { label: 'Precision Tip', value: 'Static friction (μ_s) > kinetic friction (μ_k). Maximum static friction F_s_max = μ_sN. Kinetic friction F_k = μ_kN, constant regardless of speed.' },
        { label: 'Related Formula', value: 'Friction: f = μN. Normal force on incline: N = mg cos θ. Rolling friction: f_r = μ_rN (much lower than sliding).' },
        { label: 'Unit Conversion Note', value: 'Normal force in N. On flat surface with mass m: N = mg. Convert kg to N: multiply by 9.81.' },
      ]
    }
  },

  'ohms-law': (fields) => {
    const hasVoltage = fields.some(f => /v|voltage/.test(f.name))
    const hasCurrent = fields.some(f => /i|current/.test(f.name))
    const hasResistance = fields.some(f => /r|resistance/.test(f.name))
    return {
      presets: [
        { label: 'USB charger (5 V, 2 A)', values: hasVoltage && hasCurrent ? { voltage: '5', current: '2' } : undefined },
        { label: 'LED circuit (3.3 V, 20 mA)', values: hasVoltage && hasCurrent ? { voltage: '3.3', current: '0.02' } : undefined },
        { label: 'Household (120 V, 10 A)', values: hasVoltage && hasCurrent ? { voltage: '120', current: '10' } : undefined },
      ].filter(Boolean),
      defaults: { voltage: '12', current: '1' },
      extras: [
        { label: 'Real-World Application', value: 'Ohm\'s law is fundamental to all electronics. It sizes resistors for LEDs, determines wire gauge for current capacity, and analyzes circuit behavior.' },
        { label: 'Common Values', value: 'USB: 5 V, up to 3 A. Household: 120 V (US) / 230 V (EU). Resistor values: 10 Ω - 10 MΩ. LED forward voltage: 1.8-3.3 V.' },
        { label: 'Precision Tip', value: 'Ohm\'s law is linear only for ohmic materials (metals at constant temperature). Diodes, transistors, and heating elements are non-ohmic.' },
        { label: 'Related Formula', value: 'Power: P = VI = I²R = V²/R. Series: R_total = R₁+R₂+... Parallel: 1/R_total = 1/R₁+1/R₂+...' },
        { label: 'Unit Conversion Note', value: '1 Ω = 1 V/A. Use kΩ (10³), MΩ (10⁶). mA (10⁻³) for small currents. 1 mΩ = 0.001 Ω for very low resistances.' },
      ]
    }
  },

  'ideal-gas': (fields) => {
    const hasPressure = fields.some(f => /p|pressure/.test(f.name))
    const hasVolume = fields.some(f => /v|volume/.test(f.name))
    const hasMoles = fields.some(f => /n|moles/.test(f.name))
    return {
      presets: [
        { label: 'STP (1 mol, 22.4 L)', values: hasPressure && hasVolume && hasMoles ? { pressure: '101325', volume: '0.0224', moles: '1' } : undefined },
        { label: 'Room air (1 mol, 24.5 L)', values: hasPressure && hasVolume && hasMoles ? { pressure: '101325', volume: '0.0245', moles: '1' } : undefined },
        { label: 'Car tire (0.5 mol, 10 L, 2.5 atm)', values: hasPressure && hasVolume && hasMoles ? { pressure: '253312', volume: '0.01', moles: '0.5' } : undefined },
      ].filter(Boolean),
      defaults: { pressure: '101325', volume: '0.0224', moles: '1' },
      extras: [
        { label: 'Real-World Application', value: 'Ideal gas law applies to weather balloons, SCUBA tanks, car engines, and HVAC systems. STP: 0°C, 1 atm = 22.4 L/mol.' },
        { label: 'Common Values', value: 'R = 8.314 J/(mol·K). STP: 0°C, 1 atm (101325 Pa). Room temp: 298 K (25°C). Car tire: 2.5 atm ≈ 253 kPa.' },
        { label: 'Precision Tip', value: 'Real gases deviate at high pressure (>10 atm) and low temperature. Use van der Waals equation for better accuracy in those regimes.' },
        { label: 'Related Formula', value: 'Combined gas law: P₁V₁/T₁ = P₂V₂/T₂. Van der Waals: (P + an²/V²)(V - nb) = nRT.' },
        { label: 'Unit Conversion Note', value: 'Temperature must be in Kelvin. K = °C + 273.15. 1 atm = 101325 Pa = 760 mmHg. 1 bar = 10⁵ Pa.' },
      ]
    }
  },

  'thermodynamics-heat': (fields) => {
    const hasMass = fields.some(f => /m|mass/.test(f.name))
    const hasTemp = fields.some(f => /t|temp/.test(f.name))
    const hasLatent = fields.some(f => /l|latent/.test(f.name))
    return {
      presets: [
        { label: 'Heat 1 L water by 10°C', values: { mass: '1', tempChange: '10', specificHeat: '4186' } },
        { label: 'Heat 1 kg aluminum by 50°C', values: { mass: '1', tempChange: '50', specificHeat: '900' } },
        { label: 'Melt 1 kg ice (334 kJ/kg)', values: hasMass && hasLatent ? { mass: '1', latentHeat: '334000' } : undefined },
      ].filter(Boolean),
      defaults: { mass: '1', tempChange: '10', specificHeat: '4186' },
      extras: [
        { label: 'Real-World Application', value: 'Specific heat determines cooking times, HVAC sizing, and climate patterns. Water\'s high specific heat (4186 J/(kg·°C)) stabilizes coastal temperatures.' },
        { label: 'Common Values', value: 'Water: 4186 J/(kg·°C). Aluminum: 900. Copper: 385. Iron: 450. Ice: 2090. Air: 1005. Water\'s heat capacity is the highest of common substances.' },
        { label: 'Precision Tip', value: 'Specific heat varies with temperature. Values are typically given at 25°C. Phase changes require latent heat and occur at constant temperature.' },
        { label: 'Related Formula', value: 'Q = mcΔT. Latent heat: Q = mL. Heat capacity: C = mc. Thermal equilibrium: m₁c₁(T_f - T₁) = m₂c₂(T₂ - T_f).' },
        { label: 'Unit Conversion Note', value: '1 cal = 4.184 J. 1 food Calorie (kcal) = 4184 J. 1 BTU = 1055 J (heats 1 lb water by 1°F).' },
      ]
    }
  },

  'buoyancy': (fields) => ({
    presets: [
      { label: 'Iceberg (10% above water)', values: { volume: '1000', densityFluid: '1025', densityObject: '917' } },
      { label: 'Wood block (ρ=600, in water)', values: { volume: '0.1', densityFluid: '1000', densityObject: '600' } },
      { label: 'Submarine (neutral buoyancy)', values: { volume: '500', densityFluid: '1025', densityObject: '1025' } },
    ],
    defaults: { volume: '1', densityFluid: '1000', densityObject: '800' },
    extras: [
      { label: 'Real-World Application', value: 'Buoyancy governs ships, submarines, hot air balloons, and swimming. Archimedes\' principle explains why steel ships float (displaced water weight = ship weight).' },
      { label: 'Common Values', value: 'Fresh water: 1000 kg/m³. Seawater: 1025 kg/m³. Ice: 917 kg/m³ (91.7% submerged in seawater). Cork: 240 kg/m³. Human body: ~985 kg/m³.' },
      { label: 'Precision Tip', value: 'Buoyant force = weight of displaced fluid. Apparent weight = real weight - buoyant force. Floating condition: ρ_object < ρ_fluid.' },
      { label: 'Related Formula', value: 'F_b = ρ_fluid × V_displaced × g. Apparent weight: W_app = mg - F_b. Fraction submerged: ρ_object/ρ_fluid.' },
      { label: 'Unit Conversion Note', value: 'Density in kg/m³. 1 g/cm³ = 1000 kg/m³. Specific gravity = ρ/ρ_water (dimensionless).' },
    ]
  }),

  'bernoulli': (fields) => ({
    presets: [
      { label: 'Water pipe (2 m/s, 300 kPa)', values: { velocity: '2', pressure: '300000', height: '0' } },
      { label: 'Airplane wing (80 m/s, 101 kPa)', values: { velocity: '80', pressure: '101325', height: '10000' } },
      { label: 'Venturi tube (10 m/s, 200 kPa)', values: { velocity: '10', pressure: '200000', height: '0' } },
    ],
    defaults: { velocity: '5', pressure: '200000', height: '0' },
    extras: [
      { label: 'Real-World Application', value: 'Bernoulli\'s principle explains airplane lift (faster air over curved wing = lower pressure), atomizers, and chimney drafts.' },
      { label: 'Common Values', value: 'Air density at sea level: 1.225 kg/m³. Water density: 1000 kg/m³. Typical water main pressure: 300-500 kPa.' },
      { label: 'Precision Tip', value: 'Bernoulli assumes steady, incompressible, inviscid flow along a streamline. Real fluids have viscosity — use Bernoulli with the Darcy-Weisbach correction for pipes.' },
      { label: 'Related Formula', value: 'P + ½ρv² + ρgh = constant. Continuity equation: A₁v₁ = A₂v₂. Venturi effect: P decreases where velocity increases.' },
      { label: 'Unit Conversion Note', value: 'Pressure in Pa. 1 atm = 101325 Pa. 1 bar = 10⁵ Pa. 1 psi = 6895 Pa. Velocity in m/s.' },
    ]
  }),

  'wave-speed': (fields) => ({
    presets: [
      { label: 'Sound in air (20°C)', values: { frequency: '440', wavelength: '0.78' } },
      { label: 'Radio wave (FM 100 MHz)', values: { frequency: '1e8', wavelength: '3' } },
      { label: 'Light in vacuum', values: { frequency: '5e14', wavelength: '6e-7' } },
    ],
    defaults: { frequency: '440', wavelength: '0.78' },
    extras: [
      { label: 'Real-World Application', value: 'Wave speed determines communication frequencies, medical imaging (ultrasound), and seismic wave arrival times for earthquake detection.' },
      { label: 'Common Values', value: 'Light in vacuum: 3×10⁸ m/s. Sound in air: 343 m/s (20°C). Sound in water: 1482 m/s. Seismic P-waves: 5-8 km/s.' },
      { label: 'Precision Tip', value: 'Wave speed depends on the medium, not frequency. Sound speed in air varies with temperature: v = 331√(1 + T/273) m/s.' },
      { label: 'Related Formula', value: 'v = fλ. Wave equation: ∂²y/∂t² = v²∂²y/∂x². Period T = 1/f = λ/v. Wavenumber k = 2π/λ.' },
      { label: 'Unit Conversion Note', value: '1 Hz = 1 s⁻¹. Wavelength in m. Convert MHz to Hz: ×10⁶. Convert GHz to Hz: ×10⁹. Frequency THz: ×10¹².' },
    ]
  }),

  'frequency': (fields) => {
    const hasPeriod = fields.some(f => /p|period|t/.test(f.name))
    return {
      presets: [
        { label: '60 Hz AC power', values: hasPeriod ? { period: '0.01667' } : { frequency: '60' } },
        { label: 'Middle C (261.6 Hz)', values: hasPeriod ? { period: '0.003823' } : { frequency: '261.6' } },
        { label: '1 second period', values: hasPeriod ? { period: '1' } : { frequency: '1' } },
      ],
      defaults: hasPeriod ? { period: '0.01667' } : { frequency: '60' },
      extras: [
        { label: 'Real-World Application', value: 'Frequency determines musical pitch, radio channels, AC power (50/60 Hz), and processor clock speeds. The ear hears 20 Hz to 20 kHz.' },
        { label: 'Common Values', value: 'Middle C: 261.6 Hz. A440: 440 Hz (orchestra tuning). AC power: 50 Hz (EU) / 60 Hz (US). Wi-Fi: 2.4 GHz or 5 GHz.' },
        { label: 'Precision Tip', value: 'Frequency and period are inverses: f = 1/T. For waves, angular frequency ω = 2πf = 2π/T (rad/s).' },
        { label: 'Related Formula', value: 'v = fλ. ω = 2πf. f = 1/T. For pendulums: f = (1/2π)√(g/L). For springs: f = (1/2π)√(k/m).' },
        { label: 'Unit Conversion Note', value: '1 Hz = 1 s⁻¹. 1 kHz = 10³ Hz. 1 MHz = 10⁶ Hz. 1 GHz = 10⁹ Hz. Convert RPM to Hz: divide by 60.' },
      ]
    }
  },

  'doppler': (fields) => ({
    presets: [
      { label: 'Ambulance siren (100 m/s)', values: { sourceSpeed: '30', frequency: '1000', waveSpeed: '343' } },
      { label: 'Redshift (0.1c receding)', values: { sourceSpeed: '3e7', frequency: '5e14', waveSpeed: '3e8' } },
      { label: 'Approaching train horn (80 m/s)', values: { sourceSpeed: '40', frequency: '500', waveSpeed: '343' } },
    ],
    defaults: { sourceSpeed: '30', frequency: '1000', waveSpeed: '343' },
    extras: [
      { label: 'Real-World Application', value: 'Doppler effect is used in radar speed guns, weather radar, medical ultrasound (blood flow), and astronomy (redshift measures cosmic expansion).' },
      { label: 'Common Values', value: 'Sound in air: 343 m/s. Typical ambulance siren: 800-1000 Hz. Police radar: K-band (24 GHz), Ka-band (35 GHz).' },
      { label: 'Precision Tip', value: 'For sound, the observed frequency depends on relative motion. Approaching source: f_obs = f_src/(1 - v_src/v). Receding: f_obs = f_src/(1 + v_src/v).' },
      { label: 'Related Formula', value: 'Doppler shift: f_obs = f_src(v ± v_obs)/(v ∓ v_src). Relativistic Doppler: f_obs = f_src√((1-β)/(1+β)). Hubble\'s law: v = H₀d.' },
      { label: 'Unit Conversion Note', value: 'Speed in same units as wave speed (m/s for sound, m/s or km/s for light). Redshift z = Δλ/λ₀ ≈ v/c for v << c.' },
    ]
  }),

  'gravitational-force': (fields) => ({
    presets: [
      { label: 'Earth-Sun gravity', values: { mass1: '5.97e24', mass2: '1.989e30', distance: '1.496e11' } },
      { label: 'Earth-Moon gravity', values: { mass1: '5.97e24', mass2: '7.35e22', distance: '3.84e8' } },
      { label: 'Two 70 kg people (1 m apart)', values: { mass1: '70', mass2: '70', distance: '1' } },
    ],
    defaults: { mass1: '5.97e24', mass2: '1000', distance: '6.37e6' },
    extras: [
      { label: 'Real-World Application', value: 'Gravitational force governs planetary orbits, tides, and falling objects. The Apollo missions needed to overcome Earth\'s gravity to reach the Moon.' },
      { label: 'Common Values', value: 'G = 6.674×10⁻¹¹ N·m²/kg². Earth mass: 5.97×10²⁴ kg. Earth radius: 6371 km. g = 9.81 m/s² at Earth surface.' },
      { label: 'Precision Tip', value: 'Gravity is the weakest fundamental force but acts over infinite distance. Force drops as 1/r². At Earth\'s surface, g ≈ GM/R².' },
      { label: 'Related Formula', value: 'F = Gm₁m₂/r². Gravitational field: g = GM/r². Potential energy: U = -GMm/r. Escape velocity: v_esc = √(2GM/R).' },
      { label: 'Unit Conversion Note', value: 'G in N·m²/kg². Use kg for mass, m for distance. Astronomical unit (AU) = 1.496×10¹¹ m. Light-year = 9.46×10¹⁵ m.' },
    ]
  }),

  'escape-velocity': (fields) => ({
    presets: [
      { label: 'Earth escape velocity', values: { mass: '5.97e24', radius: '6.37e6' } },
      { label: 'Moon escape velocity', values: { mass: '7.35e22', radius: '1.74e6' } },
      { label: 'Mars escape velocity', values: { mass: '6.39e23', radius: '3.39e6' } },
    ],
    defaults: { mass: '5.97e24', radius: '6.37e6' },
    extras: [
      { label: 'Real-World Application', value: 'Escape velocity determines whether a planet retains its atmosphere. Earth\'s escape velocity (11.2 km/s) retains air; the Moon\'s (2.4 km/s) cannot.' },
      { label: 'Common Values', value: 'Earth: 11.2 km/s. Moon: 2.38 km/s. Mars: 5.03 km/s. Jupiter: 59.5 km/s. Sun: 618 km/s. Black hole: v_esc > c.' },
      { label: 'Precision Tip', value: 'Escape velocity is independent of the escaping object\'s mass. From a rotating planet, launching eastward gives a boost equal to rotation speed.' },
      { label: 'Related Formula', value: 'v_esc = √(2GM/R). Orbital velocity: v_orb = √(GM/R) = v_esc/√2. Schwarzschild radius: R_s = 2GM/c².' },
      { label: 'Unit Conversion Note', value: 'Result in m/s. Convert to km/s: divide by 1000. Earth\'s G M = 3.986×10¹⁴ m³/s² (standard gravitational parameter).' },
    ]
  }),

  'orbital-velocity': (fields) => ({
    presets: [
      { label: 'ISS orbit (400 km altitude)', values: { mass: '5.97e24', radius: '6.77e6' } },
      { label: 'Geostationary orbit', values: { mass: '5.97e24', radius: '4.22e7' } },
      { label: 'GPS satellites (~20,200 km)', values: { mass: '5.97e24', radius: '2.66e7' } },
    ],
    defaults: { mass: '5.97e24', radius: '6.77e6' },
    extras: [
      { label: 'Real-World Application', value: 'Orbital velocity is critical for satellite deployment. Low Earth orbit (LEO): ~7.8 km/s at 200-2000 km. Geostationary: 3.07 km/s at 35,786 km.' },
      { label: 'Common Values', value: 'LEO (400 km): 7.67 km/s, ~90 min period. GEO: 3.07 km/s, 24 h period. Moon orbit: 1.02 km/s, ~27.3 days.' },
      { label: 'Precision Tip', value: 'Orbital velocity = √(GM/r). Period T = 2π√(r³/GM). Higher orbits = slower velocity but longer period (Kepler\'s third law).' },
      { label: 'Related Formula', value: 'v_orb = √(GM/r). v_esc = √(2) × v_orb. T = 2πr/v = 2π√(r³/GM). Vis-viva: v² = GM(2/r - 1/a).' },
      { label: 'Unit Conversion Note', value: 'G = 6.674×10⁻¹¹ N·m²/kg². Earth mass: 5.97×10²⁴ kg. Altitude above surface + Earth radius (6371 km) = orbital radius.' },
    ]
  }),

  'pendulum': (fields) => ({
    presets: [
      { label: '1 m pendulum (T ≈ 2 s)', values: { length: '1', gravity: '9.81' } },
      { label: 'Foucault pendulum (67 m)', values: { length: '67', gravity: '9.81' } },
      { label: 'Grandfather clock (0.25 m)', values: { length: '0.25', gravity: '9.81' } },
    ],
    defaults: { length: '1', gravity: '9.81' },
    extras: [
      { label: 'Real-World Application', value: 'Pendulums regulate clocks, measure gravity, and demonstrate Earth\'s rotation (Foucault pendulum). The 1 m pendulum has a period of ~2 seconds.' },
      { label: 'Common Values', value: 'g = 9.81 m/s² (Earth). g_Moon = 1.62 m/s². g_Mars = 3.71 m/s². 1 m pendulum on Earth: T = 2.01 s.' },
      { label: 'Precision Tip', value: 'Formula T = 2π√(L/g) is accurate for small angles (<15°). For larger angles, use the complete elliptic integral of the first kind.' },
      { label: 'Related Formula', value: 'Simple pendulum: T = 2π√(L/g). Physical pendulum: T = 2π√(I/mgd). Torsion pendulum: T = 2π√(I/κ).' },
      { label: 'Unit Conversion Note', value: 'Length in m. g in m/s². Period in s. Frequency f = 1/T in Hz. Angular frequency ω = 2π/T = √(g/L).' },
    ]
  }),

  'spring-force': (fields) => ({
    presets: [
      { label: 'Stretch 0.1 m (k=100 N/m)', values: { springConstant: '100', displacement: '0.1' } },
      { label: 'Car suspension (k=20000, 0.05 m)', values: { springConstant: '20000', displacement: '0.05' } },
      { label: 'Trampoline (k=5000, 0.3 m)', values: { springConstant: '5000', displacement: '0.3' } },
    ],
    defaults: { springConstant: '100', displacement: '0.1' },
    extras: [
      { label: 'Real-World Application', value: 'Hooke\'s law applies to car suspensions, mattresses, trampolines, and seismic sensors. Springs store elastic potential energy for mechanical systems.' },
      { label: 'Common Values', value: 'Pen spring: ~10 N/m. Mouse trap: ~50 N/m. Car suspension: ~20,000 N/m. Crane cable: ~10⁶ N/m. Human hair: ~10⁻³ N/m.' },
      { label: 'Precision Tip', value: 'Hooke\'s law F = -kx assumes small displacements within elastic limit. Beyond yield point, permanent deformation occurs.' },
      { label: 'Related Formula', value: 'F = -kx. Elastic PE: PE = ½kx². Spring-mass period: T = 2π√(m/k). Series springs: 1/k_eq = 1/k₁+1/k₂. Parallel: k_eq = k₁+k₂.' },
      { label: 'Unit Conversion Note', value: 'k in N/m. x in m. Convert cm to m: divide by 100. 1 N/m = 1 kg/s². lbf/in to N/m: multiply by 175.1.' },
    ]
  }),

  'capacitance': (fields) => ({
    presets: [
      { label: 'Parallel plate (1 m², 1 mm gap)', values: { area: '1', distance: '0.001' } },
      { label: 'Ceramic capacitor (10 μF)', values: { charge: '0.00005', voltage: '5' } },
      { label: 'Electrolytic (470 μF, 16 V)', values: { charge: '0.00752', voltage: '16' } },
    ],
    defaults: { area: '0.01', distance: '0.001' },
    extras: [
      { label: 'Real-World Application', value: 'Capacitors are essential in power supplies (smoothing), timing circuits (RC time constant), and camera flashes (rapid discharge).' },
      { label: 'Common Values', value: 'ε₀ = 8.854×10⁻¹² F/m. Ceramic: pF-nF range. Electrolytic: μF-mF range. Supercapacitors: up to farads. Typical USB decoupling: 100 nF.' },
      { label: 'Precision Tip', value: 'Parallel plate: C = ε₀ε_rA/d. Dielectric materials increase capacitance. Voltage rating must exceed circuit voltage to prevent breakdown.' },
      { label: 'Related Formula', value: 'Q = CV. Energy: E = ½CV² = ½QV. RC time constant: τ = RC. Capacitors in parallel: C_eq = C₁+C₂. In series: 1/C_eq = 1/C₁+1/C₂.' },
      { label: 'Unit Conversion Note', value: '1 F = 1 C/V. 1 μF = 10⁻⁶ F. 1 nF = 10⁻⁹ F. 1 pF = 10⁻¹² F. ε₀ = 8.854 × 10⁻¹² F/m.' },
    ]
  }),

  'magnetic-field': (fields) => {
    const isSolenoid = fields.some(f => /turns|n.*coil|length.*coil/.test(f.name) || /solenoid/.test(f.name.toLowerCase()))
    const isWire = fields.some(f => /distance.*wire|radius/.test(f.name))
    if (isSolenoid) {
      return {
        presets: [
          { label: 'Solenoid (100 turns, 10 cm, 2 A)', values: { turns: '100', length: '0.1', current: '2' } },
          { label: 'MRI magnet (2000 turns, 1.5 m, 200 A)', values: { turns: '2000', length: '1.5', current: '200' } },
          { label: 'Electromagnet (500 turns, 0.2 m, 5 A)', values: { turns: '500', length: '0.2', current: '5' } },
        ],
        defaults: { turns: '100', length: '0.1', current: '2' },
        extras: [
          { label: 'Real-World Application', value: 'Solenoids are used in MRI machines (1.5-3 T), particle accelerators, and electromagnetic door locks.' },
          { label: 'Common Values', value: 'Earth\'s magnetic field: ~5×10⁻⁵ T. Fridge magnet: ~5×10⁻³ T. MRI: 1.5-3 T. Strongest lab magnets: up to 45 T. μ₀ = 4π×10⁻⁷ T·m/A.' },
          { label: 'Precision Tip', value: 'Solenoid field B = μ₀nI (n = turns/m). Field is uniform inside an ideal solenoid. Edge effects reduce field near ends.' },
          { label: 'Related Formula', value: 'B = μ₀nI. Magnetic flux: Φ = BA. Self-inductance: L = NΦ/I. Energy stored: U = ½LI².' },
          { label: 'Unit Conversion Note', value: '1 T = 1 N/(A·m). 1 Gauss = 10⁻⁴ T. Earth\'s field ≈ 0.5 Gauss = 5×10⁻⁵ T.' },
        ]
      }
    }
    return {
      presets: [
        { label: 'Wire 1 cm from 10 A', values: { current: '10', distance: '0.01' } },
        { label: 'Power line 20 m from 100 A', values: { current: '100', distance: '20' } },
        { label: 'Lightning bolt (10 m, 30 kA)', values: { current: '30000', distance: '10' } },
      ],
      defaults: { current: '10', distance: '0.05' },
      extras: [
        { label: 'Real-World Application', value: 'Magnetic fields from currents power motors, generators, transformers, and wireless charging.' },
        { label: 'Common Values', value: 'μ₀ = 4π×10⁻⁷ T·m/A. Straight wire: B = μ₀I/(2πr). Loop center: B = μ₀I/(2R). Earth\'s field: ~5×10⁻⁵ T.' },
        { label: 'Precision Tip', value: 'Magnetic field direction is given by the right-hand rule. Field from a straight wire decreases as 1/r.' },
        { label: 'Related Formula', value: 'Biot-Savart law: dB = μ₀/4π × Idl×r̂/r². Ampère\'s law: ∮B·dl = μ₀I_enc. Force on a wire: F = ILB.' },
        { label: 'Unit Conversion Note', value: '1 T = 10⁴ Gauss. μ₀ = 4π×10⁻⁷ T·m/A = 1.2566×10⁻⁶ T·m/A.' },
      ]
    }
  },

  'magnetic-force': (fields) => {
    const hasCharge = fields.some(f => /q|charge/.test(f.name))
    if (hasCharge) {
      return {
        presets: [
          { label: 'Proton in LHC (7 TeV)', values: { charge: '1.6e-19', velocity: '2.998e8', field: '8.33' } },
          { label: 'Electron in CRT', values: { charge: '1.6e-19', velocity: '2e7', field: '0.01' } },
          { label: 'Ion in mass spectrometer', values: { charge: '1.6e-19', velocity: '1e5', field: '0.5' } },
        ],
        defaults: { charge: '1.6e-19', velocity: '1e6', field: '1' },
        extras: [
          { label: 'Real-World Application', value: 'Magnetic force on charges drives CRTs, mass spectrometers, and particle accelerators like the LHC (8.33 T bending magnets).' },
          { label: 'Common Values', value: 'Electron charge: 1.602×10⁻¹⁹ C. LHC magnetic field: 8.33 T. Earth\'s field: ~5×10⁻⁵ T. Fridge magnet: ~0.01 T.' },
          { label: 'Precision Tip', value: 'F = qvB sinθ. Force is perpendicular to both v and B (right-hand rule). No work done by magnetic force (F ⟂ v).' },
          { label: 'Related Formula', value: 'F = qv × B. Circular path radius: r = mv/qB. Cyclotron frequency: f = qB/2πm. Lorentz force: F = q(E + v×B).' },
          { label: 'Unit Conversion Note', value: 'B in T. q in C. v in m/s. 1 T = 1 N/(A·m). 1 eV = 1.602×10⁻¹⁹ J.' },
        ]
      }
    }
    return {
      presets: [
        { label: 'Wire in motor (0.5 m, 2 A, 0.5 T)', values: { current: '2', length: '0.5', field: '0.5' } },
        { label: 'Speaker coil (3 m, 1 A, 1 T)', values: { current: '1', length: '3', field: '1' } },
        { label: 'Power line (100 A, 50 μT)', values: { current: '100', length: '10', field: '0.00005' } },
      ],
      defaults: { current: '2', length: '0.5', field: '0.5' },
      extras: [
        { label: 'Real-World Application', value: 'Magnetic force on current-carrying wires powers electric motors, speakers, and galvanometers.' },
        { label: 'Common Values', value: 'F = ILB sinθ. Typical speaker magnet: ~1 T. Motor windings: 1-10 A. Voice coil length: 1-5 m.' },
        { label: 'Precision Tip', value: 'Force is perpendicular to both current direction and magnetic field. Maximum force when I ⟂ B. Zero when parallel.' },
        { label: 'Related Formula', value: 'F = IL × B. Torque on loop: τ = NIAB sinθ. Force between parallel wires: F/L = μ₀I₁I₂/(2πd).' },
        { label: 'Unit Conversion Note', value: 'I in A, L in m, B in T. 1 N = 1 A·m·T. 1 T = 1 N/(A·m).' },
      ]
    }
  },

  'rc-circuit': (fields) => ({
    presets: [
      { label: 'Decoupling cap (100 nF, 1 kΩ)', values: { resistance: '1000', capacitance: '1e-7' } },
      { label: 'Camera flash (100 μF, 10 kΩ)', values: { resistance: '10000', capacitance: '1e-4' } },
      { label: 'Tone control (47 nF, 10 kΩ)', values: { resistance: '10000', capacitance: '4.7e-8' } },
    ],
    defaults: { resistance: '1000', capacitance: '1e-6' },
    extras: [
      { label: 'Real-World Application', value: 'RC circuits are everywhere: coupling/decoupling capacitors, timing circuits (555 timer), audio filters, and power supply smoothing.' },
      { label: 'Common Values', value: 'τ = RC. Typical decoupling: 100 nF + 100 Ω → τ = 10 μs. Power supply smoothing: 470 μF + 1 kΩ → τ = 0.47 s.' },
      { label: 'Precision Tip', value: 'One time constant τ = RC. After 5τ, capacitor is 99.3% charged/discharged. Charging: V(t) = V₀(1 - e⁻ᵗ/ʳ).' },
      { label: 'Related Formula', value: 'τ = RC. Cutoff frequency: f_c = 1/(2πRC). Discharge: V(t) = V₀e⁻ᵗ/ʳ. Energy stored: E = ½CV².' },
      { label: 'Unit Conversion Note', value: 'R in Ω, C in F. τ in s. 1 μF = 10⁻⁶ F. 1 nF = 10⁻⁹ F. 1 pF = 10⁻¹² F.' },
    ]
  }),

  'rl-circuit': (fields) => ({
    presets: [
      { label: 'Inductor filter (10 mH, 10 Ω)', values: { inductance: '0.01', resistance: '10' } },
      { label: 'Motor winding (100 mH, 5 Ω)', values: { inductance: '0.1', resistance: '5' } },
      { label: 'Solenoid (1 H, 100 Ω)', values: { inductance: '1', resistance: '100' } },
    ],
    defaults: { inductance: '0.01', resistance: '10' },
    extras: [
      { label: 'Real-World Application', value: 'RL circuits model motor windings, transformer coils, and inductor-based power supply filters.' },
      { label: 'Common Values', value: 'τ = L/R. Time constant: 10 mH + 10 Ω → τ = 1 ms. Motor inductance: 1-100 mH. Speaker crossover: 0.5-5 mH.' },
      { label: 'Precision Tip', value: 'After 5τ, current reaches 99.3% of steady state. Current growth: I(t) = V/R(1 - e⁻ᵗʳ/ᴸ). Energy stored: U = ½LI².' },
      { label: 'Related Formula', value: 'τ = L/R. Cutoff frequency: f_c = R/(2πL). Impedance: Z_L = jωL. Voltage across L: V_L = L(dI/dt).' },
      { label: 'Unit Conversion Note', value: 'L in H, R in Ω. τ in s. 1 mH = 10⁻³ H. 1 μH = 10⁻⁶ H. 1 henry = 1 Wb/A = 1 V·s/A.' },
    ]
  }),

  'lc-circuit': (fields) => ({
    presets: [
      { label: 'FM radio (100 MHz)', values: { inductance: '2.53e-7', capacitance: '1e-11' } },
      { label: 'AM radio (1 MHz)', values: { inductance: '2.53e-4', capacitance: '1e-10' } },
      { label: 'Tesla coil (10 mH, 10 nF)', values: { inductance: '0.01', capacitance: '1e-8' } },
    ],
    defaults: { inductance: '0.001', capacitance: '1e-9' },
    extras: [
      { label: 'Real-World Application', value: 'LC circuits are the basis for radio tuning (AM/FM), oscillators, Tesla coils, and wireless power transfer.' },
      { label: 'Common Values', value: 'FM radio: 88-108 MHz. AM radio: 530-1700 kHz. Wi-Fi: 2.4 GHz. Tesla coil: 50-500 kHz. Characteristic impedance: Z₀ = √(L/C).' },
      { label: 'Precision Tip', value: 'f₀ = 1/(2π√(LC)). At resonance, impedance is purely resistive. Energy oscillates between E-field (capacitor) and B-field (inductor).' },
      { label: 'Related Formula', value: 'f₀ = 1/(2π√(LC)). Quality factor: Q = 1/R × √(L/C). Ringing frequency: ω₀ = 1/√(LC). Bandwidth: Δf = f₀/Q.' },
      { label: 'Unit Conversion Note', value: 'L in H, C in F. f₀ in Hz. 1 pF = 10⁻¹² F. 1 nF = 10⁻⁹ F. 1 μF = 10⁻⁶ F. 1 mH = 10⁻³ H. 1 μH = 10⁻⁶ H.' },
    ]
  }),

  'photon-energy': (fields) => ({
    presets: [
      { label: 'Red light (700 nm)', values: { wavelength: '7e-7' } },
      { label: 'Blue light (450 nm)', values: { wavelength: '4.5e-7' } },
      { label: 'X-ray (0.1 nm)', values: { wavelength: '1e-10' } },
      { label: 'Gamma ray (0.001 nm)', values: { wavelength: '1e-12' } },
    ],
    defaults: { wavelength: '5e-7' },
    extras: [
      { label: 'Real-World Application', value: 'Photon energy determines light color, photosynthesis efficiency, and medical imaging (X-rays need higher energy to penetrate tissue).' },
      { label: 'Common Values', value: 'Red (700 nm): 1.77 eV. Green (550 nm): 2.25 eV. Blue (450 nm): 2.76 eV. UV (100 nm): 12.4 eV. X-ray (0.1 nm): 12.4 keV.' },
      { label: 'Precision Tip', value: 'E = hf = hc/λ. h = 6.626×10⁻³⁴ J·s = 4.136×10⁻¹⁵ eV·s. hc = 1240 eV·nm. Short wavelength = high energy.' },
      { label: 'Related Formula', value: 'E = hf. Photoelectric effect: KE_max = hf - φ. Compton scattering: Δλ = h/(mc)(1 - cosθ). Momentum: p = h/λ.' },
      { label: 'Unit Conversion Note', value: '1 eV = 1.602×10⁻¹⁹ J. h = 6.626×10⁻³⁴ J·s. hc = 1240 eV·nm. Wavelength in m or nm. 1 nm = 10⁻⁹ m.' },
    ]
  }),

  'photoelectric': (fields) => ({
    presets: [
      { label: 'Sodium (φ=2.28 eV, 400 nm)', values: { workFunction: '2.28', wavelength: '4e-7' } },
      { label: 'Cesium (φ=1.95 eV, 500 nm)', values: { workFunction: '1.95', wavelength: '5e-7' } },
      { label: 'Nickel (φ=5.01 eV, 200 nm)', values: { workFunction: '5.01', wavelength: '2e-7' } },
    ],
    defaults: { workFunction: '2.28', wavelength: '4e-7' },
    extras: [
      { label: 'Real-World Application', value: 'The photoelectric effect proved light quantization (Einstein, 1905 Nobel Prize). Used in solar panels, photomultipliers, and night vision.' },
      { label: 'Common Values', value: 'Cesium: φ=1.95 eV. Sodium: φ=2.28 eV. Calcium: φ=2.87 eV. Copper: φ=4.48 eV. Nickel: φ=5.01 eV. Threshold λ = hc/φ.' },
      { label: 'Precision Tip', value: 'KE_max = hf - φ. If f < f_threshold (φ/h), no electrons emitted. Einstein\'s equation: KE_max = hf - φ. Stopping potential: eV_s = KE_max.' },
      { label: 'Related Formula', value: 'E = hf = hc/λ. φ = hf_threshold. Stopping potential: V_s = (hf - φ)/e. Compton effect: Δλ = h/(mc)(1 - cosθ).' },
      { label: 'Unit Conversion Note', value: 'φ in eV. 1 eV = 1.602×10⁻¹⁹ J. h = 4.136×10⁻¹⁵ eV·s. hc = 1240 eV·nm. Threshold: λ₀ = hc/φ.' },
    ]
  }),

  'nuclear-decay': (fields) => ({
    presets: [
      { label: 'Carbon-14 (5730 year half-life)', values: { halfLife: '5730', time: '1000', initial: '100' } },
      { label: 'Uranium-238 (4.47 Ga half-life)', values: { halfLife: '4.47e9', time: '1e9', initial: '100' } },
      { label: 'Iodine-131 (8.02 days)', values: { halfLife: '8.02', time: '16.04', initial: '100' } },
    ],
    defaults: { halfLife: '5730', time: '1000', initial: '100' },
    extras: [
      { label: 'Real-World Application', value: 'Radioactive decay enables radiometric dating (carbon-14 for archaeology, uranium-lead for geology) and medical imaging (technetium-99m, half-life 6 h).' },
      { label: 'Common Values', value: 'C-14: 5730 yr. U-238: 4.47×10⁹ yr. I-131: 8.02 days. Tc-99m: 6.01 h. Rn-222: 3.82 days. Po-210: 138 days.' },
      { label: 'Precision Tip', value: 'N = N₀(½)^(t/t_½). Decay constant λ = ln(2)/t_½. Activity A = λN. One half-life reduces activity by 50%.' },
      { label: 'Related Formula', value: 'N = N₀e^(-λt). t_½ = ln(2)/λ. Mean lifetime τ = 1/λ. Activity: A = λN = A₀e^(-λt). Carbon dating: t = (1/λ)ln(N₀/N).' },
      { label: 'Unit Conversion Note', value: 'Half-life and time in same units. Decay constant λ in 1/time. Activity in Bq (decays/s) or Ci (3.7×10¹⁰ Bq).' },
    ]
  }),

  'carbon-dating': (fields) => ({
    presets: [
      { label: 'Ancient artifact (50% remaining)', values: { remaining: '50', initial: '100' } },
      { label: 'Egyptian mummy (68% remaining)', values: { remaining: '68', initial: '100' } },
      { label: 'Ice age sample (25% remaining)', values: { remaining: '25', initial: '100' } },
    ],
    defaults: { remaining: '50', initial: '100' },
    extras: [
      { label: 'Real-World Application', value: 'Carbon-14 dating determines the age of organic materials up to ~50,000 years. Used for archaeological artifacts, fossils, and climate records.' },
      { label: 'Common Values', value: 'C-14 half-life: 5730 yr. Dead organism: C-14 decays without replenishment. Shroud of Turin (dated to 1260-1390 AD). Dead Sea Scrolls: ~2000 yr.' },
      { label: 'Precision Tip', value: 'Carbon dating assumes constant atmospheric C-14 levels. Calibration curves correct for variations. Limit: ~50,000 yr (beyond, too little C-14).' },
      { label: 'Related Formula', value: 't = -(t_½/ln2) × ln(N/N₀). N/N₀ = 2^(-t/t_½). λ = ln(2)/5730 yr⁻¹. Libby half-life: 5568 yr (original).' },
      { label: 'Unit Conversion Note', value: 'Result in years. Enter remaining as percentage (e.g., 50 for 50%). Half-life: 5730 years (Cambridge convention).' },
    ]
  }),

  'nuclear-fission': (fields) => ({
    presets: [
      { label: 'U-235 + n → Ba-141 + Kr-92', values: { massBefore: '236.0526', massAfter: '235.8493' } },
      { label: 'U-235 typical fission (200 MeV)', values: { massBefore: '236.0526', massAfter: '235.850' } },
      { label: 'Pu-239 fission (210 MeV)', values: { massBefore: '240.0538', massAfter: '239.850' } },
    ],
    defaults: { massBefore: '236.0526', massAfter: '235.8493' },
    extras: [
      { label: 'Real-World Application', value: 'Nuclear fission powers 10% of global electricity. One U-235 fission releases ~200 MeV. 1 kg U-235 = 24 GWh ≈ 3000 tons of coal.' },
      { label: 'Common Values', value: 'U-235 fission: ~200 MeV released. Mass defect: ~0.1 u (0.1%). Energy: E = Δm·c². 1 u = 931.5 MeV/c².' },
      { label: 'Precision Tip', value: 'Δm = mass_before - mass_after. E = Δm × c². 1 atomic mass unit (u) = 1.6605×10⁻²⁷ kg = 931.5 MeV/c².' },
      { label: 'Related Formula', value: 'E = Δmc². Binding energy per nucleon. Chain reaction: neutron multiplication factor k. Critical mass for U-235: ~52 kg.' },
      { label: 'Unit Conversion Note', value: 'Mass in u (atomic mass units). 1 u = 1.6605×10⁻²⁷ kg. c = 2.998×10⁸ m/s. 1 MeV = 1.602×10⁻¹³ J.' },
    ]
  }),

  'nuclear-fusion': (fields) => ({
    presets: [
      { label: 'p-p chain (H→He)', values: { massBefore: '4.0291', massAfter: '4.0026' } },
      { label: 'D-T fusion (reactor)', values: { massBefore: '5.0303', massAfter: '5.0112' } },
      { label: 'D-D fusion', values: { massBefore: '4.0282', massAfter: '4.0026' } },
    ],
    defaults: { massBefore: '5.0303', massAfter: '5.0112' },
    extras: [
      { label: 'Real-World Application', value: 'Nuclear fusion powers the Sun and stars. ITER aims for net energy from D-T fusion. D-T reaction releases 17.6 MeV per reaction.' },
      { label: 'Common Values', value: 'D-T fusion: 17.6 MeV. D-D: ~4.0 MeV. p-p chain: 26.73 MeV per ⁴He. Solar core: 15 million K. ITER goal: 500 MW from 50 MW input.' },
      { label: 'Precision Tip', value: 'Fusion requires overcoming Coulomb barrier (high temperature ~100 million K). Mass defect calculates energy via E = Δmc².' },
      { label: 'Related Formula', value: 'E = Δmc². Lawson criterion: nτ > 10²⁰ s/m³ for D-T. Cross-section peaks at ~100 keV for D-T. Tokamak magnetic confinement.' },
      { label: 'Unit Conversion Note', value: 'Mass in u. 1 u = 931.5 MeV/c². Temperature conversion: 1 eV = 11,605 K. 100 million K ≈ 8.6 keV.' },
    ]
  }),

  'mass-energy': (fields) => ({
    presets: [
      { label: '1 kg mass-energy equivalent', values: { mass: '1' } },
      { label: '1 g to energy', values: { mass: '0.001' } },
      { label: '1 atomic mass unit', values: { mass: '1.66e-27' } },
      { label: 'Electron mass', values: { mass: '9.11e-31' } },
    ],
    defaults: { mass: '1' },
    extras: [
      { label: 'Real-World Application', value: 'E=mc² is the most famous equation in physics. 1 kg of mass converts to 9×10¹⁶ J — enough to power a city for a year.' },
      { label: 'Common Values', value: '1 kg → 9×10¹⁶ J. 1 g → 9×10¹³ J. 1 u (1.66×10⁻²⁷ kg) → 931.5 MeV. Electron mass → 511 keV. Proton mass → 938.3 MeV.' },
      { label: 'Precision Tip', value: 'Mass-energy equivalence applies to all forms of energy. Chemical reactions release ~1 eV per atom, nuclear reactions release ~1-200 MeV per nucleus.' },
      { label: 'Related Formula', value: 'E = mc². 1 u = 931.494 MeV/c². Binding energy: B = (Zm_p + Nm_n - M_nucleus)c². Annihilation: e⁺ + e⁻ → 2γ (1.022 MeV).' },
      { label: 'Unit Conversion Note', value: 'c = 2.998×10⁸ m/s. 1 J = 1 kg·m²/s². 1 eV = 1.602×10⁻¹⁹ J. 1 kWh = 3.6×10⁶ J. Mass in kg.' },
    ]
  }),

  'relativity': (fields) => ({
    presets: [
      { label: 'Voyager (17 km/s = 0.000057c)', values: { velocity: '17000' } },
      { label: 'LHC proton (0.99999999c)', values: { velocity: '2.99792458e8' } },
      { label: 'Fast spacecraft (0.5c)', values: { velocity: '1.5e8' } },
    ],
    defaults: { velocity: '1e8' },
    extras: [
      { label: 'Real-World Application', value: 'Special relativity is essential for GPS (satellites moving at 3.9 km/s need relativistic corrections of 38 μs/day). LHC protons at 0.99999999c.' },
      { label: 'Common Values', value: 'γ = 1/√(1-v²/c²). At 0.1c: γ = 1.005. At 0.5c: γ = 1.155. At 0.9c: γ = 2.29. At 0.99c: γ = 7.09. At 0.999c: γ = 22.4.' },
      { label: 'Precision Tip', value: 'Relativistic effects become significant above 0.1c. Time dilation: Δt = γΔt₀. Length contraction: L = L₀/γ. Momentum: p = γmv.' },
      { label: 'Related Formula', value: 'γ = 1/√(1-β²) where β = v/c. Lorentz transformation. E² = (pc)² + (mc²)². Relativistic KE = (γ-1)mc².' },
      { label: 'Unit Conversion Note', value: 'c = 2.998×10⁸ m/s. Enter v in m/s. β = v/c (dimensionless). γ is dimensionless. 1 ly/year = c. 1 AU/year ≈ 4.74 km/s.' },
    ]
  }),

  'time-dilation': (fields) => ({
    presets: [
      { label: 'GPS satellite (3.9 km/s, 1 day)', values: { velocity: '3900', properTime: '86400' } },
      { label: 'Muon in atmosphere (0.998c, 2.2 μs)', values: { velocity: '2.994e8', properTime: '2.2e-6' } },
      { label: 'LHC proton (0.99999999c, 1 h)', values: { velocity: '2.99792457e8', properTime: '3600' } },
    ],
    defaults: { velocity: '3e7', properTime: '3600' },
    extras: [
      { label: 'Real-World Application', value: 'GPS satellites experience 38 μs/day time dilation (special + general relativity), requiring correction or position errors of ~11 km/day.' },
      { label: 'Common Values', value: 'γ=2 at 0.866c. Muons (2.2 μs half-life) reach Earth\'s surface from 10 km up due to time dilation. ISS (7.7 km/s): γ = 1.00000000033.' },
      { label: 'Precision Tip', value: 'Δt = γΔt₀ where Δt₀ is proper time (in the moving frame). Moving clocks run slow. Twin paradox: traveling twin ages less.' },
      { label: 'Related Formula', value: 'Δt = Δt₀/√(1-v²/c²). Also: length contraction L = L₀√(1-v²/c²). Relativistic Doppler: f_obs = f_src√((1-β)/(1+β)).' },
      { label: 'Unit Conversion Note', value: 'c = 2.998×10⁸ m/s. v in m/s. Time in any unit (both inputs must match). γ = 1/√(1-v²/c²).' },
    ]
  }),

  'schrodinger': (fields) => ({
    presets: [
      { label: 'Electron in 1D box (1 nm)', values: { length: '1e-9', n: '1' } },
      { label: 'Electron n=2 (1 nm box)', values: { length: '1e-9', n: '2' } },
      { label: 'Proton in nucleus (1 fm)', values: { length: '1e-15', n: '1' } },
    ],
    defaults: { length: '1e-9', n: '1' },
    extras: [
      { label: 'Real-World Application', value: 'The Schrödinger equation describes quantum systems — from electron orbitals in atoms to energy levels in quantum dots and semiconductor wells.' },
      { label: 'Common Values', value: 'h = 6.626×10⁻³⁴ J·s. ħ = h/2π = 1.055×10⁻³⁴ J·s. m_e = 9.11×10⁻³¹ kg. 1 nm box: E₁ = 0.376 eV. 1 fm box: E₁ = 376 MeV.' },
      { label: 'Precision Tip', value: 'Infinite square well: E_n = n²h²/(8mL²). Wavefunctions: ψ_n(x) = √(2/L) sin(nπx/L). n = 1 is ground state (lowest energy).' },
      { label: 'Related Formula', value: 'E_n = n²h²/(8mL²). Finite well: fewer bound states. Harmonic oscillator: E_n = (n+½)ħω. Hydrogen atom: E_n = -13.6/n² eV.' },
      { label: 'Unit Conversion Note', value: 'L in m. E in J; divide by 1.602×10⁻¹⁹ for eV. 1 nm = 10⁻⁹ m. 1 fm = 10⁻¹⁵ m. m_e = 9.11×10⁻³¹ kg.' },
    ]
  }),

  'heisenberg': (fields) => ({
    presets: [
      { label: 'Electron in atom (Δx=0.1 nm)', values: { positionUncertainty: '1e-10' } },
      { label: 'Electron in nucleus (Δx=1 fm)', values: { positionUncertainty: '1e-15' } },
      { label: 'Macroscopic (Δx=1 μm)', values: { positionUncertainty: '1e-6' } },
    ],
    defaults: { positionUncertainty: '1e-10' },
    extras: [
      { label: 'Real-World Application', value: 'Heisenberg\'s uncertainty principle sets fundamental limits on measurement. Electron in an atom (Δx~0.1 nm): Δv ~ 5.8×10⁵ m/s.' },
      { label: 'Common Values', value: 'ħ = 1.055×10⁻³⁴ J·s. Δx·Δp ≥ ħ/2. Δx·Δv ≥ ħ/(2m). For m_e: Δx=1 nm → Δv ≥ 5.8×10⁴ m/s. For m=1 g: Δx=1 μm → Δv ≥ 5.3×10⁻²⁶ m/s.' },
      { label: 'Precision Tip', value: 'The uncertainty principle is not about measurement error — it\'s a fundamental property of quantum systems. A particle cannot simultaneously have precise position and momentum.' },
      { label: 'Related Formula', value: 'Δx·Δp ≥ ħ/2. Also: ΔE·Δt ≥ ħ/2 (energy-time uncertainty). John Bell: √(Δx²Δp²) ≥ ħ/2 (Robertson-Schrödinger).' },
      { label: 'Unit Conversion Note', value: 'ħ = h/2π = 1.055×10⁻³⁴ J·s. Δx in m. Δp = mΔv in kg·m/s. Result in m/s for Δv. Convert to J·s via h or ħ.' },
    ]
  }),

  'lens': (fields) => ({
    presets: [
      { label: 'Magnifying glass (f=10 cm, d=15 cm)', values: { focalLength: '0.1', objectDistance: '0.15' } },
      { label: 'Camera lens (f=50 mm, d=5 m)', values: { focalLength: '0.05', objectDistance: '5' } },
      { label: 'Reading glasses (f=40 cm, d=25 cm)', values: { focalLength: '0.4', objectDistance: '0.25' } },
    ],
    defaults: { focalLength: '0.1', objectDistance: '0.2' },
    extras: [
      { label: 'Real-World Application', value: 'Lens equation is used in cameras, eyeglasses, microscopes, and telescopes. Determines image position, size, and type (real/virtual).' },
      { label: 'Common Values', value: 'Human eye: f ≈ 17 mm. Reading glasses: +2.5 D (f=40 cm). Camera lens: 24-200 mm. Magnifying glass: f=5-20 cm. Power in diopters: D = 1/f.' },
      { label: 'Precision Tip', value: '1/f = 1/d_o + 1/d_i. Positive f = converging lens. Negative f = diverging. Real image: d_i > 0. Virtual: d_i < 0. Magnification M = -d_i/d_o.' },
      { label: 'Related Formula', value: 'Thin lens: 1/f = 1/d_o + 1/d_i. Lens maker: 1/f = (n-1)(1/R₁ - 1/R₂). Magnification: M = h_i/h_o = -d_i/d_o. Power: P = 1/f (diopters).' },
      { label: 'Unit Conversion Note', value: 'f, d_o, d_i in same units (typically m). Diopters: 1/f in m⁻¹. 25 cm = near point of human eye. Convert cm to m: divide by 100.' },
    ]
  }),

  'quantum-tunneling': (fields) => ({
    presets: [
      { label: 'Electron through 1 nm barrier (1 eV)', values: { energy: '1', barrierHeight: '5', barrierWidth: '1e-9', mass: '9.11e-31' } },
      { label: 'Alpha decay (8 MeV, 20 fm)', values: { energy: '8e6', barrierHeight: '30e6', barrierWidth: '2e-14', mass: '6.64e-27' } },
      { label: 'STM tip (2 eV, 0.5 nm)', values: { energy: '2', barrierHeight: '4', barrierWidth: '5e-10', mass: '9.11e-31' } },
    ],
    defaults: { energy: '1', barrierHeight: '5', barrierWidth: '1e-9', mass: '9.11e-31' },
    extras: [
      { label: 'Real-World Application', value: 'Quantum tunneling enables Scanning Tunneling Microscopy (STM) which images individual atoms, flash memory (Fowler-Nordheim tunneling), and alpha decay.' },
      { label: 'Common Values', value: 'Transmission probability T ≈ 16E(V₀-E)/V₀² × e^(-2κa). κ = √(2m(V₀-E))/ħ. STM: exponential sensitivity to distance — Å resolution.' },
      { label: 'Precision Tip', value: 'Tunneling probability drops exponentially with barrier width and mass. Heavy particles (α) need very narrow barriers. Electrons tunnel easily at nm scales.' },
      { label: 'Related Formula', value: 'Transmission: T ≈ 16E(V₀-E)/V₀² × e^(-2κa). κ = √(2m(V₀-E))/ħ. WKB approximation for non-rectangular barriers.' },
      { label: 'Unit Conversion Note', value: 'E in eV. 1 eV = 1.602×10⁻¹⁹ J. Width in m. ħ = 1.055×10⁻³⁴ J·s. m_e = 9.11×10⁻³¹ kg. ħc = 197 eV·nm.' },
    ]
  }),

  'blackbody': (fields) => ({
    presets: [
      { label: 'Sun (surface ~5778 K)', values: { temperature: '5778' } },
      { label: 'Room temperature (300 K)', values: { temperature: '300' } },
      { label: 'Red giant star (3500 K)', values: { temperature: '3500' } },
      { label: 'White dwarf (20000 K)', values: { temperature: '20000' } },
    ],
    defaults: { temperature: '5778' },
    extras: [
      { label: 'Real-World Application', value: 'Blackbody radiation explains star colors, incandescent bulbs, and thermal imaging. The Sun\'s 5778 K surface peaks in visible light (green at ~500 nm).' },
      { label: 'Common Values', value: 'Wien\'s law: λ_max = b/T (b = 2.898×10⁻³ m·K). Sun (5778 K): λ=500 nm. Room (300 K): λ=9.7 μm (infrared). Steel melting (1811 K): λ=1.6 μm.' },
      { label: 'Precision Tip', value: 'Stefan-Boltzmann law: P = σεAT⁴. σ = 5.67×10⁻⁸ W/(m²·K⁴). Real objects are gray bodies (emissivity ε < 1).' },
      { label: 'Related Formula', value: 'Wien: λ_max = b/T. Stefan-Boltzmann: P = σAT⁴. Planck: u(λ) = 8πhc/λ⁵ × 1/(e^(hc/λkT)-1). Rayleigh-Jeans: classical limit.' },
      { label: 'Unit Conversion Note', value: 'T in K. λ in m or nm. b = 2.898×10⁻³ m·K. σ = 5.67×10⁻⁸ W/(m²·K⁴). h = 6.626×10⁻³⁴ J·s. k_B = 1.381×10⁻²³ J/K.' },
    ]
  }),

  'compton': (fields) => ({
    presets: [
      { label: 'X-ray (0.1 nm) scattered 90°', values: { wavelength: '1e-10', angle: '90' } },
      { label: 'Gamma ray (0.01 nm) scattered 180°', values: { wavelength: '1e-11', angle: '180' } },
      { label: 'Visible light (500 nm) scattered 45°', values: { wavelength: '5e-7', angle: '45' } },
    ],
    defaults: { wavelength: '1e-10', angle: '90' },
    extras: [
      { label: 'Real-World Application', value: 'Compton scattering demonstrated light particle nature (Compton, 1927 Nobel Prize). Used in medical imaging (Compton cameras) and X-ray spectroscopy.' },
      { label: 'Common Values', value: 'Compton wavelength of electron: λ_C = h/(m_ec) = 2.426×10⁻¹² m. Δλ = λ_C(1 - cosθ). Max Δλ at 180°: 2λ_C = 0.00485 nm.' },
      { label: 'Precision Tip', value: 'Δλ = h/(m_ec)(1 - cosθ). λ_C = h/(mc) = 2.43 pm for electron. Energy shift is significant for X-rays and gamma rays, negligible for visible light.' },
      { label: 'Related Formula', value: 'Δλ = h/(m_ec)(1 - cosθ). λ_C = 2.426×10⁻¹² m. Scattered photon energy: E\' = E/(1+(E/mc²)(1-cosθ)). KE_recoil = hc/λ - hc/λ\'.' },
      { label: 'Unit Conversion Note', value: 'λ in m. θ in degrees. λ_C = h/(m_ec) = 2.426 pm. h/m_ec = 2.426×10⁻¹² m. 1 pm = 10⁻¹² m. 1 Å = 10⁻¹⁰ m.' },
    ]
  }),

  'resistor-color': (fields) => ({
    presets: [
      { label: 'Red-Violet-Orange-Gold (27 kΩ, 5%)', values: { band1: 'red', band2: 'violet', band3: 'orange', band4: 'gold' } },
      { label: 'Brown-Black-Red-Silver (1 kΩ, 10%)', values: { band1: 'brown', band2: 'black', band3: 'red', band4: 'silver' } },
      { label: 'Yellow-Violet-Black (47 Ω, 20%)', values: { band1: 'yellow', band2: 'violet', band3: 'black', band4: 'none' } },
    ],
    defaults: { band1: 'brown', band2: 'black', band3: 'red', band4: 'gold' },
    extras: [
      { label: 'Real-World Application', value: 'Resistor color codes identify resistance values for electronics. Every hobbyist and engineer reads these daily when building circuits.' },
      { label: 'Common Values', value: 'Black=0, Brown=1, Red=2, Orange=3, Yellow=4, Green=5, Blue=6, Violet=7, Gray=8, White=9. Gold=±5%, Silver=±10%, None=±20%.' },
      { label: 'Precision Tip', value: 'First two bands = digits. Third band = multiplier (10^n). Fourth band = tolerance. Example: Red-Red-Orange-Gold = 22×10³ Ω = 22 kΩ ±5%.' },
      { label: 'Related Formula', value: 'R = (10×digit1 + digit2) × 10^multiplier. EIA-96 (SMD): 3-digit code with multiplier. 0 Ω jumper is a single black band.' },
      { label: 'Unit Conversion Note', value: 'Values in Ω. 1 kΩ = 10³ Ω. 1 MΩ = 10⁶ Ω. 1 GΩ = 10⁹ Ω. 1 mΩ = 10⁻³ Ω.' },
    ]
  }),

  'spring-mass': (fields) => ({
    presets: [
      { label: 'Car suspension (m=300 kg, k=20000)', values: { mass: '300', springConstant: '20000' } },
      { label: 'Pogo stick (m=70 kg, k=5000)', values: { mass: '70', springConstant: '5000' } },
      { label: 'Lab spring (m=0.5 kg, k=100)', values: { mass: '0.5', springConstant: '100' } },
    ],
    defaults: { mass: '1', springConstant: '100' },
    extras: [
      { label: 'Real-World Application', value: 'Spring-mass systems model vehicle suspensions, building oscillations, and mechanical vibrations. Natural frequency determines resonance behavior.' },
      { label: 'Common Values', value: 'T = 2π√(m/k). Mass on k=100 N/m spring: m=1 kg → T=0.628 s, f=1.59 Hz. Car on springs: ~1-2 Hz. Building: ~0.1-0.5 Hz.' },
      { label: 'Precision Tip', value: 'Simple harmonic oscillator: ω = √(k/m). Period independent of amplitude (small oscillations). Damping reduces frequency slightly.' },
      { label: 'Related Formula', value: 'T = 2π√(m/k). f = 1/(2π)√(k/m). Energy: E = ½kA² = ½mv²_max. Damped: ω\' = √(k/m - b²/4m²).' },
      { label: 'Unit Conversion Note', value: 'm in kg. k in N/m. T in s. f in Hz. ω in rad/s. Converting: f = ω/2π, T = 2π/ω = 1/f.' },
    ]
  }),

  'rlc-circuit': (fields) => ({
    presets: [
      { label: 'Band-pass filter (10 mH, 100 nF, 10 Ω)', values: { inductance: '0.01', capacitance: '1e-7', resistance: '10' } },
      { label: 'AM radio (5 mH, 200 pF, 50 Ω)', values: { inductance: '0.005', capacitance: '2e-10', resistance: '50' } },
      { label: 'Crossover (1 mH, 10 μF, 4 Ω)', values: { inductance: '0.001', capacitance: '1e-5', resistance: '4' } },
    ],
    defaults: { inductance: '0.01', resistance: '10', capacitance: '1e-7' },
    extras: [
      { label: 'Real-World Application', value: 'RLC circuits are fundamental to radio receivers (tuned circuits), audio crossovers, and power factor correction.' },
      { label: 'Common Values', value: 'Resonant frequency: f₀ = 1/(2π√(LC)). Q factor: Q = 1/R × √(L/C). Bandwidth: Δf = f₀/Q.' },
      { label: 'Precision Tip', value: 'At resonance, impedance is purely resistive (Z=R). Underdamped: R < 2√(L/C). Critically damped: R = 2√(L/C). Overdamped: R > 2√(L/C).' },
      { label: 'Related Formula', value: 'f₀ = 1/(2π√(LC)). Z = R + j(ωL - 1/ωC). Q = ω₀L/R = 1/(ω₀RC). Damping factor: ζ = R/2 × √(C/L).' },
      { label: 'Unit Conversion Note', value: 'L in H, C in F, R in Ω. f₀ in Hz. 1 nF = 10⁻⁹ F. 1 μF = 10⁻⁶ F. 1 mH = 10⁻³ H. 1 μH = 10⁻⁶ H.' },
    ]
  }),

  'density': (fields) => ({
    presets: [
      { label: 'Water (1 L / 1 kg)', values: { mass: '1', volume: '0.001' } },
      { label: 'Gold bar (1 kg, 51.8 cm³)', values: { mass: '1', volume: '0.0000518' } },
      { label: 'Air (1 m³, 1.225 kg)', values: { mass: '1.225', volume: '1' } },
    ],
    defaults: { mass: '1', volume: '0.001' },
    extras: [
      { label: 'Real-World Application', value: 'Density determines buoyancy (why ships float), material identification, and quality control. Gold (19,300 kg/m³) is twice as dense as lead (11,340).' },
      { label: 'Common Values', value: 'Air: 1.225 kg/m³. Water: 1000 kg/m³. Aluminum: 2700. Iron: 7874. Copper: 8960. Lead: 11,340. Gold: 19,300. Osmium: 22,590 (densest element).' },
      { label: 'Precision Tip', value: 'Density varies with temperature and pressure. Most substances expand when heated (lower density). Water is densest at 4°C.' },
      { label: 'Related Formula', value: 'ρ = m/V. Specific gravity = ρ/ρ_water. Buoyant force: F_b = ρ_fluid × V × g. Ideal gas: ρ = PM/RT.' },
      { label: 'Unit Conversion Note', value: 'Standard: kg/m³. 1 g/cm³ = 1000 kg/m³. 1 kg/L = 1000 kg/m³. Water: 1 g/cm³ = 1000 kg/m³.' },
    ]
  }),

  'pressure': (fields) => ({
    presets: [
      { label: 'Atmospheric pressure (sea level)', values: { force: '101325', area: '1' } },
      { label: 'Car tire (32 psi)', values: { force: '22063', area: '0.01' } },
      { label: 'Elephant foot (0.1 m², 5000 kg)', values: { force: '49050', area: '0.1' } },
    ],
    defaults: { force: '1000', area: '0.01' },
    extras: [
      { label: 'Real-World Application', value: 'Pressure explains why sharp knives cut better (small area = high pressure), why snowshoes prevent sinking, and how hydraulic systems multiply force.' },
      { label: 'Common Values', value: '1 atm = 101,325 Pa. Car tire: 220 kPa (32 psi). Blood pressure: ~16 kPa (120 mmHg). Deep ocean (10 m): 2 atm. Atmospheric pressure decreases by ~12 Pa/m.' },
      { label: 'Precision Tip', value: 'Pressure = force/area. In fluids: P = ρgh (hydrostatic pressure). Gauge pressure = absolute - atmospheric. A 1 Pa = 1 N/m².' },
      { label: 'Related Formula', value: 'P = F/A. P = ρgh. Pascal\'s principle: F₁/A₁ = F₂/A₂. Ideal gas: PV = nRT. Bernoulli: P + ½ρv² + ρgh = constant.' },
      { label: 'Unit Conversion Note', value: '1 Pa = 1 N/m². 1 atm = 101,325 Pa. 1 bar = 10⁵ Pa. 1 psi = 6895 Pa. 1 mmHg = 133.3 Pa.' },
    ]
  }),

  'fluid-flow': (fields) => ({
    presets: [
      { label: 'Garden hose (2 cm diam, 2 m/s)', values: { diameter: '0.02', velocity: '2' } },
      { label: 'Water pipe (5 cm diam, 1.5 m/s)', values: { diameter: '0.05', velocity: '1.5' } },
      { label: 'IV drip (0.5 mm, 0.1 m/s)', values: { diameter: '0.0005', velocity: '0.1' } },
    ],
    defaults: { diameter: '0.02', velocity: '2' },
    extras: [
      { label: 'Real-World Application', value: 'Flow rate is critical for plumbing design, medical IVs, industrial piping, and river flow measurements.' },
      { label: 'Common Values', value: 'Garden hose: ~10-20 L/min. Shower head: ~8-15 L/min. Household main: ~15-20 L/min at 3 bar. Fire hose: ~500 L/min at 7 bar.' },
      { label: 'Precision Tip', value: 'Flow rate Q = A × v = πr² × v. Continuity: A₁v₁ = A₂v₂ (mass conservation). Real flow has viscosity (Poiseuille law for pipes).' },
      { label: 'Related Formula', value: 'Q = Av. Continuity: A₁v₁ = A₂v₂. Poiseuille: Q = πr⁴ΔP/(8ηL). Bernoulli: P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂.' },
      { label: 'Unit Conversion Note', value: 'Q in m³/s. 1 m³/s = 1000 L/s = 60,000 L/min. 1 GPM = 0.063 L/s. 1 CFS = 28.32 L/s.' },
    ]
  }),

  'thermal-expansion': (fields) => ({
    presets: [
      { label: 'Steel rail (100 m, ΔT=30°C)', values: { length: '100', tempChange: '30', coefficient: '1.2e-5' } },
      { label: 'Aluminum wire (10 m, ΔT=50°C)', values: { length: '10', tempChange: '50', coefficient: '2.4e-5' } },
      { label: 'Concrete bridge (50 m, ΔT=40°C)', values: { length: '50', tempChange: '40', coefficient: '1e-5' } },
    ],
    defaults: { length: '10', tempChange: '20', coefficient: '1.2e-5' },
    extras: [
      { label: 'Real-World Application', value: 'Thermal expansion requires expansion joints in bridges, railways, and pipelines. Eiffel Tower grows 15 cm taller in summer.' },
      { label: 'Common Values', value: 'Steel: α = 12×10⁻⁶ /°C. Aluminum: 24×10⁻⁶. Copper: 17×10⁻⁶. Concrete: 10×10⁻⁶. Glass: 8.5×10⁻⁶. Invar (low expansion): 1.2×10⁻⁶.' },
      { label: 'Precision Tip', value: 'Linear expansion: ΔL = αL₀ΔT. Area expansion: ΔA = 2αA₀ΔT. Volume expansion: ΔV = 3αV₀ΔT (for isotropic materials).' },
      { label: 'Related Formula', value: 'ΔL = αL₀ΔT. Bimetallic strip bending: radius = t/(α₁-α₂)ΔT. Thermal stress: σ = EαΔT (if constrained).' },
      { label: 'Unit Conversion Note', value: 'α in /°C or /K (same numeric value). Length in m. ΔT in °C or K. For °F: multiply α by 5/9.' },
    ]
  }),

  'coulombs-law': (fields) => ({
    presets: [
      { label: 'Electron-proton (H atom)', values: { charge1: '1.6e-19', charge2: '1.6e-19', distance: '5.29e-11' } },
      { label: 'Two protons in nucleus (1 fm)', values: { charge1: '1.6e-19', charge2: '1.6e-19', distance: '1e-15' } },
      { label: 'Static charges (1 μC, 1 cm)', values: { charge1: '1e-6', charge2: '1e-6', distance: '0.01' } },
    ],
    defaults: { charge1: '1.6e-19', charge2: '1.6e-19', distance: '5.29e-11' },
    extras: [
      { label: 'Real-World Application', value: 'Coulomb\'s law explains chemical bonding, static electricity, and particle interactions. The hydrogen atom is held together by 8.2×10⁻⁸ N of electrostatic force.' },
      { label: 'Common Values', value: 'k_e = 1/(4πε₀) = 8.99×10⁹ N·m²/C². ε₀ = 8.854×10⁻¹² F/m. e = 1.602×10⁻¹⁹ C. 1 μC = 10⁻⁶ C. Typical static: nC-μC range.' },
      { label: 'Precision Tip', value: 'F = k_e|q₁q₂|/r². Force is attractive for opposite charges, repulsive for like charges. Coulomb\'s law is an inverse-square law like gravity.' },
      { label: 'Related Formula', value: 'F = k_e q₁q₂/r². Electric field: E = k_e q/r². Potential: V = k_e q/r. Gauss\'s law: ∮E·dA = Q/ε₀.' },
      { label: 'Unit Conversion Note', value: 'k_e = 8.99×10⁹ N·m²/C². ε₀ = 8.854×10⁻¹² F/m. 1 C = charge of 6.24×10¹⁸ electrons. 1 μC = 10⁻⁶ C.' },
    ]
  }),

  'electric-field': (fields) => ({
    presets: [
      { label: 'Point charge (1 μC, 1 cm)', values: { charge: '1e-6', distance: '0.01' } },
      { label: 'Parallel plates (100 V, 1 mm)', values: { voltage: '100', distance: '0.001' } },
      { label: 'Electron field in H atom (0.053 nm)', values: { charge: '1.6e-19', distance: '5.3e-11' } },
    ],
    defaults: { charge: '1e-6', distance: '0.01' },
    extras: [
      { label: 'Real-World Application', value: 'Electric fields control everything from CRT displays to lightning strikes. Air breaks down at ~3×10⁶ V/m (dielectric breakdown).' },
      { label: 'Common Values', value: 'E = k_e q/r² for point charge. E = V/d for parallel plates. Air breakdown: ~3 MV/m. Earth\'s field: ~100 V/m (fair weather). Under power lines: ~10 kV/m.' },
      { label: 'Precision Tip', value: 'Electric field is a vector — direction is from + to -. For multiple charges, use superposition (vector sum of each field).' },
      { label: 'Related Formula', value: 'E = k_e q/r². E = -dV/dr (potential gradient). Gauss: ∮E·dA = Q/ε₀. F = qE (force on charge).' },
      { label: 'Unit Conversion Note', value: 'E in V/m = N/C. 1 V/m = 1 N/C. kV/m = 10³ V/m. MV/m = 10⁶ V/m.' },
    ]
  }),

  'electric-potential': (fields) => ({
    presets: [
      { label: 'Battery terminal (9 V, 1 μC)', values: { charge: '1e-6', voltage: '9' } },
      { label: 'Point charge (1 μC, 10 cm)', values: { charge: '1e-6', distance: '0.1' } },
      { label: 'Electron in 1 V potential', values: { charge: '1.6e-19', voltage: '1' } },
    ],
    defaults: { charge: '1e-6', voltage: '9' },
    extras: [
      { label: 'Real-World Application', value: 'Electric potential (voltage) drives current in circuits, enables battery operation, and determines energy of charged particles.' },
      { label: 'Common Values', value: 'V = k_e q/r (point charge). 1 V = 1 J/C. Battery: 1.5-12 V. Power line: 120-765 kV. Lightning: ~100 MV. Electron-volt: 1 eV = 1.602×10⁻¹⁹ J.' },
      { label: 'Precision Tip', value: 'Potential difference (voltage) matters, not absolute potential. Reference point (ground) is arbitrary — typically Earth at 0 V.' },
      { label: 'Related Formula', value: 'V = k_e q/r. E = -∇V. U = qV (potential energy). Power: P = IV. Ohm: V = IR. Capacitor: Q = CV.' },
      { label: 'Unit Conversion Note', value: '1 V = 1 J/C. 1 kV = 10³ V. 1 MV = 10⁶ V. 1 mV = 10⁻³ V. 1 μV = 10⁻⁶ V.' },
    ]
  }),

  'faraday': (fields) => ({
    presets: [
      { label: 'Generator coil (100 turns, 0.1 T, 0.01 m², 60 Hz)', values: { turns: '100', field: '0.1', area: '0.01', frequency: '60' } },
      { label: 'Transformer (500 turns, 0.5 T/s)', values: { turns: '500', fluxChange: '0.5' } },
      { label: 'Microphone (50 turns, 0.02 T, 2 cm², 1 kHz)', values: { turns: '50', field: '0.02', area: '0.0002', frequency: '1000' } },
    ],
    defaults: { turns: '100', field: '0.1', area: '0.01', frequency: '60' },
    extras: [
      { label: 'Real-World Application', value: 'Faraday\'s law is the principle behind electric generators, transformers, induction cooktops, and RFID tags.' },
      { label: 'Common Values', value: 'ε = -NdΦ/dt. Generator: 60 Hz → ε_max = NBAω. Typical generator: 12 kV. Transformer: V₁/V₂ = N₁/N₂. Induction cooktop: 20-100 kHz.' },
      { label: 'Precision Tip', value: 'Lenz\'s law: induced current opposes the change. ε = -dΦ/dt. For rotating coil: ε = NBAω sin(ωt). RMS voltage: V_rms = NBAω/√2.' },
      { label: 'Related Formula', value: 'ε = -NdΦ/dt. Φ = BAcosθ. Transformer: V_s/V_p = N_s/N_p. Induced EMF = BLv (moving conductor). Self-inductance: ε = -L dI/dt.' },
      { label: 'Unit Conversion Note', value: 'Φ in Wb = T·m². ε in V. 1 V = 1 Wb/s. B in T. A in m². f in Hz. ω = 2πf in rad/s.' },
    ]
  }),

  'lenz': (fields) => ({
    presets: [
      { label: 'Magnet approaching coil', values: { fluxChange: '0.01', time: '0.1', turns: '100' } },
      { label: 'Transformer primary', values: { fluxChange: '0.05', time: '0.0167', turns: '200' } },
      { label: 'Induction heating', values: { fluxChange: '0.5', time: '0.001', turns: '10' } },
    ],
    defaults: { fluxChange: '0.01', time: '0.1', turns: '100' },
    extras: [
      { label: 'Real-World Application', value: 'Lenz\'s law explains eddy current braking, metal detectors, and induction heating. It ensures energy conservation in electromagnetic induction.' },
      { label: 'Common Values', value: 'ε = -NΔΦ/Δt. The negative sign is Lenz\'s law. Eddy current brakes in trains: powerful magnets induce opposing currents.' },
      { label: 'Precision Tip', value: 'The induced current creates a magnetic field that opposes the original change. Direction determined by Lenz\'s law / right-hand rule.' },
      { label: 'Related Formula', value: 'ε = -N dΦ/dt. Lenz\'s law is the negative sign in Faraday\'s law. Eddy currents: I_ind = ε/R. Back EMF in motors.' },
      { label: 'Unit Conversion Note', value: 'Φ in Wb. t in s. ε in V. 1 T·m² = 1 Wb. ΔΦ/Δt in Wb/s = V/turn.' },
    ]
  }),

  'inductance': (fields) => ({
    presets: [
      { label: 'Solenoid (100 turns, 10 cm, 2 cm²)', values: { turns: '100', length: '0.1', area: '0.0002' } },
      { label: 'Toroidal inductor (500 turns, 5 cm radius, 1 cm²)', values: { turns: '500', radius: '0.05', area: '0.0001' } },
      { label: 'Air-core coil (50 turns, 2 cm, 1 cm²)', values: { turns: '50', length: '0.02', area: '0.0001' } },
    ],
    defaults: { turns: '100', length: '0.1', area: '0.0002' },
    extras: [
      { label: 'Real-World Application', value: 'Inductors are used in power supplies (filters), transformers, radio tuning, and energy storage in switching converters.' },
      { label: 'Common Values', value: 'L = μ₀N²A/l (solenoid). μ₀ = 4π×10⁻⁷ H/m. Typical inductor: 1 μH - 10 H. Power supply filter: 10-100 mH. RF inductor: nH-μH.' },
      { label: 'Precision Tip', value: 'Inductance depends on geometry and core material. Ferrite cores increase L by factor μ_r (100-10,000). Energy: U = ½LI². Impedance: Z_L = jωL.' },
      { label: 'Related Formula', value: 'L = μ₀μ_r N²A/l. Mutual inductance: M = k√(L₁L₂). Energy: U = ½LI². Series: L_eq = L₁+L₂+...+2M (aiding). RL time constant: τ = L/R.' },
      { label: 'Unit Conversion Note', value: '1 H = 1 Wb/A = 1 V·s/A. 1 mH = 10⁻³ H. 1 μH = 10⁻⁶ H. 1 nH = 10⁻⁹ H. μ₀ = 4π×10⁻⁷ H/m.' },
    ]
  }),

  'general-physics': (fields, formula, description) => {
    const hasMass = fields.some(f => /m|mass/.test(f.name))
    const hasTime = fields.some(f => /t|time/.test(f.name))
    const hasTemp = fields.some(f => /t.*emp|temperature/.test(f.name))
    const hasLength = fields.some(f => /l|d|r|length|distance|radius/.test(f.name))
    const hasVelocity = fields.some(f => /v|velocity|speed/.test(f.name))
    return {
      presets: [
        { label: 'Standard example 1', values: Object.fromEntries(fields.map(f => [f.name, f.min ? String(Math.max(f.min, 1)) : '1'])) },
        { label: 'Standard example 2', values: Object.fromEntries(fields.map(f => [f.name, f.min ? String(Math.max(f.min * 10, 10)) : '10'])) },
        { label: 'Standard example 3', values: Object.fromEntries(fields.map(f => [f.name, f.min ? String(Math.max(f.min * 100, 100)) : '100'])) },
      ],
      defaults: Object.fromEntries(fields.slice(0, 4).map(f => [f.name, f.min ? String(Math.max(f.min, 1)) : '1'])),
      extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' },
      ]
    }
  },
}

function extractFields(content) {
  const fieldMatches = content.matchAll(/name:\s*'([^']+)'/g)
  return Array.from(fieldMatches, m => ({ name: m[1] }))
}

function extractFormula(content) {
  const m = content.match(/formula:\s*'([^']+)'/)
  return m ? m[1] : ''
}

function hasGenericExtras(content) {
  return /"Verification"|"Rounding note"|'Verification'|'Rounding note'/.test(content)
}

function hasPresets(content) {
  return /presets:\s*\[/.test(content)
}

function hasDefaults(content) {
  return /defaults:\s*\{/.test(content)
}

function hasDescription(content) {
  return /description:\s*'/.test(content)
}

function hasInterpretation(content) {
  return /interpretation:\s*'/.test(content)
}

function hasExtrasInCompute(content) {
  return /extras:\s*\[/.test(content)
}

function buildStepBasedCompute(originalContent, presets, extras, defaults) {
  // Get field names
  const fieldNames = []
  const schemaMatch = originalContent.match(/schema:\s*z\.object\(\{([^}]+)\}\)/)
  if (schemaMatch) {
    const schemaContent = schemaMatch[1]
    const refs = schemaContent.matchAll(/(\w+):/g)
    for (const r of refs) {
      fieldNames.push(r[1])
    }
  }

  // Read the original compute function
  const computeMatch = originalContent.match(/compute:\s*\(v\)\s*=>\s*\(\{([\s\S]*?)\}\)\s*\}/)
  if (!computeMatch) return null

  let computeBody = computeMatch[1].trim()

  // Remove steps and extras if they exist to rebuild
  computeBody = computeBody.replace(/steps:\s*\[[^\]]*\],?\s*/g, '')
  computeBody = computeBody.replace(/extras:\s*\[[^\]]*\],?\s*/g, '')

  // Extract result expression  
  const resultMatch = computeBody.match(/result:\s*([^,\n]+)/)
  if (!resultMatch) return null
  const resultExpr = resultMatch[1].trim()

  // Extract label
  const labelMatch = computeBody.match(/label:\s*'([^']+)'/)
  const resultLabel = labelMatch ? labelMatch[1] : 'Result'

  // Extract unit
  const unitMatch = computeBody.match(/unit:\s*'([^']+)'/)
  const resultUnit = unitMatch ? unitMatch[1] : ''

  // Build the compute return
  const resultWithUnit = resultUnit ? `result: ${resultExpr}, label: '${resultLabel}', unit: '${resultUnit}'` : `result: ${resultExpr}, label: '${resultLabel}'`

  // Generate steps from the compute
  let stepLines = []
  if (fieldNames.length > 0) {
    // Find formula
    const formulaMatch = originalContent.match(/formula:\s*'([^']+)'/)
    const formula = formulaMatch ? formulaMatch[1] : ''
    stepLines.push(`        { label: 'Formula', value: '${formula}' },`)
    stepLines.push(`        { label: 'Substitute', value: \`${fieldNames.map(f => `\${v.${f}}`).join(' × ')}\` },`)
    stepLines.push(`        { label: '${resultLabel}', value: \`\${(${resultExpr}).toFixed(3)}${resultUnit ? ' ' + resultUnit : ''}\` },`)
  }

  const stepsStr = stepLines.length > 0 ? `
      steps: [
${stepLines.join('\n')}
      ],` : ''

  // Generate extras
  const extraLines = extras.slice(0, 5).map(ex =>
    `        { label: '${ex.label}', value: '${ex.value.replace(/'/g, "\\'")}' }`
  )
  const extrasStr = `
      extras: [
${extraLines.join(',\n')}
      ]`

  return `  compute: (v) => ({
      ${resultWithUnit},${stepsStr}${extrasStr}
    }),`
}

function buildFullFile(originalContent, additions) {
  let result = originalContent

  // Add import for step if needed
  if (!result.includes("from '../../../lib/hub-helpers'")) {
    result = result.replace(
      "import type { CalcDef } from '../../../lib/generic-fallback'",
      "import { step } from '../../../lib/hub-helpers'\nimport type { CalcDef } from '../../../lib/generic-fallback'"
    )
  } else if (!result.includes('step')) {
    result = result.replace(
      "import { n, step, numField } from '../../../lib/hub-helpers'",
      "import { n, step, numField } from '../../../lib/hub-helpers'"
    )
  }

  // Add defaults after fields
  if (additions.defaults && !hasDefaults(result)) {
    const defaultsStr = Object.entries(additions.defaults)
      .map(([k, v]) => `${k}: '${v}'`)
      .join(', ')
    result = result.replace(
      /fields:\s*\[[^\]]+\],/,
      (match) => `${match}\n  defaults: { ${defaultsStr} },`
    )
  }

  // Add presets after defaults
  if (additions.presets && !hasPresets(result)) {
    const presetsStr = additions.presets.map(p => {
      const valsStr = Object.entries(p.values).map(([k, v]) => `${k}: '${v}'`).join(', ')
      return `    { label: '${p.label}', values: { ${valsStr} } }`
    }).join(',\n')
    result = result.replace(
      /defaults:\s*\{[^}]+\},/,
      (match) => `${match}\n  presets: [\n${presetsStr},\n  ],`
    )
  }

  // Replace generic extras with domain-specific ones
  if (additions.extras) {
    const extraLines = additions.extras.map(ex =>
      `        { label: '${ex.label}', value: '${ex.value.replace(/'/g, "\\'")}' }`
    ).join(',\n')

    const extrasBlock = `extras: [\n${extraLines}\n      ]`

    if (hasGenericExtras(result)) {
      result = result.replace(
        /extras:\s*\[[^\]]*\]/,
        extrasBlock
      )
    } else if (!hasExtrasInCompute(result)) {
      // Add extras at end of return block
      result = result.replace(
        /(steps:\s*\[[^\]]*\])(\s*\})/,
        `$1,\n      ${extrasBlock}$2`
      )
    } else {
      result = result.replace(
        /extras:\s*\[[^\]]*\]/,
        extrasBlock
      )
    }
  }

  return result
}

// Main
const files = readdirSync(physicsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts')

let upgraded = 0
let skipped = 0
let errors = []

for (const file of files) {
  if (ALREADY_UPGRADED.has(file)) {
    console.log(`  SKIP (already upgraded): ${file}`)
    skipped++
    continue
  }

  const filePath = join(physicsDir, file)
  let content = readFileSync(filePath, 'utf-8')

  // Skip if already has presets (upgraded)
  if (hasPresets(content) && hasDefaults(content) && hasExtrasInCompute(content) && !hasGenericExtras(content)) {
    console.log(`  SKIP (looks upgraded): ${file}`)
    skipped++
    continue
  }

  try {
    const category = classifyCalculator(file, content)
    const fields = extractFields(content)
    const formula = extractFormula(content)

    let additions
    if (domainGenerators[category]) {
      additions = domainGenerators[category](fields)
    } else {
      additions = domainGenerators['general-physics'](fields)
    }

    if (!additions || !additions.extras) {
      console.log(`  SKIP (no additions): ${file}`)
      skipped++
      continue
    }

    let newContent = buildFullFile(content, additions)

    // Ensure defaults exist
    if (!hasDefaults(content) && additions.defaults) {
      // Already handled in buildFullFile
    }

    // Write back
    writeFileSync(filePath, newContent, 'utf-8')
    console.log(`  UPGRADED: ${file} (${category})`)
    upgraded++
  } catch (e) {
    console.error(`  ERROR: ${file}: ${e.message}`)
    errors.push(file)
  }
}

console.log(`\n=== SUMMARY ===`)
console.log(`Upgraded: ${upgraded}`)
console.log(`Skipped: ${skipped}`)
console.log(`Errors: ${errors.length}`)
if (errors.length > 0) {
  console.log(`Error files: ${errors.join(', ')}`)
}
