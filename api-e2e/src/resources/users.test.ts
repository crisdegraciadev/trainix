import request from "supertest";
import { API_BASE_URL } from "../utils";

describe("users", () => {
  it("should create a user", async () => {
    const newUser = {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      password: "securepassword123",
      confirmPassword: "securepassword123",
    };

    const res = await request(API_BASE_URL).post("/api/v1/users").send(newUser);

    expect(res.status).toBe(201); // Assuming 201 Created status code is returned
  });
});
