import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Sähköposti');
    this.passwordInput = page.getByLabel('Salasana');
    this.submitButton = page.getByRole('button', { name: 'Kirjaudu sisään' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/kirjaudu');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectVisible(): Promise<void> {
    await expect(this.submitButton).toBeVisible();
  }
}
