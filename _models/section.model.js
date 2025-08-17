const { DataTypes } = require('sequelize')

module.exports = model

function model(sequelize){

  const attributes = {
    name: { type: DataTypes.STRING, allowNull: false }
  } 
  
  const options = {
    timestamps: false
  } 

  return sequelize.define('section', attributes, options)
}