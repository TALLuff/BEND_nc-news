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
          expect(body.articles[0]).to.eql({
            article_id: 1,
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2018-11-15T12:21:54.171Z",
            title: "Living in the shadow of a great man",
            topic: "mitch",
            votes: 100
          });
        });
    });
    it("GET status:200, uses the author query and filters the articles by the username value", () => {
      return request
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.eql({
            article_id: 2,
            author: "icellusedkars",
            body:
              "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: "2014-11-16T12:21:54.171Z",
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            votes: 0
          });
        });
    });
    it("GET status:200, uses the topic query and filters the articles by the topic value", () => {
      return request
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.eql({
            article_id: 5,
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: "2002-11-19T12:21:54.171Z",
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            votes: 0
          });
        });
    });
    it("GET status:200, uses the sort_by query and sorts the articles by the column, defaults to created_at", () => {
      return request
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.eql({
            article_id: 7,
            author: "icellusedkars",
            body: "I was hungry.",
            created_at: "1994-11-21T12:21:54.171Z",
            title: "Z",
            topic: "mitch",
            votes: 0
          });
        });
    });
    it("GET status:200, uses the order query and decides the articles order of sort, defaults to descending", () => {
      return request
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.eql({
            article_id: 12,
            author: "butter_bridge",
            body: "Have you seen the size of that thing?",
            created_at: "1974-11-26T12:21:54.171Z",
            title: "Moustache",
            topic: "mitch",
            votes: 0
          });
        });
    });
  });
});
