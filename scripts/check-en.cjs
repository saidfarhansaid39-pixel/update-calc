const path = require('path');
const d=require(path.join(__dirname,'..','src','i18n','messages','ru.json'));
function findEnglish(obj, path) {
  path = path || '';
  const results=[];
  for(const [k,v] of Object.entries(obj)) {
    const p=path?path+'.'+k:k;
    if(typeof v==='object' && v!==null) {
      results.push(...findEnglish(v,p));
    } else if(typeof v==='string') {
      const stripped=v.replace(/\{[^}]+\}/g,'').replace(/[A-Z][A-Z0-9_]+/g,'');
      const cyrillic=(stripped.match(/[\u0400-\u04FF]/g)||[]).length;
      const latin=(stripped.match(/[a-zA-Z]/g)||[]).length;
      if(latin>10 && cyrillic<latin*0.3) results.push(p+': '+v.slice(0,150));
    }
  }
  return results;
}
const eng=findEnglish(d.guide,'');
console.log('Genuinely untranslated:', eng.length);
eng.forEach(e=>console.log(e));
