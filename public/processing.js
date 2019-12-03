var socket = io('http://localhost:8888');

socket.on('server-sends-user-register-failed',function(){
    alert('Username exists.')
});

socket.on('server-sends-user-register-successfully', function(data) {
    $('#currentUser').html(data);
    $('#loginForm').hide();
    $('#chatForm').show();
});

socket.on('server-sends-user-online-list',function(data) {
    $('#boxContent').html("");
    data.forEach(function(i) {
        $('#boxContent').append("<div class='userOnline'>" + i + "</div>");
    });
});
socket.on('server-sends-messages', function(data) {
    $('#listMessages').append("<div class='ms'>" + data.un + ":" + data.ct +"</div>");
});

$(document).ready(function(){
    $('#loginForm').show();
    $('#chatForm').hide();

    $('#btnRegister').click(function() { 
        socket.emit('client-sends-username',$('#txtUsername').val());
    });

    $('#btnLogout').click(function() {
        socket.emit('client-logout')
        $('#loginForm').show();
        $('#chatForm').hide();  
    });

    $('#btnSend').click(function() {
        socket.emit('client-chat',$('#txtMessage').val());
    });
});