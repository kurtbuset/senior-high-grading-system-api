let io;

function init(server) {
  const { Server } = require("socket.io");

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "https://frontend-grado-production.up.railway.app",
  ].filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`user ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected: ", socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

module.exports = { init, getIO };
