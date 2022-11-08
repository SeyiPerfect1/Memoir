const request = require("supertest");
const Post = require("../../src/models/post.models");
const User = require("../../src/models/post.models");
const app = require("../../app");
const { connect } = require("./db");
const user = require("../fixtures/users");
const post = require("../fixtures/posts");

describe("posts route", () => {
  let conn;
  let token;

  beforeAll(async () => {
    conn = await connect();

    await User.create({
      email: user[0].email,
      password: user[0].password,
    });

    const loginResponse = await request(app)
      .post("/accounts/login")
      .set("content-type", "application/json")
      .send({
        email: user[0].email,
        password: user[0].password,
      });

    token = loginResponse.body.token;
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("GET /posts - should return posts", async () => {
    // create order in our db
    await Post.create(post[0]);
    await Post.create(post[1]);

    const response = await request(app)
      .get("/posts")
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1); //should return 1 cos only 1 post is published
  });

  it("GET /posts/:slug - should return a post", async () => {
    // create order in our db
    await Post.create(post[0]);
    await Post.create(post[1]);

    const response = await request(app)
      .get(
        "/posts/sunt-aut-facere-repellat-provident-occaecati-excepturi-optio-reprehenderit-6367116e679244141511f084"
      )
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body).toHaveProperty("author");
    expect(response.body).toHaveProperty("readCount", 1);
    expect(response.body).toHaveProperty("readingTime", 7);
  });

  it('POST /posts - create new post', async() => {
    const response = await request(app).post('/api/articles/create').send(post[1]).set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(201);
    expect(response.body.article.readCount).toBe(0);
    expect(response.body.message).toEqual("post created successfully");
    expect(response.body.article).toHaveProperty("title");
    expect(response.body.article).toHaveProperty("description");
    expect(response.body.article).toHaveProperty("body");
    expect(response.body.article).toHaveProperty("tags");
    expect(response.body.article).toHaveProperty("readingTime");
    expect(response.body.article).toHaveProperty("author");
    expect(response.body.article.state).toBe("state");
});

  it("PUT /posts - should update post", async () => {
    // create order in our db
    await Post.create(post[0]);
    await Post.create(post[1]);

    const body = {
      state: "published",
    };

    const response = await request(app)
      .put(
        "/posts/sunt-aut-facere-repellat-provident-occaecati-excepturi-optio-reprehenderit-6367116e679244141511f084"
      )
      .set("Authorization", `Bearer ${token}`)
      .send(body);
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("published");
    expect(response.status.message).toEqual("post updated successfully");
  });

  it("DELETE /posts - should delete post", async () => {
    // create order in our db
    await Post.create(post[0]);
    await Post.create(post[1]);

    const response = await request(app)
      .delete(
        "/posts/sunt-aut-facere-repellat-provident-occaecati-excepturi-optio-reprehenderit-6367116e679244141511f084"
      )
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.status.message).toEqual("post deleted successfully");
  });
});
