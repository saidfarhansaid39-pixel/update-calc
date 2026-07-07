const fs = require('fs');

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

const defs = {
  'projectile-calc': { f1: 'velocity', f2: 'angle', u1: 'm/s', u2: 'deg', r: 'v0^2 * sin(2*theta)/g', l: 'Range', ru: 'm', ff: 'R = v0^2 sin(2θ)/g', it: 'Maximum horizontal distance traveled before landing. Maximum range at 45 degrees.' },
  'circular-motion': { f1: 'radius', f2: 'period', u1: 'm', u2: 's', r: '2*pi*r/T', l: 'Speed', ru: 'm/s', ff: 'v = 2πr/T', it: 'Constant speed along circular path. Direction changes continuously producing centripetal acceleration.' },
  'friction-force': { f1: 'coeff', f2: 'normal', u1: '', u2: 'N', r: 'mu*N', l: 'Friction Force', ru: 'N', ff: 'f = μN', it: 'Friction opposes relative motion. Static friction > kinetic friction for most surfaces.' },
  'inclined-plane': { f1: 'mass', f2: 'angle', u1: 'kg', u2: 'deg', r: 'm*g*sin(theta)', l: 'Parallel Force', ru: 'N', ff: 'F_parallel = mg sin θ', it: 'Component of weight acting down the incline. Larger angle means more force.' },
  'wave-speed': { f1: 'freq', f2: 'wavelength', u1: 'Hz', u2: 'm', r: 'f*lambda', l: 'Wave Speed', ru: 'm/s', ff: 'v = fλ', it: 'Speed equals frequency times wavelength. In a given medium, speed is constant.' },
  'sound-intensity': { f1: 'power', f2: 'distance', u1: 'W', u2: 'm', r: 'P/(4*pi*r^2)', l: 'Intensity', ru: 'W/m^2', ff: 'I = P/(4πr^2)', it: 'Sound intensity decreases with square of distance from source.' },
  'electric-field': { f1: 'charge', f2: 'distance', u1: 'C', u2: 'm', r: 'k*q/r^2', l: 'Electric Field', ru: 'N/C', ff: 'E = kq/r^2', it: 'Electric field strength from a point charge decreases with square of distance.' },
  'capacitor-cylindrical': { f1: 'length', f2: 'outer', u1: 'm', u2: 'm', r: '2*pi*eps0*L/ln(b/a)', l: 'Capacitance', ru: 'F', ff: 'C = 2πε₀L/ln(b/a)', it: 'Cylindrical capacitor capacitance depends on length and radius ratio.' },
  'capacitor-spherical': { f1: 'inner', f2: 'outer', u1: 'm', u2: 'm', r: '4*pi*eps0*a*b/(b-a)', l: 'Capacitance', ru: 'F', ff: 'C = 4πε₀ab/(b-a)', it: 'Spherical capacitor depends on inner and outer radii.' },
  'rlc-parallel': { f1: 'resistance', f2: 'inductance', u1: 'ohm', u2: 'H', r: '1/(2*pi*sqrt(L*C))', l: 'Resonant Frequency', ru: 'Hz', ff: 'f0 = 1/(2π√(LC))', it: 'Parallel RLC has maximum impedance at resonance. Current is minimum at f0.' },
  'ac-power': { f1: 'voltage', f2: 'current', u1: 'V', u2: 'A', r: 'V*I*cos(phi)', l: 'Real Power', ru: 'W', ff: 'P = VI cos φ', it: 'Real power is average power dissipated. Power factor cos φ accounts for phase difference.' },
  'magnetic-field-wire': { f1: 'current', f2: 'distance', u1: 'A', u2: 'm', r: 'mu0*I/(2*pi*r)', l: 'Magnetic Field', ru: 'T', ff: 'B = μ₀I/(2πr)', it: 'Field around straight wire decreases with distance. Direction given by right-hand rule.' },
  'magnetic-field-loop': { f1: 'current', f2: 'radius', u1: 'A', u2: 'm', r: 'mu0*I/(2*R)', l: 'Field at Center', ru: 'T', ff: 'B = μ₀I/(2R)', it: 'Field at center of current loop. Used in electromagnets and sensors.' },
  'magnetic-field-solenoid': { f1: 'current', f2: 'turns', u1: 'A', u2: '', r: 'mu0*n*I', l: 'Field Inside', ru: 'T', ff: 'B = μ₀nI', it: 'Uniform field inside ideal solenoid. Field outside is nearly zero.' },
  'faraday-law': { f1: 'flux', f2: 'time', u1: 'Wb', u2: 's', r: '-N*dPhi/dt', l: 'Induced EMF', ru: 'V', ff: 'ε = -N dΦ/dt', it: 'Changing magnetic flux induces EMF. Lenz law gives negative sign.' },
  'mutual-inductance': { f1: 'current1', f2: 'flux2', u1: 'A', u2: 'Wb', r: 'N2*Phi2/I1', l: 'Mutual Inductance', ru: 'H', ff: 'M = N₂Φ₂/I₁', it: 'Mutual inductance couples two coils. Used in transformers.' },
  'self-inductance': { f1: 'flux', f2: 'current', u1: 'Wb', u2: 'A', r: 'N*Phi/I', l: 'Self Inductance', ru: 'H', ff: 'L = NΦ/I', it: 'Self-inductance opposes current changes. Energy stored in magnetic field.' },
  'magnetic-force-charge': { f1: 'charge', f2: 'velocity', u1: 'C', u2: 'm/s', r: 'q*v*B*sin(theta)', l: 'Magnetic Force', ru: 'N', ff: 'F = qvB sin θ', it: 'Force on moving charge in magnetic field. Zero if motion parallel to field.' },
  'hall-voltage': { f1: 'current', f2: 'density', u1: 'A', u2: 'm^-3', r: 'I*B/(n*q*d)', l: 'Hall Voltage', ru: 'V', ff: 'V_H = IB/(nqd)', it: 'Hall voltage measures magnetic field. Used in Hall effect sensors.' },
  'mass-spectrometer': { f1: 'charge', f2: 'mass', u1: 'C', u2: 'kg', r: 'm*v/(q*B)', l: 'Radius', ru: 'm', ff: 'r = mv/(qB)', it: 'Particles separated by mass-to-charge ratio. Lighter particles deflect more.' },
  'cyclotron-frequency': { f1: 'charge', f2: 'mass', u1: 'C', u2: 'kg', r: 'q*B/(2*pi*m)', l: 'Cyclotron Freq', ru: 'Hz', ff: 'f_c = qB/(2πm)', it: 'Frequency of charged particle in magnetic field. Independent of speed.' },
  'snells-law': { f1: 'n1', f2: 'n2', u1: '', u2: '', r: 'n1*sin(theta1)/n2', l: 'sin(theta2)', ru: '', ff: 'n₁ sin θ₁ = n₂ sin θ₂', it: 'Light bends toward normal when entering denser medium. Critical angle causes TIR.' },
  'critical-angle': { f1: 'n1', f2: 'n2', u1: '', u2: '', r: 'asin(n2/n1)', l: 'Critical Angle', ru: 'rad', ff: 'θ_c = sin⁻¹(n₂/n₁)', it: 'Angle above which light is totally internally reflected. Only when n₁ > n₂.' },
  'thin-lens': { f1: 'focal', f2: 'object', u1: 'm', u2: 'm', r: '1/(1/f - 1/do)', l: 'Image Distance', ru: 'm', ff: '1/f = 1/do + 1/di', it: 'Positive di = real image (opposite side). Negative di = virtual image (same side).' },
  'lens-makers': { f1: 'n1', f2: 'r1', u1: '', u2: 'm', r: '(n-1)*(1/R1-1/R2)', l: 'Focal Length', ru: 'm^-1', ff: '1/f = (n-1)(1/R₁ - 1/R₂)', it: 'Focal length depends on lens curvature and refractive index.' },
  'two-lens-system': { f1: 'f1', f2: 'f2', u1: 'm', u2: 'm', r: '1/(1/f1+1/f2-d/(f1*f2))', l: 'System Power', ru: 'm^-1', ff: 'P = P₁ + P₂ - dP₁P₂', it: 'Combined power of two lenses. Depends on separation distance.' },
  'compound-microscope': { f1: 'fobj', f2: 'feye', u1: 'm', u2: 'm', r: 'L*25/(fobj*feye)', l: 'Magnification', ru: '', ff: 'M = L × 25/(f_obj f_eye)', it: 'Total magnification = objective × eyepiece. L is tube length.' },
  'astronomical-telescope': { f1: 'fobj', f2: 'feye', u1: 'm', u2: 'm', r: 'fobj/feye', l: 'Angular Mag', ru: '', ff: 'M = f_obj/f_eye', it: 'Magnification = focal length ratio. Larger objective gathers more light.' },
  'diffraction-single': { f1: 'slit', f2: 'wavelength', u1: 'm', u2: 'm', r: 'asin(lambda/w)', l: 'First Minimum', ru: 'rad', ff: 'sin θ = λ/w', it: 'First minimum at angle where path difference = λ. Wider slit = narrower pattern.' },
  'diffraction-double': { f1: 'slit', f2: 'spacing', u1: 'm', u2: 'm', r: 'lambda/d', l: 'Fringe Spacing', ru: 'rad', ff: 'd sin θ = mλ', it: 'Bright fringes at integer multiples of wavelength. Narrower spacing = wider fringes.' },
  'diffraction-grating': { f1: 'lines', f2: 'wavelength', u1: 'm^-1', u2: 'm', r: 'asin(m*lambda*d)', l: 'Angle', ru: 'rad', ff: 'd sin θ = mλ', it: 'Grating separates wavelengths. More lines = better resolution.' },
  'bragg-diffraction': { f1: 'spacing', f2: 'angle', u1: 'm', u2: 'deg', r: '2*d*sin(theta)', l: 'Path Diff', ru: 'm', ff: '2d sin θ = nλ', it: 'Constructive interference when path difference = integer wavelengths.' },
  'rayleigh-criterion': { f1: 'aperture', f2: 'wavelength', u1: 'm', u2: 'm', r: '1.22*lambda/D', l: 'Min Angle', ru: 'rad', ff: 'θ_min = 1.22λ/D', it: 'Resolution limit of optical systems. Larger aperture = better resolution.' },
  'blackbody-radiation': { f1: 'temperature', f2: null, u1: 'K', u2: null, r: 'sigma*T^4', l: 'Power Density', ru: 'W/m^2', ff: 'j = σT⁴', it: 'Stefan-Boltzmann law. Power radiated per unit area proportional to T⁴.' },
  'photoelectric-effect': { f1: 'freq', f2: 'work', u1: 'Hz', u2: 'eV', r: 'h*f - phi', l: 'KE_max', ru: 'eV', ff: 'K_max = hf - φ', it: 'Einstein equation. Below threshold frequency, no electrons emitted.' },
  'compton-scattering': { f1: 'wavelength', f2: 'angle', u1: 'm', u2: 'deg', r: 'h/(m*c)*(1-cos(theta))', l: 'Shift', ru: 'm', ff: 'Δλ = h/(mc)(1 - cos θ)', it: 'Wavelength increases after scattering. Maximum shift at 180 degrees.' },
  'bohr-atom': { f1: 'level', f2: null, u1: '', u2: null, r: '-13.6/n^2', l: 'Energy', ru: 'eV', ff: 'E_n = -13.6/n² eV', it: 'Electron energy levels in hydrogen. Transitions produce spectral lines.' },
  'quantum-tunneling': { f1: 'energy', f2: 'barrier', u1: 'eV', u2: 'eV', r: 'exp(-2*kappa*a)', l: 'Transmission', ru: '', ff: 'T ≈ e^{-2κa}', it: 'Particle can penetrate potential barrier even if energy < barrier height.' },
  'heisenberg-uncertainty': { f1: 'dx', f2: null, u1: 'm', u2: null, r: 'hbar/(2*dx)', l: 'min dp', ru: 'kg·m/s', ff: 'ΔxΔp ≥ ℏ/2', it: 'Cannot simultaneously know position and momentum with arbitrary precision.' },
  'schrodinger-1d': { f1: 'energy', f2: 'well', u1: 'eV', u2: 'eV', r: 'n^2*pi^2*hbar^2/(2*m*L^2)', l: 'Energy Level', ru: 'eV', ff: 'E_n = n²π²ℏ²/(2mL²)', it: 'Particle in infinite square well. Energy quantized to discrete levels.' },
  'schrodinger-finite': { f1: 'depth', f2: 'width', u1: 'eV', u2: 'm', r: 'sqrt(2*m*V0)*L/(2*hbar)', l: 'Bound States', ru: '', ff: 'N ≈ floor(√(2mV₀)L/(πℏ)) + 1', it: 'Finite well has finite number of bound states. Penetration into barrier.' },
  'harmonic-oscillator-qm': { f1: 'level', f2: 'omega', u1: '', u2: 'Hz', r: '(n+0.5)*hbar*omega', l: 'Energy', ru: 'J', ff: 'E_n = (n+½)ℏω', it: 'Quantum harmonic oscillator has equally spaced energy levels.' },
  'hydrogen-atom-energy': { f1: 'n', f2: 'l', u1: '', u2: '', r: '-13.6/n^2', l: 'Energy', ru: 'eV', ff: 'E_n = -13.6/n² eV', it: 'Hydrogen energy depends only on principal quantum number n.' },
  'zeeman-effect': { f1: 'field', f2: null, u1: 'T', u2: null, r: 'mu_B*B', l: 'Splitting', ru: 'eV', ff: 'ΔE = μ_B B', it: 'Magnetic field splits spectral lines. Normal Zeeman effect: 3 lines.' },
  'fine-structure': { f1: 'n', f2: 'j', u1: '', u2: '', r: 'alpha^2*13.6*(1/(j+0.5)-3/(4*n))/n^3', l: 'Correction', ru: 'eV', ff: 'ΔE_FS = (α²E_n)(1/(j+½) - 3/(4n))/n', it: 'Fine structure from electron spin-orbit coupling. Relativistic correction.' },
  'selection-rules': { f1: 'deltaL', f2: 'deltaJ', u1: '', u2: '', r: 'deltaL===1&&(deltaJ===0||deltaJ===1)?1:0', l: 'Allowed?', ru: '', ff: 'Δl = ±1, Δj = 0, ±1', it: 'Dipole transitions require Δl = ±1 (change parity). Laporte rule.' },
  'nuclear-binding': { f1: 'mass_p', f2: 'mass_n', u1: 'u', u2: 'u', r: '(Z*mp+N*mn-m_nucleus)*931.5', l: 'Binding Energy', ru: 'MeV', ff: 'BE = (Zm_p + Nm_n - m)c²', it: 'Binding energy per nucleon peaks at iron-56. Explains fusion/fission energy.' },
  'radioactive-decay': { f1: 'initial', f2: 'halflife', u1: 'Bq', u2: 's', r: 'lambda*N0*exp(-lambda*t)', l: 'Activity', ru: 'Bq', ff: 'A = λN₀e^{-λt}', it: 'Exponential decay. After one half-life, half of nuclei remain.' },
  'carbon-dating': { f1: 'ratio', f2: null, u1: '', u2: null, r: 'ln(N/N0)/(-lambda)', l: 'Age', ru: 'years', ff: 't = -1/λ ln(N/N₀)', it: 'Radiocarbon dating uses C-14 decay. Maximum age ~50,000 years.' },
  'alpha-decay': { f1: 'parent_mass', f2: 'daughter_mass', u1: 'u', u2: 'u', r: '(mp-md-malpha)*931.5', l: 'Decay Energy', ru: 'MeV', ff: 'Q = (m_parent - m_daughter - m_α)c²', it: 'Alpha decay reduces atomic number by 2, mass number by 4.' },
  'beta-decay': { f1: 'parent_mass', f2: 'daughter_mass', u1: 'u', u2: 'u', r: '(mp-md)*931.5', l: 'Decay Energy', ru: 'MeV', ff: 'Q = (m_parent - m_daughter)c²', it: 'Beta-minus: neutron becomes proton + electron + antineutrino.' },
  'gamma-decay': { f1: 'e_init', f2: 'e_final', u1: 'MeV', u2: 'MeV', r: 'E_i - E_f', l: 'Photon Energy', ru: 'MeV', ff: 'E_γ = E_i - E_f', it: 'Gamma emission from excited nuclear state. No change in A or Z.' },
  'nuclear-fission': { f1: 'nucleon', f2: 'binding', u1: 'u', u2: 'MeV', r: 'A*BE_per', l: 'Total BE', ru: 'MeV', ff: 'E = A × BE/A', it: 'Heavy nuclei release energy when splitting. ~200 MeV per fission event.' },
  'nuclear-fusion': { f1: 'mass1', f2: 'mass2', u1: 'kg', u2: 'kg', r: '(m1+m2-m_out)*c^2', l: 'Energy Released', ru: 'J', ff: 'E = Δmc²', it: 'Light nuclei release energy when fusing. Powers stars and hydrogen bombs.' },
  'mass-energy': { f1: 'mass', f2: null, u1: 'kg', u2: null, r: 'm*c^2', l: 'Energy', ru: 'J', ff: 'E = mc²', it: 'Mass and energy are equivalent. Small mass = enormous energy.' },
  'time-dilation': { f1: 'speed', f2: 'proper_time', u1: 'm/s', u2: 's', r: 'tau/sqrt(1-v^2/c^2)', l: 'Dilated Time', ru: 's', ff: 't = t₀/√(1-v²/c²)', it: 'Moving clocks run slow. At 0.999c, dilation factor is 22.4.' },
  'length-contraction': { f1: 'speed', f2: 'proper_length', u1: 'm/s', u2: 'm', r: 'L0*sqrt(1-v^2/c^2)', l: 'Contracted Length', ru: 'm', ff: 'L = L₀√(1-v²/c²)', it: 'Moving objects contract along direction of motion.' },
  'relativistic-momentum': { f1: 'mass', f2: 'speed', u1: 'kg', u2: 'm/s', r: 'm*v/sqrt(1-v^2/c^2)', l: 'Rel Momentum', ru: 'kg·m/s', ff: 'p = mv/√(1-v²/c²)', it: 'Momentum approaches infinity as v approaches c. Classical at low speeds.' },
  'relativistic-energy': { f1: 'mass', f2: 'speed', u1: 'kg', u2: 'm/s', r: 'm*c^2/sqrt(1-v^2/c^2)', l: 'Total Energy', ru: 'J', ff: 'E = mc²/√(1-v²/c²)', it: 'Total energy includes rest energy + kinetic. Kinetic = (γ-1)mc².' },
  'lorentz-transformation': { f1: 'x', f2: 'speed', u1: 'm', u2: 'm/s', r: '(x-v*t)/sqrt(1-v^2/c^2)', l: "x'", ru: 'm', ff: "x' = (x-vt)/√(1-v²/c²)", it: "Lorentz transformation mixes space and time between reference frames." },
  'velocity-addition': { f1: 'u', f2: 'v', u1: 'm/s', u2: 'm/s', r: '(u+v)/(1+u*v/c^2)', l: 'Resultant', ru: 'm/s', ff: "w = (u+v)/(1+uv/c²)", it: "Relativistic velocity addition ensures resultant never exceeds c." },
  'twin-paradox': { f1: 'speed', f2: 'distance', u1: 'm/s', u2: 'ly', r: '2*d/v/sqrt(1-v^2/c^2)', l: 'Traveler Time', ru: 'years', ff: 't_traveler = 2d/v × √(1-v²/c²)', it: 'Traveling twin ages less than earthbound twin. Asymmetric due to acceleration.' },
  'gravitational-force': { f1: 'mass1', f2: 'mass2', u1: 'kg', u2: 'kg', r: 'G*m1*m2/r^2', l: 'Force', ru: 'N', ff: 'F = Gm₁m₂/r²', it: 'Newton universal gravitation. Force decreases with square of distance.' },
  'gravitational-potential': { f1: 'mass', f2: 'distance', u1: 'kg', u2: 'm', r: '-G*M/r', l: 'Potential', ru: 'J/kg', ff: 'V = -GM/r', it: 'Gravitational potential is negative. Zero at infinite distance.' },
  'gauss-gravity': { f1: 'mass_enclosed', f2: 'radius', u1: 'kg', u2: 'm', r: '-4*pi*G*M_encl', l: 'Flux', ru: 'N·m²/kg', ff: '∮g·dA = -4πGM_enclosed', it: 'Gravitational flux depends only on enclosed mass. Symmetry reduces calculation.' },
  'kepler-third': { f1: 'sma', f2: 'mass_central', u1: 'AU', u2: 'kg', r: '2*pi*sqrt(a^3/(G*M))', l: 'Period', ru: 's', ff: 'T = 2π√(a³/GM)', it: 'Period squared proportional to semi-major axis cubed. P² ∝ a³.' },
  'orbital-velocity': { f1: 'mass_central', f2: 'radius', u1: 'kg', u2: 'm', r: 'sqrt(G*M/r)', l: 'Orbital Speed', ru: 'm/s', ff: 'v = √(GM/r)', it: 'Circular orbit speed. Lower orbit = faster. Geosync at 35,786 km.' },
  'lagrange-points': { f1: 'mass_primary', f2: 'mass_secondary', u1: 'kg', u2: 'kg', r: 'R*(m2/(3*m1))^(1/3)', l: 'L1 Distance', ru: 'm', ff: 'L₁ ≈ R(ṁ₂/3ṁ₁)^{1/3}', it: 'Lagrange points are equilibrium positions in three-body system.' },
  'hohmann-transfer': { f1: 'r1', f2: 'r2', u1: 'm', u2: 'm', r: 'pi*sqrt((r1+r2)^3/(8*G*M))', l: 'Transfer Time', ru: 's', ff: 't = π√((r₁+r₂)³/(8GM))', it: 'Minimum energy transfer between circular orbits. Uses two engine burns.' },
  'rocket-equation': { f1: 'vexhaust', f2: 'mass_ratio', u1: 'm/s', u2: '', r: 've*ln(m0/mf)', l: 'Delta-v', ru: 'm/s', ff: 'Δv = v_ex ln(m₀/m_f)', it: 'Tsiolkovsky rocket equation. Delta-v depends on exhaust speed and mass ratio.' },
  'specific-impulse': { f1: 'thrust', f2: 'flow', u1: 'N', u2: 'kg/s', r: 'F/(mdot*g0)', l: 'Isp', ru: 's', ff: 'I_sp = F/(ṁg₀)', it: 'Specific impulse measures rocket efficiency. Higher Isp = more efficient.' },
  'thrust-to-weight': { f1: 'thrust', f2: 'mass', u1: 'N', u2: 'kg', r: 'F/(m*g0)', l: 'T/W Ratio', ru: '', ff: 'T/W = F/(mg₀)', it: 'T/W > 1 for liftoff. Launch vehicles typically have T/W ~1.3-1.5.' },
  'atmospheric-drag': { f1: 'density', f2: 'velocity', u1: 'kg/m^3', u2: 'm/s', r: '0.5*rho*v^2*Cd*A', l: 'Drag Force', ru: 'N', ff: 'F_d = ½ρv²C_dA', it: 'Drag proportional to density, velocity squared, and cross-sectional area.' },
  'terminal-velocity': { f1: 'mass', f2: 'area', u1: 'kg', u2: 'm^2', r: 'sqrt(2*m*g/(rho*Cd*A))', l: 'Terminal Vel', ru: 'm/s', ff: 'v_t = √(2mg/(ρC_dA))', it: 'Speed where drag = weight. Skydiver ~55 m/s, cat ~27 m/s.' },
  'buoyancy-force': { f1: 'volume', f2: 'density_fluid', u1: 'm^3', u2: 'kg/m^3', r: 'rho*V*g', l: 'Buoyant Force', ru: 'N', ff: 'F_b = ρgV', it: 'Archimedes principle. Buoyant force equals weight of displaced fluid.' },
  'fluid-pressure': { f1: 'depth', f2: 'density', u1: 'm', u2: 'kg/m^3', r: 'rho*g*h', l: 'Gauge Pressure', ru: 'Pa', ff: 'P = ρgh', it: 'Hydrostatic pressure increases linearly with depth. Every 10m water = 1 atm.' },
  'pascals-principle': { f1: 'force1', f2: 'area1', u1: 'N', u2: 'm^2', r: 'F1*A2/A1', l: 'Output Force', ru: 'N', ff: 'F₂ = F₁A₂/A₁', it: 'Pressure transmitted equally in confined fluid. Hydraulic systems multiply force.' },
  'bernoulli-equation': { f1: 'velocity', f2: 'pressure', u1: 'm/s', u2: 'Pa', r: 'P + 0.5*rho*v^2', l: 'Stagnation P', ru: 'Pa', ff: 'P₁ + ½ρv₁² = P₂ + ½ρv₂²', it: 'Higher velocity = lower pressure. Explains lift and atomizer effect.' },
  'poiseuille-flow': { f1: 'radius', f2: 'length', u1: 'm', u2: 'm', r: 'pi*deltaP*r^4/(8*eta*L)', l: 'Flow Rate', ru: 'm^3/s', ff: 'Q = πΔPr⁴/(8ηL)', it: 'Flow rate proportional to radius^4. Doubling radius = 16x flow.' },
  'stokes-law': { f1: 'radius', f2: 'velocity', u1: 'm', u2: 'm/s', r: '6*pi*eta*r*v', l: 'Drag Force', ru: 'N', ff: 'F_d = 6πηrv', it: 'Viscous drag on sphere at low Reynolds number. Used in settling analysis.' },
  'venturi-effect': { f1: 'area1', f2: 'area2', u1: 'm^2', u2: 'm^2', r: 'v1*A1/A2', l: 'Throat Velocity', ru: 'm/s', ff: 'A₁v₁ = A₂v₂', it: 'Fluid speeds up at constriction. Pressure drops, used in flow measurement.' },
  'torricellis-law': { f1: 'height', f2: null, u1: 'm', u2: null, r: 'sqrt(2*g*h)', l: 'Exit Velocity', ru: 'm/s', ff: 'v = √(2gh)', it: 'Efflux speed equals free-fall speed from same height. Independent of density.' },
  'reynolds-number': { f1: 'velocity', f2: 'length', u1: 'm/s', u2: 'm', r: 'rho*v*L/mu', l: 'Reynolds #', ru: '', ff: 'Re = ρvL/μ', it: 'Re < 2300 laminar, > 4000 turbulent. Transition depends on geometry.' },
  'drag-coefficient': { f1: 'drag', f2: 'area', u1: 'N', u2: 'm^2', r: '2*Fd/(rho*v^2*A)', l: 'Cd', ru: '', ff: 'C_d = 2F_d/(ρv²A)', it: 'Cd for sphere = 0.47, streamlined body ~0.04, flat plate ~1.17.' },
  'lift-coefficient': { f1: 'lift', f2: 'area', u1: 'N', u2: 'm^2', r: '2*FL/(rho*v^2*A)', l: 'Cl', ru: '', ff: 'C_l = 2F_L/(ρv²A)', it: 'Lift coefficient depends on angle of attack. Stall at high angles.' },
  'thermodynamic-process': { f1: 'volume1', f2: 'volume2', u1: 'm^3', u2: 'm^3', r: 'n*R*T*ln(V2/V1)', l: 'Work', ru: 'J', ff: 'W = nRT ln(V₂/V₁)', it: 'Isothermal work. In adiabatic process, PV^gamma = constant.' },
  'ideal-gas-law': { f1: 'pressure', f2: 'volume', u1: 'Pa', u2: 'm^3', r: 'P*V/(n*R)', l: 'Temperature', ru: 'K', ff: 'PV = nRT', it: 'Ideal gas law relates P, V, T, and n. Valid at low pressure.' },
  'kinetic-theory': { f1: 'temperature', f2: 'mass', u1: 'K', u2: 'kg', r: 'sqrt(3*kB*T/m)', l: 'RMS Speed', ru: 'm/s', ff: 'v_rms = √(3kT/m)', it: 'Average molecular speed increases with sqrt(T). Lighter molecules move faster.' },
  'maxwell-boltzmann': { f1: 'temperature', f2: 'mass', u1: 'K', u2: 'kg', r: 'sqrt(2*kB*T/m)', l: 'Most Probable Speed', ru: 'm/s', ff: 'v_p = √(2kT/m)', it: 'Most probable speed < average speed < RMS speed in Maxwell-Boltzmann distribution.' },
  'heat-engine': { f1: 'q_hot', f2: 'q_cold', u1: 'J', u2: 'J', r: '1 - Qc/Qh', l: 'Efficiency', ru: '', ff: 'η = 1 - Q_c/Q_h', it: 'Thermal efficiency = work output / heat input. Cannot exceed Carnot limit.' },
  'carnot-cycle': { f1: 't_hot', f2: 't_cold', u1: 'K', u2: 'K', r: '1 - Tc/Th', l: 'Carnot Eff', ru: '', ff: 'η_Carnot = 1 - T_c/T_h', it: 'Maximum possible efficiency between two reservoirs. Depends only on temperatures.' },
  'otto-cycle': { f1: 'compression', f2: null, u1: '', u2: null, r: '1 - 1/r^(gamma-1)', l: 'Otto Eff', ru: '', ff: 'η = 1 - 1/r^(γ-1)', it: 'Gasoline engine efficiency. Higher compression ratio = higher efficiency.' },
  'diesel-cycle': { f1: 'compression', f2: 'cutoff', u1: '', u2: '', r: '1 - (rc^gamma-1)/(gamma*(rc-1)*r^(gamma-1))', l: 'Diesel Eff', ru: '', ff: 'η_diesel = 1 - (r_c^γ-1)/(γ(r_c-1)r^(γ-1))', it: 'Diesel higher efficiency than Otto at same CR. No knock limit.' },
  'brayton-cycle': { f1: 'pressure_ratio', f2: null, u1: '', u2: null, r: '1 - 1/rp^((gamma-1)/gamma)', l: 'Brayton Eff', ru: '', ff: 'η = 1 - 1/r_p^((γ-1)/γ)', it: 'Gas turbine/jet engine efficiency. Higher pressure ratio = better.' },
};

