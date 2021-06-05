const express = require('express')
require('./db/mongoose')
var cors = require('cors')
const userRouter = require('./routers/user')
const messageRouter = require('./routers/message')
const groupRouter = require('./routers/groupMessage')
const contactRouter = require('./routers/contact')
const http = require("http");
const socketIO = require("socket.io");

const app = express()
const port = process.env.PORT

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
      origin: "*"
    }
  })

app.use(cors({origin:"*"}))
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(userRouter)
app.use(messageRouter)
app.use(groupRouter)
app.use(contactRouter)

io.on("connection", (socket)=>{
    const userId = socket.handshake.query.id
    socket.join(userId)

    socket.on("send-message", ({value,receiver,sender,name})=>{
      io.to(receiver).emit("recieved-message",{value,receiver,sender,name})
    })

    socket.on("disconnect", ()=>{
        console.log(`disconnected ${userId}`)
    })
})

const group = io.of("/group") 
group.on("connection", (grpSocket) => {
  const groupId = grpSocket.handshake.query.section
  grpSocket.join(groupId)

  grpSocket.on("send-group", ({value,grpId})=>{
    group.to(groupId).emit("recieved-group",{value,grpId})
  })

  grpSocket.on("disconnect", ()=>{
    console.log(`disconnected group ${groupId}`)
  })

});

server.listen(port, () => console.log(`Listening on port ${port}`))