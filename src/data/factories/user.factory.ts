import { faker } from "@faker-js/faker";
import { UserModel } from "../models/user.model";
import Countries from "../models/countries.enum";

export default class UserFactory {
  private user = {} as UserModel;

  constructor() {}

  static create(): UserFactory {
    return new UserFactory();
  }

  addFullUser(): this {
    this.user = {
      // ------ Personal information ------
      title: faker.helpers.arrayElement(["Mr.", "Mrs."]),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
      birthday: {
        day: faker.number.int({ min: 1, max: 31 }).toString(),
        month: faker.number.int({ min: 1, max: 12 }).toString(),
        year: faker.number.int({ min: 1970, max: 2008 }).toString(),
      },

      // ------ Preferences ------
      newsletter: faker.datatype.boolean(),
      offers: faker.datatype.boolean(),

      // ------ Address information ------
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: faker.helpers.enumValue(Countries),
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
      mobileNumber: faker.phone.number(),
    };

    return this;
  }

  addPersonalInfo(): this {
    this.user.title = faker.helpers.arrayElement(["Mr.", "Mrs."]);
    this.user.password = faker.internet.password({ length: 8 });
    this.user.birthday = {
      day: faker.number.int({ min: 1, max: 31 }).toString(),
      month: faker.number.int({ min: 1, max: 12 }).toString(),
      year: faker.number.int({ min: 1970, max: 2008 }).toString(),
    };

    return this;
  }

  addPreferences(): this {
    this.user.newsletter = faker.datatype.boolean();
    this.user.offers = faker.datatype.boolean();

    return this;
  }

  addAddressInfo(): this {
    this.user.firstName = faker.person.firstName();
    this.user.lastName = faker.person.lastName();
    this.user.company = faker.company.name();
    this.user.address1 = faker.location.streetAddress();
    this.user.address2 = faker.location.secondaryAddress();
    this.user.country = faker.location.country();
    this.user.state = faker.location.state();
    this.user.city = faker.location.city();
    this.user.zipcode = faker.location.zipCode();
    this.user.mobileNumber = faker.phone.number();

    return this;
  }

  build(): UserModel {
    return this.user;
  }
}
