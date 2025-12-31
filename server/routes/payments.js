const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET payment list (focused view of students with payment details)
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status && status !== 'All') {
            query.status = status;
        }

        const students = await Student.find(query)
            .sort({ createdAt: -1 })
            .select('name batch paidAmount totalAmount status photo validityFrom validityTo');

        const formattedStudents = students.map(s => ({
            ...s._doc,
            id: s._id
        }));

        res.json(formattedStudents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
