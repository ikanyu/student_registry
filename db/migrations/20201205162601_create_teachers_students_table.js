
exports.up = function(knex) {
  return knex.schema.createTable("teachers_students", table => {
    table.integer("teacher_id");
    table.integer("student_id");
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("teachers_students");
};
