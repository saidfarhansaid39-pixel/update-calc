import fs from 'fs';
import path from 'path';
const dir = 'src/components/hub-calculators/chemistry';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  const hasEnthalpy = /\b(enthalpy|DH|calorimetr|bond energy|bond enthalpy|hess|standard enthalpy)\b/i.test(content);
  const hasRedox = /\b(redox|oxidation|reduction|electrochem|cell potential|nernst|faraday|electrol)\b/i.test(content);
  const hasKinetics = /\b(rate\s*(law|constant)|integrated rate|activation energy|arrhenius|catalyst|first.?order|second.?order|zero.?order)\b/i.test(content);
  const hasSpectro = /\b(spectro|absorbance|chromatograph|retention factor|RF|wavelength)\b/i.test(content);
  const hasThermo = /\b(enthalpy|entropy|gibbs|thermochem|calorimetr)\b/i.test(content);
  const hasAcid = /\b(titration|buffer|pKa|pKb|amphoteric|salt hydrolys|weak acid|polyprotic|strong acid)\b/i.test(content);
  if (hasThermo || hasRedox || hasKinetics || hasSpectro || hasAcid || hasEnthalpy) {
    console.log(f);
  }
}
