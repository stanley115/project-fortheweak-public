/**
 *  Main application
 */
module.exports = function(app){

    var io = require('socket.io').listen(app);

    io.on('connection', function(socket){



    });

}
