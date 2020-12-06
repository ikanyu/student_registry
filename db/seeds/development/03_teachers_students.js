exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('teachers_students').del()
    .then(function () {
      let teacherId1, teacherId2, studentId1, studentId2, studentId3;

      teacherId1 = knex('teachers').where({email: 'teacherken@gmail.com'}).select('id');
      teacherId2 = knex('teachers').where({email: 'teacherjane@gmail.com'}).select('id');

      studentId1 = knex('students').where({email: 'studentjon@gmail.com'}).select('id');
      studentId2 = knex('students').where({email: 'studenthon@gmail.com'}).select('id');
      studentId3 = knex('students').where({email: 'studentalan@gmail.com'}).select('id');

      return knex('teachers_students').insert([
        { teacher_id: teacherId1, student_id: studentId1  },
        { teacher_id: teacherId1, student_id: studentId3  },
        { teacher_id: teacherId2, student_id: studentId2  }
      ]);
    });
};