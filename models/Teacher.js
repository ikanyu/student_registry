const { Model } = require("objection");
const knex = require("../db/knex")

Model.knex(knex)

class Teacher extends Model {
  static tableName() {
    return "teachers";
  }

  static get relationMappings() {
      const Student = require("./Student");

      return {
          students: {
              relation: Model.ManyToManyRelation,
              modelClass: Student,
              join: {
                from: "teachers.id",
                through: {
                  from: "student_teacher.teacher_id",
                  to: "student_teacher.student_id"
                },
                to: "students.id"
              }
          }
      }
  }
}

module.exports = Teacher;