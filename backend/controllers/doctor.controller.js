const Doctor = require('../models/doctor.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/patient.model');

// Register a new doctor
exports.register = async (req, res) => {
    try {
        const doctorDetails = req.body;
        if(!(doctorDetails.email && doctorDetails.password && doctorDetails.name && doctorDetails.phone && doctorDetails.specialization && doctorDetails.qualification && doctorDetails.experience)) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newDoctor = new Doctor(doctorDetails);
        await newDoctor.save();
        res.status(201).json({data: newDoctor, message: 'Doctor registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering doctor', error });
    }
};

// Login a doctor
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true});
        res.status(200).json({user: doctor, token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Logout a doctor
exports.logout = (req, res) => {
    res.status(200).json({ message: 'Doctor logged out successfully' });
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error });
    }
};

// Get available doctors
exports.getAvailableDoctors = async (req, res) => {
    try {
        const availableDoctors = await Doctor.find({ available: true });
        res.status(200).json({data: availableDoctors , message: "Doctors fetched successfully"});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available doctors', error });
    }
};

// Delete a doctor
exports.deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findByIdAndDelete(id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting doctor', error });
    }
};

// Change doctor's availability
exports.changeAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { availabe } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(id, { available: !availabe }, { new: true });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor availability updated successfully', doctor });
    } catch (error) {
        res.status(500).json({ message: 'Error updating doctor availability', error });
    }
};

// Assign doctor to patient
exports.assignDoctorToPatient = async (req, res) => {
    try {
        const { doctorId, patientId } = req.body;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        // Assuming there is a Patient model and it has a doctor field
        const patient = await Patient.findByIdAndUpdate(patientId, { assignedDoctor: doctorId }, { new: true });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json({ message: 'Doctor assigned to patient successfully', patient });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning doctor to patient', error });
    }
};