import { expect, test as setup } from '@playwright/test';

setup('login with manual OTP', async ({ page }) => {
  setup.setTimeout(180_000);
  await page.goto('/', { waitUntil: 'commit' });
  await page.locator('input[name="email"]').fill(process.env.TEST_EMAIL!);
  await page.locator('input[name="password"]').fill(process.env.TEST_PASSWORD!);
  await page.getByRole('button', { name: 'Login' }).click();
  // Type the OTP from your email in the browser and submit.
  await page.waitForURL('**/dashboard', { timeout: 150_000, waitUntil: 'commit' });
  await expect(page.getByText('super-admin')).toBeVisible({ timeout: 60_000 });
  await expect(page.getByRole('link', { name: 'Merchants' })).toBeVisible();

  await page.context().storageState({ path: 'auth/user.json' });
});