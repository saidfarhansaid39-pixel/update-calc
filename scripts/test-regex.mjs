import fs from 'fs'
const content = fs.readFileSync('src/lib/extra-field-pools/index.ts', 'utf8')
const regex = /\{ label:\s+'([^']+)',\s+value:\s+'([^']+)'\}/g
let count = 0
let m
// Use exec in a loop
while ((m = regex.exec(content)) !== null) {
  count++
  if (count <= 5) console.log('Found:', m[1], '=>', m[2])
}
console.log('Total matches:', count)
