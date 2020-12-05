
exports.up = function(knex) {
  return knex.schema.createTable('students', table => {
    table.increments('id');
    table.string('email');
    table.boolean('suspended');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('students');
};
