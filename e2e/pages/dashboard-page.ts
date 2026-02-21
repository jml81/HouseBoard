import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectVisible(): Promise<void> {
    await expect(this.page.getByText('Tervetuloa!')).toBeVisible();
  }
}
