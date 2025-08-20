const { DataTypes } = require('sequelize')

module.exports = model

function model(sequelize){

  const attributes = {
    grade_level_id: { type: DataTypes.INTEGER, allowNull: false, references: {
        model: 'grade_levels', // must match the table name
        key: 'id'
      }
    },
    section: { type: DataTypes.STRING, allowNull: false },
    strand_id: { type: DataTypes.INTEGER, allowNull: false, references: {
        model: 'strands', // must match the table name
        key: 'id'
      } 
    },
  }   
  
  const options = {
    timestamps: false
  } 

  return sequelize.define('homeroom', attributes, options)
}