const { Server } = require("socket.io");

const setup_socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on('connect',(socket)=>{
    console.log('connected successfuly backend side with id ',socket.id);

     //#socket.on to disconnect 
     socket.on('disconnect',()=>{
        console.log('socket is disconncted successfuly here with id',socket.id)
      })

    //#socket.emit to send particular socket
    // socket.emit('send_msg',`hello ${socket.id}`);

    //#socket.brodcast to send msg to all other socket except sender
    // socket.broadcast.emit('send_broadcast_msg',`a new user with socket id ${socket.id} is connected successfuly`)

    // socket.on('receive_msg',(msg)=>{
    //   console.log('message recieved from frontend',msg)
    //   io.emit('new_message',msg) ;
    // })

    // socket.on('receive_new_msg',(obj)=>{
    //   console.log(obj,'obj=....')
    //   socket.to(obj.id).emit('one_to_one',obj.msg); //no empact of socket and io on to
    // });

    // //create rooms here
    // socket.on('create_room', (room) => {
    //   socket.join(room); // No callback here
    //   console.log(`Socket ${socket.id} joined room ${room}`); // Log confirmation
    // });


   
  })
};

module.exports=setup_socket