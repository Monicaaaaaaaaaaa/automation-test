import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('@login', () => {
  test('does not log in with invalid credentials', async ({ page }) => {
    await page.goto('/', { waitUntil: 'commit' });

    const email = page.locator('input[name="email"]');
    const password = page.locator('input[name="password"]');
    await expect(email).toBeVisible({ timeout: 60_000 });

    await email.fill('fakeuser@example.com');
    await password.fill('toooooo345343434!');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).not.toHaveURL(/dashboard/);
    await expect(email).toBeVisible();
    await expect(page.getByText('super-admin')).toBeHidden();
  });
});