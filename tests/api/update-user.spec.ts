import UserFactory from "@/src/data/factories/user.factory";
import { test, expect } from "./setup";
import AuthController from "@/src/api/controllers/create-user.controller";
import UpdateUserController from "@/src/api/controllers/update-user.controller";
import GetUserController from "@/src/api/controllers/get-user.controller";
import type { UserModel } from "@/src/data/models/user.model";

test.describe("Update User API", () => {
  test("should update an existing user successfully", async ({
    request,
    csrfToken,
  }, testInfo) => {
    testInfo.setTimeout(45000);
    
    const authController = new AuthController(request);
    const updateController = new UpdateUserController(request);
    const getUserController = new GetUserController(request);

    const uniqueEmail = `update-user-${Date.now()}@test.com`;
    const user = UserFactory.create()
      .addFullUser()
      .withEmail(uniqueEmail)
      .build();

    await test.step("Create target user via API", async () => {
      const response = await authController.createAccount(csrfToken, user);
      const jsonResponse = await response.json();

      expect(response.ok()).toBeTruthy();
      expect(jsonResponse).toMatchObject({
        responseCode: 201,
        message: "User created!",
      });
    });

    const updatedUser: UserModel = {
      ...user,
      name: "Updated User",
      firstName: "UpdatedFirst",
      address1: "Updated Address 123",
      mobileNumber: "9998887777",
    };

    await test.step("Update existing user via API", async () => {
      const response = await updateController.updateAccount(
        csrfToken,
        updatedUser
      );
      const jsonResponse = await response.json();

      expect(response.ok()).toBeTruthy();
      expect(jsonResponse).toMatchObject({
        responseCode: 200,
        message: "User updated!",
      });
    });

    await test.step("Verify the user details were persisted", async () => {
      const response = await getUserController.getUserDetailByEmail(uniqueEmail);
      const jsonResponse = await response.json();

      expect(response.ok()).toBeTruthy();
      expect(jsonResponse.responseCode).toBe(200);
      expect(jsonResponse.user).toMatchObject({
        name: updatedUser.name,
        first_name: updatedUser.firstName,
        address1: updatedUser.address1,
      });
    });
  });

  test("should fail to update a non-existent user", async ({
    request,
    csrfToken,
  }) => {
    const updateController = new UpdateUserController(request);
    const data = UserFactory.create()
      .addFullUser()
      .withEmail(`nonexistent-${Date.now()}@test.com`)
      .build();

    await test.step("Attempt to update a user that does not exist", async () => {
      const response = await updateController.updateAccount(csrfToken, data);
      const jsonResponse = await response.json();

      expect(response.ok()).toBeTruthy();
      expect(jsonResponse).toMatchObject({
        responseCode: 404,
        message: "Account not found!",
      });
    });
  });

  test("should fail to update when the email parameter is missing", async ({
    request,
    csrfToken,
  }) => {
    const data = UserFactory.create().addFullUser().build();

    await test.step("Send update request without email", async () => {
      const response = await request.put("/api/updateAccount", {
        form: {
          csrfmiddlewaretoken: csrfToken,
          name: data.name,
          password: data.password,
          days: data.birthday.day || "11",
          months: data.birthday.month || "9",
          years: data.birthday.year || "2010",
          firstname: data.firstName,
          lastname: data.lastName,
          company: data.company || "asdf",
          address1: data.address1,
          address2: data.address2 || "",
          country: data.country || "India",
          state: data.state,
          city: data.city,
          zipcode: data.zipcode,
          mobile_number: data.mobileNumber,
          form_type: "update_account",
        },
        headers: {
          Referer: "https://automationexercise.com/",
        },
      });
      const jsonResponse = await response.json();

      expect(response.ok()).toBeTruthy();
      expect(jsonResponse).toMatchObject({
        responseCode: 400,
        message: "Bad request, email parameter is missing in PUT request.",
      });
    });
  });

  test("should fail to update when the password parameter is missing", async ({
    request,
    csrfToken,
  }) => {
    const data = UserFactory.create().addFullUser().build();

    await test.step("Send update request without password", async () => {
      const response = await request.put("/api/updateAccount", {
        form: {
          csrfmiddlewaretoken: csrfToken,
          name: data.name,
          email: data.email,
          days: data.birthday.day || "11",
          months: data.birthday.month || "9",
          years: data.birthday.year || "2010",
          firstname: data.firstName,
          lastname: data.lastName,
          company: data.company || "asdf",
          address1: data.address1,
          address2: data.address2 || "",
          country: data.country || "India",
          state: data.state,
          city: data.city,
          zipcode: data.zipcode,
          mobile_number: data.mobileNumber,
          form_type: "update_account",
        },
        headers: {
          Referer: "https://automationexercise.com/",
        },
      });
      const jsonResponse = await response.json();

      expect(response.ok()).toBeTruthy();
      expect(jsonResponse).toMatchObject({
        responseCode: 400,
        message: "Bad request, password parameter is missing in PUT request.",
      });
    });
  });
});
