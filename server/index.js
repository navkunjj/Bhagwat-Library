const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const studentRoutes = require('./routes/students');
const batchRoutes = require('./routes/batches');
const dashboardRoutes = require('./routes/dashboard');
const paymentRoutes = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*', // later replace with your frontend URL
}));
app.use(express.json({ limit: '50mb' })); // Support for Base64 images

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payments', paymentRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('Library Management API Running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
