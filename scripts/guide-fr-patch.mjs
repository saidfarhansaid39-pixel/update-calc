import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { guideSections, guideLabels, guideWhatIs, guideHowToUse, guideFormula, guideExample, guideFaq, guideUseCases, guideTips } from './guide-fr-translations.mjs';

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
