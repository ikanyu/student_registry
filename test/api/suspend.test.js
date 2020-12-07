const request = require("supertest");
const app = require("../../app");
var knex = require('../../db/knex');

const Student = require("../../models/Student");

describe("POST /suspend", () => {
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

  it('suspends student when given a valid email', async () => {
    await knex("students").insert([{ email: 'studentmary@gmail.com' }]);

    const response = await request(app)
      .post("/api/suspend")
      .send({
        student: "studentmary@gmail.com"
      });

    const student = await Student.query().where('email', 'studentmary@gmail.com');

    expect(student[0].suspended).toBe(1);
    expect(response.statusCode).toBe(204);
  })

  it('returns error when given an invalid email', async () => {
    const response = await request(app)
      .post("/api/suspend")
      .send({
        student: "studentjane@gmail.com"
      });

    const student = await Student.query().where('email', 'studentmary@gmail.com');
    expect(student.length).toBe(0);
    expect(response.statusCode).toBe(404);
  })

  it('returns error when student attribute is missing', async () => {
    const response = await request(app)
      .post("/api/suspend")
      .send({
        abc: "randomvalue"
      });


    expect(response.statusCode).toBe(422);
  })
})