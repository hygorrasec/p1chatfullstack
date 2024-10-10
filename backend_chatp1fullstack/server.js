require('dotenv').config();
const http = require('http');
const { sequelize, connectMongo } = require('./config/database');
const app = require('./app');
const socket = require('./socket');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado ao banco de dados relacional');
        await sequelize.sync({ force: false });
        await connectMongo();

        server.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
            const io = socket.init(server);

            const usersInRooms = {};

            io.on('connection', (socket) => {
                socket.on('join-room', ({ roomId, userName }) => {
                    socket.join(roomId);
                    console.log(`${userName} entrou na sala ${roomId}`);
        
                    if (!usersInRooms[roomId]) {
                        usersInRooms[roomId] = [];
                    }
                    usersInRooms[roomId].push({ id: socket.id, name: userName });
        
                    updateUsersInRoom(roomId);
                });

                socket.on('send-message', ({ roomId, message, userName }) => {
                    const messageData = { userName, message };
                    if (io.sockets.adapter.rooms.has(roomId)) {
                        io.to(roomId).emit('receive-message', messageData);
                    }
                });

                socket.on('leave-room', ({ roomId }) => {
                    socket.leave(roomId);
                    if (usersInRooms[roomId]) {
                        usersInRooms[roomId] = usersInRooms[roomId].filter(user => user.id !== socket.id);
                        updateUsersInRoom(roomId);
                    }
                });

                socket.on('disconnect', () => {
                    for (const roomId in usersInRooms) {
                        usersInRooms[roomId] = usersInRooms[roomId].filter(user => user.id !== socket.id);
                        updateUsersInRoom(roomId);
                    }
                });

                function updateUsersInRoom(roomId) {
                    const usersInRoom = usersInRooms[roomId] || [];
                    io.to(roomId).emit('update-users', usersInRoom);
                }
            });
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
    }
};

startServer();
