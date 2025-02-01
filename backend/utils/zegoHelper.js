// utils/zegoHelper.js
const jwt = require("jsonwebtoken");

const APP_ID = process.env.ZEGO_APP_ID;
const SERVER_SECRET = process.env.ZEGO_SERVER_SECRET;

// Generate a token valid for 1 hour
const generateZegoToken = (roomID, userID, userName) => {
  const payload = {
    app_id: APP_ID,
    room_id: roomID,
    user_id: userID,
    user_name: userName,
    expire_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
  };
  return jwt.sign(payload, SERVER_SECRET, { algorithm: "HS256" });
};

module.exports = { generateZegoToken };
