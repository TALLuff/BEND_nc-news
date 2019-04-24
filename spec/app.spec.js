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
    it("PATCH status:200, updates an articles votes by an object with key inc_votes and a value of a number", () => {
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
});
