const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.post('/register', doctorController.register);
router.post('/login', doctorController.login);
router.post('/logout',authenticateToken, doctorController.logout);
router.get('/', doctorController.getAllDoctors);
router.get('/available', doctorController.getAvailableDoctors);
router.patch('/availability/:id', doctorController.changeAvailability);
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;