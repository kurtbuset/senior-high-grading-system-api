const { DataTypes } = require('sequelize')

module.exports = model

function model(sequelize){

  const attributes = {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    default_ww_percent: { type: DataTypes.INTEGER, allowNull: false },
    default_pt_percent: { type: DataTypes.INTEGER, allowNull: false },
    default_qa_percent: { type: DataTypes.INTEGER, allowNull: false }
  } 
  
  const options = {
    timestamps: false
  } 

  return sequelize.define('subject', attributes, options)
}