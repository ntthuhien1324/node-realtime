// Build server
const express = require("express");
const app = express();
app.use(express.static("./public"));
app.set("view engine","ejs");
app.set("views","./views");

const server = require("http").Server(app);
const io = require("socket.io")(server);
server.listen(8888);

var userArr = [];

io.on("connection", function(socket){
    console.log("There is connection: " + socket.id);
    socket.on("disconnect",function(){
        console.log(socket.id + " is disconnected")
    });
    socket.on("Client-sends-data", function(data){
        console.log(socket.id + " sends " + data);
        //Send to all ids.
        // io.sockets.emit("Server-sends-data", data + "8888");

        //Send to id
        socket.emit("Server-sends-data", data + "8888");

        //send to other ids
        // socket.broadcast.emit("Server-sends-data", data + "8888");
    });

    socket.on("client-sends-username", function(data) {
        if (userArr.indexOf(data)>=0) {
            //fail
            socket.emit("server-sends-user-register-failed");
        } else {
            //success
            userArr.push(data);
            socket.username = data;
            socket.emit("server-sends-user-register-successfully",data);
            io.sockets.emit('server-sends-user-online-list',userArr);
        }
    });

    socket.on("client-logout", function() {
        userArr.splice(
            userArr.indexOf(socket.username),1
        );
        socket.broadcast.emit('server-sends-user-online-list',userArr);
    })

    socket.on("client-chat", function(data) {
        console.log(data);
        io.sockets.emit('server-sends-messages', {un:socket.username, ct:data});
    });
});

// app.get("/",function(req,res){
//     res.render("homepage")
// });

app.get("/",function(req,res){
    res.render("demochat")
});