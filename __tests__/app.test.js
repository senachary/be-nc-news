const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

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
        .then(({ body }) => {
          expect(body["GET /api"]).toMatchObject({
            description:
              "serves up a json representation of all the available endpoints of the api",
          });
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
