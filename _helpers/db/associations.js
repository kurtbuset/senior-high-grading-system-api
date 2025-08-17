module.exports = function defineAssociations(db){
  // one to many (account -> refreshToken)
  db.Account.hasMany(db.refreshToken, { onDelete: "CASCADE" });
  db.refreshToken.belongsTo(db.Account);

  // Account (Teacher) → TeacherSubjectAssignment
  // one to many (one teacher can handle multiple assignments)
  db.Account.hasMany(db.Teacher_Subject_Assignment, {
    foreignKey: "teacher_id",
  });
  db.Teacher_Subject_Assignment.belongsTo(db.Account, {
    foreignKey: "teacher_id",
  });

  // One-to-One: Account ↔ Student
  db.Account.hasOne(db.Student, {
    foreignKey: "account_id",
    onDelete: "CASCADE"
  });
  db.Student.belongsTo(db.Account, {
    foreignKey: "account_id"
  });

  // Subject → TeacherSubjectAssignmen
  // one to many (one subject appears in many assignments but with diff sections) 
  db.Subject.hasMany(db.Teacher_Subject_Assignment, {
    foreignKey: "subject_id",
  });
  db.Teacher_Subject_Assignment.belongsTo(db.Subject, {
    foreignKey: "subject_id",
  });


  
  // Many-to-Many: Student ↔ TeacherSubjectAssignment (through Enrollment)
  db.Student.belongsToMany(db.Teacher_Subject_Assignment, {
    through: db.Enrollment,
    foreignKey: "student_id",
    otherKey: "teacher_subject_id",
  });

  db.Teacher_Subject_Assignment.belongsToMany(db.Student, {
    through: db.Enrollment,
    foreignKey: "teacher_subject_id",
    otherKey: "student_id",
  });

  // Optional: Direct access to Enrollment entries from Student or Assignment
  db.Enrollment.belongsTo(db.Student, { foreignKey: "student_id" });
  db.Enrollment.belongsTo(db.Teacher_Subject_Assignment, {
    foreignKey: "teacher_subject_id",
  });

  db.Student.hasMany(db.Enrollment, { foreignKey: "student_id" });
  db.Teacher_Subject_Assignment.hasMany(db.Enrollment, {
    foreignKey: "teacher_subject_id",
  });

  // teacher_subject_assignment → quizzes
  db.Teacher_Subject_Assignment.hasMany(db.Quiz, {
    foreignKey: "teacher_subject_id",
  });
  db.Quiz.belongsTo(db.Teacher_Subject_Assignment, {
    foreignKey: "teacher_subject_id",
  });

  
  db.Quiz.hasMany(db.Quiz_Score, { foreignKey: "quiz_id", onDelete: 'CASCADE', });
  db.Quiz_Score.belongsTo(db.Quiz, { foreignKey: "quiz_id", onDelete: 'CASCADE', });
  db.Enrollment.hasMany(db.Quiz_Score, { foreignKey: "enrollment_id", onDelete: 'CASCADE', });
  db.Quiz_Score.belongsTo(db.Enrollment, { foreignKey: "enrollment_id", onDelete: 'CASCADE', });
}