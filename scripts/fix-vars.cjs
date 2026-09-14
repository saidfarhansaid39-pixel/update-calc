const fs = require('fs');
const path = require('path');
const base = 'C:/Users/store one/Pictures/calculatora/MpB2M28jkJJIYqVynKKb/Fichiers multiples/src/i18n/messages';
const locales = ['es','fr','de','pt','ru','ar','hi','ja','zh-CN'];
const en = JSON.parse(fs.readFileSync(path.join(base,'en.json'),'utf8'));

function getVars(s){ return (s.match(/\{(\w+)\}/g) || []); }
function sameSet(a,b){ if(a.length!==b.length) return false; const s=new Set(b); return a.every(x=>s.has(x)); }

const changes = [];
const issues = [];

function fix(enNode, locNode, parent, key, p) {
  if (typeof enNode === 'string') {
    if (typeof locNode !== 'string') return;
    if (enNode === locNode) return;
    if (enNode.indexOf('{') < 0) return;
    const enVars = getVars(enNode);
    const locVars = getVars(locNode);
    if (enVars.length === 0) return;
    if (sameSet(enVars, locVars)) return;
    // attempt positional fix only if counts match
    if (enVars.length !== locVars.length) {
      issues.push(`${p} | EN ${JSON.stringify(enVars)} vs LOC ${JSON.stringify(locVars)}`);
      return;
    }
    let fixed = locNode;
    for (let i = 0; i < locVars.length; i++) {
      fixed = fixed.split(locVars[i]).join(enVars[i]);
    }
    changes.push(`${p} | ${JSON.stringify(locVars)} -> ${JSON.stringify(enVars)}`);
    parent[key] = fixed;
  } else if (enNode && typeof enNode === 'object') {
    if (!locNode || typeof locNode !== 'object') return;
    for (const k of Object.keys(enNode)) {
      fix(enNode[k], locNode[k], locNode, k, p ? p + '.' + k : k);
    }
  }
}

const write = process.argv.includes('--write');
for (const loc of locales) {
  const data = JSON.parse(fs.readFileSync(path.join(base, loc + '.json'),'utf8'));
  fix(en.guide, data.guide, data, 'guide', 'guide');
  if (write) fs.writeFileSync(path.join(base, loc + '.json'), JSON.stringify(data, null, 2) + '\n');
}

console.log('CHANGES:', changes.length);
for (const c of changes) console.log('  ' + c);
console.log('ISSUES (count mismatch, not auto-fixed):', issues.length);
for (const i of issues) console.log('  ' + i);
