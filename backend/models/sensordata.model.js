const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sensorDataSchema = new Schema({
    patient: { 
        type: Schema.Types.ObjectId, 
        ref: 'Patient', 
        required: true 
    },
    temperature: { 
        type: Number, 
        required: true 
    },
    heartRate: { 
        type: Number, 
        required: true 
    },
    bloodPressure: { 
        type: String, 
        required: true 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SensorData', sensorDataSchema);