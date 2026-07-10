import { test as baseTest, expect as baseExpect } from "@playwright/test";

type webApp = {
  csrfToken: string;
};

export const expect = baseExpect;

export const test = baseTest.extend<webApp>({
  csrfToken: async ({ page }, use) => {
    await test.step("Navigate to the home page to retrieve CSRF token", async () => {
      await page.goto("/");

      const token = await page
        .locator('input[name="csrfmiddlewaretoken"]')
        .getAttribute("value");

      if (!token) {
        throw new Error("CSRF token not found");
      }

      const csrfToken = token as string;
      await use(csrfToken);
    });
  },
});
