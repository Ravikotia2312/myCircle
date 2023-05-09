module.exports = function (server) {
    global.io = require("socket.io")(server)

    io.on("connection", (socket) => {
  socket.emit("hello", "world");

  console.log(socket.id);
});

}