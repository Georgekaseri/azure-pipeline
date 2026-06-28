const fs = require("fs");
const path = require("path");

const jsonReportPath = path.resolve(
  __dirname,
  "../tests/reports/cucumber-report.json"
);
const htmlReportDir = path.resolve(__dirname, "../tests/reports/html");
const suiteName = process.env.REPORT_SUITE_NAME || "Automation Suite";
const suiteTag = process.env.REPORT_TAG || "all";
const executedAt = new Date().toISOString();
const ciPlatform = process.env.CI_PLATFORM || "Local";
const branchName =
  process.env.BUILD_SOURCEBRANCHNAME || process.env.GITHUB_REF_NAME || "local";
const buildId = process.env.BUILD_BUILDID || process.env.GITHUB_RUN_ID || "local";

if (!fs.existsSync(jsonReportPath)) {
  console.error(
    `Cucumber JSON report not found at ${jsonReportPath}. Run tests first (e.g. npm run test:e2e:all).`
  );
  process.exit(1);
}

const reportJson = JSON.parse(fs.readFileSync(jsonReportPath, "utf8"));
const features = Array.isArray(reportJson) ? reportJson : [];

function getScenarioStatus(scenario) {
  const steps = Array.isArray(scenario.steps) ? scenario.steps : [];
  if (!steps.length) {
    return "unknown";
  }
  if (steps.some((step) => step.result && step.result.status === "failed")) {
    return "failed";
  }
  if (steps.every((step) => step.result && step.result.status === "passed")) {
    return "passed";
  }
  return "other";
}

const featureSummaries = features.map((feature) => {
  const scenarios = Array.isArray(feature.elements) ? feature.elements : [];
  const scenarioSummaries = scenarios.map((scenario) => {
    const status = getScenarioStatus(scenario);
    const stepCount = Array.isArray(scenario.steps) ? scenario.steps.length : 0;
    const failedSteps = (scenario.steps || []).filter(
      (step) => step.result && step.result.status === "failed"
    );
    return {
      name: scenario.name || "Unnamed scenario",
      status,
      stepCount,
      failedReason:
        failedSteps.length && failedSteps[0].result
          ? failedSteps[0].result.error_message || "Step failed"
          : ""
    };
  });

  const passed = scenarioSummaries.filter((s) => s.status === "passed").length;
  const failed = scenarioSummaries.filter((s) => s.status === "failed").length;

  return {
    name: feature.name || "Unnamed feature",
    description: feature.description || "",
    scenarios: scenarioSummaries,
    passed,
    failed
  };
});

const totalFeatures = featureSummaries.length;
const totalScenarios = featureSummaries.reduce(
  (sum, feature) => sum + feature.scenarios.length,
  0
);
const passedScenarios = featureSummaries.reduce(
  (sum, feature) => sum + feature.passed,
  0
);
const failedScenarios = featureSummaries.reduce(
  (sum, feature) => sum + feature.failed,
  0
);
const passRate = totalScenarios
  ? Math.round((passedScenarios / totalScenarios) * 100)
  : 0;

const scenarioCards = featureSummaries
  .map((feature) => {
    const rows = feature.scenarios
      .map((scenario) => {
        const statusClass = `status-${scenario.status}`;
        const reason = scenario.failedReason
          ? `<div class=\"reason\">${scenario.failedReason}</div>`
          : "";
        return `
          <tr>
            <td>${scenario.name}</td>
            <td><span class=\"status-chip ${statusClass}\">${scenario.status.toUpperCase()}</span></td>
            <td>${scenario.stepCount}</td>
            <td>${reason}</td>
          </tr>
        `;
      })
      .join("");

    return `
      <section class=\"feature-card\">
        <div class=\"feature-header\">
          <div>
            <h3>${feature.name}</h3>
            <p>${feature.description || "No description provided."}</p>
          </div>
          <div class=\"feature-metrics\">
            <span class=\"metric pass\">Passed ${feature.passed}</span>
            <span class=\"metric fail\">Failed ${feature.failed}</span>
          </div>
        </div>
        <div class=\"table-wrap\">
          <table>
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Status</th>
                <th>Steps</th>
                <th>Failure Reason</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </section>
    `;
  })
  .join("");

