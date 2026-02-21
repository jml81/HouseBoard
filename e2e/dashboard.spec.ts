import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login-page';
import { DashboardPage } from './pages/dashboard-page';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.E2E_RESIDENT_EMAIL ?? 'testaaja@talo.fi',
      process.env.E2E_RESIDENT_PASSWORD ?? 'Testaaja2026!',
    );
    await page.waitForURL('**/');
  });

  test('shows building name and dashboard cards', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.expectVisible();

    // Dashboard cards should be visible
    await expect(page.getByText('Tulevat varaukset')).toBeVisible();
    await expect(page.getByText('Viimeisimmät tiedotteet')).toBeVisible();
  });
});
