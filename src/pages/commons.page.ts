import type { Locator, Page } from "@playwright/test";

export default abstract class CommonsPage {
  protected readonly continueButton: Locator;
  protected readonly signupLoginLink: Locator;
  protected readonly _logoutButton: Locator;
  protected readonly _deleteAccountButton: Locator;

  constructor(protected page: Page) {
    this.continueButton = this.page.getByRole("link", { name: "Continue" });
    this.signupLoginLink = this.page.getByRole("link", {
      name: / Signup \/ Login/,
    });
    this._logoutButton = this.page.getByRole("link", { name: / Logout/ });
    this._deleteAccountButton = this.page.getByRole("link", {
      name: / Delete Account/,
    });
  }

  get logoutButton() {
    return this._logoutButton;
  }

  get deleteAccountButton() {
    return this._deleteAccountButton;
  }

  async clickContinueButton() {
    await this.continueButton.click();
  }

  async clickSignupLoginLink() {
    await this.signupLoginLink.click();
  }
}
