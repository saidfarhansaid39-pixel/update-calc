const f = require('fs');
const c = f.readFileSync('C:\\Users\\store one\\Pictures\\calculatora\\MpB2M28jkJJIYqVynKKb\\Fichiers multiples\\scripts\\translate-descriptions-serial-2.mjs','utf-8');
const hasAr = c.includes("ar:'\u0645\u062C\u0627\u0646\u064A'");
const hasKey = c.includes('UBghlDSlJGYA63LAAd0O6hqZnNCpkTohU0iAtVF0EUc');
console.log('Arabic prefix ok:', hasAr);
console.log('Key2 set:', hasKey);
