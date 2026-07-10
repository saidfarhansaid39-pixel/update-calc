// Runs the accessibility audit after a production build.
// Exits non-zero when critical accessibility issues are found so it can
// gate CI / deploy pipelines.
import { execSync } from 'child_process';
import { runA11yChecks } from './check-a11y.mjs';

try {
  const report = runA11yChecks();
  if (report.summary.critical > 0) {
    console.error(
      `❌ Accessibility audit failed: ${report.summary.critical} critical issue(s) found.`
    );
    process.exit(1);
  }
  if (report.summary.warnings > 0) {
    console.warn(
      `⚠️  Accessibility audit passed with ${report.summary.warnings} warning(s).`
    );
  }
  console.log('✅ Accessibility audit passed.');
} catch (err) {
  console.error('Accessibility audit could not run:', err.message);
  console.error('Make sure to run `npm run build` first so .next/server/app HTML exists.');
  process.exit(1);
}