const fp = 'src/components/hub-calculators/GenericPhysicsCalculator.tsx';
let content = fs.readFileSync(fp, 'utf8');

// Insert new calcDefs before 'export function GenericPhysicsCalculator'
const insertPoint = content.lastIndexOf('\n\n') + 1;
const before = content.substring(0, content.lastIndexOf('\nexport function'));
const after = content.substring(content.lastIndexOf('\nexport function'));

let newEntries = '';
for (const slug of missing) {
  const d = defs[slug];
  if (!d) { console.log('MISSING DEF:', slug); continue; }
  const fields = [];
  fields.push(`{ name: '${slug.includes('mass')||slug.includes('grav')||slug.includes('nuclear')||slug.includes('rocket')||slug.includes('density')||slug.includes('drag')||slug.includes('lift')||slug.includes('thrust')||slug.includes('buoyancy')||slug.includes('fluid')||slug.includes('pressure')||slug.includes('volume')||slug.includes('temp')||slug.includes('q_hot')||slug.includes('t_hot')||slug.includes('compression')||slug=='kinetic-theory'||slug=='maxwell-boltzmann'?'val1':slug.includes('freq')||slug.includes('wavelength')||slug.includes('speed')||slug.includes('velocity')||slug.includes('distance')||slug.includes('radius')||slug.includes('sma')||slug.includes('r1')||slug.includes('period')||slug.includes('angle')||slug.includes('slit')||slug.includes('spacing')||slug.includes('lines')||slug.includes('aperture')||slug.includes('level')||slug.includes('energy')||slug.includes('well')||slug.includes('width')||slug.includes('omega')||slug.includes('field')||slug.includes('charge')||slug.includes('current')||slug.includes('turns')||slug.includes('flux')||slug.includes('time')||slug.includes('mass1')?'val1':'f1')}", label: '${d.f1.charAt(0).toUpperCase()+d.f1.slice(1).replace('_',' ')}', type: 'number', unit: '${d.u1||''}', min: 0, step: '0.1' }`);
  if (d.f2) {
    fields.push(`{ name: 'val2', label: '${d.f2.charAt(0).toUpperCase()+d.f2.slice(1).replace('_',' ')}', type: 'number', unit: '${d.u2||''}', min: 0, step: '0.1' }`);
  }
  
  const hasMulti = d.r.includes('Math.') || d.r.includes('if') || d.r.includes('?');
  
  let compute;
  if (hasMulti) {
    compute = `  compute: (v) => { const result = ${d.r}; return { result: typeof result === 'number' ? result : 'N/A', label: '${d.l}', unit: '${d.ru}', steps: [{ label: 'Formula', value: '${d.ff}' }, { label: 'Result', value: typeof result === 'number' ? result.toFixed(4) : String(result) }] } },`;
  } else {
    compute = `  compute: (v) => ({ result: ${d.r}, label: '${d.l}', unit: '${d.ru}', steps: [{ label: 'Formula', value: '${d.ff}' }, { label: 'Calculate', value: \`\${result.toFixed(4)}\` }] }),`;
  }
  
  const entry = `
calcDefs['${slug}'] = {
  schema: z.object({ val1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0')${d.f2 ? ", val2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0')" : ''} }),
  fields: [${fields.join(', ')}],
${compute}
  description: 'Calculates ${d.l.toLowerCase()} for ${slug.replace(/-/g, ' ')}.',
  formula: '${d.ff}',
  interpretation: '${d.it}',
}
`;
  newEntries += entry;
}

fs.writeFileSync(fp, before + newEntries + '\n' + after);
console.log('Added ' + missing.length + ' physics calcDefs');
