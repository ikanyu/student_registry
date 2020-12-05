const express = require("express");
const port = process.env.PORT || 3000;

var students = require("./api/students");

const app = express();

// Endpoints
app.use("/api", students.router);

app.listen(port, () => {
	console.log("Listening on port: " + port);
})