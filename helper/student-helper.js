const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

async function getStudent(teachersEmail) {
  let students;

  if (typeof teachersEmail === 'string' || teachersEmail instanceof String) {
    let teachers = await Teacher.query().where('email', teachersEmail).withGraphFetched('students');
    students = teachers[0].students;
  } else {
    let teacher = await Teacher
      .query()
      .select('student_id')
      .count()
      .join('student_teacher', 'teachers.id', '=', 'student_teacher.teacher_id')
      .whereIn('teachers.email', teachersEmail)
      .groupBy('student_id')
      .having('count(*)', '=', teachersEmail.length);

    students = await Student.query().whereIn('id', teacher.map(student => student.student_id));
  }

  return students
}

async function suspendStudent(studentEmail) {
  await Student.query().patch({suspended: true}).where('email', studentEmail);
}

async function registerStudent(teacher, students) {
  let studentRecord;
  let teacherRecord = await Teacher.query().findOne({'email': teacher});

  for(student of students) {
    studentRecord = await Student.query().where('email', student).first();
    if(!studentRecord) { studentRecord = await Student.query().insert({email: student}) }

    let jointStudentRecord = await Teacher.relatedQuery('students').for(teacherRecord).where('email', student).first()
    if(!jointStudentRecord) { await Teacher.relatedQuery('students').for(teacherRecord).relate(studentRecord); }
  }
}

async function notifiedStudent(teacher, notification) {
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

  return finalList;
}

module.exports = {
  getStudent,
  suspendStudent,
  registerStudent,
  notifiedStudent
}