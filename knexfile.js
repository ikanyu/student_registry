module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host : "127.0.0.1",
      user : "root",
      password : "password",
      port: "3307",
      database : "student_registry_development"
    },
    migrations: {
      directory: __dirname + "/db/migrations"
    },
    seeds: {
      directory: __dirname + "/db/seeds/development"
    },
    typeCast: function(field, next) {
      if (field.type == "TINY" && field.length == 1) {
          return (field.string() == "1"); // 1 = true, 0 = false
      }
      return next();
    }
  },
  test: {
    client: "mysql2",
    connection: {
      host : "127.0.0.1",
      user : "root",
      password : "password",
      port: "3307",
      database : "student_registry_test"
    },
    migrations: {
      directory: __dirname + "/db/migrations"
    },
    seeds: {
      directory: __dirname + "/db/seeds/development"
    },
    typeCast: function(field, next) {
      if (field.type == "TINY" && field.length == 1) {
          return (field.string() == "1"); // 1 = true, 0 = false
      }
      return next();
    }
  }
}
