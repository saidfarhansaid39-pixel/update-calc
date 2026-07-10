const res = await fetch('http://localhost:3000/api/health');
if (!res.ok) { console.error('Healthcheck failed:', res.status); process.exit(1); }
const data = await res.json();
if (data.status !== 'ok') { console.error('Healthcheck bad:', data); process.exit(1); }
console.log('Healthcheck passed');
process.exit(0);
