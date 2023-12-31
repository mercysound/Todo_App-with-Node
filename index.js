const express = require("express");
const app = express();
require("dotenv").config()
const mongoose = require("mongoose")
const userRouter = require("./routes/user.route");
const cors = require("cors");
// var declara
const MONGOOSE_URI = process.env.MONGOOSE_URI;
const PORT = process.env.PORT;
app.get("/", (req, res)=>{
  res.send("IT'S WORKING")
})
//middleware
app.use(cors());
mongoose.connect(MONGOOSE_URI)
.then(
  (result)=>{
    console.log("Mongoose has connected");
    // console.log(result);
  })
.catch((err)=>{
  console.log("Fail to connect");
  console.log("error");
});

app.use(express.urlencoded({extended:true, limit:"50mb"}));
app.use(express.json({limit:"50mb"}))// this necessary if its seperate frontend and not ejs.
app.use("/user", userRouter);

let connection = app.listen(PORT, ()=>{
  console.log("App is listening @ port: " + PORT);
});

let socketServer = require("socket.io");
let io = socketServer(connection, {cors:{origin:"*"}
}); 

io.on("connection", (socket)=>{
  console.log("A user connected successfully");
  socket.on("sendMsg", (message)=>{
    io.emit("broadcastMsg", message)
    console.log(message)
  });
  
  console.log(socket.id)
      socket.on("disconnect", (socket)=>{
        console.log(socket.id);
        console.log("user disconnect");
      })
});