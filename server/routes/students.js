const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        // Map _id to id for frontend compatibility
        const formattedStudents = students.map(s => ({
            ...s._doc,
            id: s._id
        }));
        res.json(formattedStudents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// POST new student
router.post('/', async (req, res) => {
    try {
        console.log('Creating student:', req.body);

        // Seat occupancy check
        if (req.body.seatNumber && req.body.seatNumber > 0) {
            const existingSeat = await Student.findOne({ seatNumber: req.body.seatNumber });
            if (existingSeat) {
                return res.status(400).json({ message: `Seat ${req.body.seatNumber} is already occupied by ${existingSeat.name}` });
            }
        }

        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save();
        res.status(201).json({ ...savedStudent._doc, id: savedStudent._id });
    } catch (err) {
        console.error('Error creating student:', err);
        res.status(400).json({ message: err.message });
    }
});

// PUT update student
router.put('/:id', async (req, res) => {
    try {
        console.log('Updating student ID:', req.params.id, 'Data:', req.body);

        // Seat occupancy check
        if (req.body.seatNumber && req.body.seatNumber > 0) {
            const existingSeat = await Student.findOne({
                seatNumber: req.body.seatNumber,
                _id: { $ne: req.params.id } // Exclude current student
            });
            if (existingSeat) {
                return res.status(400).json({ message: `Seat ${req.body.seatNumber} is already occupied by ${existingSeat.name}` });
            }
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json({ ...updatedStudent._doc, id: updatedStudent._id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE student
router.delete('/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
