exports.seed = function(knex, Promise) {
  return knex('students').del()
    .then(function () {
      return knex('students').insert([
        { email: 'studentjon@gmail.com', suspended: false },
        { email: 'studenthon@gmail.com', suspended: true },
        { email: 'studentalan@gmail.com', suspended: false }
      ]);
    });
};