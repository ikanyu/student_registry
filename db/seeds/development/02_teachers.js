exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('teachers').del()
    .then(function () {
      // Inserts seed entries
      return knex('teachers').insert([
        { email: 'teacherken@gmail.com' },
        { email: 'teacherjane@gmail.com'}
      ]);
    });
};