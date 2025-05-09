const { DataTypes } = require('sequelize')

module.exports = model

function model(sequelize){
  const attributes = {
    employeeId: { type: DataTypes.INTEGER, allowNull: false},    // set to cascade
    type: { type: DataTypes.STRING, allowNull: false},
    items: { type: DataTypes.JSON, allowNull: false},
    status: { type: DataTypes.STRING, allowNull: false }
  }

  const options = {
    timastamps: false
  } 
  
  return sequelize.define('request', attributes, options)
}