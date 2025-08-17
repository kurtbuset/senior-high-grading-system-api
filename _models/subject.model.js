const { DataTypes } = require('sequelize')

module.exports = model

function model(sequelize){

  const attributes = {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }
  } 
  
  const options = {
    timestamps: false
  } 

  return sequelize.define('subject', attributes, options)
}