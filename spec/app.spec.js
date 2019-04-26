process.env.NODE_ENV = "test";

const { expect } = require("chai");
const supertest = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

const request = supertest(app);

describe("/", () => {
  after(() => connection.destroy());

  beforeEach(() => connection.seed.run());

  describe("/api", () => {
    it("GET status:200", () => {
      return request
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
  });

  describe("/topics", () => {
    it("GET status:200, gets an array of topic objects", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics[0]).to.eql({
            description: "The man, the Mitch, the legend",
            slug: "mitch"
          });
        });
    });
  });

  describe("/users", () => {
    it("GET status:200, gets a user by their username", () => {
      return request
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).to.eql({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          });
        });
    });
  });

  describe("/articles", () => {
    it("GET status:200, gets an articles array of article objects", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an("array");
          expect(body.articles.length).to.equal(12);
          expect(body.articles[0]).to.eql({
            article_id: 1,
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z",
            title: "Living in the shadow of a great man",
            topic: "mitch",
            votes: 100,
            comment_count: "13"
          });
        });
    });
    it("GET status:200, uses the author query and filters the articles by the username value", () => {
      return request
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then(({ body }) => {
          expect(
            body.articles.every(article => {
              return article.author === "icellusedkars";
            })
          ).to.equal(true);
        });
    });
    it("GET status:200, uses the topic query and filters the articles by the topic value", () => {
      return request
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(
            body.articles.every(article => {
              return article.topic === "cats";
            })
          ).to.equal(true);
        });
    });
    it("GET status:200, uses the sort_by query and sorts the articles by the column, defaults to created_at", () => {
      return request
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal("Z");
          expect(body.articles[11].title).to.equal("A");
        });
    });
    it("GET status:200, uses the order query and decides the articles order of sort, defaults to descending", () => {
      return request
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].article_id).to.eql(12);
        });
    });
  });

  describe("/articles/:article_id", () => {
    it("GET status:200, gets an article object by the article_id", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.be.an("object");
          expect(body.article).to.eql({
            article_id: 1,
            author: "butter_bridge",
            body: "I find this existence challenging",
            comment_count: "13",
            created_at: "2018-11-15T12:21:54.171Z",
            title: "Living in the shadow of a great man",
            topic: "mitch",
            votes: 100
          });
        });
    });
    it("PATCH status:200, updates an articles votes by an object with key inc_votes and a value of a number, returns the updated article", () => {
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: 5 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.eql({
            article_id: 1,
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2018-11-15T12:21:54.171Z",
            title: "Living in the shadow of a great man",
            topic: "mitch",
            votes: 105
          });
        });
    });
  });

  describe("/api/articles/:article_id/comments", () => {
    it("GET status:200, gets an articles comments in an array by the article_id", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.an("array");
          expect(body.comments[0]).to.eql({
            author: "butter_bridge",
            body:
              "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            comment_id: 2,
            created_at: "2016-11-22T12:36:03.389Z",
            votes: 14
          });
        });
    });
    it("GET status:200, uses the sort_by query which sorts the comments by any valid column, defaults to created_at", () => {
      return request
        .get("/api/articles/1/comments?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.an("array");
          expect(body.comments[0]).to.eql({
            author: "icellusedkars",
            body:
              "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
            comment_id: 3,
            created_at: "2015-11-23T12:36:03.389Z",
            votes: 100
          });
        });
    });
    it("GET status:200, uses the order query which orders the comments by ascending or descending, defaults to desc", () => {
      return request
        .get("/api/articles/1/comments?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.an("array");
          expect(body.comments[0]).to.eql({
            author: "butter_bridge",
            body: "This morning, I showered for nine minutes.",
            comment_id: 18,
            created_at: "2000-11-26T12:36:03.389Z",
            votes: 16
          });
        });
    });
    it("POST status:201, posts a new comment, taking an object with the properties username and body, responds with the posted comment", () => {
      return request
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "I woke up and solved 20 katas whilst brushing my teeth"
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).to.be.an("object");
          expect(body.comment).to.eql({
            article_id: 1,
            author: "butter_bridge",
            body: "I woke up and solved 20 katas whilst brushing my teeth",
            comment_id: 19,
            created_at: body.comment.created_at,
            votes: 0
          });
        });
    });
  });

  describe("/api/comments/:comment_id", () => {
    it("PATCH status:200, updates a comments votes by an object with key inc_votes and a value of a number, returns the updated comment", () => {
      return request
        .patch("/api/comments/2")
        .send({ inc_votes: 5 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).to.eql({
            article_id: 1,
            author: "butter_bridge",
            body:
              "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            comment_id: 2,
            created_at: "2016-11-22T12:36:03.389Z",
            votes: 19
          });
        });
    });
    it("DELETE status:204, deletes a comment by the given comment_id, responds with status 204 and no content", () => {
      return request.delete("/api/comments/2").expect(204);
    });
  });

  describe("/errors", () => {
    describe("GET /api", () => {
      it("PATCH/POST/DELETE status: 405, if the request type is not get then that method is not allowed on /api", () => {
        return request
          .post("/api")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("GET status: 404, if route is not found on the /api", () => {
        return request
          .get("/api/abc")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Route Not Found");
          });
      });
    });

    describe("GET /api/topics", () => {
      it("PATCH/POST/DELETE status: 405, if the request type is not get then that method is not allowed on /api/topics", () => {
        return request
          .post("/api/topics")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("GET status: 404, if route is not found on the /api/topics", () => {
        return request
          .get("/api/topics/abc")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Route Not Found");
          });
      });
    });

    describe("GET /api/users", () => {
      it("PATCH/POST/DELETE status: 405, if the request type is not get then that method is not allowed on /api/users", () => {
        return request
          .post("/api/users/butter_bridge")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("GET status: 404, if the username is not contained in the database /api/users", () => {
        return request
          .get("/api/users/asdfghjkl")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Username is not valid");
          });
      });
    });

    describe("GET /api/articles", () => {
      it("PATCH/POST/DELETE status: 405, if the request type is not get then that method is not allowed on /api/articles", () => {
        return request
          .patch("/api/articles")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      describe("QUERIES", () => {
        describe("sort_by", () => {
          it("GET status:200, if the sort by query is used with an invalid column it will default to created_at", () => {
            return request
              .get("/api/articles?sort_by=random")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.an("array");
                expect(body.articles.length).to.equal(12);
                expect(body.articles[0]).to.eql({
                  article_id: 1,
                  author: "butter_bridge",
                  created_at: "2018-11-15T12:21:54.171Z",
                  title: "Living in the shadow of a great man",
                  topic: "mitch",
                  votes: 100,
                  comment_count: "13"
                });
              });
          });
        });
        describe("order", () => {
          it("GET status:200, uses the order query if an invalid order is given then it will default to descending", () => {
            return request
              .get("/api/articles?order=circular")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.an("array");
                expect(body.articles.length).to.equal(12);
                expect(body.articles[0]).to.eql({
                  article_id: 1,
                  author: "butter_bridge",
                  created_at: "2018-11-15T12:21:54.171Z",
                  title: "Living in the shadow of a great man",
                  topic: "mitch",
                  votes: 100,
                  comment_count: "13"
                });
              });
          });
        });
        describe("author/topic", () => {
          it("GET status:404, uses the author and topics queries and returns not found respectively if given an author/topic not in the database", () => {
            return request
              .get("/api/articles?author=iamcool")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("User not found");
              });
          });
        });
      });
    });

    describe("GET /api/articles/:article_id", () => {
      it("POST/DELETE status: 405, if the request type is not get then that method is not allowed on /api/articles/:article_id", () => {
        return request
          .delete("/api/articles/5")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("GET status: 400, if the paramter of article_id is not a number /api/articles/:article_id", () => {
        return request
          .get("/api/articles/hehexd")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad article_id");
          });
      });
      it("GET status: 404, if the paramter of article_id is not an existing article /api/articles/:article_id", () => {
        return request
          .get("/api/articles/12345")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article does not exist");
          });
      });
    });

    describe("PATCH /api/articles/:article_id", () => {
      it("PATCH status: 400, if the paramter of article_id is not a number /api/articles/:article_id", () => {
        return request
          .patch("/api/articles/hehexd")
          .send({ inc_votes: 5 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad article_id");
          });
      });
      it("PATCH status: 404, if the paramter of article_id is not an existing article /api/articles/:article_id", () => {
        return request
          .patch("/api/articles/12345")
          .send({ inc_votes: 5 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article does not exist");
          });
      });
      it("PATCH status: 400, if the request does not have a body sent with it /api/articles/:article_id", () => {
        return request
          .patch("/api/articles/1")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request body, nothing sent");
          });
      });
      it("PATCH status: 400, if the request body has more than just inc_votes as parameters or no inc_votes /api/articles/:article_id", () => {
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: 5, imCool: true })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "Bad request body, invalid properties given"
            );
          });
      });
      it("PATCH status: 400, if the request body has a parameter of inc_votes with a parameter that is not a number /api/articles/:article_id", () => {
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: "bigNumber" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "Bad request body, inc_votes not integer value"
            );
          });
      });
    });

    describe("GET /api/articles/:article_id/comments", () => {
      it("PATCH/DELETE status: 405, if the request type is not get then that method is not allowed on /api/articles/:article_id", () => {
        return request
          .delete("/api/articles/5")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("GET status: 400, if the paramter of article_id is not a number /api/articles/:article_id", () => {
        return request
          .get("/api/articles/hehexd/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad article_id");
          });
      });
      it("GET status: 404, if the paramter of article_id is not an existing article /api/articles/:article_id", () => {
        return request
          .get("/api/articles/12345/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article does not exist");
          });
      });
      describe("QUERIES", () => {
        describe("sort_by", () => {
          it("GET status:200, if the sort by query is used with an invalid column it will default to created_at", () => {
            return request
              .get("/api/articles/1/comments?sort_by=random")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.an("array");
                expect(body.comments.length).to.equal(13);
                expect(body.comments[0]).to.eql({
                  comment_id: 2,
                  votes: 14,
                  created_at: "2016-11-22T12:36:03.389Z",
                  author: "butter_bridge",
                  body:
                    "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
                });
              });
          });
        });
        describe("order", () => {
          it("GET status:200, uses the order query if an invalid order is given then it will default to descending", () => {
            return request
              .get("/api/articles/2/comments?order=circular")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.an("array");
                expect(body.comments.length).to.equal(0);
                expect(body.comments[0]).to.eql(undefined);
              });
          });
        });
      });
    });

    describe("POST /api/articles/:article_id/comments", () => {
      it("POST status: 400, if the paramter of article_id is not a number /api/articles/:article_id/comments", () => {
        return request
          .post("/api/articles/hehexd/comments")
          .send({
            username: "butter_bridge",
            body: "I woke up and solved 20 katas whilst brushing my teeth"
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad article_id");
          });
      });
      it("POST status: 404, if the paramter of article_id is not an existing article /api/articles/:article_id/comments", () => {
        return request
          .post("/api/articles/12345/comments")
          .send({
            username: "butter_bridge",
            body: "I woke up and solved 20 katas whilst brushing my teeth"
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Not found");
          });
      });
      it("POST status: 400, if the request does not have a body sent with it /api/articles/:article_id/comments", () => {
        return request
          .post("/api/articles/1/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request body, nothing sent");
          });
      });
      it("POST status: 400, if the request body does not have just the parameters username and body /api/articles/:article_id/comments", () => {
        return request
          .post("/api/articles/1/comments")
          .send({
            username: "butter_bridge",
            body: "I woke up and solved 20 katas whilst brushing my teeth",
            hairColour: "Golden"
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "Bad request body, invalid properties given"
            );
          });
      });
      it("POST status: 400, if the request body has parameters of username and body but username and/or body is not a string /api/articles/:article_id/comments", () => {
        return request
          .post("/api/articles/1/comments")
          .send({
            username: "butter_bridge",
            body: null
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "Bad request body, username and body must be strings"
            );
          });
      });
    });

    describe("PATCH /api/comments/:comment_id", () => {
      it("GET/POST status: 405, if the request type is not get then that method is not allowed on /api/comments/:comment_id", () => {
        return request
          .get("/api/comments/1")
          .send({ inc_votes: 5 })
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("PATCH status: 400, if the paramter of comment_id is not a number /api/comments/:comment_id", () => {
        return request
          .patch("/api/comments/firstComment")
          .send({ inc_votes: 5 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad comment_id");
          });
      });
      it("PATCH status: 404, if the paramter of comment_id is not an existing comment /api/comments/:comment_id", () => {
        return request
          .patch("/api/comments/1001")
          .send({ inc_votes: 5 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Comment does not exist");
          });
      });
      it("PATCH status: 400, if the request does not have a body sent with it /api/comments/:comment_id", () => {
        return request
          .patch("/api/comments/1")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request body, nothing sent");
          });
      });
      it("PATCH status: 400, if the request body has a parameter of inc_votes with a parameter that is not a number /api/comments/:comment_id", () => {
        return request
          .patch("/api/comments/1")
          .send({ inc_votes: "bigNumber" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "Bad request body, inc_votes not integer value"
            );
          });
      });
      it("PATCH status: 400, if the request body has more than just inc_votes as parameters /api/comments/:comment_id", () => {
        return request
          .patch("/api/comments/1")
          .send({ inc_votes: 5, imCool: true })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "Bad request body, invalid properties given"
            );
          });
      });
    });

    describe("DELETE /api/comments/:comment_id", () => {
      it("DELETE status: 400, if the paramter of comment_id is not a number /api/comments/:comment_id", () => {
        return request
          .delete("/api/comments/firstComment")
          .send({ inc_votes: 5 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad comment_id");
          });
      });
      it("DELETE status: 404, if the paramter of comment_id is not an existing article /api/comments/:comment_id", () => {
        return request
          .delete("/api/comments/1001")
          .send({ inc_votes: 5 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Comment does not exist");
          });
      });
    });
  });
});
