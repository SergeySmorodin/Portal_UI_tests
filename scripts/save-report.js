const fs = require('fs');
const path = require('path');

const REPORT_SOURCE = path.resolve(__dirname, '..', 'playwright-report');
const REPORTS_DIR = path.resolve(__dirname, '..', 'reports');
const JSON_REPORT = path.resolve(__dirname, '..', 'test-results.json');

function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function getReportSummary() {
  if (!fs.existsSync(JSON_REPORT)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(JSON_REPORT, 'utf-8'));
    const stats = data.stats || {};
    const duration = data.stats?.duration ?? Object.values(stats).reduce((sum, s) => sum + (s.duration || 0), 0);
    let expected = 0, unexpected = 0, flaky = 0, skipped = 0;
    for (const suite of Object.values(stats)) {
      expected += suite.expected ?? 0;
      unexpected += suite.unexpected ?? 0;
      flaky += suite.flaky ?? 0;
      skipped += suite.skipped ?? 0;
    }
    return { expected, unexpected, flaky, skipped, duration };
  } catch {
    return null;
  }
}

function generateIndex(reportsDir) {
  const runs = fs.readdirSync(reportsDir)
    .filter(f => fs.statSync(path.join(reportsDir, f)).isDirectory())
    .sort()
    .reverse();

  const rows = runs.map((run, i) => {
    const summaryJson = path.join(reportsDir, run, 'test-results.json');
    let summary = null;
    if (fs.existsSync(summaryJson)) {
      try {
        const data = JSON.parse(fs.readFileSync(summaryJson, 'utf-8'));
        let expected = 0, unexpected = 0, flaky = 0, skipped = 0, duration = 0;
        for (const suite of Object.values(data.stats || {})) {
          expected += suite.expected ?? 0;
          unexpected += suite.unexpected ?? 0;
          flaky += suite.flaky ?? 0;
          skipped += suite.skipped ?? 0;
          duration += suite.duration ?? 0;
        }
        summary = { expected, unexpected, flaky, skipped, duration };
      } catch {}
    }

    const date = run.replace('_', ' ');
    if (!summary) {
      return `<tr><td>${i + 1}</td><td><a href="${run}/index.html">${date}</a></td><td colspan="5">—</td></tr>`;
    }
    const status = summary.unexpected === 0
      ? '<span style="color:#2ea043;font-weight:bold">PASS</span>'
      : '<span style="color:#f85149;font-weight:bold">FAIL</span>';
    const durationMin = Math.round(summary.duration / 60000);
    return `<tr>
      <td>${i + 1}</td>
      <td><a href="${run}/index.html">${date}</a></td>
      <td>${status}</td>
      <td>${summary.expected}</td>
      <td>${summary.unexpected}</td>
      <td>${summary.flaky}</td>
      <td>${summary.skipped}</td>
      <td>${durationMin} min</td>
    </tr>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Playwright Test Reports</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0d1117; color: #c9d1d9; padding: 2rem; }
    h1 { margin-bottom: 1.5rem; font-size: 1.5rem; }
    table { border-collapse: collapse; width: 100%; max-width: 1000px; }
    th, td { padding: 0.6rem 1rem; text-align: left; border-bottom: 1px solid #21262d; }
    th { background: #161b22; font-weight: 600; }
    tr:hover { background: #161b22; }
    a { color: #58a6ff; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Playwright Test Reports</h1>
  <table>
    <thead>
      <tr><th>#</th><th>Date</th><th>Status</th><th>Passed</th><th>Failed</th><th>Flaky</th><th>Skipped</th><th>Duration</th></tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>`;

  fs.writeFileSync(path.join(reportsDir, 'index.html'), html);
}

function main() {
  if (!fs.existsSync(REPORT_SOURCE)) {
    console.error('playwright-report/ not found. Run tests first.');
    process.exit(1);
  }

  const timestamp = getTimestamp();
  const dest = path.join(REPORTS_DIR, timestamp);

  console.log(`Saving report to reports/${timestamp}/`);
  copyDirSync(REPORT_SOURCE, dest);

  if (fs.existsSync(JSON_REPORT)) {
    fs.copyFileSync(JSON_REPORT, path.join(dest, 'test-results.json'));
  }

  generateIndex(REPORTS_DIR);
  console.log('Index page updated.');
}

main();
