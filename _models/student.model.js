const { DataTypes } = require('sequelize')

module.exports = model

function model(sequelize){
  const attributes = {
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'accounts',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    school_id: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    sex: {
      type: DataTypes.ENUM('M', 'F'),
      allowNull: false  
    },
    homeroom_id: { type: DataTypes.INTEGER, allowNull: false, references: {
        model: 'homerooms', // must match the table name
        key: 'id'
      }
    },
    address: { type: DataTypes.STRING }, 
    lrn_number: { type: DataTypes.STRING, allowNull: false }
  };
  
  const options = {
    timestamps: false
  }

  return sequelize.define('students', attributes, options)
}