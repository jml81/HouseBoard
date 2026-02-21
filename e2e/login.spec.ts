import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login-page';
import { DashboardPage } from './pages/dashboard-page';

test.describe('Login flow', () => {
  test('redirects to login and authenticates to dashboard', async ({ page }) => {
    // Navigate to root — should redirect to /kirjaudu
    await page.goto('/');
    await page.waitForURL('**/kirjaudu');

    const loginPage = new LoginPage(page);
    await loginPage.expectVisible();

    // Login with resident credentials
    await loginPage.login(
      process.env.E2E_RESIDENT_EMAIL ?? 'testaaja@talo.fi',
      process.env.E2E_RESIDENT_PASSWORD ?? 'Testaaja2026!',
    );

    // Should navigate to dashboard
    await page.waitForURL('**/');
    const dashboard = new DashboardPage(page);
    await dashboard.expectVisible();

    // Building name should be visible
    await expect(page.getByText('Taloyhtiö')).toBeVisible();
  });
});
