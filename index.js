// ----------------- server setup ------------------
var express = require('express');
var app = express();
// Don't use http server directly here
// http://stackoverflow.com/questions/27393705/socketio-get-http-localhost3000-socket-io-eio-3transport-pollingt-1418187
// Otherwise SocketIO cannot listen/route directly
//var http = require('http').Server(app);
app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});
app.use('/3rdparty',express.static(__dirname + '/node_modules/'));
app.use(express.static(__dirname + '/public'));
var server_port = process.env.PORT || 8080;
var ip = require("ip");
var server_ip_address = ip.address() || '127.0.0.1';
// run application
var server = app.listen(server_port, function(){
	console.log('listening on ' + server_ip_address + ':' + server_port);
});
require("./bin/app.js")(server);
module.exports=app;
