import type { APIRequestContext } from "@playwright/test";

export default class GetUserController {
  private endpoint = "/api/getUserDetailByEmail";

  constructor(private request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Obtiene los detalles de un usuario a partir de su email
   * @param email Correo electrónico del usuario a buscar
   */
  async getUserDetailByEmail(email: string) {
    return await this.request.get(this.endpoint, {
      params: {
        email,
      },
    });
  }
}
