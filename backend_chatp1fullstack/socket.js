let io;

module.exports = {
    init: (server) => {
        io = require('socket.io')(server, {
            cors: {
                origin: "http://localhost:3001",
                methods: ["GET", "POST"]
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io não foi inicializado!");
        }
        return io;
    }
};
