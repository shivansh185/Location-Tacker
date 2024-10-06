const express = require("express")
const app = express()
const port = 8000

const socketio = require("socket.io")
const http = require("http")
const path = require("path")
const server = http.createServer(app)

const io = socketio(server)

io.on("connection", function(socket) {
    socket.on("send location", function(data) {
        io.emit("receive-location", { id: socket.id, ...data })
    })

    socket.on("disconnected", () => {
        io.emit("user-disconnected")
    })
    console.log("connected")
})

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))

app.get("/maps", (req, res) => {
    return res.render("index")
})

app.get("/", (req, res) => {
    return res.render("home")
})

server.listen(port, () => console.log(`running on port ${port}`))