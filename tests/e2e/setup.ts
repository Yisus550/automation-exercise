import LoginPage from "@/src/pages/login.page";
import SignupPage from "@/src/pages/signup.page";
import { createPageObjectFixture } from "@/src/utils";
import {
  test as baseTest,
  expect as baseExpect,
  type Page,
} from "@playwright/test";

type webApp = {
  page: Page;
  loginPage: LoginPage;
  signupPage: SignupPage;
};

export const expect = baseExpect;

export const test = baseTest.extend<webApp>({
  page: async ({ page }, use) => {
    await use(page);
  },

  loginPage: createPageObjectFixture(LoginPage),
  signupPage: createPageObjectFixture(SignupPage),
});
