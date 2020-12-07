const express = require("express");
const router = express.Router()
const _ = require('lodash');
const knex = require("../db/knex");

const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

router.get("/commonstudents", async (req, res) => {
  let teachers;
  let students;
  let teachersEmail = req.query.teacher;

  if(!teachersEmail) { return res.status(422).json({message: 'Teacher attribute is missing'}) };

  if (typeof teachersEmail === 'string' || teachersEmail instanceof String) {
    teachers = await Teacher.query().where('email', teachersEmail).withGraphFetched('students')
    students = teachers[0].students;
  } else {
    teacher = await Teacher
      .query()
      .select('student_id')
      .count()
      .join('student_teacher', 'teachers.id', '=', 'student_teacher.teacher_id')
      .whereIn('teachers.email', teachersEmail)
      .groupBy('student_id')
      .having('count(*)', '=', teachersEmail.length)

    students = await Student.query().whereIn('id', teacher.map(student => student.student_id))
  }
  res.status(200).json(_.map(students, 'email'));
})

router.post("/suspend", async (req, res) => {
  let { student } = req.body;

  if(!student) { return res.status(422).json({message: 'Student attribute is missing'}) }

  studentRecord = await Student.query().where('email', student).first()
  if(!studentRecord) { return res.status(404).json({message: "Student not found"}) }
  await Student.query().patch({suspended: true}).where('email', student)

  res.status(204).json(null);
})

router.post("/register", async (req, res) => {
  let { teacher, students } = req.body;

  if(!teacher || !students) { return res.status(422).json({message: 'Teacher or student attribute is missing'}) }

  let studentRecord;
  let teacherRecord = await Teacher.query().findOne({'email': teacher});

  for(student of students) {
    studentRecord = await Student.query().where('email', student).first()
    if(!studentRecord) { studentRecord = await Student.query().insert({email: student}) }

    let jointStudentRecord = await Teacher.relatedQuery('students').for(teacherRecord).where('email', student).first()
    if(!jointStudentRecord) { await Teacher.relatedQuery('students').for(teacherRecord).relate(studentRecord); }
  }

  res.status(204).json(null);
})

router.post("/retrievefornotifications", async (req, res) => {
  // Assumption: all emails are valid students
  let { teacher, notification } = req.body;

  if(!teacher || !notification) { return res.status(422).json({ message: 'Teacher or notification attribute is missing'}) };

  let finalList;
  const emails = notification.match(/(?<=@)[^\s\,]+/g);

  let teacherSubQuery = await Teacher.query().where('email', teacher);
  let teachersStudents = await Teacher.relatedQuery('students').for(teacherSubQuery).where('suspended', false);
  let teachersStudentsArray = _.map(teachersStudents, 'email');

  if (emails) {
    let suspendedStudent = await Student.query().where('suspended', true).whereIn('email', emails);
    let suspendedStudentArray = _.map(suspendedStudent, 'email');
    let cleanList = emails.filter((email) => !suspendedStudentArray.includes(email));

    finalList = _.union(teachersStudentsArray, cleanList);
  } else {
    finalList = teachersStudentsArray;
  }

  res.status(200).json(finalList);
})

module.exports = router;