module.exports = {
  development: {
    client: "mysql",
    connection: {
      host : "127.0.0.1",
      user : "root",
      password : "",
      database : "student_registry"
    },
    migrations: {
      directory: __dirname + "/db/migrations"
    },
    typeCast: function(field, next) {
      if (field.type == "TINY" && field.length == 1) {
          return (field.string() == "1"); // 1 = true, 0 = false
      }
      return next();
    }
  }
}
