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

  it('with valid emails', async () => {
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

  it('with invalid attributes', async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        teacher1: "teacherken@gmail.com",
        students2: [
          "studentjon@gmail.com",
          "studenthon@gmail.com"
        ]
      })

    expect(response.statusCode).toBe(422);
  })
})