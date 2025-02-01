const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.post('/register', agentController.register);
router.post('/login', agentController.login);
router.post('/logout',authenticateToken, agentController.logout);
router.delete('/:id',authenticateToken, agentController.deleteAgent);

module.exports = router;