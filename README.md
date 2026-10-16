# Restful-Booker Playwright API Automation

API test automation framework for the [Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html) REST API, built with **Playwright** and **JavaScript**. It covers authentication and the booking endpoints, with positive and negative scenarios, an API client layer, a test data factory and automatic cleanup of the data each test creates.

## Highlights

- 17 automated API tests so far, each named with a test case ID (for example `TC_BOOKING_GET_001`)
- API client layer (one class per resource), the API equivalent of Page Objects
- Custom fixtures that inject the API clients into tests
- Every booking created by a test is deleted automatically afterwards, so the shared server stays clean
- Test data factory that gives each booking a unique name, so tests never depend on existing data
- Known API defects are documented as expected failures instead of being hidden
- Runs one worker at a time, out of respect for a shared public server

## Endpoints Covered

| Endpoint | Method | Module | Status |
|---|---|---|---|
| `/ping` | GET | Health | Covered |
| `/auth` | POST | Auth | Covered |
| `/booking` | GET | Booking list (with filters) | Covered |
| `/booking/{id}` | GET | Booking get | Covered |
| `/booking` | POST | Booking create | Covered |
| `/booking/{id}` | PUT | Booking update | In progress |
| `/booking/{id}` | PATCH | Booking partial update | In progress |
| `/booking/{id}` | DELETE | Booking delete | Used for cleanup, dedicated tests in progress |

## Known API Defects

Restful-Booker is a practice API that contains deliberate bugs. These tests assert the **correct** behaviour and are marked with `test.fail()`, so they pass while the defect exists and start failing as soon as the API is fixed.

| Test | Endpoint | Actual behaviour | Expected behaviour |
|---|---|---|---|
| TC_BOOKING_CREATE_003 | POST /booking | 500 when a required field is missing | 400 Bad Request |
| TC_BOOKING_CREATE_004 | POST /booking | 200, invalid date is stored as `0NaN-aN-aN` | 400 Bad Request |
| TC_BOOKING_CREATE_005 | POST /booking | 500 for an empty body | 400 Bad Request |

## Tech Stack

| Area | Tools |
|---|---|
| Automation | Playwright (`request` fixture), JavaScript (Node.js 20) |
| Pattern | API client classes, custom fixtures, test data factory |
| Version control | Git, GitHub |

## Project Structure

```
├── api/                 API client classes (auth, booking)
├── fixtures/            Custom fixtures with automatic cleanup
├── test-data/           Credentials and static test data
├── tests/               Spec files
├── utils/               Test data factory
└── playwright.config.js
```

## Getting Started

```bash
git clone https://github.com/vharshitha2705-dotcom/restful-booker-playwright-api.git
cd restful-booker-playwright-api
npm ci
```

API tests do not open a browser, so `npx playwright install` is not needed.

## Running Tests

```bash
npm test          # run all API tests
npm run report    # open the last HTML report
```

## Design Decisions

- **API client layer:** specs call methods such as `bookingApi.createBooking(payload)` instead of writing raw requests, so a change to an endpoint is made in one place.
- **Automatic cleanup:** the fixture tracks every booking ID a test creates and deletes it after the test, even when the test fails.
- **Unique test data:** each booking gets a unique first and last name, so filter tests can find their own booking among everyone else's on the public server.
- **Known defects as expected failures:** using `test.fail()` keeps the suite green while documenting real bugs, and flags the day they are fixed.
- **Token in a Cookie header:** the API only accepts the auth token through the `Cookie` header, so the client builds it that way.
- **Single worker:** the target is a shared public server, so tests run one at a time.

## AI-Assisted Development

I used AI (Claude by Anthropic) as a pair-programming and learning aid while building this project:

- **Planning:** splitting the API into test modules and deciding which scenarios to automate
- **Design:** structuring the client layer, fixtures and data factory
- **Review:** checking my specs and assertions

I explored every endpoint manually first, recorded the real responses, and ran and verified every test myself, including finding the API defects listed above.

## Author

**Harshitha Veeravalli**, QA Engineer  
Manual testing, API testing, SQL/database testing, and Playwright automation.