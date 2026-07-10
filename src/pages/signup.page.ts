import CommonsPage from "./commons.page";
import type { UserModel } from "../data/models/user.model";
import type { Locator, Page } from "@playwright/test";

export default class SignupPage extends CommonsPage {
  private readonly enterAccountInformationHeader: Locator;

  // ------ Personal information ------
  private readonly titleRadio: (title: "Mr." | "Mrs.") => Locator;
  private readonly passwordInput: Locator;
  private readonly dayCombobox: Locator;
  private readonly monthCombobox: Locator;
  private readonly yearCombobox: Locator;

  // ------ Preferences ------
  private readonly newsletterCheckbox: Locator;
  private readonly offersCheckbox: Locator;

  // ------ Address information ------
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly companyInput: Locator;
  private readonly address1Input: Locator;
  private readonly address2Input: Locator;
  private readonly countryCombobox: Locator;
  private readonly stateInput: Locator;
  private readonly cityInput: Locator;
  private readonly zipcodeInput: Locator;
  private readonly mobileNumberInput: Locator;

  private readonly createAccountButton: Locator;

  // ------ Successful account creation ------
  private readonly _accountCreatedHeader: Locator;

  constructor(protected page: Page) {
    super(page);

    this.enterAccountInformationHeader = this.page.getByRole("heading", {
      name: "ENTER ACCOUNT INFORMATION",
    });

    // ------ Personal information ------
    this.titleRadio = (title) => this.page.getByRole("radio", { name: title });
    this.passwordInput = this.page.getByLabel("Password *");
    this.dayCombobox = this.page
      .getByRole("combobox")
      .filter({ hasText: "Day" });
    this.monthCombobox = this.page
      .getByRole("combobox")
      .filter({ hasText: "Month" });
    this.yearCombobox = this.page
      .getByRole("combobox")
      .filter({ hasText: "Year" });

    // ------ Preferences ------
    this.newsletterCheckbox = this.page.getByLabel(
      "Sign up for our newsletter!",
    );
    this.offersCheckbox = this.page.getByLabel(
      "Receive special offers from our partners!",
    );

    // ------ Address information ------
    this.firstNameInput = this.page.getByLabel("First name *");
    this.lastNameInput = this.page.getByLabel("Last name *");
    this.companyInput = this.page.getByRole("textbox", {
      name: "Company",
      exact: true,
    });
    this.address1Input = this.page.getByLabel(/Address \* /);
    this.address2Input = this.page.getByLabel("Address 2");
    this.countryCombobox = this.page.getByLabel("Country *");
    this.stateInput = this.page.getByLabel("State *");
    this.cityInput = this.page.getByLabel("City *");
    this.zipcodeInput = this.page.getByLabel("Zipcode *");
    this.mobileNumberInput = this.page.getByLabel("Mobile Number *");

    this.createAccountButton = this.page.getByRole("button", {
      name: "Create Account",
    });

    // ------ Successful account creation ------
    this._accountCreatedHeader = this.page.getByRole("heading", {
      name: "ACCOUNT CREATED!",
    });
  }

  get accountCreatedHeader() {
    return this._accountCreatedHeader;
  }

  async waitForAccountInformationHeader() {
    await this.enterAccountInformationHeader.waitFor({
      state: "visible",
    });
  }

  async fillPersonalInformation(data: UserModel) {
    await this.titleRadio(data.title).check();
    await this.passwordInput.fill(data.password);
    await this.dayCombobox.selectOption(data.birthday.day);
    await this.monthCombobox.selectOption(data.birthday.month);
    await this.yearCombobox.selectOption(data.birthday.year);
  }

  async fillPersonalInformationWithoutPassword(data: UserModel) {
    await this.titleRadio(data.title).check();
    await this.dayCombobox.selectOption(data.birthday.day);
    await this.monthCombobox.selectOption(data.birthday.month);
    await this.yearCombobox.selectOption(data.birthday.year);
  }

  async fillPreferences(data: UserModel) {
    if (data.newsletter) {
      await this.newsletterCheckbox.check();
    }

    if (data.offers) {
      await this.offersCheckbox.check();
    }
  }

  async fillAddressInformation(data: UserModel) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.companyInput.fill(data.company);
    await this.address1Input.fill(data.address1);
    await this.address2Input.fill(data.address2);
    await this.countryCombobox.selectOption({ label: data.country });
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(data.zipcode);
    await this.mobileNumberInput.fill(data.mobileNumber);
  }

  async fillAddressInformationWithoutFirstName(data: UserModel) {
    await this.lastNameInput.fill(data.lastName);
    await this.companyInput.fill(data.company);
    await this.address1Input.fill(data.address1);
    await this.address2Input.fill(data.address2);
    await this.countryCombobox.selectOption({ label: data.country });
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(data.zipcode);
    await this.mobileNumberInput.fill(data.mobileNumber);
  }

  async fillAddressInformationWithoutLastName(data: UserModel) {
    await this.firstNameInput.fill(data.firstName);
    await this.companyInput.fill(data.company);
    await this.address1Input.fill(data.address1);
    await this.address2Input.fill(data.address2);
    await this.countryCombobox.selectOption({ label: data.country });
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(data.zipcode);
    await this.mobileNumberInput.fill(data.mobileNumber);
  }

  async fillAddressInformationWithCustomZipcode(
    data: UserModel,
    zipcode: string,
  ) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.companyInput.fill(data.company);
    await this.address1Input.fill(data.address1);
    await this.address2Input.fill(data.address2);
    await this.countryCombobox.selectOption({ label: data.country });
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(zipcode);
    await this.mobileNumberInput.fill(data.mobileNumber);
  }

  async fillAddressInformationWithCustomMobileNumber(
    data: UserModel,
    mobileNumber: string,
  ) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.companyInput.fill(data.company);
    await this.address1Input.fill(data.address1);
    await this.address2Input.fill(data.address2);
    await this.countryCombobox.selectOption({ label: data.country });
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(data.zipcode);
    await this.mobileNumberInput.fill(mobileNumber);
  }

  async clickCreateAccount() {
    await this.createAccountButton.click();
  }
}
