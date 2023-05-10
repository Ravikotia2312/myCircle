module.exports = function (server) {
    global.io = require("socket.io")(server)

    io.on("connection", async(socket) => {
        
        socket.join(socket.handshake.query.userId);
            // io.to(socket.handshake.query.userId).emit(socket.handshake.query.userId, "Kotia")
          // server-side

            socket.on("test", (arg) => {
                  
                   console.log(io.to(arg).emit(arg, "Kotia"),"+++++++++++++++++++++++++++++++++++++++++====");
                console.log(arg, "arg"); // world
            });


             console.log(socket.id);
             console.log(socket.handshake.query.userId, "socket.handshake.query.userId");
             console.log(socket.rooms); 

}); 


}