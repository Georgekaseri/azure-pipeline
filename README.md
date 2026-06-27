# Playwright + TypeScript + Cucumber (Bahmni Login)

This project provides a simple BDD automation framework for the Bahmni Standard demo login page.

## What is included

- Playwright browser automation
- Cucumber BDD with Gherkin
- TypeScript setup
- Page Object Model for login page
- Two scenarios:
  - Verify login page and Standard demo environment
  - Perform login using configured credentials

## Setup

```bash
npm install
cp .env.example .env
```

Fill your `.env`:

```env
BASE_URL=https://demo.standard.mybahmni.in/bahmni/home/index.html#/login
QA_URL=https://your-qa-url.example.com/path#/login
SIT_URL=https://your-sit-url.example.com/path#/login
BASE_DOMAIN=demo.standard.mybahmni.in
QA_DOMAIN=your-qa-domain.example.com
SIT_DOMAIN=your-sit-domain.example.com
BAHMNI_USERNAME=your_username
BAHMNI_PASSWORD=your_password
```

Smoke scenario is fully parameterized and runs for BASE, QA, and SIT from the feature Examples table.

## Run tests

```bash
npm run test:e2e
```

This runs only the `@smoke` scenario (login page + Standard environment check).

Headed mode:

```bash
npm run test:e2e:headed
```

Run all scenarios (smoke + auth):

```bash
npm run test:e2e:all
```

Run all scenarios in headed mode:

```bash
PW_HEADLESS=false BAHMNI_USERNAME=superman BAHMNI_PASSWORD=Admin123 npm run test:e2e:all:headed
```

Run credential-based login scenario:

```bash
npm run test:e2e:auth
```

Cucumber JSON report will be generated at `tests/reports/cucumber-report.json`.

## Generate HTML report

After running tests, generate an HTML report:

```bash
npm run report:generate
```

Open the report in browser:

```bash
npm run report:open
```

Run all scenarios and build report in one command:

```bash
npm run test:e2e:report
```

HTML report path: `tests/reports/html/index.html`

## Azure Pipelines

This repo has two separate pipeline YAML files:

```text
azure-pipelines.yml
azure-pipelines-regression.yml
```

Create two Azure DevOps pipelines and point one to each file so smoke and regression run independently.
