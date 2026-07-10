import type { Page } from "@playwright/test";

export const createPageObjectFixture =
  <T>(PageObjectClass: new (page: Page) => T) =>
  async ({ page }: { page: Page }, use: (pageObject: T) => Promise<void>) => {
    await use(new PageObjectClass(page));
  };
