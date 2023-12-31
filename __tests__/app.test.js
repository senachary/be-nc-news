const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const { getVersion } = require("jest");

const { updateArticle } = require("../models/articles-model");

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


describe("GET /api/articles/:article_id", () => {
    describe("Connecting to path", () => {
        test("Should return status 200", () => {
            return request(app).get("/api/articles/1").expect(200)
        });
        test("Should return the correct data for specific article (1)", () => {
            return request(app).get("/api/articles/1").expect(200)
                .then(({ body: { article } }) => {
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

    })
})


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

})

describe("Errors", () => {
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


describe("PATCH /api/articles/:article_id", () => {
    describe("Connecting to path", () => {
        test("Should return status 200 ", () => {
            return request(app).patch("/api/articles/1").send({ inc_votes : 1 }).expect(200)
        })
        test("Should return the updated article if patch successful: increase votes", () => {
            const testUpdate = {
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 101,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            }
            return request(app).patch("/api/articles/1").send({ inc_votes: 1 })
                .then(({ body: { updatedArticle } }) => {
                expect(updatedArticle).toMatchObject(testUpdate)
            })
        })
        test("Should return the updated article if patch successful: decrease votes", () => {
            const testUpdate = {
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 99,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            }
            return request(app).patch("/api/articles/1").send({ inc_votes: -1 })
                .then(({ body: { updatedArticle } }) => {
                expect(updatedArticle).toMatchObject(testUpdate)
            })
        })
    })
    describe("PATCH Errors", () => {
        test("Should return status 400 for invalid request ", () => {
            return request(app).patch("/api/articles/invalid").send({ inc_votes: 1 }).expect(400)
                .then(({ body: {msg} }) => {
                expect(msg).toBe("Bad Request")
            })
        })
        test("Should return status 400 for valid request with incorrect property", () => {
            return request(app).patch("/api/articles/invalid").send({ invalid: 1 }).expect(400)
                .then(({ body: {msg} }) => {
                expect(msg).toBe("Bad Request")
            })
        })
        test("Should return status 404 if valid request sent but article does not exist", () => {
            return request(app).patch("/api/articles/555").send({ inc_votes: 1 }).expect(404)
                .then(({ body: {msg} }) => {
                expect(msg).toBe("article does not exist")
            })
        })
    })
})


describe("DELETE /api/comments/:comment_id", () => {
    describe("Connecting to path", () => {
        test("Should return status 204 for successful deletion", () => {
            return request(app).delete("/api/comments/1").expect(204)
        })
        test("Should return no content for successful deletion", () => {
            return request(app).delete("/api/comments/1")
                .then(({ body }) => {
                    expect(body).toEqual({})
            })
        })
    })
    describe("DELETE Errors", () => {
        test("Should return a 404 if the comment is not found", () => {
            return request(app).delete("/api/comments/9999").expect(404)
                .then(({ body: {msg} }) => {
                    expect(msg).toBe("comment does not exist")
            })
        })
        test("Should return 400 for invalid request", () => {
            return request(app).delete("/api/comments/invalid_request").expect(400)
                .then(({ body: {msg} }) => {
                    expect(msg).toBe("Bad Request")
            })
        })
    })
})



