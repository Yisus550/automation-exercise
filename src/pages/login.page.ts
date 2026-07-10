import type { Locator, Page } from "@playwright/test";

export default class LoginPage {
  private readonly SignupLoginLink: Locator;
  private readonly NewUserSignupHeader: Locator;
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly signupButton: Locator;

  constructor(private page: Page) {
    this.SignupLoginLink = this.page.getByRole("link", {
      name: / Signup \/ Login/,
    });
    this.NewUserSignupHeader = this.page.getByRole("heading", {
      name: "New User Signup!",
    });
    this.nameInput = this.page.getByRole("textbox", { name: "Name" });
    this.emailInput = this.page.getByRole("textbox", { name: "Email Address" });
    this.signupButton = this.page.getByRole("button", { name: "Signup" });
  }

  async goto() {
    await this.page.goto("/login", { waitUntil: "domcontentloaded" });
  }

  async clickSignupLoginLink() {
    await this.SignupLoginLink.click();
  }

  async waitForNewUserSignupHeaderVisible() {
    await this.NewUserSignupHeader.waitFor({ state: "visible" });
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  /**
   * Fills the email input field based on the type of action (signup or login). Defaults to filling the first email input for signup and the last email input for login.
   * @param email - The email address to fill in the input field.
   * @param type - The type of action, either "signup" or "login".
   */
  async fillEmail(email: string, type: "signup" | "login") {
    if (type === "signup") {
      await this.emailInput.nth(1).fill(email);
    } else {
      await this.emailInput.first().fill(email);
    }
  }

  async clickSignup() {
    await this.signupButton.click();
  }
}
