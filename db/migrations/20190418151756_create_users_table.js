exports.up = function(knex, Promise) {
  // console.log("creating users table..");
  return knex.schema.createTable("users", usersTable => {
    usersTable
      .string("username")
      .primary()
      .unique()
      .notNullable();
    usersTable.string("name").notNullable();
    usersTable.string("avatar_url").notNullable();
  });
};

exports.down = function(knex, Promise) {
  // console.log("drop the users table...");
  return knex.schema.dropTable("users");
};
