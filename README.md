# Automation Exercise – Test Suite

Automated test suite for [automationexercise.com](https://automationexercise.com), covering end-to-end UI workflows and REST API assertions. Built with Playwright and TypeScript, following the Page Object Model (POM) pattern for UI tests and a Controller pattern for API tests.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture](#architecture)
3. [Folder Structure](#folder-structure)
4. [POM Structure](#pom-structure)
5. [API Controllers](#api-controllers)
6. [Data Layer](#data-layer)
7. [Test Suites](#test-suites)
8. [Fixtures & Setup](#fixtures--setup)
9. [Prerequisites & Installation](#prerequisites--installation)
10. [Running Tests](#running-tests)
11. [CI/CD](#cicd)
12. [Configuration](#configuration)
13. [Known Issues](#known-issues)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | LTS | Runtime environment |
| TypeScript | via `tsconfig.json` | Static typing |
| [Playwright Test](https://playwright.dev/) | `^1.61.1` | Test framework, browser automation, and API testing |
| [@faker-js/faker](https://fakerjs.dev/) | `^10.5.0` | Dynamic test data generation |

---

## Architecture

The project is organized around three core patterns:

### Page Object Model (POM) — UI Tests
UI interactions are encapsulated in page classes under `src/pages/`. Each page class exposes typed locators and action methods. A shared base class (`CommonsPage`) holds common navigation elements inherited by all pages. Page objects are injected into tests as Playwright fixtures.

### Controller Pattern — API Tests
API interactions are encapsulated in controller classes under `src/api/controllers/`. Each controller wraps a specific endpoint and exposes typed async methods that return raw `APIResponse` objects, allowing tests to assert on both status and body.

### Data Layer
Test data flows through three layers:
```
UserModel (interface)  →  UserFactory (builder)  →  Test
```
- **Model** defines the data shape.
- **Factory** uses Faker.js to produce randomized, valid instances via a chainable builder API.
- **Tests** consume the built object directly or override specific fields with `.withEmail()`.

### Fixture Composition
Both `tests/e2e/setup.ts` and `tests/api/setup.ts` extend Playwright's base `test` object with custom fixtures (`loginPage`, `signupPage`, `csrfToken`), keeping test files clean and focused on assertions.

---

## Folder Structure

```
tests/                              # Project root
├── src/                            # Supporting source code (non-test)
│   ├── api/
│   │   └── controllers/            # API endpoint wrappers
│   │       ├── create-user.controller.ts
│   │       ├── get-user.controller.ts
│   │       └── update-user.controller.ts
│   ├── data/
│   │   ├── factories/              # Test data builders
│   │   │   └── user.factory.ts
│   │   └── models/                 # Data interfaces and enums
│   │       ├── user.model.ts
│   │       └── countries.enum.ts
│   ├── pages/                      # Page Object Model classes
│   │   ├── commons.page.ts         # Base class with shared locators
│   │   ├── login.page.ts
│   │   └── signup.page.ts
│   └── utils/
│       └── index.ts                # createPageObjectFixture helper
├── tests/                          # Test specs
│   ├── api/
│   │   ├── setup.ts                # API fixture: csrfToken
│   │   ├── create-user.spec.ts
│   │   ├── get-user.spec.ts
│   │   └── update-user.spec.ts
│   └── e2e/
│       ├── setup.ts                # E2E fixtures: loginPage, signupPage
│       ├── login.spec.ts
│       └── signup.spec.ts
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI pipeline
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json
└── bug-signup-account-creation-timeout.md
```

---

## POM Structure

### Class Hierarchy

```
CommonsPage (abstract)
├── LoginPage
└── SignupPage
```

### CommonsPage — `src/pages/commons.page.ts`

Base class injected with Playwright's `Page`. Defines locators and actions that are available on every page of the application.

| Member | Type | Description |
|---|---|---|
| `continueButton` | `Locator` | "Continue" link |
| `signupLoginLink` | `Locator` | "Signup / Login" nav link |
| `logoutButton` | `Locator` (getter) | "Logout" nav link |
| `deleteAccountButton` | `Locator` (getter) | "Delete Account" nav link |
| `clickContinueButton()` | `async` | Clicks Continue |
| `clickSignupLoginLink()` | `async` | Clicks Signup / Login |

### LoginPage — `src/pages/login.page.ts`

Extends `CommonsPage`. Covers the `/login` route, which hosts both the login form and the new-user signup form.

| Member | Type | Description |
|---|---|---|
| `goto()` | `async` | Navigates to `/login` |
| `waitForLoginHeaderVisible()` | `async` | Waits for "Login to your account" heading |
| `waitForNewUserSignupHeaderVisible()` | `async` | Waits for "New User Signup!" heading |
| `fillName(name)` | `async` | Fills Name input (signup section) |
| `fillEmail(email, type)` | `async` | Fills Email; `type: "signup"` uses `nth(1)`, `type: "login"` uses `first()` |
| `fillPassword(password)` | `async` | Fills Password input |
| `clickSignup()` | `async` | Clicks Signup button |
| `clickLogin()` | `async` | Clicks Login button |
| `login(email, password)` | `async` | Composite: fill email + password + click Login |
| `errorMessage` | `Locator` (getter) | "Your email or password is incorrect!" text |
| `existingEmailError` | `Locator` (getter) | "Email Address already exist!" text |

### SignupPage — `src/pages/signup.page.ts`

Extends `CommonsPage`. Covers the `/signup` route (account information form).

| Member | Type | Description |
|---|---|---|
| `waitForAccountInformationHeader()` | `async` | Waits for "ENTER ACCOUNT INFORMATION" heading |
| `fillPersonalInformation(data)` | `async` | Fills title, password, and birthday fields |
| `fillPersonalInformationWithoutPassword(data)` | `async` | Same as above, skipping password (negative test helper) |
| `fillPreferences(data)` | `async` | Checks newsletter/offers checkboxes if set in data |
| `fillAddressInformation(data)` | `async` | Fills all address fields |
| `fillAddressInformationWithoutFirstName(data)` | `async` | Address fields minus first name |
| `fillAddressInformationWithoutLastName(data)` | `async` | Address fields minus last name |
| `fillAddressInformationWithCustomZipcode(data, zipcode)` | `async` | Address fields with override zipcode |
| `fillAddressInformationWithCustomMobileNumber(data, mobile)` | `async` | Address fields with override mobile number |
| `clickCreateAccount()` | `async` | Clicks "Create Account" button |
| `accountCreatedHeader` | `Locator` (getter) | "ACCOUNT CREATED!" heading |

### `createPageObjectFixture` — `src/utils/index.ts`

Generic factory that wraps any page class into a Playwright fixture function:

```typescript
export const createPageObjectFixture =
  <T>(PageObjectClass: new (page: Page) => T) =>
  async ({ page }: { page: Page }, use: (pageObject: T) => Promise<void>) => {
    await use(new PageObjectClass(page));
  };
```

Usage in `tests/e2e/setup.ts`:

```typescript
loginPage: createPageObjectFixture(LoginPage),
signupPage: createPageObjectFixture(SignupPage),
```

---

## API Controllers

All controllers accept a Playwright `APIRequestContext` in their constructor and return raw `APIResponse` objects.

### AuthController — `src/api/controllers/create-user.controller.ts`

| Method | HTTP | Endpoint | Description |
|---|---|---|---|
| `createAccount(csrfToken, userDetails)` | `POST` | `/api/createAccount` | Creates a new user account |

**Expected responses:**
- `{ responseCode: 201, message: "User created!" }` — success
- `{ responseCode: 400, message: "Email already exists!" }` — duplicate email

### GetUserController — `src/api/controllers/get-user.controller.ts`

| Method | HTTP | Endpoint | Description |
|---|---|---|---|
| `getUserDetailByEmail(email)` | `GET` | `/api/getUserDetailByEmail` | Retrieves user details by email |

**Expected responses:**
- `{ responseCode: 200, user: { ... } }` — user found
- `{ responseCode: 404, message: "Account not found with this email, try another email!" }` — not found

### UpdateUserController — `src/api/controllers/update-user.controller.ts`

| Method | HTTP | Endpoint | Description |
|---|---|---|---|
| `updateAccount(csrfToken, userDetails)` | `PUT` | `/api/updateAccount` | Updates an existing user account |

**Expected responses:**
- `{ responseCode: 200, message: "User updated!" }` — success
- `{ responseCode: 404, message: "Account not found!" }` — user does not exist
- `{ responseCode: 400, message: "Bad request, email parameter is missing in PUT request." }` — missing email
- `{ responseCode: 400, message: "Bad request, password parameter is missing in PUT request." }` — missing password

> **Note:** Both `createAccount` and `updateAccount` require a valid `csrfmiddlewaretoken` obtained from the home page. The `csrfToken` fixture in `tests/api/setup.ts` handles this automatically.

---

## Data Layer

### `UserModel` — `src/data/models/user.model.ts`

TypeScript interface representing the full user data shape used across UI and API tests.

```typescript
interface UserModel {
  name: string;
  title: "Mr." | "Mrs.";
  email: string;
  password: string;
  birthday: { day: string; month: string; year: string; };
  newsletter: boolean;
  offers: boolean;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}
```

### `Countries` — `src/data/models/countries.enum.ts`

Enum of countries accepted by the application's signup form:

```
INDIA, USA, CANADA, AUSTRALIA, ISRAEL, NEW_ZEALAND, SINGAPORE
```

### `UserFactory` — `src/data/factories/user.factory.ts`

Chainable builder that generates `UserModel` instances using Faker.js.

| Method | Description |
|---|---|
| `UserFactory.create()` | Static factory entry point |
| `.addFullUser()` | Populates all fields with random data |
| `.addPersonalInfo()` | Populates title, password, and birthday only |
| `.addPreferences()` | Populates newsletter and offers flags |
| `.addAddressInfo()` | Populates all address fields |
| `.withEmail(email)` | Overrides the email (for targeted scenarios) |
| `.build()` | Returns the completed `UserModel` |

**Common usage patterns:**

```typescript
// Full random user
const user = UserFactory.create().addFullUser().build();

// Full random user with a specific email
const user = UserFactory.create().addFullUser().withEmail("tests@correo.com").build();
```

---

## Test Suites

### E2E Tests — `tests/e2e/`

#### `login.spec.ts`

| Suite | Test | Description |
|---|---|---|
| Login | should allow a registered user to log in with valid credentials | Happy path login; verifies logout button and "Logged in as" text |
| Login | should display an error when the password is invalid | Verifies error message with wrong password |
| Login | should display an error when the user does not exist | Verifies error message with non-existent email |

#### `signup.spec.ts`

| Suite | Test | Description |
|---|---|---|
| Signup workflow | should allow a user to register | Full registration happy path; verifies confirmation message, logout, and delete account buttons |
| /login - Name and Email | should not allow signup with empty name | Verifies page stays on `/login` |
| /login - Name and Email | should not allow signup with empty email | Verifies page stays on `/login` |
| /login - Name and Email | should not allow signup with invalid email format | Verifies page stays on `/login` |
| /login - Name and Email | should display an error when the email is already registered | Verifies "Email Address already exist!" error |
| /signup - Account Information | should not allow account creation with empty password | Verifies page stays on `/signup` |
| /signup - Account Information | should not allow account creation with empty first name | Verifies page stays on `/signup` |
| /signup - Account Information | should not allow account creation with empty last name | Verifies page stays on `/signup` |
| /signup - Account Information | should not allow account creation with letters in zipcode | Verifies page stays on `/signup` |
| /signup - Account Information | should not allow account creation with symbols in zipcode | Verifies page stays on `/signup` |
| /signup - Account Information | should not allow account creation with letters in mobile number | Verifies page stays on `/signup` |
| /signup - Account Information | should not allow account creation with symbols in mobile number | Verifies page stays on `/signup` |

### API Tests — `tests/api/`

#### `create-user.spec.ts`

| Suite | Test | Description |
|---|---|---|
| Create User API | should create a new user successfully | `POST /api/createAccount` → 201 |
| Create User API | should fail to create a user with an existing email | `POST /api/createAccount` with known email → 400 |

#### `get-user.spec.ts`

| Suite | Test | Description |
|---|---|---|
| Get User API | should retrieve an existing user by email | `GET /api/getUserDetailByEmail` → 200, verifies email |
| Get User API | should return not found for a non-existent email | `GET /api/getUserDetailByEmail` → 404 |

#### `update-user.spec.ts`

| Suite | Test | Description |
|---|---|---|
| Update User API | should update an existing user successfully | Creates user, updates it, verifies persisted changes via GET |
| Update User API | should fail to update a non-existent user | `PUT /api/updateAccount` with unknown email → 404 |
| Update User API | should fail to update when the email parameter is missing | Raw PUT without email field → 400 |
| Update User API | should fail to update when the password parameter is missing | Raw PUT without password field → 400 |

---

## Fixtures & Setup

### E2E Fixture — `tests/e2e/setup.ts`

Extends Playwright's `test` with two page object fixtures:

| Fixture | Type | Description |
|---|---|---|
| `loginPage` | `LoginPage` | Instantiated and injected per test |
| `signupPage` | `SignupPage` | Instantiated and injected per test |

The `page` fixture is passed through unchanged. Both page fixtures are created via `createPageObjectFixture`.

### API Fixture — `tests/api/setup.ts`

Extends Playwright's `test` with one custom fixture:

| Fixture | Type | Description |
|---|---|---|
| `csrfToken` | `string` | Navigates to `/` and extracts the `csrfmiddlewaretoken` from the page before each test |

This fixture is required by any test that calls `createAccount` or `updateAccount`, since the application validates the CSRF token server-side.

### Shared Test Constant

`VALID_EMAIL` is exported from `tests/e2e/login.spec.ts` and imported by API tests to reference a known, pre-existing account:

```typescript
export const VALID_EMAIL = "tests@correo.com";
```

---

## Prerequisites & Installation

**Requirements:**
- [Node.js LTS](https://nodejs.org/)
- npm (bundled with Node.js)

**Steps:**

```bash
# 1. Install Node dependencies
npm ci

# 2. Install Playwright browsers and system dependencies
npx playwright install --with-deps
```

> The `--with-deps` flag installs required OS-level browser dependencies (needed on CI and fresh Linux environments).

---

## Running Tests

```bash
# Run all tests (all browsers)
npx playwright test

# Run tests for a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run a specific spec file
npx playwright test tests/e2e/login.spec.ts
npx playwright test tests/api/create-user.spec.ts

# Run all API tests
npx playwright test tests/api/

# Run all E2E tests
npx playwright test tests/e2e/

# Run in headed mode (opens a browser window)
npx playwright test --headed

# Open Playwright UI mode (interactive test runner)
npx playwright test --ui

# View the HTML report after a test run
npx playwright show-report
```

---

## CI/CD

The GitHub Actions pipeline is defined in `.github/workflows/playwright.yml`.

**Triggers:**
- `push` to `main` or `master`
- `pull_request` targeting `main` or `master`

**Pipeline steps:**

| Step | Description |
|---|---|
| `actions/checkout@v4` | Checks out the repository |
| `actions/setup-node@v4` | Sets up Node.js LTS |
| `npm ci` | Installs project dependencies |
| `npx playwright install --with-deps` | Installs browsers and OS dependencies |
| `npx playwright test` | Runs the full test suite |
| `actions/upload-artifact@v4` | Uploads the HTML report as `playwright-report` (retained 30 days) |

**CI-specific behavior** (configured in `playwright.config.ts`):
- `forbidOnly: true` — fails the build if `test.only` is left in code
- `retries: 2` — retries failing tests twice before marking them as failed
- `workers: 1` — runs tests serially to avoid resource contention

---

## Configuration

Key settings in `playwright.config.ts`:

| Setting | Value | Description |
|---|---|---|
| `testDir` | `./tests` | Root directory for test discovery |
| `baseURL` | `https://automationexercise.com` | Used with relative `page.goto()` paths |
| `fullyParallel` | `true` | Tests within a file run in parallel locally |
| `reporter` | `list`, `html` | Console list output + HTML report |
| `trace` | `retain-on-failure` | Trace files saved only for failed tests |
| `screenshot` | `only-on-failure` | Screenshots captured only on failure |
| **Projects** | `chromium`, `firefox`, `webkit` | Tests run against all three engines |

**TypeScript path alias** (configured in `tsconfig.json`):

```json
"paths": { "@/*": ["./*"] }
```

This allows imports like `@/src/data/models/user.model` instead of relative paths.

---

## Known Issues

See [`bug-signup-account-creation-timeout.md`](./bug-signup-account-creation-timeout.md) for a documented S1 bug:

> **[Signup] Account creation confirmation never appears** — The E2E signup test reaches the "Create Account" button click but the `ACCOUNT CREATED!` heading never renders, causing a timeout. The `POST /api/createAccount` endpoint responds correctly (201) when called directly, indicating the issue is in the UI rendering layer, not the backend.
