// const { iteratee } = require("lodash");
const { eq } = require("lodash");
const request = require("supertest");
const app = require("../../app");
var knex = require('../../db/knex');

const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");

describe("POST /register", () => {
  beforeEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      knex.migrate.latest()
      .then(function() {
        done();
      });
    });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      done();
    });
  });

  it('valid registration should return register 204', async () => {
    const teacher = await knex("teachers").insert([{ email: 'teacherken@gmail.com' }]);

    const response = await request(app)
      .post("/api/register")
      .send({
        teacher: "teacherken@gmail.com",
        students: [
          "studentjon@gmail.com",
          "studenthon@gmail.com"
        ]
      })

    const teacherSubQuery = await Teacher.query().where('email', 'teacherken@gmail.com').withGraphFetched('students');
    const students = teacherSubQuery[0].students;

    expect(students[0].email).toEqual("studentjon@gmail.com");
    expect(students[1].email).toEqual("studenthon@gmail.com");
    expect(response.statusCode).toBe(204);
  })

  it('POST /suspend should return register 204', async () => {
    await knex("students").insert([{ email: 'studentmary@gmail.com' }]);

    const response = await request(app)
      .post("/api/suspend")
      .send({
        student: "studentmary@gmail.com"
      })

    const student = await Student.query().where('email', 'studentmary@gmail.com');

    expect(student[0].suspended).toBe(1);
    expect(response.statusCode).toBe(204);
  })

  it('GET /commonstudents with 1 teacher should return register 200', async () => {

    const teacherId = await knex("teachers").insert([{ email: 'teacherken@gmail.com' }]);
    const studentId = await knex("students").insert([{ email: 'studentmary@gmail.com' }]);
    await knex('student_teacher').insert({ teacher_id: teacherId, student_id: studentId  });

    const response = await request(app)
      .get("/api/commonstudents")
      .query({teacher: 'teacherken@gmail.com'})

    expect(response.body).toEqual(['studentmary@gmail.com']);
    expect(response.statusCode).toBe(200);
  })

  it('GET /commonstudents with 2 teachers should return register 200', async () => {

    const teacherId1 = await knex("teachers").insert([{ email: 'teacherken@gmail.com' }]);
    const teacherId2 = await knex("teachers").insert([{ email: 'teacherjane@gmail.com' }]);
    const studentId = await knex("students").insert([{ email: 'studentmary@gmail.com' }]);
    await knex('student_teacher').insert({ teacher_id: teacherId1, student_id: studentId  });
    await knex('student_teacher').insert({ teacher_id: teacherId2, student_id: studentId  });

    const response = await request(app)
      .get("/api/commonstudents")
      .query({teacher: 'teacherken@gmail.com'})

    expect(response.body).toEqual(['studentmary@gmail.com']);
    expect(response.statusCode).toBe(200);
  })

  it('POST /retrievefornotifications', async () => {
    const teacherId = await knex("teachers").insert([{ email: 'teacherken@gmail.com' }]);
    const studentId1 = await knex("students").insert([{ email: 'studentagnes@gmail.com' }]);
    const studentId2 = await knex("students").insert([{ email: 'studentalan@gmail.com', suspended: true }]);
    const studentId3 = await knex("students").insert([{ email: 'studentkim@gmail.com'}]);
    await knex('student_teacher').insert({ teacher_id: teacherId, student_id: studentId1  });

    const response = await request(app)
      .post("/api/retrievefornotifications")
      .send({
        teacher: 'teacherken@gmail.com',
        notification: 'Hello! @studentalan@gmail.com @studentkim@gmail.com'
      })

    expect(response.body).toContain('studentagnes@gmail.com');
    expect(response.body).toContain('studentkim@gmail.com');
    expect(response.body).not.toContain('studentalan@gmail.com');
    expect(response.statusCode).toBe(200);
  })
})