export default function setupSockets(io) {
  io.on("connection", (socket) => {
    const user = socket.request.session.user;

    socket.on("new-selection", (data) => {
      if (!user) return;

      io.emit("leaderboard-update", { username: user.username, ...data });
    });
    socket.on("disconnect", () => {
    });
  });
}
