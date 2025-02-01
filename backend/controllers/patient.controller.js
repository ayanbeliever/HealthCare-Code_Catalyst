const Patient = require('../models/patient.model');

// Create and Save a new Patient
exports.create = async (req, res) => {
    // Validate request
    const patientDetails = req.body;
    if (!(patientDetails.name && patientDetails.address && patientDetails.phone && patientDetails.dateOfBirth && patientDetails.medicalHistory)) {
        return res.status(400).send({
            message: "Patient content can not be empty"
        });
    }

    // Create a Patient
    const patient = new Patient(patientDetails);

    // Save Patient in the database
    await patient.save()
        
    if(!patient) {
        return res.status(500).json({ message: 'Error registering patient' });
    }
    res.status(200).json({ data: patient, message: 'Patient registered successfully' });
};

// Retrieve and return all patients from the database.
exports.findAll = (req, res) => {
    Patient.find()
        .then(patients => {
            res.send(patients);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving patients."
            });
        });
};

// Find a single patient with a patientId
exports.findOne = (req, res) => {
    Patient.findById(req.params.patientId)
        .then(patient => {
            if (!patient) {
                return res.status(404).send({
                    message: "Patient not found with id " + req.params.patientId
                });
            }
            res.send(patient);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Patient not found with id " + req.params.patientId
                });
            }
            return res.status(500).send({
                message: "Error retrieving patient with id " + req.params.patientId
            });
        });
};

// Update a patient identified by the patientId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.name || !req.body.age || !req.body.address) {
        return res.status(400).send({
            message: "Patient content can not be empty"
        });
    }

    // Find patient and update it with the request body
    Patient.findByIdAndUpdate(req.params.patientId, {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
        phone: req.body.phone
    }, { new: true })
        .then(patient => {
            if (!patient) {
                return res.status(404).send({
                    message: "Patient not found with id " + req.params.patientId
                });
            }
            res.send(patient);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Patient not found with id " + req.params.patientId
                });
            }
            return res.status(500).send({
                message: "Error updating patient with id " + req.params.patientId
            });
        });
};

// Delete a patient with the specified patientId in the request
exports.delete = (req, res) => {
    Patient.findByIdAndRemove(req.params.patientId)
        .then(patient => {
            if (!patient) {
                return res.status(404).send({
                    message: "Patient not found with id " + req.params.patientId
                });
            }
            res.send({ message: "Patient deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Patient not found with id " + req.params.patientId
                });
            }
            return res.status(500).send({
                message: "Could not delete patient with id " + req.params.patientId
            });
        });
};