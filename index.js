// Build server
const express = require("express");
const app = express();
app.use(express.static("./public"));
app.set("view engine","ejs");
app.set("views","./views");

const server = require("http").Server(app);
const io = require("socket.io")(server);
server.listen(8888);

io.on("connection", function(socket){
    console.log("There is connection: " + socket.id);
    socket.on("disconnect",function(){
        console.log(socket.id + " is disconnected")
    });
    socket.on("Client-sends-data", function(data){
        console.log(socket.id + " sends " + data);
        io.sockets.emit("Server-sends-data", data + "8888");
    });
});

app.get("/",function(req,res){
    res.render("homepage")
});