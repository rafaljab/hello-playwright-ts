# Hello Playwright (Typescript)
This is an example implementation of automated tests using Playwright with Typescript.

You can also check how this can be done using Playwright with Python (Pytest) here: [helloPlaywrightPy](https://github.com/rafaljab/helloPlaywrightPy).

## Features
* Page Object Model
* Pytest fixtures
* Parametrized tests
* Tagged tests
* CI Pipeline (GitHub Actions)
* Reports (Playwright native)

## Application under tests
We'll be testing a web application written in React from this repository: [GUI Automation Playground](https://github.com/rafaljab/gui-automation-playground) (v1.1.0).

Install and run the application according to the instructions on the above page.

## Dependencies
* [Node.js](https://nodejs.org/) (I use version 18.12.1)

## Set up
Clone the repository and install other dependencies:
```bash
git clone https://github.com/rafaljab/hello-playwright-ts.git
cd hello-playwright-ts
npm install
```
If you want more freedom, you can fork the repository first instead of cloning it directly.

Install Playwright Browsers (if needed):
```bash
npx playwright install
```

Create an `.env` file in the root directory (`hello-playwright-ts`).
This file is ignored by Git and should contain a variable for the domain:
```
BASE_URL=https://rafaljab.github.io
```

You're all set!

## Running tests

Just run the following command:
```bash
npx playwright test
```

The tests will run without launching the browser.
If you want to see the progress of the tests, use the `headed`.

```bash
npx playwright test --headed
```

Showing tests report (after test execution):
```bash
npx playwright show-report
```

Running tests for a given tag:
```bash
npx playwright test --grep "@e2e"
```

You can also exclude tests with a given tag:
```bash
npx playwright test --grep-invert "@e2e"
```

You can freely combine different commands.
Playwright CLI is very flexible and allows you to specify which tests to run in different ways.
More details in the documentation - [Command line](https://playwright.dev/docs/test-cli).
