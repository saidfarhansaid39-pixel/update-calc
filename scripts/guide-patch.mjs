import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { guideSections, guideLabels, guideFormula, guideExample } from './guide-patch-parts.mjs';
import { guideWhatIs } from './guide-patch-whatis.mjs';
import { guideHowToUse } from './guide-patch-howto.mjs';
import { guideFaq } from './guide-patch-faq.mjs';
import { guideUseCases } from './guide-patch-usecases.mjs';
import { guideTips } from './guide-patch-tips.mjs';

const dir = resolve(import.meta.dirname, '../src/i18n/messages');
const frPath = resolve(dir, 'fr.json');
const fr = JSON.parse(readFileSync(frPath, 'utf8'));

fr.guide.sections = guideSections;
fr.guide.labels = guideLabels;
fr.guide.body.whatIs = guideWhatIs;
fr.guide.body.howToUse = guideHowToUse;
fr.guide.body.formula = guideFormula;
fr.guide.body.example = guideExample;
fr.guide.body.faq = guideFaq;
fr.guide.body.useCases = guideUseCases;
fr.guide.body.tips = guideTips;

writeFileSync(frPath, JSON.stringify(fr, null, 2) + '\n', 'utf8');
console.log('fr.json guide section translated successfully!');

// Verify no obvious English remains
const content = readFileSync(frPath, 'utf8');
const englishPatterns = [
  /The \{title\} is a/g,
  /Using the \{title\} is/g,
  /Frequently asked questions/g,
  /What is the \{title\}/g,
  /How do I /g,
  /Always consider/g,
  /Double-check/g,
  "Step-by-Step Calculation",
  "Final Result",
  "Input Values",
  "Scenario"
];
let issues = 0;
for (const p of englishPatterns) {
  const matches = content.match(p);
  if (matches) {
    console.log(`WARNING: Found ${matches.length}x "${p}" still in English`);
    issues += matches.length;
  }
}
if (issues === 0) {
  console.log('VERIFICATION PASSED: No obvious English patterns found in guide section.');
} else {
  console.log(`VERIFICATION: ${issues} potential English strings remaining.`);
}
