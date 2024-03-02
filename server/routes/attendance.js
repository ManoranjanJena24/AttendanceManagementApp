// routes/attendance.js
const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');
const sequelize = require('sequelize')
const Student = require('../models/student')

router.get('/', async (req, res) => {
    const { date } = req.query;
    try {
        const attendanceData = await Attendance.findAll({ where: { date } });
        res.json(attendanceData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { date, attendance } = req.body;
        for (const record of attendance) {
            // Check if attendance record already exists for the student on the specified date
            const existingRecord = await Attendance.findOne({ where: { StudentId: record.StudentId, date: date } });
            if (existingRecord) {
                // Update existing record
                await existingRecord.update({ present: record.present });
            } else {
                // Create new record
                await Attendance.create({ StudentId: record.StudentId, date: date, present: record.present });
            }
        }
        res.status(201).json({ message: 'Attendance marked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.get('/report', async (req, res) => {
    try {
        const reportData = await Attendance.findAll({
            attributes: [
                'StudentId',
                [sequelize.fn('SUM', sequelize.col('present')), 'daysPresent']
            ],
            group: ['StudentId'],
            include: [
                {
                    model: Student,
                    attributes: ['name'] // Include the 'name' attribute from the 'Student' model
                }
            ]
        });

        // Get the count of rows in the Student table
        const studentCount = await Student.count();

        // Get the count of rows in the Attendance table
        const attendanceCount = await Attendance.count();
        const totalAttendance=Math.floor(attendanceCount/studentCount)

        // Format the response
        const formattedData = reportData.map(entry => ({
            StudentId: entry.StudentId,
            StudentName: entry.Student.name, // Access the name from the included 'Student' model
            DaysPresent: entry.get('daysPresent') || 0,
            AttendanceCount: totalAttendance
        }));

        res.status(200).json({
            data: formattedData,
            status: 200,
            statusText: 'OK'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});




module.exports = router;