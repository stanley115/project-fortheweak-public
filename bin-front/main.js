"use strict";

//var Welcome = require('./Welcome');
var Game = require('./Game');

//var welcome = new Welcome();
var game = new Game({
  players: [{}],
    role: 0
});


var communication = require('./Communication');
require('./StylesAndFix');
game.start();

//
/*
console.log(communication);
communication.roomCreate("Test Room");
*/
