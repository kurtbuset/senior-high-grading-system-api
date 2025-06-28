const { DataTypes } = require('sequelize')

module.exports = model

function model(sequelize){
  const attributes = {
    quiz_id: {
      type: DataTypes.INTEGER, allowNull: false, 
      references: {
        model: 'quizzes',
        key: 'id'
      }
    },
    enrollment_id: {
      type: DataTypes.INTEGER, allowNull: false, 
      references: {
        model: 'enrollments',
        key: 'id'
      }
    },
    raw_score: {
      type: DataTypes.INTEGER
    }
  }

  const options = {
    timestamps: false
  }

  return sequelize.define('quiz_score', attributes, options)
}