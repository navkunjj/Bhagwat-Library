const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET dashboard statistics
router.get('/', async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const paidStudents = await Student.countDocuments({ status: 'Paid' });
        const unpaidStudents = await Student.countDocuments({ status: 'Unpaid' });
        const partialStudents = await Student.countDocuments({ status: 'Partial' });

        // Sum total revenue (paidAmount)
        const revenueResult = await Student.aggregate([
            { $group: { _id: null, total: { $sum: '$paidAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Recent 5 students
        const recentStudents = await Student.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name batch status createdAt');

        res.json({
            stats: {
                totalStudents,
                paidStudents,
                unpaidStudents,
                partialStudents,
                totalRevenue
            },
            recentStudents: recentStudents.map(s => ({
                ...s._doc,
                id: s._id
            }))
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
