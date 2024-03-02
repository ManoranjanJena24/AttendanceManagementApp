// routes/attendance.js
const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');
const sequelize=require('sequelize')

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
        await Attendance.bulkCreate(attendance.map(record => ({ date, ...record })));
        res.status(201).json({ message: 'Attendance marked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/report', async (req, res) => {
    try {
        const reportData = await Attendance.findAll({
            attributes: ['studentId', [sequelize.fn('COUNT', sequelize.col('studentId')), 'daysPresent']],
            group: ['studentId']
        });
        res.json(reportData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;