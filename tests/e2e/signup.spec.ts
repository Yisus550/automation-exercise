import UserFactory from "@/src/data/factories/user.factory";
import { expect, test } from "./setup";
import type { UserModel } from "@/src/data/models/user.model";

test.describe("Signup", () => {
  let userData: UserModel;

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await page.route("**/*googleads*", (route) => route.abort());
    await page.route("**/*doubleclick.net*", (route) => route.abort());
  });

  test("should allow a user to register", async ({
    page,
    loginPage,
    signupPage,
  }) => {
    await test.step("Go to the login page and fill the signup form with valid data", async () => {
      userData = UserFactory.create().addFullUser().build();

      await loginPage.fillName(userData.firstName);
      await loginPage.fillEmail(userData.email, "signup");
      await loginPage.clickSignup();
    });

    await test.step("Fill the account information form and submit it", async () => {
      await signupPage.waitForAccountInformationHeader();
      await signupPage.fillPersonalInformation(userData);
      await signupPage.fillPreferences(userData);
      await signupPage.fillAddressInformation(userData);
      await signupPage.clickCreateAccount();
      await signupPage.accountCreatedHeader.waitFor();
    });

    await test.step("Verify that the account was created successfully and logout", async () => {
      await expect(
        page.getByText(
          "Congratulations! Your new account has been successfully created!",
        ),
      ).toBeVisible();

      await signupPage.clickContinueButton();
      await page.waitForURL("/");

      await expect(signupPage.logoutButton).toBeVisible();
      await expect(signupPage.deleteAccountButton).toBeVisible();
    });
  });
});
