const express = require("express");
const app = express();

var students = require("./api/students");

// Endpoints
app.use(express.json());
app.use("/api", students.router);

module.exports = app;