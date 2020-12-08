const express = require("express");
const router = express.Router()
const _ = require('lodash');
const knex = require("../db/knex");
const { getStudent, suspendStudent, registerStudent, notifiedStudent } = require("../helper/student-helper");

const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

router.get("/commonstudents", async (req, res) => {
  let teachersEmail = req.query.teacher;

  if(!teachersEmail) { return res.status(422).json({message: 'Teacher attribute is missing'}) }

  let students = await getStudent(teachersEmail);
  res.status(200).json(_.map(students, 'email'));
})

router.post("/suspend", async (req, res) => {
  let { student } = req.body;

  if(!student) { return res.status(422).json({message: 'Student attribute is missing'}) }

  studentRecord = await Student.query().where('email', student).first();
  if(!studentRecord) { return res.status(404).json({message: "Student not found"}) }
  await suspendStudent(student);

  res.status(204).json(null);
})

router.post("/register", async (req, res) => {
  let { teacher, students } = req.body;

  if(!teacher || !students) { return res.status(422).json({message: 'Teacher or student attribute is missing'}) }

  await registerStudent(teacher, students);

  res.status(204).json(null);
})

router.post("/retrievefornotifications", async (req, res) => {
  // Assumption: all emails are valid students
  let { teacher, notification } = req.body;

  if(!teacher || !notification) { return res.status(422).json({ message: 'Teacher or notification attribute is missing'}) };

  let finalList = await notifiedStudent(teacher, notification);

  res.status(200).json(finalList);
})

module.exports = {
  router: router
}