const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');

// GET all batches
router.get('/', async (req, res) => {
    try {
        const batches = await Batch.find();
        if (batches.length === 0) {
            // Seed default batches if none exist (replicating store.js logic)
            const seed = [
                { time: '6:00 AM - 10:00 AM', price: '250' },
                { time: '10:00 AM - 2:00 PM', price: '300' },
                { time: '2:00 PM - 6:00 PM', price: '300' },
                { time: '6:00 PM - 10:00 PM', price: '250' },
                { time: '6:00 AM - 2:00 PM', price: '500' },
                { time: '10:00 AM - 6:00 PM', price: '550' },
                { time: '2:00 PM - 10:00 PM', price: '500' },
                { time: 'All Shift', price: '800' },
            ];
            const inserted = await Batch.insertMany(seed);
            return res.json(inserted.map(b => ({ ...b._doc, id: b._id })));
        }
        res.json(batches.map(b => ({ ...b._doc, id: b._id })));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new batch
router.post('/', async (req, res) => {
    try {
        const newBatch = new Batch(req.body);
        const saved = await newBatch.save();
        res.status(201).json({ ...saved._doc, id: saved._id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update batch
router.put('/:id', async (req, res) => {
    try {
        const updatedBatch = await Batch.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedBatch) return res.status(404).json({ message: 'Batch not found' });
        res.json({ ...updatedBatch._doc, id: updatedBatch._id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE batch
router.delete('/:id', async (req, res) => {
    try {
        await Batch.findByIdAndDelete(req.params.id);
        res.json({ message: 'Batch deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
