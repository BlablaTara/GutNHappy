
export default function setupSockets(io) {

    io.on("connection", (socket) => {
        const user = socket.request.session.user;
        console.log("A client is connected", user?.username || "Unknown");

        socket.on("new-selection", (data) => {
            if (!user) return;

            console.log(`${user.username} added a new ${data.type}`);

            io.emit("leaderboard-update", { username: user.username, ...data });
        });
        socket.on("disconnect", () => {
            console.log("A client disconnected", socket.id);
        });
    });
}
