exports.up = function(knex, Promise) {
  // console.log("creating topics table..");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable.string("description").notNullable();
    topicsTable
      .string("slug")
      .primary()
      .notNullable();
  });
};

exports.down = function(knex, Promise) {
  // console.log("drop the topics table...");
  return knex.schema.dropTable("topics");
};
