const { DataTypes } = require('sequelize')

module.exports = model

function model(sequelize){
  const attributes = {
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false }
  }
  
  const options = {
    timestamps: false
  }

  return sequelize.define('students', attributes, options)
}