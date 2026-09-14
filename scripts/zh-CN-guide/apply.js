const fs = require('fs');
const path = require('path');
const base = path.resolve(__dirname, '../../src/i18n/messages');
const zhCN = JSON.parse(fs.readFileSync(path.join(base, 'zh-CN.json'), 'utf8'));

// Load translation modules
const t1 = require('./t1.js');
const t2 = require('./t2.js');
const t3 = require('./t3.js');
const t4 = require('./t4.js');
const t5a = require('./t5a.js');
const t5b = require('./t5b.js');
const t5 = { ...t5a, ...t5b };
const t6 = require('./t6.js');
const t7 = require('./t7.js');

// Apply sections and labels
Object.assign(zhCN.guide.sections, t1.sections);
Object.assign(zhCN.guide.labels, t1.labels);

// Apply body sections
Object.assign(zhCN.guide.body.whatIs, t2);
Object.assign(zhCN.guide.body.howToUse, t3);
Object.assign(zhCN.guide.body.formula, t4.formula);
Object.assign(zhCN.guide.body.example, t4.example);

// Apply faq
Object.assign(zhCN.guide.body.faq, t5);
// Apply useCases
Object.assign(zhCN.guide.body.useCases, t6);
// Apply tips
Object.assign(zhCN.guide.body.tips, t7);

fs.writeFileSync(path.join(base, 'zh-CN.json'), JSON.stringify(zhCN, null, 2), 'utf8');
console.log('Done! zh-CN.json guide namespace updated.');
