const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Helper to get or create the single admin user
const getAdminUser = async () => {
    let user = await User.findOne({ username: 'admin' });
    if (!user) {
        user = new User({ username: 'admin' });
        await user.save();
    }
    return user;
};

// GET /api/auth/biometric-user
// Returns the registered credential ID for the admin
router.get('/biometric-user', async (req, res) => {
    try {
        const user = await getAdminUser();
        res.json({ credentialId: user.biometricCredentialId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/auth/register-biometric
// Updates the admin's biometric credential
router.post('/register-biometric', async (req, res) => {
    try {
        const { credentialId } = req.body;
        if (!credentialId) return res.status(400).json({ message: 'Credential ID required' });

        const user = await getAdminUser();

        // OVERWRITE policy: Always replace with new one
        user.biometricCredentialId = credentialId;
        await user.save();

        res.json({ success: true, message: 'Fingerprint registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
