const { DataTypes } = require('sequelize')

module.exports = model

function model(sequelize){

  const attributes = {
    level: { type: DataTypes.INTEGER, allowNull: false }
  } 
  
  const options = {
    timestamps: false
  } 

  return sequelize.define('grade_level', attributes, options)
}