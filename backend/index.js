const express = require('express');
const dbConnnect = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors( {
    origin: 'http://127.0.0.1:5500',
    credentials: true
}))

// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "http://127.0.0.1:5500",
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

// let users = {};

// io.on('connection', (socket) => {
//   console.log('New client connected:', socket.id);

//   // Listen for registration message (to identify agent or doctor)
//   socket.on('register', (data) => {
//     // data = { userID, role } where role can be "agent" or "doctor"
//     users[data.userID] = { socketId: socket.id, role: data.role };
//     console.log(`${data.role} registered with id ${data.userID} and socket ${socket.id}`);
//   });

//   // Agent initiates a call: send a call request to the doctor
//   socket.on('initiate-call', (data) => {
//     // data = { agentID, doctorID, roomID }
//     const doctor = users[data.doctorID];
//     if (doctor) {
//       io.to(doctor.socketId).emit('incoming-call', {
//         agentID: data.agentID,
//         roomID: data.roomID,
//       });
//       console.log(`Call initiated from agent ${data.agentID} to doctor ${data.doctorID}`);
//     }
//   });

//   // Relay signaling messages (offer, answer, ICE candidates) between peers.
//   socket.on('signal', (data) => {
//     // data = { to: targetUserID, from: senderUserID, type: 'offer' | 'answer' | 'ice-candidate', payload: ... }
//     const target = users[data.to];
//     if (target) {
//       io.to(target.socketId).emit('signal', data);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//     // Remove from users object if needed (simple approach)
//     for (const id in users) {
//       if (users[id].socketId === socket.id) {
//         delete users[id];
//         break;
//       }
//     }
//   });
// });

const http = require('http');
const WebSocket = require('ws');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let agents = {};  // To store agent connections
let doctors = {}; // To store doctor connections

wss.on('connection', (ws) => {
    console.log('New connection established');

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'register':
                // Register agent or doctor
                if (data.role === 'agent') {
                    agents[data.id] = ws;
                    console.log(`Agent ${data.id} registered`);
                } else if (data.role === 'doctor') {
                    doctors[data.id] = ws;
                    console.log(`Doctor ${data.id} registered`);
                }
                break;

            case 'call':
                // Send incoming call to the doctor
                const doctorSocket = doctors[data.doctorId];
                if (doctorSocket) {
                    doctorSocket.send(JSON.stringify({
                        type: 'incomingCall',
                        from: data.agentId
                    }));
                }
                break;

            case 'offer':
                // Send offer from the agent to the doctor
                const offerSocket = doctors[data.to];
                if (offerSocket) {
                    offerSocket.send(JSON.stringify({
                        type: 'offer',
                        offer: data.offer,
                        from: data.from
                    }));
                }
                break;

            case 'answer':
                // Send answer from the doctor to the agent
                const answerSocket = agents[data.to];
                if (answerSocket) {
                    answerSocket.send(JSON.stringify({
                        type: 'answer',
                        answer: data.answer,
                        from: data.from
                    }));
                }
                break;

            case 'icecandidate':
                // Forward ICE candidates to the respective peer
                const iceSocket = agents[data.to] || doctors[data.to];
                if (iceSocket) {
                    iceSocket.send(JSON.stringify({
                        type: 'icecandidate',
                        candidate: data.candidate,
                        from: data.from
                    }));
                }
                break;
        }
    });

    ws.on('close', () => {
        // Cleanup on disconnect
        for (let agentId in agents) {
            if (agents[agentId] === ws) {
                delete agents[agentId];
                break;
            }
        }

        for (let doctorId in doctors) {
            if (doctors[doctorId] === ws) {
                delete doctors[doctorId];
                break;
            }
        }
    });
});

app.use(express.static('public'));

server.listen(PORT, () => {
    dbConnnect();
    console.log(`Server is running on port ${PORT}`);
});

const agentRoutes = require('./routes/agent.routes');
const doctorRoutes = require('./routes/doctor.routes');
const videocallRoutes = require('./routes/videocall.routes');
const patientRoutes = require('./routes/patient.routes');

app.use('/api/agent', agentRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/videocall', videocallRoutes);
app.use('/api/patient', patientRoutes);