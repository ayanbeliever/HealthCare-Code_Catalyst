const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const agentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    centerId: {
        type: String,
        required: true
    },
    centerLocation: {
        type: String,
        required: true
    }
},
{timestamps: true}
);

// Hash the password before saving the agent model
agentSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        return next();
    }
});

// Method to verify the password
agentSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;
