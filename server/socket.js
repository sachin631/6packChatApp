const { Server } = require("socket.io");
const { NEW_MESSAGE } = require("./constant/constant");
const { v4: uuid } = require("uuid");
const user_message_model = require("./models/user.messages.model");

let userSocketIDs = new Map();

const getSockets = (users = []) => {
  return users
    .map((curelem) => userSocketIDs.get(curelem)) // Retrieve socket IDs
    .filter((id) => id); // Remove undefined socket IDs
};

const setup_socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connect", (socket) => {
    console.log("connected successfuly backend side with id ", socket.id);

    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
      const handshake_data = socket.handshake.query;
      const user_parse = JSON.parse(handshake_data.loginUserDetails);
      let user = user_parse.data;

      userSocketIDs.set(user._id, socket.id);

      const messageForRealTime = {
        content: message,
        _id: uuid(),
        sender: {
          _id: user._id,
          name: user.name,
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      const messageForDb = {
        content: message,
        sender: user._id,
        chat: chatId,
      };

      const userSockets = getSockets(members);

      io.to(userSockets).emit(NEW_MESSAGE, messageForRealTime);
      io.to(userSockets).emit(NEW_MESSAGE, chatId); //for increment on chat liek new message

      try {
        await user_message_model.create(messageForDb);
      } catch (err) {
        console.log(err);
        return err;
      }
    });

    //#socket.on to disconnect
    socket.on("disconnect", () => {
      console.log("socket is disconncted successfuly here with id", socket.id);
    });
  });
};

module.exports = setup_socket;
