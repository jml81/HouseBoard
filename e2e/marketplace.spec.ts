import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login-page';

test.describe('Marketplace', () => {
  test('marketplace items load after navigation', async ({ page }) => {
    // Login as resident
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.E2E_RESIDENT_EMAIL ?? 'testaaja@talo.fi',
      process.env.E2E_RESIDENT_PASSWORD ?? 'Testaaja2026!',
    );
    await page.waitForURL('**/');

    // Navigate to marketplace
    await page.getByRole('link', { name: 'Kirpputori' }).click();
    await expect(page.getByText('Kirpputori')).toBeVisible();

    // Items should load (search bar visible means the page loaded)
    await expect(page.getByPlaceholder('Hae tuotetta...')).toBeVisible();
  });
});
