const request = require("supertest");
const app = require("../../app");
var knex = require('../../db/knex');

const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");

describe("GET /commonstudents", () => {
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

  it('among 1 teacher', async () => {
    const teacherId = await knex("teachers").insert([{ email: 'teacherken@gmail.com' }]);
    const studentId = await knex("students").insert([{ email: 'studentmary@gmail.com' }]);
    await knex('student_teacher').insert({ teacher_id: teacherId, student_id: studentId  });

    const response = await request(app)
      .get("/api/commonstudents")
      .query({teacher: 'teacherken@gmail.com'})

    expect(response.body).toEqual(['studentmary@gmail.com']);
    expect(response.statusCode).toBe(200);
  })

  it('among 2 teachers', async () => {
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

  it('with missing teacher attributes', async () => {
    const response = await request(app)
      .get("/api/commonstudents")
      .query({teacher1: 'teacherken@gmail.com'})

    expect(response.statusCode).toBe(422);
  })
})