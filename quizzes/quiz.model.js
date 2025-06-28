const { DataTypes } = require('sequelize')

module.exports = model

function model(sequelize){
  const attributes = {
    teacher_subject_id: {
      type: DataTypes.INTEGER, allowNull: false,
      references: {
        model: "teacher_subject_assignments",
        key: "id",
      }
    },
    type: { type: DataTypes.ENUM('Written Work', 'Performance Tasks', 'Quarterly Assesment'), allowNull: false },
    quarter: { type: DataTypes.ENUM('First Quarter', 'Second Quarter'), allowNull: false },
    description: { type: DataTypes.STRING },
    hps: { type: DataTypes.INTEGER }
  }
  
  const options = {
    timestamps: false
  }

  return sequelize.define('quiz', attributes, options)
}