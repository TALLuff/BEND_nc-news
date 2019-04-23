exports.up = function(knex, Promise) {
  // console.log("creating articles table..");
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable
      .increments("article_id")
      .primary()
      .notNullable();
    articlesTable.string("title").notNullable();
    articlesTable
      .string("topic")
      .references("slug")
      .inTable("topics")
      .notNullable();
    articlesTable
      .string("author")
      .references("username")
      .inTable("users")
      .notNullable();
    articlesTable.string("body", 2000).notNullable();
    articlesTable.integer("votes").defaultTo(0);
    articlesTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  // console.log("drop the articles table...");
  return knex.schema.dropTable("articles");
};
