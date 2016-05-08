// ----------------- server setup ------------------
var express = require('express'),
	app = express(),
	http = require('http').Server(app);
  
//Must ,otherwise route would not be captured...
var io = require('socket.io').listen(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

app.use('/3rdparty',express.static(__dirname + '/node_modules/'));
app.use(express.static(__dirname + '/public'));

var server_port = process.env.PORT || 8080;
var ip = require("ip");
var server_ip_address = ip.address() || '127.0.0.1';
app.listen(server_port, function(){
	console.log('listening on ' + server_ip_address + ':' + server_port);
});

// run application
require("./bin/app.js")(http,io);
module.exports=app;
