const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json")

afterAll(() => {
  return connection.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET /api/topics", () => {
  describe("Connecting to path", () => {
    test("Should return status 200", () => {
      return request(app).get("/api/topics").expect(200);
    });
    test("Should return the data from the path", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(data.topicData.length);
        });
    });
    test("Should return the correct data", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          body.forEach((topic) => {
            expect(topic).toHaveProperty("slug", expect.any(String));
            expect(topic).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });
});

describe("GET /api", () => {
  describe("Connecting to /api path", () => {
    test("Should return status 200", () => {
      return request(app).get("/api").expect(200);
    });
    test("Should return the data from the path", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body}) => {
          expect(body).toMatchObject({...endpoints});
        });
    });
    test("Should return the correct info for each endpoint (/api/topics)", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body["GET /api/topics"]).toMatchObject({
            "description": "serves an array of all topics",
            "queries": [],
            "exampleResponse": {
              "topics": [{ "slug": "football", "description": "Footie!" }]
            }
          });
        });
    });

    test("Should return the correct info for each endpoint (/api/articles)", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(body["GET /api/articles"]).toMatchObject({
                "description": "serves an array of all articles",
                "queries": ["author", "topic", "sort_by", "order"],
                "exampleResponse": {
                  "articles": [
                    {
                      "title": "Seafood substitutions are increasing",
                      "topic": "cooking",
                      "author": "weegembump",
                      "body": "Text from the article..",
                      "created_at": "2018-05-30T15:59:13.341Z",
                      "votes": 0,
                      "comment_count": 6
                    }
                  ]
                }
              });
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


