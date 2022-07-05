
let io;

export default {

    init: httpServer => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: "http://localhost:3002",
                methods: ["GET", "POST", "PUT"]
            }
        })
        return io;
    },
    getIo: () => {

        if(!io){

            throw new Error('Socket.io not initialized');
        }

        return io;
    } 
}