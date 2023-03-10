import { Server } from "socket.io";

export default function SocketHandler(req, res) {
    // It means that socket server was already initialised
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;
        let users = []
        const addUser = (userData, socketId) => {
            !users.some(user => user._id === userData?._id) && users.push({ ...userData, socketId })
        }

        const getUser = (uid) => {
            return users.find(user => user._id === uid)
        }
        const onConnection = (socket) => {
            socket.on('addUsers', userData => {
                addUser(userData, socket.id)
                io.emit('getUsers', users)
            })
            socket.on('removeUser', id => {
                const removeduser = users.filter(user => user._id != id)
                io.emit('getUsers', removeduser)
            })

            socket.on('sendMessage', data => {
                const user = getUser(data.recieverId)
                io.to(user.socketId).emit('getMessage', data)
            })

        };
        io.on("connection", onConnection);
        console.log("Setting up socket");
        res.end();
    } else {
        console.log("Already set up");
        res.end();
        return;
    }

}
export const config = {
    api: {
        bodyParser: false
    }
};