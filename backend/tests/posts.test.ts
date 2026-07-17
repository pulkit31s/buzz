import request from "supertest";
import app from "../src/app";
import "./setup";

describe("Posts & Feed Integration Tests (/api/v1/posts)", () => {
  let accessToken: string;
  let userId: string;

  beforeEach(async () => {
    const authRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        collegeId: "POST_TEST_001",
        email: "posttester@campus.edu",
        password: "Password123!",
        username: "post_author",
        year: "2nd Year",
        branch: "ECE",
      });

    accessToken = authRes.body.data.accessToken;
    userId = authRes.body.data.user._id;
  });

  it("should create a new post with text content and poll options", async () => {
    const postPayload = {
      content: "Anyone excited for the upcoming coding hackathon?",
      tags: ["hackathon", "coding"],
      poll: {
        question: "Will you participate?",
        options: [{ text: "Yes, already registered" }, { text: "No, busy with exams" }],
      },
    };

    const res = await request(app)
      .post("/api/v1/posts")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(postPayload)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.content).toBe(postPayload.content);
    expect(res.body.data.author.username).toMatch(/Anonymous/);
    expect(res.body.data.poll.options).toHaveLength(2);
  });

  it("should retrieve paginated feed posts formatted for Next.js frontend", async () => {
    await request(app)
      .post("/api/v1/posts")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "First test post on campus feed" });

    const res = await request(app)
      .get("/api/v1/posts?page=1&limit=10")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.posts)).toBe(true);
    expect(res.body.data.posts[0]).toHaveProperty("stats");
    expect(res.body.data.posts[0]).toHaveProperty("userInteraction");
  });
});
