const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const REPORT_SOURCE = path.join(ROOT, 'playwright-report');
const JSON_REPORT = path.join(ROOT, 'test-results.json');
const BRANCH = 'reports';

function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirSync(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function parseStats(data) {
  const s = data?.stats;
  if (!s) return null;
  return {
    expected: s.expected ?? 0, unexpected: s.unexpected ?? 0,
    flaky: s.flaky ?? 0, skipped: s.skipped ?? 0, duration: s.duration ?? 0,
  };
}

function generateIndex(reportsDir) {
  const runs = fs.readdirSync(reportsDir)
    .filter(f => fs.statSync(path.join(reportsDir, f)).isDirectory())
    .sort().reverse();

  const rows = runs.map((run, i) => {
    const jsonPath = path.join(reportsDir, run, 'test-results.json');
    let summary = null;
    if (fs.existsSync(jsonPath)) {
      try { summary = parseStats(JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))); } catch {}
    }
    const date = run.replace('_', ' ');
    if (!summary) {
      return `<tr><td>${i + 1}</td><td><a href="${run}/index.html">${date}</a></td><td colspan="5">—</td></tr>`;
    }
    const status = summary.unexpected === 0
      ? '<span style="color:#2ea043;font-weight:bold">PASS</span>'
      : '<span style="color:#f85149;font-weight:bold">FAIL</span>';
    const d = summary.duration;
    const dur = d >= 60000 ? `${Math.round(d / 60000)} min` : `${Math.round(d / 1000)} sec`;
    return `<tr><td>${i + 1}</td><td><a href="${run}/index.html">${date}</a></td><td>${status}</td><td>${summary.expected}</td><td>${summary.unexpected}</td><td>${summary.flaky}</td><td>${summary.skipped}</td><td>${dur}</td></tr>`;
  }).join('\n');

  fs.writeFileSync(path.join(reportsDir, 'index.html'), `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Playwright Test Reports</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0d1117;color:#c9d1d9;padding:2rem}
    h1{margin-bottom:1.5rem;font-size:1.5rem}
    table{border-collapse:collapse;width:100%;max-width:1000px}
    th,td{padding:.6rem 1rem;text-align:left;border-bottom:1px solid #21262d}
    th{background:#161b22;font-weight:600}
    tr:hover{background:#161b22}
    a{color:#58a6ff;text-decoration:none}
    a:hover{text-decoration:underline}
  </style>
</head>
<body>
  <h1>Playwright Test Reports</h1>
  <table>
    <thead><tr><th>#</th><th>Date</th><th>Status</th><th>Passed</th><th>Failed</th><th>Flaky</th><th>Skipped</th><th>Duration</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`);
}

function git(args, cwd) {
  return execSync(`git ${args}`, { cwd: cwd || ROOT, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

function main() {
  if (!fs.existsSync(REPORT_SOURCE)) {
    console.error('playwright-report/ not found. Run tests first.');
    process.exit(1);
  }

  const timestamp = getTimestamp();
  const remoteUrl = git('remote get-url origin');

  const tmpGit = path.join(ROOT, '.tmp-reports-repo');
  try { fs.rmSync(tmpGit, { recursive: true, force: true }); } catch {}

  const hasBranch = git('ls-remote --heads origin reports').length > 0;

  if (hasBranch) {
    console.log('Step 1: Cloning reports branch...');
    git(`clone --branch ${BRANCH} --single-branch "${remoteUrl}" "${tmpGit}"`);
  } else {
    console.log('Step 1: Creating reports branch...');
    git(`init "${tmpGit}"`);
    git('config user.email "report-bot@local"', tmpGit);
    git('config user.name "Report Bot"', tmpGit);
    git(`remote add origin "${remoteUrl}"`, tmpGit);
    git(`checkout --orphan ${BRANCH}`, tmpGit);
    git('rm -rf . 2>NUL', tmpGit);
    fs.writeFileSync(path.join(tmpGit, '.gitkeep'), '');
    git('add .', tmpGit);
    git('commit -m "init reports"', tmpGit);
    git(`push origin ${BRANCH}`, tmpGit);
  }

  const workflowDir = path.join(tmpGit, '.github', 'workflows');
  fs.mkdirSync(workflowDir, { recursive: true });
  fs.writeFileSync(path.join(workflowDir, 'deploy.yml'), `name: Deploy Playwright Report

on:
  push:
    branches: [reports]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: reports

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: reports

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`);

  console.log(`Step 2: Saving report ${timestamp}...`);
  fs.mkdirSync(path.join(tmpGit, 'reports'), { recursive: true });
  const destDir = path.join(tmpGit, 'reports', timestamp);
  fs.rmSync(destDir, { recursive: true, force: true });
  copyDirSync(REPORT_SOURCE, destDir);
  if (fs.existsSync(JSON_REPORT)) fs.copyFileSync(JSON_REPORT, path.join(destDir, 'test-results.json'));

  generateIndex(path.join(tmpGit, 'reports'));

  console.log('Step 3: Pushing...');
  git('config user.email "report-bot@local"', tmpGit);
  git('config user.name "Report Bot"', tmpGit);
  git('add .', tmpGit);
  const status = git('status --porcelain', tmpGit);
  if (!status) {
    console.log('No changes to commit.');
  } else {
    git(`commit -m "report: ${timestamp}"`, tmpGit);
    git(`push origin ${BRANCH}`, tmpGit);
    console.log(`Done! Report pushed to '${BRANCH}' branch.`);
  }

  try { fs.rmSync(tmpGit, { recursive: true, force: true }); } catch {}
}

main();
