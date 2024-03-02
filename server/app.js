const express = require('express');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/student');
const attendanceRoutes = require('./routes/attendance');
const sequelize = require('./utils/database')
const Student = require('./models/student')
const Attendance = require('./models/attendance')
const CORS= require('cors')

const app = express();
app.use(CORS())
app.use(bodyParser.json());

app.use('/students', studentRoutes);
app.use('/attendance', attendanceRoutes);

Attendance.belongsTo(Student); // Each attendance record belongs to one student
Student.hasMany(Attendance); // Each student can have multiple attendance records

sequelize.sync({
    // force: true
})
    .then(() => {
        console.log('Database synchronized');
    })
    .catch(err => {
        console.error('Error synchronizing database:', err);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});