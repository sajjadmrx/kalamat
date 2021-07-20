class socket {

    constructor(socket) {
        this.io = socket;

    }

    handel() {
        this.io.sockets.on("connection", async function (socket) {
            console.log("Connected succesfully to the socket ...");
            socket.on('disconnect', async function () {
                console.log("Disconnected from the socket ...");
            })

        });
    }


}

module.exports = socket