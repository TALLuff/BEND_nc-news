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
            comment_count: "1"
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
            comment_count: "1",
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
});

describe("/errors", () => {
  after(() => connection.destroy());

  beforeEach(() => connection.seed.run());

  describe("", () => {});
});
