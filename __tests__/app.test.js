const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const { getVersion } = require("jest");

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

describe("GET /api/articles/:article_id/comments", () => {
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
        test("Should return all comments for each article and check each comment for all properties", () => {
            return request(app).get("/api/articles/1/comments").expect(200)
            .then(({ body: { comments } }) => {
                expect(comments).toHaveLength(11)
                comments.forEach(comment => {
                    expect(comment).toHaveProperty("comment_id", expect.any(Number))
                    expect(comment).toHaveProperty("votes", expect.any(Number))
                    expect(comment).toHaveProperty("created_at", expect.any(String))
                    expect(comment).toHaveProperty("author", expect.any(String))
                    expect(comment).toHaveProperty("body", expect.any(String))
                    expect(comment).toHaveProperty("article_id", expect.any(Number))
                })
            })
        })
        xtest("Should return an empty array if there are no comments", () => {
            return request(app).get("/api/articles/4/comments")
            .then(({ body: { comments } }) => {
                expect(comments).toEqual([])
            })
        })
    })
    describe("Errors", () => {
        test("Should return 400: the article_id is invalid e.g. 'not-an-id'", () => {
            return request(app).get("/api/articles/invalid/comments").expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad Request")
            })
        })
        test("Should return 404: the article_id is not present in the database e.g. 9999", () => {
            return request(app).get("/api/articles/9999/comments").expect(404)
                .then(({ body: { msg } }) => {
                expect(msg).toBe("Not Found")
            })
        })
    })
})