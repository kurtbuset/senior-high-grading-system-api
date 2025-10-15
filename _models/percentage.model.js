const { DataTypes } = require('sequelize')

module.exports = model


function model(sequelize){

  const attributes = {
    ww_percent: {
      type: DataTypes.INTEGER
    },
    pt_percent: {
      type: DataTypes.INTEGER
    },
    qa_percent: {
      type: DataTypes.INTEGER
    }
  }

  const options = {
    timestamps: false
  } 

  return sequelize.define('percentages', attributes, options)
}