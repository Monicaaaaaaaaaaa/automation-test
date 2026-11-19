# Merchant Automation (Playwright)

Automated UI test for the **Merchants** section of the TMS dev site. It logs in (email + password + OTP), opens **Merchants**, clicks **New Merchant**, fills the form and checks that the merchant is created.

## What the test covers

- Login with email, password and a manual OTP
- Navigation: sidebar > Merchants > New Merchant
- Filling the form: Institution, Merchant Name, Company Name, Email Address, Address, Phone Number, State, Local Government Area
- Submitting with **Add Merchant**
- Checking the **Merchant Successfully Created** toast
- Checking the new merchant appears in the Merchants list

## Requirements

- Node.js (LTS version)
- A test account for the TMS dev site
- Access to the email inbox that receives the OTP

## Setup

1. Install dependencies:

   ```bash
   npm install
   npx playwright install
   ```

2. Create a `.env` file in the project root (next to `package.json`) and add these:
   ```
   TEST_EMAIL=your-login-email
   TEST_PASSWORD=your-password
   ```

   No quotes and no spaces around `=`. If the password contains `#`, wrap it in double quotes.

   Never commit `.env`. It is listed in `.gitignore`.

## Running the tests

### First run, or when the saved session has expired

```bash
npx playwright test
```

The browser opens and fills in the email and password. **Type the OTP from your email in the browser and submit it.** The test waits for you, then saves the session to `auth/user.json` and runs the merchant test.

### Later runs (session still valid, no OTP needed)

```bash
npx playwright test merchants.spec.ts --project=chromium --no-deps --workers=1
```

### Run by tag

```bash
npx playwright test --grep "@merchant" --project=chromium --no-deps
```

On Windows PowerShell, keep the quotes around `@merchant`. Without them, PowerShell reads it as a variable.

### Debugging

```bash
npx playwright test --ui       # watch each step with a timeline
npx playwright test --debug    # step through with the Inspector
npx playwright show-report     # open the last HTML report
```

## Project structure

```
tests/
  auth.setup.ts       # logs in once (manual OTP) and saves the session
  merchants.spec.ts   # create-merchant test, tagged @merchant
playwright.config.ts  # base URL, timeouts, projects
.env                  # your credentials (not committed)
auth/user.json        # saved login session (not committed)
```

## Notes

- **The OTP is manual.** There is no OTP bypass on the dev site yet. If the team adds one, or a test inbox, the login step can be fully automated.
- **The dev site can be slow.** The test uses retries and longer timeouts for dropdowns and navigation, and runs with one worker. Do not run many copies in parallel.
- **Each run creates a new merchant** (named `Lisa <timestamp>`) on the dev site. Ask the team whether these should be cleaned up.
- **Never commit** `.env`, `auth/`, `test-results/` or `playwright-report/`.

## Troubleshooting

| Problem | Likely cause | Fix |
| --- | --- | --- |
| `value: expected string, got undefined` at login | `.env` missing or not read | Check the file name (not `.env.txt`), its location and `TEST_EMAIL` / `TEST_PASSWORD` |
| Test hangs waiting for `super-admin` | Saved session expired | Run the full `npx playwright test` and type the OTP |
| `ERR_INTERNET_DISCONNECTED` | No internet or VPN dropped | Reconnect and run again |
| Dropdown option not found | Slow dev API | Run again; the test already retries |
