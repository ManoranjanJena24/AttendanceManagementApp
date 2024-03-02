// routes/student.js
const express = require('express');
const router = express.Router();
const Student = require('../models/student');

router.get('/', async (req, res) => {
    try {
        const students = await Student.findAll();
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;