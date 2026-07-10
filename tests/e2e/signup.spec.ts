import UserFactory from "@/src/data/factories/user.factory";
import { expect, test } from "./setup";
import type { UserModel } from "@/src/data/models/user.model";

let userData: UserModel;
const REGISTERED_EMAIL = "tests@correo.com";

test.describe("Signup workflow", () => {
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

test.describe("/login - Name and Email", () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await page.route("**/*googleads*", (route) => route.abort());
    await page.route("**/*doubleclick.net*", (route) => route.abort());
  });

  test("should not allow signup with empty name", async ({
    page,
    loginPage,
  }) => {
    await test.step("Leave name empty, fill valid email and click Signup", async () => {
      userData = UserFactory.create().addFullUser().build();
      await loginPage.fillEmail(userData.email, "signup");
      await loginPage.clickSignup();
    });

    await test.step("Verify that the page stays on /login", async () => {
      expect(page.url()).toContain("/login");
    });
  });

  test("should not allow signup with empty email", async ({
    page,
    loginPage,
  }) => {
    await test.step("Fill valid name, leave email empty and click Signup", async () => {
      userData = UserFactory.create().addFullUser().build();
      await loginPage.fillName(userData.firstName);
      await loginPage.clickSignup();
    });

    await test.step("Verify that the page stays on /login", async () => {
      expect(page.url()).toContain("/login");
    });
  });

  test("should not allow signup with invalid email format", async ({
    page,
    loginPage,
  }) => {
    await test.step("Fill valid name and an email without @ symbol, then click Signup", async () => {
      userData = UserFactory.create().addFullUser().build();
      await loginPage.fillName(userData.firstName);
      await loginPage.fillEmail("invalidemail", "signup");
      await loginPage.clickSignup();
    });

    await test.step("Verify that the page stays on /login", async () => {
      expect(page.url()).toContain("/login");
    });
  });

  test("should display an error when the email is already registered", async ({
    loginPage,
  }) => {
    await test.step("Fill valid name and an already-registered email, then click Signup", async () => {
      userData = UserFactory.create().addFullUser().build();
      await loginPage.fillName(userData.firstName);
      await loginPage.fillEmail(REGISTERED_EMAIL, "signup");
      await loginPage.clickSignup();
    });

    await test.step("Verify that the existing email error message is shown", async () => {
      await expect(loginPage.existingEmailError).toBeVisible();
    });
  });
});

test.describe("/signup - Account Information", () => {
  test.beforeEach(async ({ page, loginPage, signupPage }) => {
    await loginPage.goto();
    await page.route("**/*googleads*", (route) => route.abort());
    await page.route("**/*doubleclick.net*", (route) => route.abort());
    userData = UserFactory.create().addFullUser().build();
    await loginPage.fillName(userData.firstName);
    await loginPage.fillEmail(userData.email, "signup");
    await loginPage.clickSignup();
    await signupPage.waitForAccountInformationHeader();
  });

  test("should not allow account creation with empty password", async ({
    page,
    signupPage,
  }) => {
    await test.step("Fill all fields except password and click Create Account", async () => {
      await signupPage.fillPersonalInformationWithoutPassword(userData);
      await signupPage.fillPreferences(userData);
      await signupPage.fillAddressInformation(userData);
      await signupPage.clickCreateAccount();
    });

    await test.step("Verify that the page stays on /signup", async () => {
      expect(page.url()).toContain("/signup");
    });
  });

  test("should not allow account creation with empty first name", async ({
    page,
    signupPage,
  }) => {
    await test.step("Fill all fields except first name and click Create Account", async () => {
      await signupPage.fillPersonalInformation(userData);
      await signupPage.fillPreferences(userData);
      await signupPage.fillAddressInformationWithoutFirstName(userData);
      await signupPage.clickCreateAccount();
    });

    await test.step("Verify that the page stays on /signup", async () => {
      expect(page.url()).toContain("/signup");
    });
  });

  test("should not allow account creation with empty last name", async ({
    page,
    signupPage,
  }) => {
    await test.step("Fill all fields except last name and click Create Account", async () => {
      await signupPage.fillPersonalInformation(userData);
      await signupPage.fillPreferences(userData);
      await signupPage.fillAddressInformationWithoutLastName(userData);
      await signupPage.clickCreateAccount();
    });

    await test.step("Verify that the page stays on /signup", async () => {
      expect(page.url()).toContain("/signup");
    });
  });

  test("should not allow account creation with letters in zipcode", async ({
    page,
    signupPage,
  }) => {
    await test.step("Fill all fields with a zipcode containing letters and click Create Account", async () => {
      await signupPage.fillPersonalInformation(userData);
      await signupPage.fillPreferences(userData);
      await signupPage.fillAddressInformationWithCustomZipcode(
        userData,
        "ABCDE",
      );
      await signupPage.clickCreateAccount();
    });

    await test.step("Verify that the page stays on /signup", async () => {
      expect(page.url()).toContain("/signup");
    });
  });

  test("should not allow account creation with symbols in zipcode", async ({
    page,
    signupPage,
  }) => {
    await test.step("Fill all fields with a zipcode containing symbols and click Create Account", async () => {
      await signupPage.fillPersonalInformation(userData);
      await signupPage.fillPreferences(userData);
      await signupPage.fillAddressInformationWithCustomZipcode(
        userData,
        "12@34",
      );
      await signupPage.clickCreateAccount();
    });

    await test.step("Verify that the page stays on /signup", async () => {
      expect(page.url()).toContain("/signup");
    });
  });

  test("should not allow account creation with letters in mobile number", async ({
    page,
    signupPage,
  }) => {
    await test.step("Fill all fields with a mobile number containing letters and click Create Account", async () => {
      await signupPage.fillPersonalInformation(userData);
      await signupPage.fillPreferences(userData);
      await signupPage.fillAddressInformationWithCustomMobileNumber(
        userData,
        "ABC123",
      );
      await signupPage.clickCreateAccount();
    });

    await test.step("Verify that the page stays on /signup", async () => {
      expect(page.url()).toContain("/signup");
    });
  });

  test("should not allow account creation with symbols in mobile number", async ({
    page,
    signupPage,
  }) => {
    await test.step("Fill all fields with a mobile number containing symbols and click Create Account", async () => {
      await signupPage.fillPersonalInformation(userData);
      await signupPage.fillPreferences(userData);
      await signupPage.fillAddressInformationWithCustomMobileNumber(
        userData,
        "555-1234",
      );
      await signupPage.clickCreateAccount();
    });

    await test.step("Verify that the page stays on /signup", async () => {
      expect(page.url()).toContain("/signup");
    });
  });
});
