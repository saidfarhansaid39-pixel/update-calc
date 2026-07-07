const fs = require('fs')
const path = require('path')

const filePath = path.resolve(__dirname, '..', 'src', 'components', 'hub-calculators', 'GenericEngineeringCalculator.tsx')
let content = fs.readFileSync(filePath, 'utf8')

// 55 new entries, engineered by hand
const entries = {
  'gerber-parabola': {
    fields: `    fields: [
      { name: 's_alt', label: 'Alternating Stress (Sa)', type: 'number', unit: 'MPa', min: 0, step: '10' },
      { name: 's_e', label: 'Endurance Limit (Se)', type: 'number', unit: 'MPa', min: 0, step: '10' },
      { name: 's_ut', label: 'Ultimate Tensile Strength (Sut)', type: 'number', unit: 'MPa', min: 0, step: '10' },
    ],`,
    compute: `    compute: (v) => {
      const n = 1 / (v.s_alt / v.s_e + (v.s_alt / v.s_ut) ** 2)
      return { result: n, label: 'Safety Factor (Gerber)', unit: 'dimensionless', steps: [
        { label: 'Sa (alternating)', value: \`\${v.s_alt} MPa\` },
        { label: 'Se (endurance limit)', value: \`\${v.s_e} MPa\` },
        { label: 'Sut (ultimate)', value: \`\${v.s_ut} MPa\` },
        { label: 'nf = 1 / (Sa/Se + (Sa/Sut)²)', value: \`\${n.toFixed(3)}\` },
      ]}
    },`,
    description: "Gerber parabola fatigue criterion accounts for mean stress effects using a parabolic relationship. n_f = 1 / (S_a/S_e + (S_a/S_ut)²). Applies to ductile materials.",
    example: `    example: { label: 'Sa=200MPa, Se=300MPa, Sut=600MPa', value: 'n_f = 0.882' },`
  },
  'shell-buckling': {
    fields: `    fields: [
      { name: 'e', label: "Young's Modulus (E)", type: 'number', unit: 'GPa', min: 0, step: '10' },
      { name: 't', label: 'Wall Thickness', type: 'number', unit: 'mm', min: 0.01, step: '0.1' },
      { name: 'd', label: 'Shell Diameter', type: 'number', unit: 'mm', min: 1, step: '10' },
    ],`,
    compute: `    compute: (v) => {
      const r = v.d / 2
      const pCr = (0.6 * v.e * 1e9 * (v.t / 1e3)) / (r / 1e3) * (v.t / 1e3 / (r / 1e3)) ** 0.5
      return { result: pCr / 1e6, label: 'Critical Buckling Pressure', unit: 'MPa', steps: [
        { label: 'E', value: \`\${v.e} GPa\` },
        { label: 'Radius r = D/2', value: \`\${r.toFixed(1)} mm\` },
        { label: 't/r ratio', value: \`\${(v.t / r).toFixed(4)}\` },
        { label: 'Pcr = 0.6·E·(t/r)^(1.5)', value: \`\${(pCr / 1e6).toFixed(3)} MPa\` },
      ]}
    },`,
    description: "Critical buckling pressure for thin cylindrical shells under external pressure. Based on elastic stability theory. Shells with t/r < 0.05 are considered thin.",
    example: `    example: { label: 'E=200GPa, t=2mm, D=500mm', value: 'Pcr = 0.304 MPa' },`
  },
  'minor-losses': {
    fields: `    fields: [
      { name: 'k', label: 'Loss Coefficient (K)', type: 'number', min: 0, step: '0.1' },
      { name: 'v', label: 'Fluid Velocity', type: 'number', unit: 'm/s', min: 0, step: '0.5' },
      { name: 'density', label: 'Fluid Density', type: 'number', unit: 'kg/m³', min: 0, step: '100' },
    ],`,
    compute: `    compute: (v) => {
      const hM = v.k * v.v ** 2 / (2 * 9.80665)
      const dP = v.k * 0.5 * v.density * v.v ** 2
      return { result: hM, label: 'Minor Head Loss (hm)', unit: 'm', steps: [
        { label: 'K factor', value: \`\${v.k}\` },
        { label: 'Velocity', value: \`\${v.v} m/s\` },
        { label: 'hm = K·V²/(2g)', value: \`\${hM.toFixed(3)} m\` },
        { label: 'Pressure drop ΔP', value: \`\${dP.toFixed(0)} Pa\` },
      ]}
    },`,
    description: "Minor losses account for energy losses in pipe fittings (elbows, valves, tees). hm = K·V²/(2g). K values: elbow 0.3-1.5, gate valve 0.15-0.5, check valve 2-6.",
    example: `    example: { label: 'K=1.5 (standard elbow), V=3m/s, water', value: 'hm = 0.689 m, ΔP = 6,743 Pa' },`
  },
  'pipe-network': {
    fields: `    fields: [
      { name: 'q', label: 'Initial Flow Estimate (Q)', type: 'number', unit: 'm³/s', min: 0, step: '0.01' },
      { name: 'r', label: 'Pipe Resistance (R)', type: 'number', min: 0, step: '100' },
      { name: 'n', label: 'Flow Exponent (n)', type: 'number', min: 1, max: 3, step: '0.1' },
    ],`,
    compute: `    compute: (v) => {
      const hL = v.r * v.q ** v.n
      const dq = -hL / (v.n * v.r * v.q ** (v.n - 1))
      return { result: dq, label: 'Flow Correction (ΔQ)', unit: 'm³/s', steps: [
        { label: 'Assumed Q', value: \`\${v.q} m³/s\` },
        { label: 'R', value: \`\${v.r}\` },
        { label: 'n', value: \`\${v.n}\` },
        { label: 'hL = R·Q^n', value: \`\${hL.toFixed(4)} m\` },
        { label: 'ΔQ = −hL / (n·R·Q^(n−1))', value: \`\${dq.toFixed(6)} m³/s\` },
      ]}
    },`,
    description: "Hardy Cross method iteratively corrects assumed flows in pipe networks. Head loss h_L = R·Q^n. Correct flow by ΔQ each iteration until h_L ≈ 0.",
    example: `    example: { label: 'Q=0.05, R=5000, n=2', value: 'ΔQ = −0.00417 m³/s (corrected)' },`
  },
  'sediment-transport': {
    fields: `    fields: [
      { name: 'd50', label: 'Median Grain Diameter (d₅₀)', type: 'number', unit: 'mm', min: 0.01, step: '0.1' },
      { name: 'rho_s', label: 'Sediment Density', type: 'number', unit: 'kg/m³', min: 0, step: '100' },
      { name: 'rho_w', label: 'Water Density', type: 'number', unit: 'kg/m³', min: 0, step: '100' },
      { name: 'tau', label: 'Bed Shear Stress', type: 'number', unit: 'Pa', min: 0, step: '0.5' },
    ],`,
    compute: `    compute: (v) => {
      const dM = v.d50 / 1000
      const theta = v.tau / ((v.rho_s - v.rho_w) * 9.80665 * dM)
      return { result: theta, label: 'Shields Parameter (θ)', unit: 'dimensionless', steps: [
        { label: 'd₅₀', value: \`\${v.d50} mm\` },
        { label: 'τ₀ (bed shear)', value: \`\${v.tau} Pa\` },
        { label: 'θ = τ₀ / ((ρs−ρw)·g·d₅₀)', value: \`\${theta.toFixed(4)}\` },
        { label: 'θ > θ_critical → motion', value: theta > 0.03 ? '(above threshold, transport begins)' : '(below threshold, no transport)' },
      ]}
    },`,
    description: "Shields parameter determines incipient sediment motion. θ = τ_b/((ρ_s−ρ_w)gd₅₀). Critical Shields ≈ 0.03 for quartz in water. θ > θ_cr → bedload transport.",
    example: `    example: { label: 'd₅₀=0.5mm, ρs=2650, ρw=1000, τ=3Pa', value: 'θ = 0.037 — transport occurring' },`
  },
  'mixing-tank': {
    fields: `    fields: [
      { name: 'v_tank', label: 'Tank Volume', type: 'number', unit: 'm³', min: 0, step: '0.1' },
      { name: 'q_in', label: 'Inlet Flow Rate', type: 'number', unit: 'm³/s', min: 0, step: '0.001' },
      { name: 'c_in', label: 'Inlet Concentration', type: 'number', unit: 'kg/m³', min: 0, step: '0.1' },
      { name: 'c0', label: 'Initial Concentration', type: 'number', unit: 'kg/m³', min: 0, step: '0.1' },
    ],`,
    compute: `    compute: (v) => {
      const tau = v.v_tank / v.q_in
      const css = v.c_in
      const c90 = css + (v.c0 - css) * Math.exp(-3 * tau / tau)
      return { result: tau, label: 'Residence Time (τ)', unit: 's', steps: [
        { label: 'V', value: \`\${v.v_tank} m³\` },
        { label: 'Q_in', value: \`\${v.q_in} m³/s\` },
        { label: 'τ = V / Q', value: \`\${tau.toFixed(1)} s\` },
        { label: 'Steady-state C_out', value: \`\${css.toFixed(2)} kg/m³\` },
      ]}
    },`,
    description: "CSTR mixing tank: residence time τ = V/Q. Outlet concentration approaches inlet concentration exponentially: C(t) = C_in + (C₀−C_in)e^(−t/τ). At 3τ, 95% of steady state.",
    example: `    example: { label: 'V=5m³, Q=0.01m³/s, Cin=2, C₀=0', value: 'τ = 500s, Css = 2.0 kg/m³' },`
  },
  'heat-transfer-conduction': {
    fields: `    fields: [
      { name: 'k', label: 'Thermal Conductivity (k)', type: 'number', unit: 'W/m·K', min: 0, step: '0.1' },
      { name: 'area', label: 'Cross-Sectional Area', type: 'number', unit: 'm²', min: 0, step: '0.01' },
      { name: 't1', label: 'Temperature Side 1', type: 'number', unit: '°C', min: -273, step: '10' },
      { name: 't2', label: 'Temperature Side 2', type: 'number', unit: '°C', min: -273, step: '10' },
      { name: 'thickness', label: 'Wall Thickness', type: 'number', unit: 'm', min: 0.001, step: '0.01' },
    ],`,
    compute: `    compute: (v) => {
      const q = v.k * v.area * (v.t1 - v.t2) / v.thickness
      return { result: q, label: 'Conductive Heat Transfer (Q)', unit: 'W', steps: [
        { label: 'k = thermal conductivity', value: \`\${v.k} W/m·K\` },
        { label: 'A', value: \`\${v.area} m²\` },
        { label: 'ΔT = T₁ − T₂', value: \`\${(v.t1 - v.t2).toFixed(1)} °C\` },
        { label: 'L (thickness)', value: \`\${v.thickness} m\` },
        { label: 'Q = k·A·ΔT / L', value: \`\${q.toFixed(1)} W\` },
      ]}
    },`,
    description: "Fourier's law of conduction: Q = k·A·ΔT/L. Heat flows from hot to cold through a solid. Materials with high k (copper 401) are good conductors; low k (fiberglass 0.04) are insulators.",
    example: `    example: { label: 'k=0.04 (fiberglass), A=20m², ΔT=30°C, L=0.15m', value: 'Q = 160.0 W' },`
  },
  'heat-transfer-convection': {
    fields: `    fields: [
      { name: 'h', label: 'Convection Coefficient (h)', type: 'number', unit: 'W/m²·K', min: 0, step: '5' },
      { name: 'area', label: 'Surface Area', type: 'number', unit: 'm²', min: 0, step: '0.1' },
      { name: 't_s', label: 'Surface Temperature (Ts)', type: 'number', unit: '°C', min: -273, step: '10' },
      { name: 't_inf', label: 'Fluid Temperature (T∞)', type: 'number', unit: '°C', min: -273, step: '10' },
    ],`,
    compute: `    compute: (v) => {
      const q = v.h * v.area * (v.t_s - v.t_inf)
      return { result: q, label: 'Convective Heat Transfer (Q)', unit: 'W', steps: [
        { label: 'h (convection coef)', value: \`\${v.h} W/m²·K\` },
        { label: 'A', value: \`\${v.area} m²\` },
        { label: 'Ts − T∞', value: \`\${(v.t_s - v.t_inf).toFixed(1)} °C\` },
        { label: 'Q = h·A·(Ts−T∞)', value: \`\${q.toFixed(0)} W\` },
      ]}
    },`,
    description: "Newton's law of cooling: Q = h·A·(T_s−T_∞). Typical h values (W/m²·K): free convection air 5-25, forced air 25-250, water 100-15,000, boiling 2,500-100,000.",
    example: `    example: { label: 'h=50, A=2m², Ts=80°C, T∞=25°C', value: 'Q = 5,500 W' },`
  },
  'heat-transfer-radiation': {
    fields: `    fields: [
      { name: 'epsilon', label: 'Emissivity (ε)', type: 'number', min: 0, max: 1, step: '0.05' },
      { name: 'area', label: 'Surface Area', type: 'number', unit: 'm²', min: 0, step: '0.1' },
      { name: 't_s', label: 'Surface Temperature', type: 'number', unit: 'K', min: 0, step: '50' },
      { name: 't_surr', label: 'Surrounding Temperature', type: 'number', unit: 'K', min: 0, step: '50' },
    ],`,
    compute: `    compute: (v) => {
      const sigma = 5.670374419e-8
      const q = v.epsilon * sigma * v.area * (v.t_s ** 4 - v.t_surr ** 4)
      return { result: q, label: 'Radiative Heat Transfer (Q)', unit: 'W', steps: [
        { label: 'ε (emissivity)', value: \`\${v.epsilon}\` },
        { label: 'σ (Stefan-Boltzmann)', value: '5.67×10⁻⁸ W/m²·K⁴' },
        { label: 'T_s⁴ − T_surr⁴', value: \`\${(v.t_s ** 4 - v.t_surr ** 4).toExponential(2)} K⁴\` },
        { label: 'Q = ε·σ·A·(T_s⁴−T_surr⁴)', value: \`\${q.toFixed(1)} W\` },
      ]}
    },`,
    description: "Stefan-Boltzmann law: Q = ε·σ·A·(T_s⁴−T_surr⁴). All bodies above absolute zero emit thermal radiation. Blackbody ε=1; polished metal ε≈0.05; glass/brick ε≈0.9.",
    example: `    example: { label: 'ε=0.9, A=1m², Ts=500K, Tsurr=300K', value: 'Q = 2,878.5 W' },`
  },
  'fins-heat-transfer': {
    fields: `    fields: [
      { name: 'h', label: 'Convection Coefficient (h)', type: 'number', unit: 'W/m²·K', min: 0, step: '5' },
      { name: 'k', label: 'Fin Thermal Conductivity (k)', type: 'number', unit: 'W/m·K', min: 0, step: '10' },
      { name: 'l', label: 'Fin Length (L)', type: 'number', unit: 'mm', min: 0, step: '10' },
      { name: 't', label: 'Fin Thickness (t)', type: 'number', unit: 'mm', min: 0.1, step: '0.5' },
      { name: 'w', label: 'Fin Width (w)', type: 'number', unit: 'mm', min: 1, step: '10' },
    ],`,
    compute: `    compute: (v) => {
      const lm = v.l / 1000; const tm = v.t / 1000; const wm = v.w / 1000
      const p = 2 * (wm + tm); const ac = wm * tm
      const m = Math.sqrt(v.h * p / (v.k * ac))
      const eff = Math.tanh(m * lm) / (m * lm)
      return { result: eff, label: 'Fin Efficiency (η)', unit: 'dimensionless', steps: [
        { label: 'h, k', value: \`\${v.h} W/m²·K, \${v.k} W/m·K\` },
        { label: 'Perimeter P = 2(w+t)', value: \`\${(p * 1000).toFixed(1)} mm\` },
        { label: 'Cross-section A_c', value: \`\${(ac * 1e6).toFixed(1)} mm²\` },
        { label: 'm = √(h·P/(k·A_c))', value: \`\${m.toFixed(2)} m⁻¹\` },
        { label: 'η = tanh(mL) / (mL)', value: \`\${(eff * 100).toFixed(1)}%\` },
      ]}
    },`,
    description: "Fin efficiency for straight rectangular fins. η = tanh(mL)/(mL) where m = √(hP/kA_c). Long fins: η→0; short fat fins: η→1. Typical fin efficiency 60-95%.",
    example: `    example: { label: 'h=50, k=200(Al), L=50mm, t=3mm, w=100mm', value: 'η = 87.4%' },`
  },
  'heat-exchanger-ntu': {
    fields: `    fields: [
      { name: 'ua', label: 'UA (Overall HX Coefficient × Area)', type: 'number', unit: 'W/K', min: 0, step: '100' },
      { name: 'c_min', label: 'C_min (Minimum Heat Capacity Rate)', type: 'number', unit: 'W/K', min: 0, step: '50' },
      { name: 'c_r', label: 'C_r = C_min / C_max (Capacity Ratio)', type: 'number', min: 0, max: 1, step: '0.05' },
      { name: 'flow', label: 'Flow Arrangement', type: 'select', options: [{ label: 'Counterflow', value: 'counter' }, { label: 'Parallel', value: 'parallel' }] },
    ],`,
    compute: `    compute: (v) => {
      const ntu = v.ua / v.c_min
      let eff
      if (v.flow === 'counter') {
        eff = v.c_r < 1 ? (1 - Math.exp(-ntu * (1 - v.c_r))) / (1 - v.c_r * Math.exp(-ntu * (1 - v.c_r))) : ntu / (1 + ntu)
      } else {
        eff = (1 - Math.exp(-ntu * (1 + v.c_r))) / (1 + v.c_r)
      }
      return { result: eff * 100, label: 'Heat Exchanger Effectiveness (ε)', unit: '%', steps: [
        { label: 'NTU = UA / C_min', value: \`\${ntu.toFixed(2)}\` },
        { label: 'Cr = C_min/C_max', value: \`\${v.c_r.toFixed(3)}\` },
        { label: 'Flow arrangement', value: v.flow === 'counter' ? 'Counterflow' : 'Parallel' },
        { label: 'ε (effectiveness)', value: \`\${(eff * 100).toFixed(1)}%\` },
        { label: 'Q = ε·C_min·(Th_in−Tc_in)', value: \`\${(eff * v.c_min).toFixed(0)} W/K·ΔT\` },
      ]}
    },`,
    description: "Effectiveness-NTU method: ε = f(NTU, C_r, flow). Counterflow achieves highest effectiveness. NTU > 4 gives ε > 80% for counterflow. Parallel flow limited to ε < 50% at high Cr.",
    example: `    example: { label: 'UA=2000W/K, Cmin=1000W/K, Cr=0.5, counterflow', value: 'NTU=2.0, ε=73.0%' },`
  },
  'heat-exchanger-lmtd': {
    fields: `    fields: [
      { name: 'th_in', label: 'Hot Fluid Inlet (Th,in)', type: 'number', unit: '°C', min: -273, step: '10' },
      { name: 'th_out', label: 'Hot Fluid Outlet (Th,out)', type: 'number', unit: '°C', min: -273, step: '10' },
      { name: 'tc_in', label: 'Cold Fluid Inlet (Tc,in)', type: 'number', unit: '°C', min: -273, step: '10' },
      { name: 'tc_out', label: 'Cold Fluid Outlet (Tc,out)', type: 'number', unit: '°C', min: -273, step: '10' },
    ],`,
    compute: `    compute: (v) => {
      const dT1 = v.th_in - v.tc_out; const dT2 = v.th_out - v.tc_in
      const lmtd = (dT1 - dT2) / Math.log(Math.max(dT1, 1e-9) / Math.max(dT2, 1e-9))
      return { result: lmtd, label: 'Log Mean Temperature Difference (LMTD)', unit: '°C', steps: [
        { label: 'ΔT₁ = Th,in − Tc,out', value: \`\${dT1.toFixed(1)} °C\` },
        { label: 'ΔT₂ = Th,out − Tc,in', value: \`\${dT2.toFixed(1)} °C\` },
        { label: 'LMTD = (ΔT₁−ΔT₂)/ln(ΔT₁/ΔT₂)', value: \`\${lmtd.toFixed(2)} °C\` },
      ]}
    },`,
    description: "LMTD is the effective temperature difference for heat exchangers. For counterflow: ΔT₁ = Th,in−Tc,out, ΔT₂ = Th,out−Tc,in. Parallel flow swaps cold streams. Q = U·A·LMTD·F.",
    example: `    example: { label: 'Th,in=90°C, Th,out=50°C, Tc,in=20°C, Tc,out=40°C', value: 'LMTD = 35.8°C (counterflow)' },`
  },
  'transient-heat': {
    fields: `    fields: [
      { name: 'h', label: 'Convection Coefficient (h)', type: 'number', unit: 'W/m²·K', min: 0, step: '10' },
      { name: 'l', label: 'Characteristic Length (Lc)', type: 'number', unit: 'mm', min: 0.1, step: '1' },
      { name: 'k', label: 'Thermal Conductivity (k)', type: 'number', unit: 'W/m·K', min: 0, step: '1' },
      { name: 'rho', label: 'Density (ρ)', type: 'number', unit: 'kg/m³', min: 0, step: '500' },
      { name: 'cp', label: 'Specific Heat (c_p)', type: 'number', unit: 'J/kg·K', min: 0, step: '100' },
      { name: 't_sec', label: 'Time (t)', type: 'number', unit: 's', min: 0, step: '10' },
    ],`,
    compute: `    compute: (v) => {
      const lc = v.l / 1000; const bi = v.h * lc / v.k
      const alpha = v.k / (v.rho * v.cp); const fo = alpha * v.t_sec / (lc ** 2)
      const thetaRatio = Math.exp(-bi * fo)
      return { result: thetaRatio * 100, label: 'Temperature Ratio θ/θ₀', unit: '%', steps: [
        { label: 'Lc', value: \`\${v.l} mm\` },
        { label: 'Bi = h·Lc/k', value: \`\${bi.toFixed(3)} (lumped valid if < 0.1)\` },
        { label: 'α = k/(ρ·cp)', value: \`\${alpha.toExponential(4)} m²/s\` },
        { label: 'Fo = α·t/Lc²', value: \`\${fo.toFixed(3)}\` },
        { label: 'θ/θ₀ = exp(−Bi·Fo)', value: \`\${(thetaRatio * 100).toFixed(1)}%\` },
      ]}
    },`,
    description: "Lumped capacitance transient heat conduction. Valid when Bi = h·L_c/k < 0.1. θ/θ₀ = exp(−Bi·Fo). Time to reach target temp: t = (ρ·V·c_p/h·A)·ln(θ₀/θ).",
    example: `    example: { label: 'h=100, Lc=10mm, k=50, ρ=2700, cp=900, t=60s', value: 'Bi=0.020, θ/θ₀=76.2% remaining' },`
  },
  'refrigeration-cycle': {
    fields: `    fields: [
      { name: 't_l', label: 'Low Temperature (T_L)', type: 'number', unit: 'K', min: 0, step: '10' },
      { name: 't_h', label: 'High Temperature (T_H)', type: 'number', unit: 'K', min: 0, step: '10' },
      { name: 'q_l', label: 'Cooling Load (Q_L)', type: 'number', unit: 'kW', min: 0, step: '1' },
    ],`,
    compute: `    compute: (v) => {
      const copCarnot = v.t_l / (v.t_h - v.t_l)
      const wIn = copCarnot > 0 ? v.q_l / copCarnot : 0
      return { result: copCarnot, label: 'Carnot COP', unit: 'dimensionless', steps: [
        { label: 'T_L (cold reservoir)', value: \`\${v.t_l} K\` },
        { label: 'T_H (hot reservoir)', value: \`\${v.t_h} K\` },
        { label: 'COP_Carnot = T_L/(T_H−T_L)', value: \`\${copCarnot.toFixed(2)}\` },
        { label: 'Minimum power input W_in', value: \`\${wIn.toFixed(2)} kW\` },
      ]}
    },`,
    description: "Carnot COP for refrigeration: COP = T_L/(T_H−T_L). Higher COP means more efficient cooling. Actual vapor-compression cycles achieve 50-70% of Carnot COP. Typical COP: 2.5-5.",
    example: `    example: { label: 'TL=250K (−23°C), TH=300K (27°C), QL=10kW', value: 'COP = 5.00, W_in = 2.00 kW' },`
  },
  'diffuser-flow': {
    fields: `    fields: [
      { name: 'v1', label: 'Inlet Velocity (V₁)', type: 'number', unit: 'm/s', min: 0, step: '5' },
      { name: 'a_ratio', label: 'Area Ratio (A₂/A₁)', type: 'number', min: 1, step: '0.5' },
      { name: 'cp', label: 'Specific Heat (c_p)', type: 'number', unit: 'J/kg·K', min: 0, step: '100' },
      { name: 'eta_d', label: 'Diffuser Efficiency (η_D)', type: 'number', min: 0, max: 1, step: '0.05' },
    ],`,
    compute: `    compute: (v) => {
      const v2 = v.v1 / v.a_ratio
      const dP = v.eta_d * 0.5 * 1.225 * (v.v1 ** 2 - v2 ** 2)
      return { result: dP, label: 'Static Pressure Recovery (ΔP)', unit: 'Pa', steps: [
        { label: 'Inlet velocity V₁', value: \`\${v.v1} m/s\` },
        { label: 'Area ratio A₂/A₁', value: \`\${v.a_ratio}\` },
        { label: 'Outlet velocity V₂ = V₁/(A₂/A₁)', value: \`\${v2.toFixed(2)} m/s\` },
        { label: 'η_D', value: \`\${(v.eta_d * 100).toFixed(0)}%\` },
        { label: 'ΔP = η_D·½ρ(V₁²−V₂²)', value: \`\${dP.toFixed(1)} Pa\` },
      ]}
    },`,
    description: "Diffuser pressure recovery converts kinetic energy to static pressure. ΔP = η_D·½ρ(V₁²−V₂²). Area ratio 2-4 is typical. High-efficiency diffusers (η > 0.85) minimize separation losses.",
    example: `    example: { label: 'V₁=40m/s, A₂/A₁=2.5, η=0.85, air ρ=1.225', value: 'ΔP = 669.3 Pa (recovered)' },`
  },
  'fan-map': {
    fields: `    fields: [
      { name: 'd', label: 'Fan Diameter (D)', type: 'number', unit: 'mm', min: 1, step: '50' },
      { name: 'n', label: 'Rotational Speed (N)', type: 'number', unit: 'RPM', min: 0, step: '500' },
      { name: 'q', label: 'Flow Rate (Q)', type: 'number', unit: 'm³/s', min: 0, step: '0.5' },
      { name: 'rho', label: 'Air Density (ρ)', type: 'number', unit: 'kg/m³', min: 0, step: '0.1' },
    ],`,
    compute: `    compute: (v) => {
      const dM = v.d / 1000
      const phi = v.q / (v.n / 60 * dM ** 3)
      const u = Math.PI * dM * v.n / 60
      const dP = 0.5 * v.rho * u ** 2
      return { result: phi, label: 'Flow Coefficient (φ)', unit: 'dimensionless', steps: [
        { label: 'D', value: \`\${v.d} mm\` },
        { label: 'N', value: \`\${v.n} RPM\` },
        { label: 'Tip speed U = πDN/60', value: \`\${u.toFixed(1)} m/s\` },
        { label: 'φ = Q/(N·D³)', value: \`\${phi.toFixed(3)}\` },
        { label: 'Pressure coefficient ψ', value: \`\${(2 * dP / (v.rho * u ** 2)).toFixed(3)}\` },
      ]}
    },`,
    description: "Fan performance curves use dimensionless coefficients: flow φ = Q/(N·D³), pressure ψ = ΔP/(½ρU²). Affinity laws: Q ∝ N, ΔP ∝ N², P ∝ N³. Match fan to system curve at operating point.",
    example: `    example: { label: 'D=500mm, N=1200RPM, Q=3m³/s, ρ=1.225', value: 'φ = 0.191, ψ ≈ 0.45 (typical)}' },`
  },
  'pump-map': {
    fields: `    fields: [
      { name: 'q', label: 'Flow Rate (Q)', type: 'number', unit: 'm³/s', min: 0, step: '0.01' },
      { name: 'h', label: 'Head (H)', type: 'number', unit: 'm', min: 0, step: '5' },
      { name: 'rho', label: 'Fluid Density (ρ)', type: 'number', unit: 'kg/m³', min: 0, step: '100' },
      { name: 'eta_p', label: 'Pump Efficiency (η)', type: 'number', min: 0, max: 1, step: '0.05' },
    ],`,
    compute: `    compute: (v) => {
      const pHyd = v.rho * 9.80665 * v.q * v.h
      const pShaft = pHyd / v.eta_p
      return { result: pShaft, label: 'Shaft Power (P_shaft)', unit: 'W', steps: [
        { label: 'Q (flow)', value: \`\${v.q} m³/s\` },
        { label: 'H (head)', value: \`\${v.h} m\` },
        { label: 'Hydraulic power Ph = ρ·g·Q·H', value: \`\${(pHyd / 1000).toFixed(2)} kW\` },
        { label: 'η (efficiency)', value: \`\${(v.eta_p * 100).toFixed(0)}%\` },
        { label: 'P_shaft = Ph / η', value: \`\${(pShaft / 1000).toFixed(2)} kW\` },
      ]}
    },`,
    description: "Pump shaft power: P_shaft = ρ·g·Q·H / η. Pump affinity laws: Q ∝ N, H ∝ N², P ∝ N³. BEP (best efficiency point) is where the pump operates at maximum η.",
    example: `    example: { label: 'Q=0.05m³/s, H=30m, η=0.75, water ρ=1000', value: 'P_shaft = 19.61 kW' },`
  },
  'compressor-map': {
    fields: `    fields: [
      { name: 'pr', label: 'Pressure Ratio (PR)', type: 'number', min: 1, step: '0.5' },
      { name: 'm_dot', label: 'Mass Flow Rate (ṁ)', type: 'number', unit: 'kg/s', min: 0, step: '0.1' },
      { name: 't_in', label: 'Inlet Temperature (T_in)', type: 'number', unit: 'K', min: 0, step: '10' },
      { name: 'eta_c', label: 'Compressor Efficiency (η_c)', type: 'number', min: 0, max: 1, step: '0.05' },
    ],`,
    compute: `    compute: (v) => {
      const gamma = 1.4
      const tOutIdeal = v.t_in * v.pr ** ((gamma - 1) / gamma)
      const tOutActual = v.t_in + (tOutIdeal - v.t_in) / v.eta_c
      const w = v.m_dot * 1005 * (tOutActual - v.t_in)
      return { result: w / 1000, label: 'Compressor Power (W_c)', unit: 'kW', steps: [
        { label: 'PR', value: \`\${v.pr}\` },
        { label: 'ṁ', value: \`\${v.m_dot} kg/s\` },
        { label: 'T_out,ideal', value: \`\${tOutIdeal.toFixed(1)} K\` },
        { label: 'T_out,actual = T_in + (T_out,i−T_in)/η_c', value: \`\${tOutActual.toFixed(1)} K\` },
        { label: 'W_c = ṁ·c_p·(T_out−T_in)', value: \`\${(w / 1000).toFixed(2)} kW\` },
      ]}
    },`,
    description: "Compressor power: W_c = ṁ·c_p·(T_out−T_in). Compressor maps show pressure ratio vs mass flow at various speeds. Surge line limits left operation; choke line limits right.",
    example: `    example: { label: 'PR=3, ṁ=5kg/s, Tin=300K, ηc=0.85', value: 'W_c = 592.9 kW (actual)' },`
  },
  'gas-turbine': {
    fields: `    fields: [
      { name: 'pr', label: 'Pressure Ratio (r_p)', type: 'number', min: 1, step: '1' },
      { name: 't3', label: 'Turbine Inlet Temp (T₃)', type: 'number', unit: 'K', min: 0, step: '100' },
      { name: 't1', label: 'Compressor Inlet Temp (T₁)', type: 'number', unit: 'K', min: 0, step: '10' },
      { name: 'eta_c', label: 'Compressor η_c', type: 'number', min: 0, max: 1, step: '0.05' },
      { name: 'eta_t', label: 'Turbine η_t', type: 'number', min: 0, max: 1, step: '0.05' },
    ],`,
    compute: `    compute: (v) => {
      const gamma = 1.4; const cp = 1005; const exp = (gamma - 1) / gamma
      const t2s = v.t1 * v.pr ** exp; const t2 = v.t1 + (t2s - v.t1) / v.eta_c
      const t4s = v.t3 / v.pr ** exp; const t4 = v.t3 - v.eta_t * (v.t3 - t4s)
      const wNet = cp * ((v.t3 - t4) - (t2 - v.t1))
      const etaTh = 1 - 1 / v.pr ** exp
      return { result: wNet / 1000, label: 'Net Specific Work (w_net)', unit: 'kJ/kg', steps: [
        { label: 'r_p', value: \`\${v.pr}\` },
        { label: 'T₂ (compressor exit)', value: \`\${t2.toFixed(1)} K\` },
        { label: 'T₄ (turbine exit)', value: \`\${t4.toFixed(1)} K\` },
        { label: 'w_net = c_p[(T₃−T₄)−(T₂−T₁)]', value: \`\${(wNet / 1000).toFixed(0)} kJ/kg\` },
        { label: 'Thermal efficiency (ideal)', value: \`\${(etaTh * 100).toFixed(1)}%\` },
      ]}
    },`,
    description: "Brayton cycle gas turbine: net specific work w_net = c_p[(T₃−T₄)−(T₂−T₁)]. Ideal thermal efficiency η = 1−1/r_p^((γ−1)/γ). Modern turbines: r_p=15-30, η_th=35-42%.",
    example: `    example: { label: 'rp=12, T₃=1400K, T₁=300K, ηc=0.85, ηt=0.88', value: 'w_net = 327.4 kJ/kg, η=53.0% (ideal)' },`
  },
  'steam-cycle': {
    fields: `    fields: [
      { name: 'p_h', label: 'Boiler Pressure (P_high)', type: 'number', unit: 'MPa', min: 0.1, step: '1' },
      { name: 'p_l', label: 'Condenser Pressure (P_low)', type: 'number', unit: 'kPa', min: 1, step: '5' },
      { name: 't_super', label: 'Superheat Temp (T_super)', type: 'number', unit: '°C', min: 0, step: '50' },
      { name: 'eta_t', label: 'Turbine η', type: 'number', min: 0, max: 1, step: '0.05' },
    ],`,
    compute: `    compute: (v) => {
      const prRatio = v.p_h * 1000 / v.p_l
      const etaRankine = 1 - (v.p_l * 1000) / (v.p_h * 1e6) * Math.log(v.p_h * 1e6 / (v.p_l * 1000))
      const etaAct = etaRankine * v.eta_t
      return { result: etaAct * 100, label: 'Cycle Thermal Efficiency', unit: '%', steps: [
        { label: 'P_high', value: \`\${v.p_h} MPa\` },
        { label: 'P_low', value: \`\${v.p_l} kPa\` },
        { label: 'PR ratio', value: \`\${prRatio.toFixed(0)}×\` },
        { label: 'η_Rankine (approx)', value: \`\${(etaRankine * 100).toFixed(1)}%\` },
        { label: 'η_actual = η_Rankine × η_turbine', value: \`\${etaAct.toFixed(1)}%\` },
      ]}
    },`,
    description: "Rankine steam cycle: thermal efficiency increases with boiler pressure and decreases with condenser back pressure. η ≈ 1 − T_L/T_H (Carnot limit). Superheat improves efficiency and reduces moisture.",
    example: `    example: { label: 'Ph=10MPa, Pl=10kPa, Tsuper=500°C, ηt=0.85', value: 'η = 30.2% (actual cycle)' },`
  },
  'cogeneration': {
    fields: `    fields: [
      { name: 'w_net', label: 'Net Power Output (W_net)', type: 'number', unit: 'MW', min: 0, step: '1' },
      { name: 'q_heat', label: 'Process Heat Output (Q_heat)', type: 'number', unit: 'MW', min: 0, step: '1' },
      { name: 'q_fuel', label: 'Fuel Energy Input (Q_fuel)', type: 'number', unit: 'MW', min: 0, step: '5' },
    ],`,
    compute: `    compute: (v) => {
      const etaTotal = (v.w_net + v.q_heat) / v.q_fuel * 100
      const pur = v.w_net / v.q_heat
      return { result: etaTotal, label: 'Total CHP Efficiency (η_total)', unit: '%', steps: [
        { label: 'W_net (power)', value: \`\${v.w_net} MW\` },
        { label: 'Q_heat (heat)', value: \`\${v.q_heat} MW\` },
        { label: 'Q_fuel (fuel input)', value: \`\${v.q_fuel} MW\` },
        { label: 'η = (W + Q_heat) / Q_fuel × 100%', value: \`\${etaTotal.toFixed(1)}%\` },
        { label: 'PUR (power-to-heat ratio)', value: \`\${pur.toFixed(2)}\` },
      ]}
    },`,
    description: "Combined heat and power (CHP) efficiency: η_total = (W_net + Q_heat)/Q_fuel. Typical CHP: 75-90% total efficiency vs 35-45% for power-only. PUR = W_net/Q_heat varies by prime mover.",
    example: `    example: { label: 'Wnet=5MW, Qheat=8MW, Qfuel=15MW', value: 'η = 86.7%, PUR = 0.63' },`
  },
  'chiller-performance': {
    fields: `    fields: [
      { name: 'q_cool', label: 'Cooling Capacity (Q_cool)', type: 'number', unit: 'kW', min: 0, step: '10' },
      { name: 'p_in', label: 'Power Input (P_in)', type: 'number', unit: 'kW', min: 0, step: '5' },
    ],`,
    compute: `    compute: (v) => {
      const cop = v.q_cool / v.p_in
      const eer = cop * 3.412
      const kwPerTon = v.p_in / (v.q_cool / 3.517)
      return { result: cop, label: 'COP (Coefficient of Performance)', unit: 'dimensionless', steps: [
        { label: 'Cooling capacity', value: \`\${v.q_cool} kW\` },
        { label: 'Power input', value: \`\${v.p_in} kW\` },
        { label: 'COP = Q_cool / P_in', value: \`\${cop.toFixed(2)}\` },
        { label: 'EER', value: \`\${eer.toFixed(1)} BTU/h·W\` },
        { label: 'kW/ton', value: \`\${kwPerTon.toFixed(2)} kW/ton\` },
      ]}
    },`,
    description: "Chiller performance metrics: COP = Q_cool/P_in. EER (BTU/h·W) = COP×3.412. kW/ton = 3.517/COP. Good chillers: COP 5-7 (centrifugal), 3-5 (reciprocating). ASHRAE 90.1 minimums apply.",
    example: `    example: { label: 'Qcool=500kW, Pin=100kW', value: 'COP = 5.00, EER = 17.1, kW/ton = 0.70' },`
  },
  'cooling-tower': {
    fields: `    fields: [
      { name: 't_hot', label: 'Hot Water Temp In (T_hot)', type: 'number', unit: '°C', min: 0, step: '2' },
      { name: 't_cold', label: 'Cold Water Temp Out (T_cold)', type: 'number', unit: '°C', min: 0, step: '2' },
      { name: 't_wb', label: 'Wet Bulb Temp (T_wb)', type: 'number', unit: '°C', min: 0, step: '2' },
      { name: 'q_water', label: 'Water Flow Rate', type: 'number', unit: 'm³/s', min: 0, step: '0.01' },
    ],`,
    compute: `    compute: (v) => {
      const range = v.t_hot - v.t_cold
      const approach = v.t_cold - v.t_wb
      const evapLoss = v.q_water * range * 0.001 * 0.001
      return { result: range, label: 'Cooling Range', unit: '°C', steps: [
        { label: 'T_hot in', value: \`\${v.t_hot} °C\` },
        { label: 'T_cold out', value: \`\${v.t_cold} °C\` },
        { label: 'Range = T_hot − T_cold', value: \`\${range.toFixed(1)} °C\` },
        { label: 'Approach = T_cold − T_wb', value: \`\${approach.toFixed(1)} °C\` },
        { label: 'Evaporation loss (approx)', value: \`\${(evapLoss * 3600).toFixed(3)} m³/h\` },
      ]}
    },`,
    description: "Cooling tower performance: Range = T_hot−T_cold (cooling achieved). Approach = T_cold−T_wb (closeness to ambient). Smaller approach = larger/costlier tower. Evaporation loss ≈ 0.1% per °C range per cycle.",
    example: `    example: { label: 'Thot=40°C, Tcold=30°C, Twb=25°C, Q=0.1m³/s', value: 'Range=10°C, Approach=5°C, evap=1.26 m³/h' },`
  },
  'hvac-heating': {
    fields: `    fields: [
      { name: 'area', label: 'Floor Area', type: 'number', unit: 'm²', min: 0, step: '50' },
      { name: 'u', label: 'Overall U-Value', type: 'number', unit: 'W/m²·K', min: 0, step: '0.1' },
      { name: 'dd', label: 'Degree Days (HDD)', type: 'number', min: 0, step: '500' },
    ],`,
    compute: `    compute: (v) => {
      const heatLoss = v.u * v.area * v.dd * 86400 / 1e6
      return { result: heatLoss, label: 'Seasonal Heating Load', unit: 'MJ', steps: [
        { label: 'A (area)', value: \`\${v.area} m²\` },
        { label: 'U-value', value: \`\${v.u} W/m²·K\` },
        { label: 'HDD (heating degree days)', value: \`\${v.dd}\` },
        { label: 'Q_seasonal = U·A·HDD·86400/1e6', value: \`\${heatLoss.toFixed(0)} MJ\` },
        { label: 'Fuel needed (gas, 90% eff)', value: \`\${(heatLoss / (0.9 * 37.26)).toFixed(1)} m³ NG\` },
      ]}
    },`,
    description: "Heating load via degree-day method: Q_seasonal = U·A·HDD·86400 (J). HDD = sum of (18°C − T_avg) over heating season. Typical: well-insulated home ≈ 50-80 MJ/m² per season.",
    example: `    example: { label: 'A=200m², U=0.4, HDD=3000', value: 'Q = 20,736 MJ (≈619 m³ NG)' },`
  },
  'duct-design': {
    fields: `    fields: [
      { name: 'q', label: 'Air Flow Rate (Q)', type: 'number', unit: 'm³/s', min: 0, step: '0.5' },
      { name: 'l', label: 'Duct Length (L)', type: 'number', unit: 'm', min: 0, step: '5' },
      { name: 'd', label: 'Duct Diameter (D)', type: 'number', unit: 'mm', min: 1, step: '50' },
      { name: 'f', label: 'Friction Factor (f)', type: 'number', min: 0.001, max: 0.1, step: '0.005' },
    ],`,
    compute: `    compute: (v) => {
      const dM = v.d / 1000; const a = Math.PI * dM ** 2 / 4; const vel = v.q / a
      const dP = v.f * (v.l / dM) * 0.5 * 1.225 * vel ** 2
      return { result: dP, label: 'Pressure Drop (ΔP)', unit: 'Pa', steps: [
        { label: 'Q', value: \`\${v.q} m³/s\` },
        { label: 'Duct area A = πD²/4', value: \`\${a.toFixed(3)} m²\` },
        { label: 'Velocity V = Q/A', value: \`\${vel.toFixed(1)} m/s\` },
        { label: 'ΔP = f·(L/D)·½ρV²', value: \`\${dP.toFixed(0)} Pa\` },
      ]}
    },`,
    description: "Equal friction duct design maintains constant friction loss per unit length (typically 0.8-2.0 Pa/m for low-velocity duct). ΔP = f·(L/D)·½ρV². Lower velocity = lower ΔP but larger duct.",
    example: `    example: { label: 'Q=2m³/s, L=20m, D=400mm, f=0.02', value: 'V=15.9m/s, ΔP = 99.2 Pa' },`
  },
  'air-handler': {
    fields: `    fields: [
      { name: 'q_cfm', label: 'Air Flow Rate', type: 'number', unit: 'CFM', min: 0, step: '500' },
      { name: 'delta_t', label: 'Temperature Difference (ΔT)', type: 'number', unit: '°F', min: 0, step: '5' },
      { name: 'latent', label: 'Latent Load?', type: 'select', options: [{ label: 'Sensible only', value: 'sensible' }, { label: 'Sensible + Latent', value: 'total' }] },
    ],`,
    compute: `    compute: (v) => {
      const qM3s = v.q_cfm * 0.000471947
      const sensibleBtuh = 1.08 * v.q_cfm * v.delta_t
      const totalBtuh = v.latent === 'total' ? sensibleBtuh * 1.3 : sensibleBtuh
      return { result: totalBtuh, label: 'Coil Load', unit: 'BTU/h', steps: [
        { label: 'Q (airflow)', value: \`\${v.q_cfm} CFM (\${qM3s.toFixed(3)} m³/s)\` },
        { label: 'ΔT', value: \`\${v.delta_t} °F\` },
        { label: 'Q_sensible = 1.08 × CFM × ΔT', value: \`\${sensibleBtuh.toFixed(0)} BTU/h (\${(sensibleBtuh / 12000).toFixed(2)} tons)\` },
        { label: 'Q_total (with latent)', value: \`\${totalBtuh.toFixed(0)} BTU/h (\${(totalBtuh / 12000).toFixed(2)} tons)\` },
      ]}
    },`,
    description: "AHU coil sizing: Q_sensible = 1.08 × CFM × ΔT (°F). 1 ton = 12,000 BTU/h = 3.517 kW. Typical: 400 CFM/ton for cooling. Include latent load for dehumidification (+25-35%).",
    example: `    example: { label: '10,000 CFM, ΔT=20°F, total load', value: 'Q = 280,800 BTU/h (23.4 tons)' },`
  },
  'vav-box': {
    fields: `    fields: [
      { name: 'q_design', label: 'Design Flow Rate', type: 'number', unit: 'CFM', min: 0, step: '100' },
      { name: 'q_min_pct', label: 'Minimum Flow %', type: 'number', min: 10, max: 100, step: '5' },
      { name: 'delta_p', label: 'Inlet Static Pressure', type: 'number', unit: 'in. wg', min: 0, step: '0.1' },
    ],`,
    compute: `    compute: (v) => {
      const qMin = v.q_design * v.q_min_pct / 100
      const qRange = v.q_design - qMin
      const turndown = v.q_design / qMin
      const dpPa = v.delta_p * 249.089
      return { result: qMin, label: 'Minimum Flow Setpoint', unit: 'CFM', steps: [
        { label: 'Design flow', value: \`\${v.q_design} CFM\` },
        { label: 'Minimum %', value: \`\${v.q_min_pct}%\` },
        { label: 'Q_min = Design × %', value: \`\${qMin.toFixed(0)} CFM\` },
        { label: 'Turndown ratio', value: \`\${turndown.toFixed(1)}:1\` },
        { label: 'ΔP at inlet', value: \`\${v.delta_p} in. wg (\${dpPa.toFixed(0)} Pa)\` },
      ]}
    },`,
    description: "VAV box sizing: minimum flow setpoint (typically 20-30% of design for cooling; 10-15% for heating). Turndown ratio = Q_design/Q_min. ASHRAE 62.1 minimum ventilation requirements apply.",
    example: `    example: { label: 'Design=2000CFM, Min%=25%, ΔP=0.5in.wg', value: 'Qmin = 500 CFM, Turndown=4:1' },`
  },
  'differential-settling': {
    fields: `    fields: [
      { name: 'd_p', label: 'Particle Diameter (d_p)', type: 'number', unit: 'μm', min: 0.1, step: '10' },
      { name: 'rho_p', label: 'Particle Density (ρ_p)', type: 'number', unit: 'kg/m³', min: 0, step: '100' },
      { name: 'rho_f', label: 'Fluid Density (ρ_f)', type: 'number', unit: 'kg/m³', min: 0, step: '100' },
      { name: 'mu', label: 'Fluid Viscosity (μ)', type: 'number', unit: 'Pa·s', min: 0, step: '0.0001' },
    ],`,
    compute: `    compute: (v) => {
      const dpM = v.d_p / 1e6
      const vS = (v.rho_p - v.rho_f) * 9.80665 * dpM ** 2 / (18 * v.mu)
      const re = v.rho_f * vS * dpM / v.mu
      return { result: vS * 1000, label: 'Stokes Settling Velocity', unit: 'mm/s', steps: [
        { label: 'd_p (particle diam)', value: \`\${v.d_p} μm\` },
        { label: 'ρ_p − ρ_f', value: \`\${(v.rho_p - v.rho_f).toFixed(0)} kg/m³\` },
        { label: 'v_s = (ρp−ρf)·g·dp²/(18μ)', value: \`\${(vS * 1000).toFixed(3)} mm/s\` },
        { label: 'Re', value: \`\${re.toExponential(2)} (Stokes valid if Re < 0.3)\` },
      ]}
    },`,
    description: "Stokes settling velocity for spherical particles: v_s = (ρ_p−ρ_f)g·d_p²/(18μ). Valid for Re<0.3. Larger/heavier particles settle faster. Used in sedimentation basin design and particle separation.",
    example: `    example: { label: 'dp=50μm, ρp=2650, ρf=1000, μ=0.001Pa·s', value: 'v_s = 2.25 mm/s' },`
  },
  'cyclone-separator': {
    fields: `    fields: [
      { name: 'v_in', label: 'Inlet Velocity (V_in)', type: 'number', unit: 'm/s', min: 0, step: '5' },
      { name: 'dc', label: 'Cyclone Diameter (D_c)', type: 'number', unit: 'm', min: 0.01, step: '0.1' },
      { name: 'rho_p', label: 'Particle Density (ρ_p)', type: 'number', unit: 'kg/m³', min: 0, step: '500' },
      { name: 'rho_g', label: 'Gas Density (ρ_g)', type: 'number', unit: 'kg/m³', min: 0, step: '0.1' },
      { name: 'mu', label: 'Gas Viscosity (μ)', type: 'number', unit: 'Pa·s', min: 0, step: '0.00001' },
    ],`,
    compute: `    compute: (v) => {
      const d50 = Math.sqrt(9 * v.mu * v.dc / (2 * Math.PI * v.v_in * (v.rho_p - v.rho_g)))
      return { result: d50 * 1e6, label: 'Cut Diameter (d₅₀)', unit: 'μm', steps: [
        { label: 'D_c (cyclone diam)', value: \`\${v.dc} m\` },
        { label: 'V_in', value: \`\${v.v_in} m/s\` },
        { label: 'd₅₀ = √(9μD_c/(2πV_in(ρp−ρg)))', value: \`\${(d50 * 1e6).toFixed(2)} μm\` },
        { label: 'Particles > d₅₀: >50% collected', value: d50 * 1e6 < 10 ? 'High efficiency' : 'Medium efficiency' },
      ]}
    },`,
    description: "Cyclone separator cut diameter d₅₀ (50% collection efficiency). Smaller d₅₀ = better collection. Lapple model: d₅₀ = √(9μD_c/(2πV_in(ρ_p−ρ_g))). High-efficiency cyclones achieve d₅₀ < 5μm.",
    example: `    example: { label: 'Vin=20m/s, Dc=0.5m, ρp=2000, μ=1.8e-5', value: 'd₅₀ = 2.77 μm' },`
  },
  'baghouse-filter': {
    fields: `    fields: [
      { name: 'q', label: 'Gas Flow Rate (Q)', type: 'number', unit: 'm³/s', min: 0, step: '5' },
      { name: 'n_bags', label: 'Number of Bags', type: 'number', min: 1, step: '10' },
      { name: 'd_bag', label: 'Bag Diameter (D)', type: 'number', unit: 'mm', min: 1, step: '25' },
      { name: 'l_bag', label: 'Bag Length (L)', type: 'number', unit: 'm', min: 0.1, step: '0.5' },
    ],`,
    compute: `    compute: (v) => {
      const aBag = Math.PI * (v.d_bag / 1000) * v.l_bag
      const aTotal = aBag * v.n_bags
      const acRatio = v.q / aTotal
      const dP = 250 * acRatio + 500
      return { result: acRatio, label: 'Air-to-Cloth Ratio (A/C)', unit: 'm³/m²·s', steps: [
        { label: 'Q (flow)', value: \`\${v.q} m³/s\` },
        { label: 'Bags × area/bag', value: \`\${v.n_bags} × \${aBag.toFixed(2)} m²\` },
        { label: 'Total cloth area', value: \`\${aTotal.toFixed(1)} m²\` },
        { label: 'A/C = Q / A_total', value: \`\${(acRatio * 60).toFixed(2)} m³/m²·min (\${acRatio.toFixed(3)} m/s)\` },
        { label: 'ΔP (approx)', value: \`\${dP.toFixed(0)} Pa\` },
      ]}
    },`,
    description: "Baghouse filter sizing: air-to-cloth ratio = Q/A_total. Typical A/C (m³/m²·min): reverse air 0.5-1.0, pulse jet 1.0-2.5, shaker 0.6-1.2. Lower ratio = better collection, higher cost.",
    example: `    example: { label: 'Q=50m³/s, 200 bags, D=150mm, L=3m', value: 'A/C = 1.06 m³/m²·min (0.018 m/s)' },`
  },
  'electrostatic-precipitator': {
    fields: `    fields: [
      { name: 'q', label: 'Gas Flow Rate (Q)', type: 'number', unit: 'm³/s', min: 0, step: '10' },
      { name: 'v_m', label: 'Migration Velocity (w_m)', type: 'number', unit: 'cm/s', min: 0, step: '1' },
      { name: 'a_c', label: 'Collection Plate Area (A_c)', type: 'number', unit: 'm²', min: 0, step: '100' },
    ],`,
    compute: `    compute: (v) => {
      const wMs = v.v_m / 100
      const sc = -Math.log(1 - 0.99) * v.q / wMs
      const eff = 1 - Math.exp(-wMs * v.a_c / v.q)
      return { result: eff * 100, label: 'Collection Efficiency (η)', unit: '%', steps: [
        { label: 'Q', value: \`\${v.q} m³/s\` },
        { label: 'w_m (migration velocity)', value: \`\${v.v_m} cm/s\` },
        { label: 'A_c (collection area)', value: \`\${v.a_c} m²\` },
        { label: 'Deutsch number w·A_c/Q', value: \`\${(wMs * v.a_c / v.q).toFixed(2)}\` },
        { label: 'η = 1 − exp(−w·A_c/Q)', value: \`\${(eff * 100).toFixed(2)}%\` },
      ]}
    },`,
    description: "ESP collection efficiency (Deutsch-Anderson): η = 1−exp(−w_m·A_c/Q). Migration velocity w_m: 5-15 cm/s for fly ash, 2-10 cm/s for cement dust. 99+% efficiency achievable. SCA = A_c/Q (typical 50-150 m²/(m³/s)).",
    example: `    example: { label: 'Q=100m³/s, wm=10cm/s, Ac=1000m²', value: 'η = 63.21% (need more plate area for 99%: SCA=460)' },`
  },
  'chemical-reactor-cstr': {
    fields: `    fields: [
      { name: 'v', label: 'Reactor Volume (V)', type: 'number', unit: 'm³', min: 0, step: '1' },
      { name: 'v_dot', label: 'Volumetric Flow Rate (v̇)', type: 'number', unit: 'm³/s', min: 0, step: '0.001' },
      { name: 'k', label: 'Reaction Rate Constant (k)', type: 'number', unit: 's⁻¹', min: 0, step: '0.001' },
      { name: 'c_a0', label: 'Inlet Concentration (C_A0)', type: 'number', unit: 'mol/m³', min: 0, step: '10' },
    ],`,
    compute: `    compute: (v) => {
      const tau = v.v / v.v_dot
      const x = v.k * tau / (1 + v.k * tau)
      const cA = v.c_a0 * (1 - x)
      return { result: x * 100, label: 'Conversion (X_A)', unit: '%', steps: [
        { label: 'τ = V / v̇', value: \`\${tau.toFixed(1)} s\` },
        { label: 'Da = k·τ (Damköhler)', value: \`\${(v.k * tau).toFixed(3)}\` },
        { label: 'X = Da / (1 + Da)', value: \`\${(x * 100).toFixed(2)}%\` },
        { label: 'C_A_out = C_A0·(1−X)', value: \`\${cA.toFixed(2)} mol/m³\` },
      ]}
    },`,
    description: "CSTR (continuous stirred-tank reactor): X = kτ/(1+kτ) for first-order reaction. Damköhler number Da = kτ. High Da → near-complete conversion. CSTR requires larger volume than PFR for same conversion.",
    example: `    example: { label: 'V=10m³, v̇=0.01m³/s, k=0.005s⁻¹, CA0=100', value: 'τ=1000s, Da=5, X=83.33%' },`
  },
  'chemical-reactor-pfr': {
    fields: `    fields: [
      { name: 'v_dot', label: 'Volumetric Flow Rate (v̇)', type: 'number', unit: 'm³/s', min: 0, step: '0.001' },
      { name: 'k', label: 'Rate Constant (k)', type: 'number', unit: 's⁻¹', min: 0, step: '0.001' },
      { name: 'l', label: 'Reactor Length (L)', type: 'number', unit: 'm', min: 0, step: '1' },
      { name: 'a', label: 'Cross-Sectional Area (A)', type: 'number', unit: 'm²', min: 0, step: '0.01' },
    ],`,
    compute: `    compute: (v) => {
      const tau = v.a * v.l / v.v_dot
      const x = 1 - Math.exp(-v.k * tau)
      return { result: x * 100, label: 'Conversion (X_A)', unit: '%', steps: [
        { label: 'V = A × L', value: \`\${(v.a * v.l).toFixed(2)} m³\` },
        { label: 'τ = V / v̇', value: \`\${tau.toFixed(1)} s\` },
        { label: 'X = 1 − exp(−k·τ)', value: \`\${(x * 100).toFixed(2)}%\` },
      ]}
    },`,
    description: "PFR (plug flow reactor): X = 1−exp(−kτ) for first-order reaction. No back-mixing → higher conversion than CSTR at same τ. PFR requires less volume than CSTR for same conversion.",
    example: `    example: { label: 'A=0.5m², L=20m, v̇=0.01m³/s, k=0.005s⁻¹', value: 'V=10m³, τ=1000s, X=99.33%' },`
  },
  'batch-reactor': {
    fields: `    fields: [
      { name: 'c_a0', label: 'Initial Concentration (C_A0)', type: 'number', unit: 'mol/m³', min: 0, step: '50' },
      { name: 'k', label: 'Rate Constant (k)', type: 'number', unit: 's⁻¹', min: 0, step: '0.001' },
      { name: 'time', label: 'Reaction Time (t)', type: 'number', unit: 's', min: 0, step: '100' },
    ],`,
    compute: `    compute: (v) => {
      const x = 1 - Math.exp(-v.k * v.time)
      const cA = v.c_a0 * Math.exp(-v.k * v.time)
      const t90 = Math.log(10) / v.k
      return { result: x * 100, label: 'Conversion (X_A)', unit: '%', steps: [
        { label: 'C_A0 (initial)', value: \`\${v.c_a0} mol/m³\` },
        { label: 'k', value: \`\${v.k} s⁻¹\` },
        { label: 't', value: \`\${v.time} s\` },
        { label: 'X = 1 − exp(−k·t)', value: \`\${(x * 100).toFixed(2)}%\` },
        { label: 't (for 90% conversion)', value: \`\${t90.toFixed(0)} s\` },
      ]}
    },`,
    description: "Batch reactor first-order kinetics: C_A = C_A0·e^(−kt), X = 1−e^(−kt). Time for 90% conversion: t_90 = ln(10)/k. Batch reactors are flexible but have downtime between batches.",
    example: `    example: { label: 'CA0=200mol/m³, k=0.002s⁻¹, t=600s', value: 'X = 69.88%, C_A = 60.24 mol/m³' },`
  },
  'catalyst-bed': {
    fields: `    fields: [
      { name: 'dp', label: 'Particle Diameter (d_p)', type: 'number', unit: 'mm', min: 0.1, step: '0.5' },
      { name: 'l', label: 'Bed Length (L)', type: 'number', unit: 'm', min: 0, step: '0.5' },
      { name: 'epsilon', label: 'Bed Voidage (ε)', type: 'number', min: 0.1, max: 0.9, step: '0.05' },
      { name: 'mu', label: 'Fluid Viscosity (μ)', type: 'number', unit: 'Pa·s', min: 0, step: '0.00001' },
      { name: 'rho', label: 'Fluid Density (ρ)', type: 'number', unit: 'kg/m³', min: 0, step: '10' },
      { name: 'v_s', label: 'Superficial Velocity (v_s)', type: 'number', unit: 'm/s', min: 0, step: '0.1' },
    ],`,
    compute: `    compute: (v) => {
      const dpM = v.dp / 1000
      const reP = v.rho * v.v_s * dpM / (v.mu * (1 - v.epsilon))
      const ergun = (150 / reP + 1.75) * (1 - v.epsilon) / v.epsilon ** 3
      const dP = ergun * v.l * v.rho * v.v_s ** 2 / dpM
      return { result: dP / 1e5, label: 'Pressure Drop (ΔP)', unit: 'bar', steps: [
        { label: 'd_p', value: \`\${v.dp} mm\` },
        { label: 'Re_p', value: \`\${reP.toFixed(1)}\` },
        { label: 'Ergun term f_p', value: \`\${ergun.toFixed(2)}\` },
        { label: 'ΔP (Ergun eqn)', value: \`\${(dP / 1e5).toFixed(4)} bar (\${dP.toFixed(0)} Pa)\` },
      ]}
    },`,
    description: "Ergun equation for packed bed pressure drop: ΔP/L = f_p·ρ·v_s²/d_p where f_p = (150/Re_p+1.75)·(1−ε)/ε³. Valid for laminar to turbulent. Catalyst beds typically ΔP 0.1-1 bar.",
    example: `    example: { label: 'dp=3mm, L=5m, ε=0.4, μ=2e-5, ρ=1.2, vs=0.5m/s', value: 'ΔP = 0.0221 bar' },`
  },
  'distillation-column': {
    fields: `    fields: [
      { name: 'xd', label: 'Distillate Mole Fraction (x_D)', type: 'number', min: 0, max: 1, step: '0.05' },
      { name: 'xb', label: 'Bottoms Mole Fraction (x_B)', type: 'number', min: 0, max: 1, step: '0.05' },
      { name: 'xf', label: 'Feed Mole Fraction (x_F)', type: 'number', min: 0, max: 1, step: '0.05' },
      { name: 'alpha', label: 'Relative Volatility (α)', type: 'number', min: 1, step: '0.5' },
      { name: 'r', label: 'Reflux Ratio (R)', type: 'number', min: 0, step: '0.5' },
    ],`,
    compute: `    compute: (v) => {
      const rMin = 1 / (v.alpha - 1) * (v.xd / v.xf - v.alpha * (1 - v.xd) / (1 - v.xf))
      const nO = Math.log(v.xd * (1 - v.xb) / (v.xb * (1 - v.xd))) / Math.log(v.alpha)
      const n = nO * (v.r + 0.5) / (v.r + 1)
      return { result: n, label: 'Approximate Number of Stages', unit: 'stages', steps: [
        { label: 'α', value: \`\${v.alpha}\` },
        { label: 'R_min (minimum reflux)', value: \`\${Math.max(0, rMin.toFixed(3))}\` },
        { label: 'N_min (Fenske, total reflux)', value: \`\${nO.toFixed(1)}\` },
        { label: 'N (at R = R_op)', value: \`\${Math.ceil(n)} stages\` },
      ]}
    },`,
    description: "McCabe-Thiele distillation: Fenske equation N_min = ln[x_D(1−x_B)/x_B(1−x_D)]/ln(α). Underwood R_min. Operating R = 1.2-1.5×R_min. More stages needed for high purity or close-boiling mixtures.",
    example: `    example: { label: 'xD=0.95, xB=0.05, xF=0.5, α=2.5, R=2', value: 'N ≈ 10 stages (Rmin=1.333)' },`
  },
  'absorption-column': {
    fields: `    fields: [
      { name: 'v_y', label: 'Gas Flow (V_y)', type: 'number', unit: 'kmol/s', min: 0, step: '0.01' },
      { name: 'l_x', label: 'Liquid Flow (L_x)', type: 'number', unit: 'kmol/s', min: 0, step: '0.01' },
      { name: 'm', label: 'Equilibrium Constant (m)', type: 'number', min: 0, step: '0.1' },
      { name: 'y1', label: 'Inlet Gas Mole Frac (y₁)', type: 'number', min: 0, max: 1, step: '0.01' },
      { name: 'y2', label: 'Outlet Gas Mole Frac (y₂)', type: 'number', min: 0, max: 1, step: '0.01' },
    ],`,
    compute: `    compute: (v) => {
      const aF = v.l_x / (v.v_y * v.m)
      const nog = Math.log((1 - 1 / aF) * (v.y1 - v.m * 0) / (v.y2 - v.m * 0) + 1 / aF) / (1 - 1 / aF)
      const hog = v.v_y / (v.l_x)
      const z = nog * hog * 0.5
      return { result: z, label: 'Packed Column Height (Z)', unit: 'm', steps: [
        { label: 'L/V·m = A (absorption factor)', value: \`\${aF.toFixed(3)}\` },
        { label: 'N_OG (transfer units)', value: \`\${nog.toFixed(2)}\` },
        { label: 'H_OG (HTU, approx)', value: \`\${hog.toFixed(3)} m\` },
        { label: 'Z = N_OG × H_OG', value: \`\${z.toFixed(2)} m\` },
      ]}
    },`,
    description: "Packed absorption column height: Z = N_OG × H_OG. Absorption factor A = L/(V·m). A > 1.5 recommended for 90%+ recovery. H_OG depends on packing type and size (typically 0.3-1.0 m).",
    example: `    example: { label: 'Vy=0.05, Lx=0.15, m=1.2, y1=0.1, y2=0.01', value: 'A=2.5, N_OG=3.5, Z≈0.88m' },`
  },
  'extraction-calc': {
    fields: `    fields: [
      { name: 'k_d', label: 'Distribution Coefficient (K_D)', type: 'number', min: 0, step: '0.5' },
      { name: 'v_org', label: 'Organic Phase Volume (V_org)', type: 'number', unit: 'L', min: 0, step: '0.1' },
      { name: 'v_aq', label: 'Aqueous Phase Volume (V_aq)', type: 'number', unit: 'L', min: 0, step: '0.1' },
      { name: 'n_stages', label: 'Number of Stages', type: 'number', min: 1, max: 10, step: '1' },
    ],`,
    compute: `    compute: (v) => {
      const e = v.k_d * v.v_org / v.v_aq
      const fRemaining = 1 / (1 + e) ** v.n_stages
      const fExtracted = 1 - fRemaining
      return { result: fExtracted * 100, label: 'Fraction Extracted', unit: '%', steps: [
        { label: 'K_D', value: \`\${v.k_d}\` },
        { label: 'V_org / V_aq', value: \`\${(v.v_org / v.v_aq).toFixed(2)}\` },
        { label: 'E = K_D × (V_org/V_aq)', value: \`\${e.toFixed(2)}\` },
        { label: 'Fraction remaining after N stages', value: \`\${(fRemaining * 100).toFixed(2)}%\` },
        { label: 'Fraction extracted', value: \`\${fExtracted * 100 > 99.9 ? '>99.9%' : fExtracted.toFixed(2) + '%'}\` },
      ]}
    },`,
    description: "Liquid-liquid extraction: E = K_D·(V_org/V_aq). After N stages: fraction remaining = 1/(1+E)^N. K_D > 5 enables efficient extraction with few stages. Multiple smaller portions extract more than one large one.",
    example: `    example: { label: 'KD=3, Vorg=0.2L, Vaq=1L, 3 stages', value: 'E=0.6, extracted=93.0%' },`
  },
  'adsorption-column': {
    fields: `    fields: [
      { name: 'q_max', label: 'Max Adsorption Capacity (q_max)', type: 'number', unit: 'mg/g', min: 0, step: '10' },
      { name: 'k_l', label: 'Langmuir Constant (K_L)', type: 'number', unit: 'L/mg', min: 0, step: '0.01' },
      { name: 'c_init', label: 'Initial Concentration (C₀)', type: 'number', unit: 'mg/L', min: 0, step: '10' },
      { name: 'm_ads', label: 'Adsorbent Mass', type: 'number', unit: 'g', min: 0, step: '1' },
      { name: 'v_soln', label: 'Solution Volume', type: 'number', unit: 'L', min: 0, step: '0.5' },
    ],`,
    compute: `    compute: (v) => {
      const c_eq = v.c_init * Math.exp(-v.m_ads * v.q_max * v.k_l / (v.v_soln * (1 + v.k_l * 0)))
      const qe = v.q_max * v.k_l * v.c_init / (1 + v.k_l * v.c_init)
      const removal = (v.c_init - c_eq) / v.c_init * 100
      return { result: removal, label: 'Removal Efficiency', unit: '%', steps: [
        { label: 'q_max', value: \`\${v.q_max} mg/g\` },
        { label: 'K_L', value: \`\${v.k_l} L/mg\` },
        { label: 'C₀', value: \`\${v.c_init} mg/L\` },
        { label: 'qe = q_max·K_L·C₀/(1+K_L·C₀)', value: \`\${qe.toFixed(2)} mg/g\` },
        { label: 'Removal ≈', value: \`\${removal.toFixed(1)}%\` },
      ]}
    },`,
    description: "Langmuir adsorption isotherm: q_e = q_max·K_L·C_eq/(1+K_L·C_eq). Removal efficiency depends on adsorbent mass, solution volume, and isotherm parameters. Activated carbon: q_max ≈ 200-400 mg/g for many organics.",
    example: `    example: { label: 'qmax=300mg/g, KL=0.05L/mg, C₀=100mg/L, m=10g, V=1L', value: 'qe=50mg/g, removal≈93.5%' },`
  },
  'membrane-separation': {
    fields: `    fields: [
      { name: 'a_m', label: 'Membrane Area (A)', type: 'number', unit: 'm²', min: 0, step: '1' },
      { name: 'p_feed', label: 'Feed Pressure (P_f)', type: 'number', unit: 'bar', min: 0, step: '5' },
      { name: 'p_perm', label: 'Permeate Pressure (P_p)', type: 'number', unit: 'bar', min: 0, step: '0.5' },
      { name: 'l_p', label: 'Water Permeability (L_p)', type: 'number', unit: 'L/m²·h·bar', min: 0, step: '0.5' },
      { name: 'osmotic', label: 'Osmotic Pressure (Δπ)', type: 'number', unit: 'bar', min: 0, step: '0.5' },
    ],`,
    compute: `    compute: (v) => {
      const netDriving = (v.p_feed - v.p_perm) - v.osmotic
      const jw = v.l_p * netDriving
      const qPerm = jw * v.a_m
      return { result: qPerm, label: 'Permeate Flow Rate (Q_p)', unit: 'L/h', steps: [
        { label: 'ΔP (trans-membrane)', value: \`\${(v.p_feed - v.p_perm).toFixed(1)} bar\` },
        { label: 'Δπ (osmotic)', value: \`\${v.osmotic.toFixed(1)} bar\` },
        { label: 'Net driving pressure', value: \`\${netDriving.toFixed(1)} bar\` },
        { label: 'J_w = L_p × NDP', value: \`\${jw.toFixed(2)} L/m²·h\` },
        { label: 'Q_p = J_w × A', value: \`\${qPerm.toFixed(1)} L/h\` },
      ]}
    },`,
    description: "RO membrane flux: J_w = L_p·(ΔP−Δπ). Higher pressure increases flux but costs more. Δπ for seawater ≈ 25 bar. Typical L_p: 1-5 L/m²·h·bar for RO membranes. Salt rejection > 99% for single-pass seawater RO.",
    example: `    example: { label: 'A=100m², Pf=55bar, Pp=1bar, Lp=2, Δπ=25bar', value: 'NDP=29bar, Jw=58L/m²·h, Qp=5,800L/h' },`
  },
  'crystallization': {
    fields: `    fields: [
      { name: 'c_init', label: 'Initial Concentration (C₀)', type: 'number', unit: 'g/100g', min: 0, step: '5' },
      { name: 'c_eq', label: 'Equilibrium Solubility (C_eq)', type: 'number', unit: 'g/100g', min: 0, step: '5' },
      { name: 'm_soln', label: 'Solution Mass', type: 'number', unit: 'kg', min: 0, step: '10' },
    ],`,
    compute: `    compute: (v) => {
      const supersat = v.c_init - v.c_eq
      const yieldG = v.m_soln * (v.c_init - v.c_eq) / (100 + v.c_eq) * 1000
      const yieldPct = supersat / v.c_init * 100
      return { result: yieldG, label: 'Crystal Yield', unit: 'g', steps: [
        { label: 'C₀ (initial concentration)', value: \`\${v.c_init} g/100g\` },
        { label: 'C* (solubility at T)', value: \`\${v.c_eq} g/100g\` },
        { label: 'ΔC (supersaturation)', value: \`\${supersat.toFixed(1)} g/100g\` },
        { label: 'Yield = Msoln·ΔC/(100+C*)', value: \`\${yieldG.toFixed(0)} g\` },
        { label: 'Yield % of solute', value: \`\${yieldPct.toFixed(1)}%\` },
      ]}
    },`,
    description: "Crystallization yield: Y = M_soln·(C₀−C*)/(100+C*). Supersaturation ΔC = C₀−C* drives nucleation and growth. Cooling or evaporation increases supersaturation. Yield is limited by solubility at final temperature.",
    example: `    example: { label: 'C₀=80g/100g, C*=50g/100g, Msoln=500kg', value: 'Yield = 100.0 kg (250 g/kg solution)' },`
  },
  'drying-calc': {
    fields: `    fields: [
      { name: 'x_init', label: 'Initial Moisture (X₀)', type: 'number', unit: 'kg/kg dry', min: 0, step: '0.1' },
      { name: 'x_crit', label: 'Critical Moisture (X_c)', type: 'number', unit: 'kg/kg dry', min: 0, step: '0.05' },
      { name: 'x_eq', label: 'Equilibrium Moisture (X*)', type: 'number', unit: 'kg/kg dry', min: 0, step: '0.01' },
      { name: 'n_c', label: 'Constant Drying Rate (N_c)', type: 'number', unit: 'kg/m²·h', min: 0, step: '0.1' },
      { name: 'm_dry', label: 'Dry Solid Mass', type: 'number', unit: 'kg', min: 0, step: '10' },
      { name: 'area', label: 'Drying Surface Area', type: 'number', unit: 'm²', min: 0, step: '1' },
    ],`,
    compute: `    compute: (v) => {
      const t1 = v.m_dry * (v.x_init - v.x_crit) / (v.n_c * v.area)
      const t2 = v.m_dry * (v.x_crit - v.x_eq) / (v.n_c * v.area) * Math.log((v.x_crit - v.x_eq) / (0.01))
      const tTotal = t1 + t2
      return { result: tTotal, label: 'Total Drying Time', unit: 'h', steps: [
        { label: 'X₀−X_c (constant rate)', value: \`\${(v.x_init - v.x_crit).toFixed(2)}\` },
        { label: 'Constant rate time', value: \`\${t1.toFixed(1)} h\` },
        { label: 'Falling rate time', value: \`\${t2.toFixed(1)} h\` },
        { label: 'Total time to X=0.01', value: \`\${tTotal.toFixed(1)} h\` },
      ]}
    },`,
    description: "Drying rate: constant rate period (unbound moisture) until X_crit, then falling rate (bound moisture). N_c depends on temperature, humidity, and air velocity. Typical: food products N_c=0.5-2, paper=5-15 kg/m²·h.",
    example: `    example: { label: 'X₀=2, Xc=0.5, X*=0.05, Nc=0.8, Mdry=100kg, A=5m²', value: 'Total time = 48.5h' },`
  },
  'filtration-calc': {
    fields: `    fields: [
      { name: 'v_filtrate', label: 'Filtrate Volume (V)', type: 'number', unit: 'm³', min: 0, step: '0.5' },
      { name: 'a', label: 'Filter Area (A)', type: 'number', unit: 'm²', min: 0, step: '0.1' },
      { name: 'delta_p', label: 'Pressure Drop (ΔP)', type: 'number', unit: 'kPa', min: 0, step: '10' },
      { name: 'mu', label: 'Filtrate Viscosity (μ)', type: 'number', unit: 'mPa·s', min: 0, step: '0.5' },
      { name: 'alpha', label: 'Specific Cake Resistance (α)', type: 'number', unit: 'm/kg', min: 0, step: '1e11' },
      { name: 'c', label: 'Solid Concentration (c)', type: 'number', unit: 'kg/m³', min: 0, step: '10' },
    ],`,
    compute: `    compute: (v) => {
      const dPa = v.delta_p * 1000; const muPa = v.mu / 1000
      const t1 = (muPa * v.alpha * v.c / (2 * dPa * v.a ** 2)) * v.v_filtrate ** 2
      const t2 = muPa * 0 * v.v_filtrate / (dPa * v.a)
      const dTdV = muPa * v.alpha * v.c * v.v_filtrate / (dPa * v.a ** 2)
      return { result: t1, label: 'Filtration Time (t)', unit: 's', steps: [
        { label: 'ΔP', value: \`\${v.delta_p} kPa\` },
        { label: 'Cake filtration', value: \`t = (μ·α·c/2ΔP·A²)·V²\` },
        { label: 't for V =', value: \`\${v.v_filtrate} m³ → \${t1.toFixed(1)} s\` },
        { label: 'dT/dV', value: \`\${dTdV.toExponential(2)} s/m³\` },
      ]}
    },`,
    description: "Ruth filtration equation: t = (μ·α·c/(2ΔP·A²))·V² for constant pressure filtration. Specific cake resistance α depends on particle size and compressibility. Lower α means easier filtration (α=1e10-1e12 m/kg typical).",
    example: `    example: { label: 'V=2m³, A=1m², ΔP=100kPa, μ=1mPa·s, α=1e11, c=50', value: 't = 1,000 s (≈17 min)' },`
  },
  'centrifugation': {
    fields: `    fields: [
      { name: 'r', label: 'Centrifuge Radius (r)', type: 'number', unit: 'mm', min: 0, step: '25' },
      { name: 'rpm', label: 'Rotational Speed (N)', type: 'number', unit: 'RPM', min: 0, step: '1000' },
    ],`,
    compute: `    compute: (v) => {
      const rM = v.r / 1000
      const omega = v.rpm * 2 * Math.PI / 60
      const gForce = omega ** 2 * rM / 9.80665
      const vTang = omega * rM
      return { result: gForce, label: 'Relative Centrifugal Force (RCF)', unit: '×g', steps: [
        { label: 'Radius r', value: \`\${v.r} mm\` },
        { label: 'N', value: \`\${v.rpm} RPM\` },
        { label: 'ω = 2πN/60', value: \`\${omega.toFixed(1)} rad/s\` },
        { label: 'RCF = ω²r/g', value: \`\${gForce.toFixed(0)} ×g\` },
        { label: 'Tangential velocity', value: \`\${vTang.toFixed(1)} m/s\` },
      ]}
    },`,
    description: "Centrifugal force (RCF): G = ω²r/g = (2πN/60)²·r/g. Typical G: low-speed 1,000-5,000×g, high-speed 10,000-50,000×g, ultracentrifuge 100,000-500,000×g. Higher G = faster separation.",
    example: `    example: { label: 'r=150mm, N=3000RPM', value: 'RCF = 1,511 ×g, v_tan = 47.1 m/s' },`
  },
  'mixer-design': {
    fields: `    fields: [
      { name: 'd', label: 'Impeller Diameter (D)', type: 'number', unit: 'mm', min: 0, step: '50' },
      { name: 'n', label: 'Rotational Speed (N)', type: 'number', unit: 'RPM', min: 0, step: '50' },
      { name: 'rho', label: 'Fluid Density (ρ)', type: 'number', unit: 'kg/m³', min: 0, step: '100' },
      { name: 'mu', label: 'Fluid Viscosity (μ)', type: 'number', unit: 'Pa·s', min: 0, step: '0.1' },
      { name: 'np', label: 'Power Number (N_p)', type: 'number', min: 0.1, step: '0.5' },
    ],`,
    compute: `    compute: (v) => {
      const dM = v.d / 1000
      const nRps = v.n / 60
      const re = v.rho * nRps * dM ** 2 / v.mu
      const p = v.np * v.rho * nRps ** 3 * dM ** 5
      return { result: p, label: 'Impeller Power (P)', unit: 'W', steps: [
        { label: 'D', value: \`\${v.d} mm\` },
        { label: 'N', value: \`\${v.n} RPM (\${nRps.toFixed(2)} rps)\` },
        { label: 'Re = ρ·N·D²/μ', value: \`\${re.toFixed(0)}\` },
        { label: 'N_p', value: \`\${v.np}\` },
        { label: 'P = Np·ρ·N³·D⁵', value: \`\${p.toFixed(0)} W (\${(p / 1000).toFixed(2)} kW)\` },
      ]}
    },`,
    description: "Mixer power: P = N_p·ρ·N³·D⁵. Power number N_p depends on impeller type and Re: Rushton turbine ≈ 5, pitched blade ≈ 1.5, propeller ≈ 0.5. Turbulent regime (Re > 10⁴) gives constant N_p.",
    example: `    example: { label: 'D=300mm, N=150RPM, ρ=1000, μ=0.001, Np=5', value: 'P = 195 W (turbulent, Re=220,000)' },`
  },
  'agitated-vessel': {
    fields: `    fields: [
      { name: 'v_tank', label: 'Tank Volume (V)', type: 'number', unit: 'm³', min: 0, step: '1' },
      { name: 'q_recirc', label: 'Recirculation Rate (Q_r)', type: 'number', unit: 'm³/s', min: 0, step: '0.01' },
      { name: 'n_impellers', label: 'Number of Impellers', type: 'number', min: 1, max: 4, step: '1' },
    ],`,
    compute: `    compute: (v) => {
      const tau = v.v_tank / v.q_recirc
      const turnovers = v.q_recirc / v.v_tank * 60
      const blendTime = tau * 2
      return { result: blendTime, label: 'Approximate Blend Time (t_b)', unit: 's', steps: [
        { label: 'V (tank volume)', value: \`\${v.v_tank} m³\` },
        { label: 'Q_r (recirc rate)', value: \`\${v.q_recirc} m³/s\` },
        { label: 'Circulation time τ = V/Q_r', value: \`\${tau.toFixed(1)} s\` },
        { label: 'Turnovers per minute', value: \`\${turnovers.toFixed(1)}\` },
        { label: 'Blend time ≈ 2τ', value: \`\${blendTime.toFixed(0)} s\` },
      ]}
    },`,
    description: "Agitated vessel blending: circulation time τ = V/Q_r. Blending time ≈ 2-4 circulation times. For impeller-generated flow, Q_r = N_Q·N·D³. Flow number N_Q ≈ 0.5-0.8 for Rushton turbine. Good mixing requires 3-5 turnovers/min.",
    example: `    example: { label: 'V=20m³, Qr=0.1m³/s, 2 impellers', value: 'τ = 200s, t_blend ≈ 400s (6.7 min)' },`
  },
  'pinch-analysis': {
    fields: `    fields: [
      { name: 't_hot_in', label: 'Hot Stream Inlet (T_h,in)', type: 'number', unit: '°C', min: -273, step: '20' },
      { name: 't_hot_out', label: 'Hot Stream Outlet (T_h,out)', type: 'number', unit: '°C', min: -273, step: '20' },
      { name: 't_cold_in', label: 'Cold Stream Inlet (T_c,in)', type: 'number', unit: '°C', min: -273, step: '20' },
      { name: 't_cold_out', label: 'Cold Stream Outlet (T_c,out)', type: 'number', unit: '°C', min: -273, step: '20' },
      { name: 'mcp_h', label: 'Hot MC_p (mass·cp)', type: 'number', unit: 'kW/°C', min: 0, step: '10' },
      { name: 'mcp_c', label: 'Cold MC_p (mass·cp)', type: 'number', unit: 'kW/°C', min: 0, step: '10' },
    ],`,
    compute: `    compute: (v) => {
      const qHot = v.mcp_h * (v.t_hot_in - v.t_hot_out)
      const qCold = v.mcp_c * (v.t_cold_out - v.t_cold_in)
      const qInt = Math.min(qHot, qCold)
      const dtMin = 10
      const pinchT = (v.t_hot_out + v.t_cold_in) / 2
      return { result: qInt, label: 'Maximum Heat Recovery (Q_rec)', unit: 'kW', steps: [
        { label: 'Q_hot (available)', value: \`\${qHot.toFixed(1)} kW\` },
        { label: 'Q_cold (required)', value: \`\${qCold.toFixed(1)} kW\` },
        { label: 'ΔT_min (assumed)', value: \`\${dtMin} °C\` },
        { label: 'Max recovery', value: \`\${qInt.toFixed(1)} kW\` },
        { label: 'Hot utility avoided', value: \`\${qInt.toFixed(1)} kW\` },
      ]}
    },`,
    description: "Pinch analysis identifies minimum utility targets. ΔT_min (typically 10-20°C) determines the pinch point. Above pinch: use only hot utility. Below pinch: use only cold utility. Cross-pinch heat transfer wastes energy.",
    example: `    example: { label: 'Hot: 150→80°C, MCp=50; Cold: 20→100°C, MCp=40', value: 'Qrec=3,200 kW (Qhot=3,500, Qcold=3,200)' },`
  },
  'mass-balance': {
    fields: `    fields: [
      { name: 'm_in', label: 'Total Mass In (M_in)', type: 'number', unit: 'kg/h', min: 0, step: '100' },
      { name: 'x_in', label: 'Inlet Composition (x_in)', type: 'number', min: 0, max: 1, step: '0.05' },
      { name: 'f_split', label: 'Split Fraction to Stream 1', type: 'number', min: 0, max: 1, step: '0.05' },
    ],`,
    compute: `    compute: (v) => {
      const m1 = v.m_in * v.f_split
      const m2 = v.m_in * (1 - v.f_split)
      const x1 = v.x_in
      const x2 = v.x_in
      return { result: m1, label: 'Mass Flow Stream 1 (M₁)', unit: 'kg/h', steps: [
        { label: 'M_in', value: \`\${v.m_in} kg/h\` },
        { label: 'Split fraction', value: \`\${(v.f_split * 100).toFixed(0)}% / \${((1 - v.f_split) * 100).toFixed(0)}%\` },
        { label: 'M₁ = M_in × f', value: \`\${m1.toFixed(1)} kg/h\` },
        { label: 'M₂ = M_in × (1−f)', value: \`\${m2.toFixed(1)} kg/h\` },
        { label: 'Mass balance check', value: \`\${(m1 + m2).toFixed(1)} = \${v.m_in} ✓\` },
      ]}
    },`,
    description: "Steady-state mass balance: ΣM_in = ΣM_out. For splits: M₁ = f·M_in, M₂ = (1−f)·M_in. Composition remains same in splitter. For mixers/separation, component balance: M_in·x_in = Σ(M_out·x_out).",
    example: `    example: { label: 'Min=1000kg/h, x=0.3, split=0.6', value: 'M₁=600 kg/h (x₁=0.3), M₂=400 kg/h (x₂=0.3)' },`
  },
  'energy-balance': {
    fields: `    fields: [
      { name: 'm_dot', label: 'Mass Flow Rate (ṁ)', type: 'number', unit: 'kg/s', min: 0, step: '1' },
      { name: 'h_in', label: 'Inlet Enthalpy (h_in)', type: 'number', unit: 'kJ/kg', min: 0, step: '100' },
      { name: 'h_out', label: 'Outlet Enthalpy (h_out)', type: 'number', unit: 'kJ/kg', min: 0, step: '100' },
      { name: 'q_ext', label: 'External Heat (Q_ext)', type: 'number', unit: 'kW', min: 0, step: '100' },
    ],`,
    compute: `    compute: (v) => {
      const deltaH = v.m_dot * (v.h_out - v.h_in)
      const wShaft = deltaH - v.q_ext
      return { result: deltaH, label: 'Enthalpy Change (ΔH)', unit: 'kW', steps: [
        { label: 'ṁ (mass flow)', value: \`\${v.m_dot} kg/s\` },
        { label: 'h_in', value: \`\${v.h_in} kJ/kg\` },
        { label: 'h_out', value: \`\${v.h_out} kJ/kg\` },
        { label: 'ΔH = ṁ·(h_out−h_in)', value: \`\${deltaH.toFixed(1)} kW\` },
        { label: 'Shaft work = ΔH − Q_ext', value: \`\${wShaft.toFixed(1)} kW\` },
      ]}
    },`,
    description: "Steady-flow energy balance: ṁ·h_in + Q_ext + W_shaft = ṁ·h_out. ΔH = ṁ·(h_out−h_in). Q_ext positive = heat added, W_shaft positive = work done on system (compressor) or by system (turbine).",
    example: `    example: { label: 'ṁ=5kg/s, hin=500kJ/kg, hout=700kJ/kg, Q=100kW', value: 'ΔH=1,000kW, W_shaft=900kW (turbine)' },`
  },
  'process-control-pid': {
    fields: `    fields: [
      { name: 'k_u', label: 'Ultimate Gain (K_u)', type: 'number', min: 0, step: '1' },
      { name: 't_u', label: 'Ultimate Period (T_u)', type: 'number', unit: 's', min: 0.1, step: '5' },
      { name: 'method', label: 'Tuning Method', type: 'select', options: [{ label: 'Ziegler-Nichols', value: 'zn' }, { label: 'Cohen-Coon', value: 'cc' }] },
    ],`,
    compute: `    compute: (v) => {
      let kp, ti, td
      if (v.method === 'zn') {
        kp = 0.6 * v.k_u; ti = v.t_u / 2; td = v.t_u / 8
      } else {
        kp = v.k_u / 1.7; ti = v.t_u / 2.5; td = v.t_u / 10
      }
      return { result: kp, label: 'Proportional Gain (K_p)', unit: 'dimensionless', steps: [
        { label: 'K_u (ultimate gain)', value: \`\${v.k_u}\` },
        { label: 'T_u (ultimate period)', value: \`\${v.t_u} s\` },
        { label: 'Method', value: v.method === 'zn' ? 'Ziegler-Nichols' : 'Cohen-Coon' },
        { label: 'K_p', value: \`\${kp.toFixed(3)}\` },
        { label: 'T_i (integral time)', value: \`\${ti.toFixed(1)} s\` },
        { label: 'T_d (derivative time)', value: \`\${td.toFixed(1)} s\` },
      ]}
    },`,
    description: "Ziegler-Nichols PID tuning (closed-loop): K_p = 0.6K_u, T_i = T_u/2, T_d = T_u/8. Cohen-Coon: K_p = K_u/1.7, T_i = T_u/2.5, T_d = T_u/10. Quarter-decay ratio response. Fine-tune for aggressive/conservative control.",
    example: `    example: { label: 'Ku=10, Tu=30s, Ziegler-Nichols', value: 'Kp=6.0, Ti=15s, Td=3.75s' },`
  },
  'process-control-loop': {
    fields: `    fields: [
      { name: 'k_p', label: 'Process Gain (K_p)', type: 'number', min: 0, step: '0.5' },
      { name: 'tau_p', label: 'Process Time Constant (τ_p)', type: 'number', unit: 's', min: 0, step: '5' },
      { name: 'theta_p', label: 'Process Dead Time (θ_p)', type: 'number', unit: 's', min: 0, step: '1' },
      { name: 'k_c', label: 'Controller Gain (K_c)', type: 'number', min: 0, step: '0.5' },
    ],`,
    compute: `    compute: (v) => {
      const kO = v.k_p * v.k_c
      const gm = 1 / kO
      const pm = 180 - 180 / Math.PI * Math.atan2(v.theta_p, v.tau_p) - 180 / Math.PI * Math.atan2(0, 1)
      return { result: gm, label: 'Gain Margin (GM)', unit: 'dimensionless', steps: [
        { label: 'K_p (process gain)', value: \`\${v.k_p}\` },
        { label: 'τ_p (time constant)', value: \`\${v.tau_p} s\` },
        { label: 'θ_p (dead time)', value: \`\${v.theta_p} s\` },
        { label: 'K_c (controller gain)', value: \`\${v.k_c}\` },
        { label: 'GM = 1/|K_p·K_c|', value: \`\${gm.toFixed(3)} (GM > 1.7 stable)\` },
      ]}
    },`,
    description: "Control loop stability: gain margin GM = 1/|K_p·K_c|. Stable if GM > 1 (typically > 1.7 for good robustness). Phase margin > 30° recommended. Larger dead time θ_p reduces stability margins — use derivative action to compensate.",
    example: `    example: { label: 'Kp=2, τp=10s, θp=2s, Kc=0.5', value: 'GM = 1.000 (marginally stable)' },`
  },
  'block-diagram': {
    fields: `    fields: [
      { name: 'g1', label: 'Transfer Function G₁(s)', type: 'number', min: 0, step: '1' },
      { name: 'g2', label: 'Transfer Function G₂(s)', type: 'number', min: 0, step: '1' },
      { name: 'h', label: 'Feedback Function H(s)', type: 'number', min: 0, step: '0.1' },
      { name: 'config', label: 'Connection Type', type: 'select', options: [{ label: 'Series', value: 'series' }, { label: 'Parallel', value: 'parallel' }, { label: 'Feedback (negative)', value: 'feedback' }] },
    ],`,
    compute: `    compute: (v) => {
      let tf
      if (v.config === 'series') { tf = v.g1 * v.g2 }
      else if (v.config === 'parallel') { tf = v.g1 + v.g2 }
      else { tf = v.g1 / (1 + v.g1 * v.h) }
      return { result: tf, label: 'Overall Transfer Function (TF)', unit: 'dimensionless', steps: [
        { label: 'G₁', value: \`\${v.g1}\` },
        { label: 'G₂', value: \`\${v.g2}\` },
        { label: 'H', value: \`\${v.h}\` },
        { label: 'Configuration', value: v.config === 'series' ? 'Series: G₁·G₂' : v.config === 'parallel' ? 'Parallel: G₁+G₂' : 'Negative feedback: G₁/(1+G₁·H)' },
        { label: 'Result TF', value: \`\${tf.toFixed(4)}\` },
      ]}
    },`,
    description: "Block diagram reduction rules: series G=G₁·G₂, parallel G=G₁+G₂, negative feedback T=G/(1+GH), positive feedback T=G/(1−GH). Mason's gain formula for complex systems with multiple loops. Reduce step by step.",
    example: `    example: { label: 'G₁=5, G₂=2, H=0.1, feedback', value: 'TF = 3.333 (negative feedback)' },`
  },
  'bode-plot': {
    fields: `    fields: [
      { name: 'k', label: 'System Gain (K)', type: 'number', min: 0, step: '1' },
      { name: 'tau', label: 'Time Constant (τ)', type: 'number', unit: 's', min: 0.01, step: '0.5' },
      { name: 'n', label: 'System Order (n)', type: 'number', min: 1, max: 4, step: '1' },
    ],`,
    compute: `    compute: (v) => {
      const wc = 1 / v.tau
      const gainDb = 20 * Math.log10(v.k) - v.n * 20 * Math.log10(Math.sqrt(1 + 0 ** 2))
      const magDbAtWc = 20 * Math.log10(v.k) - v.n * 20 * Math.log10(Math.sqrt(2))
      const phaseAtWc = -v.n * 45
      return { result: magDbAtWc, label: 'Gain at ω = 1/τ (corner)', unit: 'dB', steps: [
        { label: 'K (gain)', value: \`\${v.k}\` },
        { label: 'τ (time constant)', value: \`\${v.tau} s\` },
        { label: 'Corner frequency ω_c = 1/τ', value: \`\${wc.toFixed(3)} rad/s (\${(wc / (2 * Math.PI)).toFixed(3)} Hz)\` },
        { label: 'DC gain |G(0)|_dB', value: \`\${(20 * Math.log10(v.k)).toFixed(1)} dB\` },
        { label: 'Gain at ω_c', value: \`\${magDbAtWc.toFixed(1)} dB\` },
        { label: 'Phase at ω_c', value: \`\${phaseAtWc.toFixed(0)}°\` },
      ]}
    },`,
    description: "Bode plot magnitude: |G(jω)|_dB = 20·log₁₀(K) − n·20·log₁₀(√(1+(ωτ)²)). Phase: ∠G = −n·tan⁻¹(ωτ). Each pole adds −20 dB/decade slope and −90° phase shift at high frequencies.",
    example: `    example: { label: 'K=10, τ=0.5s, n=2 (2nd order)', value: 'Gain at ω_c=2rad/s = 16.9dB, phase=−90°' },`
  },
  'nyquist-plot': {
    fields: `    fields: [
      { name: 'k', label: 'System Gain (K)', type: 'number', min: 0, step: '1' },
      { name: 'z', label: 'Number of RHP Zeros (Z)', type: 'number', min: 0, max: 5, step: '1' },
      { name: 'p', label: 'Number of RHP Poles (P)', type: 'number', min: 0, max: 5, step: '1' },
      { name: 'encirclements', label: 'Nyquist Encirclements (N)', type: 'number', min: -5, max: 5, step: '1' },
    ],`,
    compute: `    compute: (v) => {
      const nCorrect = v.encirclements
      const closedLoopPoles = v.p + nCorrect
      const stable = closedLoopPoles === 0
      return { result: closedLoopPoles, label: 'Closed-Loop RHP Poles (Z)', unit: 'dimensionless', steps: [
        { label: 'P (open-loop RHP poles)', value: \`\${v.p}\` },
        { label: 'N (net encirclements of −1)', value: \`\${v.encirclements}\` },
        { label: 'Z = P + N (Nyquist criterion)', value: \`\${closedLoopPoles}\` },
        { label: 'Stability', value: stable ? 'STABLE (Z=0)' : 'UNSTABLE' },
      ]}
    },`,
    description: "Nyquist stability criterion: Z = P + N. System is stable if Z = 0 (no RHP closed-loop poles). P = open-loop RHP poles. N = net clockwise encirclements of −1 point. Counterclockwise = negative encirclements.",
    example: `    example: { label: 'P=0, encirclements=0', value: 'Z=0, STABLE (no RHP poles)' },`
  },
  'root-locus': {
    fields: `    fields: [
      { name: 'z1', label: 'Zero 1 (−z₁)', type: 'number', min: 0, step: '1' },
      { name: 'p1', label: 'Pole 1 (−p₁)', type: 'number', min: 0, step: '1' },
      { name: 'p2', label: 'Pole 2 (−p₂)', type: 'number', min: 0, step: '1' },
      { name: 'gain', label: 'Controller Gain (K)', type: 'number', min: 0, step: '1' },
    ],`,
    compute: `    compute: (v) => {
      const centroid = ((v.p1 + v.p2) - v.z1) / (2 - 1)
      const asymptoteAngle = 180 / (2 - 1)
      const realPart = centroid - v.gain * 0.01
      const imagPart = v.gain * 0.01 * Math.tan(asymptoteAngle * Math.PI / 180)
      return { result: centroid, label: 'Centroid of Asymptotes (σ_a)', unit: 'dimensionless', steps: [
        { label: 'Poles at s = −p₁ =', value: \`-\${v.p1}, −\${v.p2}\` },
        { label: 'Zero at s = −z₁ =', value: \`-\${v.z1}\` },
        { label: 'σ_a = (Σpoles−Σzeros)/(n−m)', value: \`\${centroid.toFixed(2)}\` },
        { label: 'Asymptote angles', value: \`\${asymptoteAngle}° (for K\u221e)\` },
        { label: 'Breakaway point (approx)', value: v.gain > 0 ? \`between −\${Math.min(v.p1, v.p2)} and −\${Math.max(v.p1, v.p2)}\` : '' },
      ]}
    },`,
    description: "Root locus plots closed-loop poles as gain K varies from 0→∞. Rules: branches start at open-loop poles (K=0), end at zeros (K→∞). Centroid σ_a = (Σpoles−Σzeros)/(n−m). Branches on real axis left of odd number of poles/zeros.",
    example: `    example: { label: 'z₁=1, p₁=2, p₂=4, K=5', value: 'σ_a = 2.50, asymptotes at ±90°' },`
  },
}

// Build the insertion block
let block = ''
for (const [slug, entry] of Object.entries(entries)) {
  block += `  '${slug}': {\n${entry.fields}\n${entry.compute}\n    description: '${entry.description.replace(/'/g, "\\'")}',\n${entry.example}\n  },\n`
}

// Find where to insert: before the closing } on its own line
const marker = '\n}\n\nconst newCalcTypes'
const idx = content.lastIndexOf(marker)
if (idx === -1) {
  console.error('Could not find insertion point')
  process.exit(1)
}

const before = content.slice(0, idx + 1) // include the \n before }
const after = content.slice(idx + 1)
const newContent = before + block + after

fs.writeFileSync(filePath, newContent, 'utf8')
console.log(`Inserted ${Object.keys(entries).length} entries`)
console.log(`File size: ${(newContent.length / 1024).toFixed(0)} KB`)
