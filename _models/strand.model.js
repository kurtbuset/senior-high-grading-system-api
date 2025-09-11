const { DataTypes } = require('sequelize')

module.exports = model

function model(sequelize){

  const attributes = {
    code: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false }
  } 
  
  const options = {
    timestamps: false
  } 

  return sequelize.define('strand', attributes, options)
}