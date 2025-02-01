const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    medicalHistory: {
        type: String,
        required: true
    },
    assignedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        // required: true
    }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;