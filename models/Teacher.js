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
                  from: "teachers_students.teacher_id",
                  to: "teachers_students.student_id"
                },
                to: "students.id"
              }
          }
      }
  }
}

module.exports = Teacher;