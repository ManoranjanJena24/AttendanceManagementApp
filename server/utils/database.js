const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('attendance_management', 'root', 'user', {
    dialect: 'mysql'
});
module.exports = sequelize