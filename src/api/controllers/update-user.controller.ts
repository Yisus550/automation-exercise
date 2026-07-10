import type { UserModel } from "@/src/data/models/user.model";
import type { APIRequestContext } from "@playwright/test";

export default class UpdateUserController {
  private endpoint = "/api/updateAccount";

  constructor(private request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Actualiza una cuenta existente simulando el envío del formulario web real
   * @param csrfToken Token de seguridad obligatorio recuperado previamente
   * @param userDetails Objeto con la información del formulario (name, password, etc.)
   */
  async updateAccount(csrfToken: string, userDetails: UserModel) {
    return await this.request.put(this.endpoint, {
      form: {
        csrfmiddlewaretoken: csrfToken,
        name: userDetails.name,
        email: userDetails.email,
        password: userDetails.password,
        days: userDetails.birthday.day || "11",
        months: userDetails.birthday.month || "9",
        years: userDetails.birthday.year || "2010",
        firstname: userDetails.firstName,
        lastname: userDetails.lastName,
        company: userDetails.company || "asdf",
        address1: userDetails.address1,
        address2: userDetails.address2 || "",
        country: userDetails.country || "India",
        state: userDetails.state,
        city: userDetails.city,
        zipcode: userDetails.zipcode,
        mobile_number: userDetails.mobileNumber,
        form_type: "update_account",
      },
      headers: {
        Referer: "https://automationexercise.com/",
      },
    });
  }
}
