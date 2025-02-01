const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');

router.post('/create', patientController.create);

module.exports = router;