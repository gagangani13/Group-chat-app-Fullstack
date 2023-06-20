const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./router/router");
const database = require("./database/database");
const { User } = require("./model/user");
const { ForgotPassword } = require("./model/forgotPassword");
require("dotenv").config();
const helmet = require("helmet");
const compression = require("compression");
const { Message } = require("./model/message");
const { Group } = require("./model/group");
const { GroupUser } = require("./model/groupUser");
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(Message);
Message.belongsTo(User);

Group.belongsToMany(User, { through: GroupUser });
User.belongsToMany(Group, { through: GroupUser });

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000/",
    methods: ["GET", "POST","DELETE","PATCH","PUT"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
})
app.use(router);
// app.use(helmet());
// app.use(compression());

//wrongUrl
app.use("/", (req, res) => {
  res.redirect("http://localhost:3000/");
});

database
  .sync()
  .then((res) => app.listen(process.env.PORT))
  .catch((err) => console.log(err));
