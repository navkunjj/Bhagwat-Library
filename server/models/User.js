const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    // For now we might not strictly use password from DB if we keep hardcoded one, 
    // but good practice to have it. User asked for password as second option.
    // We will verify against "admin853203" in code or seed this.
    password: {
        type: String,
    },
    biometricCredentialId: {
        type: String, // Store base64 encoded credential ID
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
