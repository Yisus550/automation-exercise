import CommonsPage from "./commons.page";
import type { Locator, Page } from "@playwright/test";

export default class LoginPage extends CommonsPage {
  private readonly newUserSignupHeader: Locator;
  private readonly loginHeader: Locator;
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signupButton: Locator;
  private readonly loginButton: Locator;
  private readonly loginErrorMessage: Locator;

  constructor(protected page: Page) {
    super(page);

    this.newUserSignupHeader = this.page.getByRole("heading", {
      name: "New User Signup!",
    });
    this.loginHeader = this.page.getByRole("heading", {
      name: "Login to your account",
    });

    this.nameInput = this.page.getByRole("textbox", { name: "Name" });
    this.emailInput = this.page.getByRole("textbox", { name: "Email Address" });
    this.passwordInput = this.page.getByRole("textbox", { name: "Password" });
    this.signupButton = this.page.getByRole("button", { name: "Signup" });
    this.loginButton = this.page.getByRole("button", { name: "Login" });
    this.loginErrorMessage = this.page.getByText(
      "Your email or password is incorrect!",
    );
  }

  async goto() {
    await this.page.goto("/login", { waitUntil: "domcontentloaded" });
  }

  async clickSignupLoginLink() {
    await this.signupLoginLink.click();
  }

  async waitForNewUserSignupHeaderVisible() {
    await this.newUserSignupHeader.waitFor({ state: "visible" });
  }

  async waitForLoginHeaderVisible() {
    await this.loginHeader.waitFor({ state: "visible" });
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

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSignup() {
    await this.signupButton.click();
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email, "login");
    await this.fillPassword(password);
    await this.clickLogin();
  }

  get errorMessage() {
    return this.loginErrorMessage;
  }
}
