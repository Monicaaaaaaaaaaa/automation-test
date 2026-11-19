import { test, expect } from '@playwright/test';

test.describe('@merchant', () => {
  test('create a merchant', async ({ page }) => {
        await page.goto('/dashboard', { waitUntil: 'commit' });
        
    await expect(async () => {
      if (!(await page.getByText('super-admin').isVisible())) {
        await page.reload({ waitUntil: 'commit' });
      }
      await expect(page.getByText('super-admin')).toBeVisible({ timeout: 15_000 });
    }).toPass({ timeout: 75_000 });
    await page.getByRole('link', { name: 'Merchants' }).click();
    await page.waitForURL('**/merchants', { waitUntil: 'commit' });
    await page.getByRole('button', { name: 'New Merchant' }).click();

    const unique = Date.now();
    const merchantName = `tester ${unique}`;
    //first dropdown
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
    // 2nd dropdown
    await page.getByRole('combobox').nth(2).click();
    await page.getByRole('option', { name: 'Lagos State' }).click();
    // 3rd dropdown
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
});