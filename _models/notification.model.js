const { DataTypes } = require("sequelize")

module.exports = model

function model(sequelize){
    const attributes = {
        recipient_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: "accounts", key: "id"} },
        sender_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: "accounts", key: "id"} },
        message: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.ENUM("LOCKED", "REQUEST", "INFO"), allowNull: false },
        is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    }

    const options = {
        timestamps: true
    }

    return sequelize.define("notification", attributes, options)
}