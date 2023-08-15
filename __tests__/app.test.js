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

describe.only("GET /api/articles/:article_id/comments", () => {
    describe("Connecting to path", () => {
        test("Should return status 200", () => {
            return request(app).get("/api/articles/1/comments").expect(200)
        });
        test("Should return the correct comment data for a specific article", () => {
            return request(app).get("/api/articles/1/comments").expect(200)
                .then(({ body: { comments } }) => {
                    expect(comments[0]).toHaveProperty("comment_id", expect.any(Number))
                    expect(comments[0]).toHaveProperty("votes", expect.any(Number))
                    expect(comments[0]).toHaveProperty("created_at", "2020-11-03T21:00:00.000Z")
                    expect(comments[0]).toHaveProperty("author", expect.any(String))
                    expect(comments[0]).toHaveProperty("body", expect.any(String))
                    expect(comments[0]).toHaveProperty("article_id", expect.any(Number))
                });
        });
        test("Should return comments sorted by date in DESC order", () => {
            return request(app).get("/api/articles/1/comments").expect(200)
                .then(({ body: { comments } }) => {
                    expect(comments).toBeSortedBy("created_at", { descending: true })
            })
        })
    })
})