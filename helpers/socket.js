module.exports = function (server) {
  global.io = require("socket.io")(server);

  io.on("connection", async (socket) => {


    const groupIdArray = socket.handshake.query.groupId.split(',')
    console.log(groupIdArray,"groupIdArray");

    socket.join(socket.handshake.query.userId);
    socket.join(groupIdArray);
   


    console.log(socket.id);
    console.log(socket.handshake.query.userId, "socket.handshake.query.userId");
    console.log(socket.handshake.query.groupId, "socket.handshake.query.groupId");
    console.log(socket.rooms);  
  });
};
