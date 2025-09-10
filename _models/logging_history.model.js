const { DataTypes } = require("sequelize");

module.exports = model;
    
function model(sequelize) {
  const attributes = {  
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,     
      references: {
        model: "accounts", // must match the table name
        key: "id",
      },        
    },          
    login_date: { type: DataTypes.DATE },
    logout_date: { type: DataTypes.DATE },
  };

  const options = {
    timestamps: false,
  };

  return sequelize.define("logging_history", attributes, options);
}
