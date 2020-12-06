
exports.up = function(knex) {
  return knex.schema.createTable("student_teacher", table => {
    table.integer("teacher_id");
    table.integer("student_id");
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("student_teacher");
};
