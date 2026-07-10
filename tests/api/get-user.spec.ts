import { test, expect } from "./setup";
import GetUserController from "@/src/api/controllers/get-user.controller";
import { VALID_EMAIL } from "../e2e/login.spec";

test.describe("Get User API", () => {
  test("should retrieve an existing user by email", async ({ request }) => {
    const getUserController = new GetUserController(request);

    await test.step("Get user detail by email via API", async () => {
      const response = await getUserController.getUserDetailByEmail(VALID_EMAIL);
      const jsonResponse = await response.json();

      expect(response.ok()).toBeTruthy();
      expect(jsonResponse).toMatchObject({
        responseCode: 200,
      });
      expect(jsonResponse.user?.email).toBe(VALID_EMAIL);
    });
  });

  test("should return not found for a non-existent email", async ({ request }) => {
    const getUserController = new GetUserController(request);
    const nonExistentEmail = `nonexistent-${Date.now()}@correo.com`;

    await test.step("Get user detail for non-existent email via API", async () => {
      const response = await getUserController.getUserDetailByEmail(nonExistentEmail);
      const jsonResponse = await response.json();

      expect(jsonResponse).toMatchObject({
        responseCode: 404,
        message: "Account not found with this email, try another email!",
      });
    });
  });
});
