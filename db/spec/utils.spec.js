const { expect } = require("chai");
const { convertTime, createRef, formatComments } = require("../utils/index");

describe("convertTime", () => {
  it("returns the created_at key from milliseconds to the date", () => {
    expect(convertTime([{ created_at: 1542284514171 }])).to.eql([
      {
        created_at: "2018-11-15T12:21:54.171Z"
      }
    ]);
  });
});

describe("createRef", () => {
  it("returns a reference object", () => {
    expect(
      createRef(
        [
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2018-11-15T12:21:54.171Z",
            votes: 100
          }
        ],
        "title",
        "article_id"
      )
    ).to.eql({ "Living in the shadow of a great man": 1 });
  });
});

describe("formatComments", () => {
  it("formats an array of comments", () => {
    expect(
      formatComments(
        [
          {
            body:
              "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            belongs_to: "Living in the shadow of a great man",
            created_by: "butter_bridge",
            votes: 14,
            created_at: 1479818163389
          }
        ],
        { "Living in the shadow of a great man": 1 }
      )
    ).to.eql([
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ]);
  });
});
