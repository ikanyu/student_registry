const express = require('express')
const router = express.Router()

const Student = require('../models/Student')

router.get('/students', (req, res) => {
  // console.log("hello");
  console.log(req.query);
  res.send(req.query.email);
  // User.query()
    //     .then(users => {
    //         res.json(users)
    //     })
})

module.exports = {
  router: router
}