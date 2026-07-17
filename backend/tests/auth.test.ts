import request from "supertest";
import app from "../src/app";
import "./setup";

describe("Authentication Integration Tests (POST /api/v1/auth)", () => {
  const mockUserPayload = {
    collegeId: "TEST_2026_001",
    email: "testuser@campus.edu",
    password: "SecurePassword123!",
    username: "test_student",
    year: "3rd Year",
    branch: "CSE",
  };

  it("should successfully register a new student and assign an anonymous identity", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(mockUserPayload)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toHaveProperty("anonymousName");
    expect(res.body.data.user).toHaveProperty("anonymousAvatar");
    expect(res.body.data.user.password).toBeUndefined(); // Never leak password
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it("should fail registration if email or college ID already exists", async () => {
    await request(app).post("/api/v1/auth/register").send(mockUserPayload);

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(mockUserPayload)
      .expect(409);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists|already taken|already registered/i);
  });

  it("should log in successfully with correct credentials and return tokens", async () => {
    await request(app).post("/api/v1/auth/register").send(mockUserPayload);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: mockUserPayload.email,
        password: mockUserPayload.password,
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe(mockUserPayload.email);
  });
});
