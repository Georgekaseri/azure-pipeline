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
      "json:tests/reports/cucumber-report.json"
    ]
  }
};
