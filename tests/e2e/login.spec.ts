import { expect, test } from "./setup";

export const VALID_EMAIL = "tests@correo.com";
const VALID_PASSWORD = "Testing123";

test.describe("Login", () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.waitForLoginHeaderVisible();
    await page.route("**/*googleads*", (route) => route.abort());
    await page.route("**/*doubleclick.net*", (route) => route.abort());
  });

  test("should allow a registered user to log in with valid credentials", async ({
    page,
    loginPage,
  }) => {
    await test.step("Fill the login form with valid credentials", async () => {
      await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
    });

    await test.step("Verify that the user is logged in successfully", async () => {
      await page.waitForURL("/");
      await expect(loginPage.logoutButton).toBeVisible();
      await expect(page.getByText("Logged in as")).toBeVisible();
    });
  });

  test("should display an error when the password is invalid", async ({
    loginPage,
  }) => {
    await test.step("Fill the login form with a valid email and an invalid password", async () => {
      await loginPage.login(VALID_EMAIL, "WrongPassword123");
    });

    await test.step("Verify that the error message is shown", async () => {
      await expect(loginPage.errorMessage).toBeVisible();
    });
  });

  test("should display an error when the user does not exist", async ({
    loginPage,
  }) => {
    await test.step("Fill the login form with a non-existent user", async () => {
      await loginPage.login("nonexistent@correo.com", "Testing123");
    });

    await test.step("Verify that the error message is shown", async () => {
      await expect(loginPage.errorMessage).toBeVisible();
    });
  });
});