const html = `<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <title>${suiteName} Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

    :root {
      --bg: #f4f6fb;
      --ink: #1f2430;
      --card: #ffffff;
      --accent: #0f9d8a;
      --accent-2: #1f5eff;
      --pass: #0e9f6e;
      --fail: #d7263d;
      --muted: #6a7280;
      --border: #e3e8f2;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: 'Space Grotesk', sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at 15% 10%, rgba(31,94,255,0.1), transparent 30%),
        radial-gradient(circle at 90% 0%, rgba(15,157,138,0.13), transparent 25%),
        var(--bg);
    }

    .container {
      width: min(1200px, 92vw);
      margin: 24px auto 40px;
    }

    .hero {
      background: linear-gradient(140deg, #0f172a 0%, #1e293b 50%, #334155 100%);
      color: #f8fafc;
      border-radius: 18px;
      padding: 24px;
      box-shadow: 0 18px 40px rgba(2, 8, 20, 0.25);
    }

    h1 {
      margin: 0;
      font-size: clamp(1.4rem, 2.8vw, 2.1rem);
      letter-spacing: 0.2px;
    }

    .sub {
      margin-top: 8px;
      color: #cbd5e1;
      font-size: 0.95rem;
    }

    .meta {
      margin-top: 14px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.8rem;
    }

    .meta span {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.16);
      padding: 6px 10px;
      border-radius: 999px;
    }

    .kpi-grid {
      margin-top: 18px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 12px;
    }

    .kpi {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 14px;
      box-shadow: 0 8px 18px rgba(31, 36, 48, 0.05);
    }

    .kpi .label {
      color: var(--muted);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .kpi .value {
      margin-top: 6px;
      font-size: 1.6rem;
      font-weight: 700;
    }

    .progress-wrap {
      margin-top: 10px;
      background: #e7edf9;
      border-radius: 999px;
      height: 12px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      width: ${passRate}%;
      transition: width 0.5s ease;
    }

    .section-title {
      margin: 26px 2px 10px;
      font-size: 1.2rem;
      font-weight: 700;
    }

    .feature-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 14px;
      margin-bottom: 12px;
      box-shadow: 0 10px 20px rgba(31, 36, 48, 0.05);
    }

    .feature-header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      align-items: center;
    }

    .feature-header h3 {
      margin: 0;
      font-size: 1.05rem;
    }

    .feature-header p {
      margin: 6px 0 0;
      color: var(--muted);
      font-size: 0.92rem;
    }

    .feature-metrics {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .metric {
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
      border: 1px solid;
    }

    .metric.pass { color: var(--pass); border-color: rgba(14, 159, 110, 0.35); background: rgba(14, 159, 110, 0.08); }
    .metric.fail { color: var(--fail); border-color: rgba(215, 38, 61, 0.35); background: rgba(215, 38, 61, 0.08); }

    .table-wrap {
      margin-top: 12px;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 720px;
    }

    th, td {
      text-align: left;
      padding: 10px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
      font-size: 0.9rem;
    }

    th {
      color: #3f4a5a;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .status-chip {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.04em;
    }

    .status-passed { color: var(--pass); background: rgba(14, 159, 110, 0.12); }
    .status-failed { color: var(--fail); background: rgba(215, 38, 61, 0.12); }
    .status-other, .status-unknown { color: #8854d0; background: rgba(136, 84, 208, 0.12); }

    .reason {
      color: #7c2d12;
      background: #fff4ed;
      border: 1px solid #fed7aa;
      padding: 8px;
      border-radius: 8px;
      white-space: pre-wrap;
      line-height: 1.35;
      max-width: 520px;
    }

    @media (max-width: 760px) {
      .container {
        width: 94vw;
      }
      .hero {
        padding: 18px;
      }
    }
  </style>
</head>
<body>
  <main class=\"container\">
    <section class=\"hero\">
      <h1>${suiteName} Test Report</h1>
      <div class=\"sub\">Playwright + Cucumber execution summary for tag ${suiteTag}</div>
      <div class=\"meta\">
        <span>Project: Azure-pipeline</span>
        <span>Branch: ${branchName}</span>
        <span>Build: ${buildId}</span>
        <span>Platform: ${ciPlatform}</span>
        <span>Executed: ${executedAt}</span>
      </div>
    </section>

    <section class=\"kpi-grid\">
      <article class=\"kpi\">
        <div class=\"label\">Pass Rate</div>
        <div class=\"value\">${passRate}%</div>
        <div class=\"progress-wrap\"><div class=\"progress-bar\"></div></div>
      </article>
      <article class=\"kpi\">
        <div class=\"label\">Features</div>
        <div class=\"value\">${totalFeatures}</div>
      </article>
      <article class=\"kpi\">
        <div class=\"label\">Scenarios</div>
        <div class=\"value\">${totalScenarios}</div>
      </article>
      <article class=\"kpi\">
        <div class=\"label\">Passed</div>
        <div class=\"value\" style=\"color: var(--pass);\">${passedScenarios}</div>
      </article>
      <article class=\"kpi\">
        <div class=\"label\">Failed</div>
        <div class=\"value\" style=\"color: var(--fail);\">${failedScenarios}</div>
      </article>
    </section>

    <h2 class=\"section-title\">Feature Breakdown</h2>
    ${scenarioCards || '<p>No features found in report JSON.</p>'}
  </main>
</body>
</html>`;

fs.mkdirSync(htmlReportDir, { recursive: true });
fs.writeFileSync(path.join(htmlReportDir, "index.html"), html, "utf8");

console.log(`HTML report generated at ${htmlReportDir}/index.html`);
