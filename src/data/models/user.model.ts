export interface UserModel {
  title: "Mr." | "Mrs.";
  email: string;
  password: string;
  birthday: {
    day: string;
    month: string;
    year: string;
  };
  newsletter: boolean;
  offers: boolean;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}
