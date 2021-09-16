class socket {

    constructor(socket) {
        this.io = socket;

    }

    handel() {
        this.io.sockets.on("connection", async (socket) => {
            // console.log("Connected succesfully to the socket ...");
            const session = socket.request.session;
            socket.userID = session.passport?.user;

            if (!socket.userID)
                return socket.disconnect();


            socket.join(socket.userID);

            socket.on('join room', chatID => {
                console.log(chatID)
            })

            socket.on('new message', message => {
                console.log(message);
                const chat = message.chat;
                const sender = message.sender
                if (!chat.users) return console.log("Chat.users not defined");


                chat.users.forEach(user => {
                    if (user == sender._id) return;
                    socket.in(user).emit('message received', message)
                })
            })


            socket.on('disconnect', async function () {
                // console.log("Disconnected from the socket ...");
            })

        });
    }
    async message_(message) {
        console.log(message);
    }


}

module.exports = socket