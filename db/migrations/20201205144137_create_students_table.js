
exports.up = function(knex) {
  return knex.schema.createTable("students", table => {
    table.increments("id").primary();
    table.string("email");
    table.boolean("suspended").defaultTo(false);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("students");
};
