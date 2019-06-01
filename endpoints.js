exports.endpoints = {
  "GET /api": {
    description:
      "Responds with a JSON describing all available endpoints on your API"
  },
  "GET /api/topics": {
    description: "Responds with an array of topic objects"
  },
  "GET /api/users/:username": {
    description: "Responds with a user object matching the given username"
  },
  "GET /api/articles/:article_id": {
    description: "Responds with an article object with that id"
  },
  "PATCH /api/articles/:article_id": {
    description:
      "Takes an object with inc_votes and updates an articles votes, responds with the updated article",
    bodyExample: "{ inc_votes: newVote }"
  },
  "POST /api/articles/:article_id/comments": {
    description:
      "Takes an object with username,body, and posts a new comment, responds with the posted comment",
    bodyExample:
      "{username: 'jessjelly', body: 'Coding in the morning, coding in the evening!' }"
  },
  "GET /api/articles/:article_id/comments": {
    description:
      "Responds with an array of comments for the given article_id, also accepts queries sort_by and order",
    queriesAccepted: "sort_by, order"
  },
  "GET /api/articles": {
    description:
      "Responds with an articles array of article objects, also accepts queries sort_by, order, author, topic",
    queriesAccepted: "sort_by, order, author, topic"
  },
  "PATCH /api/comments/:comment_id": {
    description:
      "Takes an object with inc_votes and updates a comments votes, responds with the updated comment",
    bodyExample: "{ inc_votes: newVote }"
  },
  "DELETE /api/comments/:comment_id": {
    description: "Deletes the comment with that id and responds with status 204"
  },
  "POST /api/articles": {
    description:
      "Takes an object with author,topic,title,body, and posts a new article, responds with the posted article",
    bodyExample:
      "{author: 'jessjelly', topic: 'coding', title: 'Coding is fun xD', body: 'Coding in the morning, coding in the evening!' }"
  },
  "DELETE /api/articles/:article_id": {
    description: "Deletes the article with that id and responds with status 204"
  }
};
