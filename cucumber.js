const junitReportFile = process.env.JUNIT_REPORT_FILE || "tests/reports/cucumber-junit.xml";

module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: [
      "support/**/*.ts",
      "features/step-definitions/**/*.ts"
    ],
    format: [
      "progress",
      "summary",
      "json:tests/reports/cucumber-report.json",
      `junit:${junitReportFile}`
    ]
  }
};
