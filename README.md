# Playwright Automation Challenges

Solutions to the TTA automation challenges, organised by level. Each challenge
is a **standalone npm project** derived from the
[`AdvancePlaywrightFramework1x`](https://github.com/SathishQASelenium/AdvancePlaywrightFramework1x)
core, including its custom TTA HTML reporter.

## Levels

| Level | Challenge | Target | Project |
| ----- | --------- | ------ | ------- |
| Level_01 | Automation Challenge 1 - Calculate the total amount of money spent | <https://demo.applitools.com> | [`challenge-01-total-amount-spent`](./Level_01/challenge-01-total-amount-spent) |
| Level_01 | Automation Challenge 2 - Web tables verification | <https://demoqa.com/webtables> | [`challenge-02-web-tables-verification`](./Level_01/challenge-02-web-tables-verification) |
| Level_01 | Automation Challenge 3 - Modal dialogs content | <https://demoqa.com/modal-dialogs> | [`challenge-03-modal-dialogs`](./Level_01/challenge-03-modal-dialogs) |
| Level_01 | Automation Challenge 4 - VWO login/dashboard + logout in parallel browsers | <https://app.wingify.com/#/login> | [`challenge-04-vwo-login-dashboard`](./Level_01/challenge-04-vwo-login-dashboard) |
| Level_02 | Project 1 - E-commerce checkout process automation | <https://www.automationexercise.com> | [`challenge-01-ecommerce-checkout`](./Level_02/challenge-01-ecommerce-checkout) |
| Level_02 | Project 2 - REST API automation with integration testing | <https://jsonplaceholder.typicode.com> | [`challenge-02-rest-api-integration`](./Level_02/challenge-02-rest-api-integration) |

## Running a challenge

Every challenge project has its own `package.json` and Playwright config:

```bash
cd Level_01/challenge-01-total-amount-spent
npm install
npx playwright install chromium
npm test
```

Each project writes its own reports:

- Custom TTA report: `tta-report/index.html`
- Playwright HTML report: `playwright-report/`
