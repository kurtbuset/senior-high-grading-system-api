let io

function init(server){
    const { Server } = require('socket.io')
    io = new Server(server, {
        cors: { origin: process.env.FRONTEND_URL, credentials: true }
    })

    io.on('connection', (socket) => {
        console.log('user connected: ', socket.id)

        socket.on('join', (userId) => {
            socket.join(userId)
            console.log(`user ${userId} joined their room`)
        })

        socket.on('disconnect', () => {
            console.log('user disconnected: ', socket.id)
        })
    })

    return io   
}

function getIO(){   
    if (!io) throw new Error("Socket.io not initialized")
    return io
}

module.exports = { init, getIO }    