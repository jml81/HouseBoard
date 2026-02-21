import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login-page';

test.describe('Announcements CRUD', () => {
  test('manager can create and delete an announcement', async ({ page }) => {
    // Login as manager
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.E2E_MANAGER_EMAIL ?? 'testipj@talo.fi',
      process.env.E2E_MANAGER_PASSWORD ?? 'TestiPJ2026!',
    );
    await page.waitForURL('**/');

    // Enable manager mode
    await page.getByRole('button', { name: /isännöitsijätila/i }).click();

    // Navigate to announcements
    await page.getByRole('link', { name: 'Tiedotteet' }).click();
    await expect(page.getByText('Tiedotteet')).toBeVisible();

    // Create a new announcement
    await page.getByRole('button', { name: 'Uusi tiedote' }).click();
    await page.getByLabel('Otsikko').fill('E2E-testitiedote');
    await page.getByLabel('Yhteenveto').fill('E2E-testin yhteenveto');
    await page.getByLabel('Sisältö').fill('E2E-testin sisältö');
    await page.getByRole('button', { name: 'Julkaise' }).click();

    // Verify announcement appears in the list
    await expect(page.getByText('E2E-testitiedote')).toBeVisible();

    // Open the announcement and delete it (cleanup)
    await page.getByText('E2E-testitiedote').click();
    await page.getByRole('button', { name: 'Poista tiedote' }).click();

    // Confirm deletion in dialog
    const confirmButton = page.getByRole('button', { name: 'Poista' }).last();
    await confirmButton.click();

    // Verify announcement is gone
    await expect(page.getByText('E2E-testitiedote')).not.toBeVisible();
  });
});
