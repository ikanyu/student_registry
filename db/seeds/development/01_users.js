exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students').del()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        { email: 'studentjon@gmail.com', suspended: false },
        { email: 'studenthon@gmail.com', suspended: true }
      ]);
    });
};