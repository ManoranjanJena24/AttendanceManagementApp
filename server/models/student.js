const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const Student = sequelize.define('Student', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Student;


