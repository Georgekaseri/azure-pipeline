const fs = require("fs");
const path = require("path");
const reporter = require("multiple-cucumber-html-reporter");

const jsonReportPath = path.resolve(
  __dirname,
  "../tests/reports/cucumber-report.json"
);
const htmlReportDir = path.resolve(__dirname, "../tests/reports/html");
const suiteName = process.env.REPORT_SUITE_NAME || "Automation Suite";
const suiteTag = process.env.REPORT_TAG || "all";
const reportTheme = process.env.REPORT_THEME || "hierarchy";
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

reporter.generate({
  theme: reportTheme,
  jsonDir: path.dirname(jsonReportPath),
  reportPath: htmlReportDir,
  reportName: `${suiteName} - Playwright + Cucumber`,
  pageTitle: `${suiteName} Report`,
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
    title: "Execution Info",
    data: [
      { label: "Project", value: "Azure-pipeline" },
      { label: "Suite", value: suiteName },
      { label: "Tag", value: suiteTag },
      { label: "Branch", value: branchName },
      { label: "Build", value: buildId },
      { label: "Platform", value: ciPlatform },
      { label: "Executed", value: executedAt }
    ]
  }
});

console.log(`HTML report generated at ${htmlReportDir}/index.html`);
