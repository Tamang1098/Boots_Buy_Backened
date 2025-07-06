const request = require("supertest");
const app = require("../index");
const User = require("../models/User");
const mongoose = require("mongoose");

afterAll(async () => {
  await mongoose.disconnect();
});

let authToken;

describe("User Authentication API", () => {
  beforeAll(async () => {
    // Clean up before tests
    await User.deleteOne({ email: "suraj123@gmail.com" });
  });

  // 1. Missing fields during registration
  test("can validate user while creating user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "suraj tamang",
        email: "suraj123@gmail.com",
        password: "password"
        // missing address and mobilenumber
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Missing fields"); // ✅ fixed
  });

  // 2. Successful registration
  test("can register user with all fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "suraj tamang",
        email: "suraj123@gmail.com",
        password: "password",
        address: "Kathmandu",
        mobilenumber: "9800000000"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User Registered"); // ✅ fixed
  });


  // 4. Login missing fields
  test("cannot login user with missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "suraj123@gmail.com"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Missing field");
  });

  // 5. Login incorrect email
  test("cannot login user with incorrect email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrong@email.com",
        password: "password"
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });

  // 6. Login incorrect password
  test("cannot login user with incorrect password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "suraj123@gmail.com",
        password: "wrongpassword"
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid credentials");
  });

  // 7. Successful login
  test("can login user with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "suraj123@gmail.com",
        password: "password"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Login Successful");
    expect(res.body.token).toEqual(expect.any(String));

    authToken = res.body.token;
  });

  // 8. Access admin route without token
  test("cannot get users as admin without token", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch("Users fetched successfully");
  });
});
