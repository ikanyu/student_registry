
exports.up = function(knex) {
  return knex.schema.createTable('teachers', table => {
    table.increments('id')
    table.string('email')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('teachers')
};