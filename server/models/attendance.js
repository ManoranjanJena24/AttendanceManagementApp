// models/attendance.js
const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const Attendance = sequelize.define('Attendance', {
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    present: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});

module.exports = Attendance;