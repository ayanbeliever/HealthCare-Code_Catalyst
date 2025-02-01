const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Agent = require('../models/agent.model'); // Adjust the path as necessary

// Register a new agent
exports.register = async (req, res) => {
    try {
        const agentDetails = req.body;
        if (!(agentDetails.email && agentDetails.password && agentDetails.name && agentDetails.phone && agentDetails.centerId && agentDetails.centerLocation)) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const newAgent = new Agent(agentDetails);
        await newAgent.save();
        res.status(201).json({ message: 'Agent registered successfully' , data: newAgent});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login an agent
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const agent = await Agent.findOne({ email });
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, agent.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid creadentials' });
        }
        const token = jwt.sign({ id: agent._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true});
        res.status(200).json({user: agent, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Logout an agent
exports.logout = (req, res) => {
    // Invalidate the token on the client side
    res
    .status(200)
    .clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Strict' })
    .json({ message: 'Logged out successfully' });
};

// Delete an agent
exports.deleteAgent = async (req, res) => {
    try {
        const { id } = req.params;
        const agent = await Agent.findByIdAndDelete(id);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        res.status(200).json({ message: 'Agent deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};