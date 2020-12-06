const express = require("express");
const router = express.Router()

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

    res.json(teachers[0].students.map(student => student.email))
  } else {
    teacher = await Teacher.query()
      .select('student_id')
      .count()
      .join('student_teacher', 'teachers.id', '=', 'student_teacher.teacher_id')
      .whereIn('teachers.email', teachersEmail)
      .groupBy('student_id')
      .having('count(*)', '=', teachersEmail.length)

    console.log(teachers);
    students = await Student.query()
      .whereIn('id', teacher.map(student => student.student_id))

    res.json(students.map(student => student.email))
  }
})

module.exports = {
  router: router
}