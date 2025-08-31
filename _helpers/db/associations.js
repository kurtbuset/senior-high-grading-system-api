module.exports = function defineAssociations(db) {
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
    onDelete: "CASCADE",
  });
  db.Student.belongsTo(db.Account, {
    foreignKey: "account_id",
  });

  // Enrollment → Final_Grade
  db.Enrollment.hasMany(db.Final_Grade, {
    foreignKey: "enrollment_id",
    onDelete: "CASCADE",
    as: "final_grades",
  });
  db.Final_Grade.belongsTo(db.Enrollment, {
    foreignKey: "enrollment_id",
    as: "enrollment",
  });

  // one to many teacher_subject_assignment -> curriculum_subject
  db.Teacher_Subject_Assignment.belongsTo(db.Curriculum_Subject, {
    foreignKey: "curriculum_subject_id",
    as: "curriculum_subject",
  });
  db.Curriculum_Subject.hasMany(db.Teacher_Subject_Assignment, {
    foreignKey: "curriculum_subject_id",
    as: "assignments",
  });

  // Curriculum_Subject belongs to Subject
  db.Curriculum_Subject.belongsTo(db.Subject, {
    foreignKey: "subject_id",
    as: "subject",
  });

  // Teacher_Subject_Assignment → Homeroom
  db.Teacher_Subject_Assignment.belongsTo(db.HomeRoom, {
    foreignKey: "homeroom_id",
    as: "homeroom",
  });
  db.HomeRoom.hasMany(db.Teacher_Subject_Assignment, {
    foreignKey: "homeroom_id",
    as: "assignments",
  });

  // Curriculum_Subject → School_Year
  db.Curriculum_Subject.belongsTo(db.School_Year, {
    foreignKey: "school_year_id",
    as: "school_year",
  });

  db.School_Year.hasMany(db.Curriculum_Subject, {
    foreignKey: "school_year_id",
    as: "curriculum_subjects",
  });

  // Homeroom → Grade_Level
  db.HomeRoom.belongsTo(db.Grade_Level, {
    foreignKey: "grade_level_id",
    as: "grade_level",
  });
  db.Grade_Level.hasMany(db.HomeRoom, {
    foreignKey: "grade_level_id",
    as: "homeroom",
  });

  // Homeroom → School_Year
  db.HomeRoom.belongsTo(db.School_Year, {
    foreignKey: "school_year_id",
    as: "school_year",
  });
  db.School_Year.hasMany(db.HomeRoom, {
    foreignKey: "school_year_id",
    as: "homerooms",
  });

  // Student → HomeRoom (many students belong to 1 homeroom)
  db.Student.belongsTo(db.HomeRoom, {
    foreignKey: "homeroom_id",
    as: "homeroom",
  });
  db.HomeRoom.hasMany(db.Student, {
    foreignKey: "homeroom_id",
    as: "students",
  });

  // Homeroom → Strand
  db.HomeRoom.belongsTo(db.Strand, {
    foreignKey: "strand_id",
    as: "strand",
  });
  db.Strand.hasMany(db.HomeRoom, {
    foreignKey: "strand_id",
    as: "homerooms",
  });

  // Student → Enrollment
  db.Student.hasMany(db.Enrollment, {
    foreignKey: "student_id",
    as: "enrollments", // 👈 add alias
  });
  db.Enrollment.belongsTo(db.Student, {
    foreignKey: "student_id",
    as: "student",
  });

  // Enrollment → Teacher_Subject_Assignment
  db.Enrollment.belongsTo(db.Teacher_Subject_Assignment, {
    foreignKey: "teacher_subject_id",
    as: "assignment",
  });
  db.Teacher_Subject_Assignment.hasMany(db.Enrollment, {
    foreignKey: "teacher_subject_id",
    as: "enrollments",
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

  db.Quiz.hasMany(db.Quiz_Score, {
    foreignKey: "quiz_id",
    onDelete: "CASCADE",
  });
  db.Quiz_Score.belongsTo(db.Quiz, {
    foreignKey: "quiz_id",
    onDelete: "CASCADE",
  });
  db.Enrollment.hasMany(db.Quiz_Score, {
    foreignKey: "enrollment_id",
    onDelete: "CASCADE",
  });
  db.Quiz_Score.belongsTo(db.Enrollment, {
    foreignKey: "enrollment_id",
    onDelete: "CASCADE",
  });
};
