const fs = require("fs");
const path = require("path");
const reporter = require("multiple-cucumber-html-reporter");

const jsonReportPath = path.resolve(
  __dirname,
  "../tests/reports/cucumber-report.json"
);
const htmlReportDir = path.resolve(__dirname, "../tests/reports/html");

if (!fs.existsSync(jsonReportPath)) {
  console.error(
    `Cucumber JSON report not found at ${jsonReportPath}. Run tests first (e.g. npm run test:e2e:all).`
  );
  process.exit(1);
}

reporter.generate({
  jsonDir: path.dirname(jsonReportPath),
  reportPath: htmlReportDir,
  reportName: "Playwright + Cucumber Report",
  pageTitle: "E2E Test Report",
  displayDuration: true,
  metadata: {
    browser: {
      name: "chromium",
      version: "auto"
    },
    device: "Local machine",
    platform: {
      name: process.platform,
      version: process.version
    }
  },
  customData: {
    title: "Execution info",
    data: [
      { label: "Project", value: "Azure-pipeline" },
      { label: "Executed", value: new Date().toISOString() }
    ]
  }
});

console.log(`HTML report generated at ${htmlReportDir}/index.html`);
