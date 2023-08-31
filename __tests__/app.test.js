const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
    return connection.end()
});

beforeEach(() => {
    return seed(data)
})

describe("GET api/topics", () => {
    describe("Connecting to path", () => {
        test("Should return status 200", () => {
            return request(app).get("/api/topics").expect(200)
        });
        test("Should return the data from the path", () => {
            return request(app).get("/api/topics").expect(200)
                .then(({ body }) => {
                    expect(body.length).toBe(data.topicData.length)
                });
        });
        test("Should return the correct data", () => {
            return request(app).get("/api/topics").expect(200)
                .then(({ body }) => {
                    body.forEach((topic) => {
                        expect(topic).toHaveProperty("slug", expect.any(String))
                        expect(topic).toHaveProperty("description", expect.any(String))
                    });
                });
        });
    });
});

describe("GET /api/articles/:article_id", () => (
    describe("Connecting to path", () => {
        test("Should return status 200", () => {
            return request(app).get("/api/articles/1").expect(200)
        });
        test("Should return the correct data for specific article (1)", () => {
            return request(app).get("/api/articles/1").expect(200)
                .then(({ body: {article} }) => {
                    expect(article).toMatchObject({
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: "2020-07-09T20:11:00.000Z",
                        votes: 100,
                        article_img_url:
                          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                      })
                });
        });
        test("Should return a 404 if article ID does not exist", () => {
            return request(app).get("/api/articles/27").expect(404)
                .then(({ body: { msg } }) => {
                expect(msg).toBe("article does not exist")
            })
        })
        test("Should return a bad request for non-article_id", () => {
            return request(app).get("/api/articles/HELLO").expect(400)
                .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad Request")
            })
        })
    })
));

describe("GET /api/users", () => {
    describe("Connecting to path", () => {
        test("Should return status 200", () => {
            return request(app).get("/api/users").expect(200)
        });
        test("Should return the correct data", () => {
            return request(app).get("/api/users")
                .then(({ body: { users } }) => {
                    users.forEach((user) => {
                        expect(user).toHaveProperty("username", expect.any(String))
                        expect(user).toHaveProperty("name", expect.any(String))
                        expect(user).toHaveProperty("avatar_url", expect.any(String))
                    });
                });
        });
        test("Should return the correct data", () => {
            return request(app).get("/api/users")
                .then(({ body: { users } }) => {
                    expect(users.length).toBe(4)
                });
        });
    });
})