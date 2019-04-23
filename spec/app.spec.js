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
    it("GET status:200, gets all the topics", () => {
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

  // describe("/users", () => {
  //   it("GET status:200, gets a user by their username", () => {
  //     return request
  //       .get("/api/:username")
  //       .expect(200)
  //       .then(({ body }) => {
  //         expect(body.user).to.equal({});
  //       });
  //   });
  // });

  // describe("/api", () => {
  //   it("GET status:200", () => {
  //     return request
  //       .get("/api")
  //       .expect(200)
  //       .then(({ body }) => {
  //         expect(body.ok).to.equal(true);
  //       });
  //   });
  // });
});
