const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./router/router");
const database = require("./database/database");
const { User } = require("./model/user");
const { ForgotPassword } = require("./model/forgotPassword");
require("dotenv").config();
const { Message } = require("./model/message");
const { Group } = require("./model/group");
const { GroupUser } = require("./model/groupUser");
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const path=require('path')
const _dirname=path.dirname("")
const buildPath=path.join(_dirname,"../client/build")
app.use(express.static(buildPath))
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: "https://gagan-chat-app.vercel.app",
    methods: ["GET", "POST","DELETE","PATCH","PUT"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("joinChat",(data)=>{
    socket.join(data)
    console.log(`User ${socket.id} joined chat ${data}`)
  })

  socket.on('sendMessage', (data) => {
    try {
        socket.join(data.groupId)
        io.to(data.groupId).emit('receiveMessage', data);
        console.log(data);
    } catch (error) {
      console.error('Error occurred while emitting receiveMessage event:', error);
    }
  });

  socket.on("disconnect",()=>{
    console.log(`User disconnected:${socket.id}`);
  })
})

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(Message);
Message.belongsTo(User);

Group.belongsToMany(User, { through: GroupUser });
User.belongsToMany(Group, { through: GroupUser });

app.use(router);

//wrongUrl
app.use("/", (req, res) => {
  res.redirect("https://gagan-chat-app.vercel.app/");
});

database
  .sync()
  .then((res) => server.listen(process.env.PORT))
  .catch((err) => console.log(err));
