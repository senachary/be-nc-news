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

describe("POST /api/articles/:article_id/comments", () => {
    describe("Connect to path", () => {
        test("Should return 201': 'Created' when connecting to path", () => {
            const testComment = {
                author: "butter_bridge",
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            }
            return request(app).post("/api/articles/1/comments").send(testComment).expect(201)
        })
        test("Should respond with the posted comment with the comment properties", () => {
            const testComment = {
                author: "butter_bridge",
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            }
            return request(app).post("/api/articles/1/comments").send(testComment)
                .then(({ body: { post } }) => {
                    expect(post).toMatchObject({
                        author: expect.any(String),
                        body: expect.any(String),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        article_id: expect.any(Number),
                        comment_id: expect.any(Number)
                })
            })
        })
    })
    describe("Errors for POST", () => {
        test("Returns 404 if article not found", () => {
            const testComment = {
                author: "test_user",
                body: "test_body",
            }
            return request(app).post("/api/articles/5555/comments").send(testComment).expect(404)
                .then(({ body: { msg } }) => {
                expect(msg).toBe("article does not exist")
            })
        })
    })
})