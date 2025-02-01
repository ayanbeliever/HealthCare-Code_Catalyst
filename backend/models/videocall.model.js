const mongoose = require("mongoose");

const videoCallSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const VideoCall = mongoose.model("VideoCall", videoCallSchema);

module.exports = VideoCall;