const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
    student_id: {
      type: DataTypes.INTEGER, allowNull: false,
      references: {
        model: "students",
        key: "id",
      },
    },
    teacher_subject_id: {
      type: DataTypes.INTEGER, allowNull: false,
      references: {
        model: "teacher_subject_assignments",
        key: "id",
      },
      onDelete: "CASCADE",   // ✅ important
      onUpdate: "CASCADE",
    },
    is_enrolled: {
      type: DataTypes.BOOLEAN
    }
  };

  const options = {
    timestamps: false,
  };

  return sequelize.define("enrollment", attributes, options);
}
