const express = require('express');
const { createRoom, getRooms, deleteRoom } = require('../controllers/roomController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const { getIO } = require('../socket');
const Room = require('../models/room');

router.post('/rooms', authMiddleware, createRoom);
router.get('/rooms', authMiddleware, getRooms);
router.delete('/rooms/:id', authMiddleware, deleteRoom);
router.get('/rooms/:roomId', authMiddleware, async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ error: 'Sala não encontrada' });
        }

        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar sala' });
    }
});
router.get('/rooms/:roomId/users', authMiddleware, async (req, res) => {
    try {
        const io = getIO();
        const roomId = req.params.roomId;
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Sala não encontrada no banco de dados' });
        }

        // Verificar os usuários conectados na sala via Socket.IO
        const socketRoom = io.sockets.adapter.rooms.get(roomId);
        const connectedUsers = socketRoom ? socketRoom.size : 0;
        
        res.json({ connectedUsers });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar a capacidade da sala' });
    }
});

module.exports = router;
