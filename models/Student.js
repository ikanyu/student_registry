const { Model } = require("objection");
const knex = require("../db/knex");

Model.knex(knex);

class Student extends Model {
  static get tableName() {
    return "students";
  }

  static get relationMappings() {
      const Teacher = require("./Teacher");

      return {
          teachers: {
              relation: Model.ManyToManyRelation,
              modelClass: Teacher,
              join: {
                from: "students.id",
                through: {
                  from: "student_teacher.student_id",
                  to: "student_teacher.teacher_id"
                },
                to: "teachers.id"
              }
          }
      }
  }
}

module.exports = Student;