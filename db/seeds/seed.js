const {
  topicsData,
  articlesData,
  usersData,
  commentsData
} = require("../data");
const { convertTime, createRef, formatComments } = require("../utils/index");

exports.seed = (knex, Promise) => {
  console.log("Seeding...");
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex("topics")
        .insert(topicsData)
        .returning("*");
    })
    .then(() => {
      return knex("users")
        .insert(usersData)
        .returning("*");
    })
    .then(() => {
      const datedArticles = convertTime(articlesData);
      return knex("articles")
        .insert(datedArticles)
        .returning("*");
    })
    .then(articles => {
      const articleRef = createRef(articles, "title", "article_id");
      const formattedComments = formatComments(commentsData, articleRef);
      const datedComments = convertTime(formattedComments);
      return knex("comments")
        .insert(datedComments)
        .returning("*");
    });
};
