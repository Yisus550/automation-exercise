import UserFactory from "@/src/data/factories/user.factory";
import { test, expect } from "./setup";
import AuthController from "@/src/api/controllers/create-user.controller";
import { VALID_EMAIL } from "../e2e/login.spec";
import type { UserModel } from "@/src/data/models/user.model";

test.describe("Create User API", () => {
  test("should create a new user successfully", async ({
    request,
    csrfToken,
  }) => {
    const authController = new AuthController(request);
    const data = UserFactory.create().addFullUser().build();

    await test.step("Create account via API", async () => {
      const response = await authController.createAccount(csrfToken, data);
      const jsonResponse = await response.json();

      expect(response.ok()).toBeTruthy();
      expect(jsonResponse).toMatchObject({
        responseCode: 201,
        message: "User created!",
      });
    });
  });

  test("should fail to create a user with an existing email", async ({
    request,
    csrfToken,
  }) => {
    const authController = new AuthController(request);
    const data = UserFactory.create()
      .addFullUser()
      .withEmail(VALID_EMAIL)
      .build();

    await test.step("Attempt to create account with existing email via API", async () => {
      const response = await authController.createAccount(csrfToken, data);
      const jsonResponse = await response.json();

      expect(response.ok()).toBeTruthy();
      expect(jsonResponse).toMatchObject({
        responseCode: 400,
        message: "Email already exists!",
      });
    });
  });
});
