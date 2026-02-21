import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login-page';

test.describe('Logout', () => {
  test('user can log out and is redirected to login page', async ({ page }) => {
    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.E2E_RESIDENT_EMAIL ?? 'testaaja@talo.fi',
      process.env.E2E_RESIDENT_PASSWORD ?? 'Testaaja2026!',
    );
    await page.waitForURL('**/');

    // Open the user dropdown (profile menu)
    await page.getByRole('button', { name: /profiili/i }).click();

    // Click logout
    await page.getByText('Kirjaudu ulos').click();

    // Should redirect to login page
    await page.waitForURL('**/kirjaudu');
    await expect(page.getByRole('button', { name: 'Kirjaudu sisään' })).toBeVisible();
  });
});
