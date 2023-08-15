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

describe("GET api/articles", () => {
    describe("Connecting to path", () => {
        test("Should return status 200", () => {
            return request(app).get("/api/articles").expect(200)
        });
        test("Should return the all the articles with correct properties", () => {
            return request(app).get("/api/articles").expect(200)
                .then(({ body: {articles} }) => {
                    expect(articles.length).toBe(13)
                    articles.forEach((article) => {
                        expect(article).toHaveProperty("author", expect.any(String))
                        expect(article).toHaveProperty("title", expect.any(String))
                        expect(article).toHaveProperty("article_id", expect.any(Number))
                        expect(article).toHaveProperty("topic", expect.any(String))
                        expect(article).toHaveProperty("created_at", expect.any(String))
                        expect(article).toHaveProperty("votes", expect.any(Number))
                        expect(article).toHaveProperty("article_img_url", expect.any(String))
                        
                    });
                });
        });
        test("Should include the comment_count", () => {
            return request(app).get("/api/articles").expect(200)
                .then(({ body: { articles } }) => {
                    articles.forEach((article) => {
                    expect(article).toHaveProperty("comment_count", expect.any(Number))
                })
            })
        })
        test("Should return articles sorted by date in DESC order", () => {
            return request(app).get("/api/articles").expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("created_at", { descending: true })
            })
        })
    });
})