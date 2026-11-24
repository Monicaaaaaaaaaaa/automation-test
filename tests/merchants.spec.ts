import { test, expect, Page } from '@playwright/test';

async function openNewMerchantForm(page: Page) {
  await page.goto('/dashboard', { waitUntil: 'commit' });

  const loginForm = page.locator('input[name="email"]');
  await expect(loginForm.or(page.getByText('super-admin'))).toBeVisible({ timeout: 60_000 });
  if (await loginForm.isVisible()) {
    throw new Error('Session expired: run the full "npx playwright test" to log in again');
  }

  await expect(async () => {
    await page.getByRole('link', { name: 'Merchants' }).click();
    await expect(page).toHaveURL(/\/merchants/, { timeout: 5_000 });
  }).toPass({ timeout: 45_000 });

  const formLabel = page.getByText('Select Institution');
  await expect(async () => {
    if (!(await formLabel.isVisible())) {
      await page.getByRole('button', { name: 'New Merchant' }).click({ timeout: 5_000 });
    }
    await expect(formLabel).toBeVisible({ timeout: 5_000 });
  }).toPass({ timeout: 45_000 });
}

test.describe('@merchant', () => {
  test('create a merchant', async ({ page }) => {
    await openNewMerchantForm(page);

    const unique = Date.now();
    const merchantName = `tester ${unique}`;

    const trigger = page.locator('[role="combobox"]').first();
    const institution = page.getByRole('option', { name: 'Test Joachim' });
    await trigger.click();
    await expect(async () => {
      if (!(await institution.isVisible())) {
        await page.keyboard.press('Escape');
        await trigger.click();
      }
      await expect(institution).toBeVisible({ timeout: 5_000 });
    }).toPass({ timeout: 60_000 });
    await institution.click();

    await page.locator('input[name="merchantName"]').fill(merchantName);
    await page.locator('input[name="companyName"]').fill('test company');
    await page.locator('input[name="email"]').fill(`merchant+${unique}@gmail.com`);
    await page.locator('input[name="address"]').fill('no3 lagos');
    await page.getByRole('textbox', { name: '070 000 00000' }).fill('08000000000');

    await page.getByRole('combobox').nth(2).click();
    await page.getByRole('option', { name: 'Lagos State' }).click();

    const combos = page.locator('[role="combobox"]');
    const lga = page.getByRole('option', { name: 'Amuwo-odofin' });
    await expect(page.getByRole('listbox')).toBeHidden();
    await expect(async () => {
      if (!(await lga.isVisible())) {
        await combos.nth(3).click();
      }
      await expect(lga).toBeVisible({ timeout: 4_000 });
    }).toPass({ timeout: 45_000 });
    await lga.click();

    await page.getByRole('button', { name: 'Add Merchant' }).click();

    await expect(page.getByText('Merchant Successfully Created')).toBeVisible();

    await expect(async () => {
      await page.getByRole('button', { name: 'Refresh' }).click();
      await expect(page.getByRole('cell', { name: merchantName })).toBeVisible({ timeout: 5_000 });
    }).toPass({ timeout: 45_000 });
  });

  test('does not create a merchant when the form is empty', async ({ page }) => {
    await openNewMerchantForm(page);

    await page.getByRole('button', { name: 'Add Merchant' }).click();

    const requiredMessages = [
      'Institution is required',
      'Merchant name is required',
      'Company name is required',
      'Email address is required',
      'Address is required',
      'Phone number is required',
      'State is required',
      'Local government area is required',
    ];

    for (const message of requiredMessages) {
        await expect(page.getByText(message, { exact: true })).toBeVisible();
    }

    await expect(page.getByText('Merchant Successfully Created')).toBeHidden();
    await expect(page.getByText('Select Institution')).toBeVisible();
  });
});