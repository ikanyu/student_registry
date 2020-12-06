const express = require("express");
const router = express.Router()
var lodash = require('lodash');

const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

router.get("/commonstudents", async (req, res) => {
  let teachers;
  let students;
  let teachersEmail = req.query.teacher;

  if (typeof teachersEmail === 'string' || teachersEmail instanceof String) {
    teachers = await Teacher.query()
      .where('email', teachersEmail)
      .withGraphFetched('students')
    students = teachers[0].students;
  } else {
    teacher = await Teacher.query()
      .select('student_id')
      .count()
      .join('student_teacher', 'teachers.id', '=', 'student_teacher.teacher_id')
      .whereIn('teachers.email', teachersEmail)
      .groupBy('student_id')
      .having('count(*)', '=', teachersEmail.length)

    students = await Student.query()
      .whereIn('id', teacher.map(student => student.student_id))
  }
  res.status(200);
  res.json(lodash.map(students, 'email'));
})


router.post("/suspend", async (req, res) => {
  // TODO: invalid student email
  let { student } = req.body;

  await Student.query()
    .patch({suspended: true})
    .where('email', student)

  res.status(204);
  res.json(null);
})

module.exports = {
  router: router
}