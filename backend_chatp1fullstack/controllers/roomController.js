const Room = require('../models/room');

const createRoom = async (req, res) => {
    try {
        const { name, description, capacity } = req.body;
        const createdBy = req.user.id.toString();

        const room = await Room.create({
            name,
            description,
            capacity,
            createdBy,
        });

        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar sala' });
    }
};

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        console.error("Erro ao listar salas:", error);
        res.status(400).json({ error: 'Erro ao listar salas' });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const roomId = req.params.id;
        const room = await Room.findById(roomId);

        // Verifica se a sala existe
        if (!room) {
            return res.status(404).json({ error: 'Sala não encontrada' });
        }

        // Converte ambos os IDs para strings antes de comparar
        if (String(room.createdBy) !== String(req.user.id)) {
            return res.status(403).json({ error: 'Você não tem permissão para excluir esta sala' });
        }

        // Exclui a sala
        await room.deleteOne();
        res.status(200).json({ message: 'Sala excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir sala:', error); // Log do erro detalhado
        res.status(500).json({ error: 'Erro ao excluir sala' });
    }
};

module.exports = { createRoom, getRooms, deleteRoom };
