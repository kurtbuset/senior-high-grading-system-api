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
    address: { type: DataTypes.STRING },
    guardian_name: { type: DataTypes.STRING },
    guardian_contact: { type: DataTypes.STRING }
  };
  
  const options = {
    timestamps: false
  }

  return sequelize.define('students', attributes, options)
}