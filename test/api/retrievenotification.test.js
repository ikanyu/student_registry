const request = require("supertest");
const app = require("../../app");
var knex = require('../../db/knex');

describe("POST /retrievefornotifications", () => {
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

  it("returns all active students tagged in the message and the teachers's student", async () => {
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

  it("returns error when attribute is missing", async () => {
    const response = await request(app)
      .post("/api/retrievefornotifications")
      .send({
        teacher1: 'teacherken@gmail.com',
        notification1: 'Hello! @studentalan@gmail.com @studentkim@gmail.com'
      })

    expect(response.statusCode).toBe(422);
  })
})