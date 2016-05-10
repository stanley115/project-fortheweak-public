"use strict";
var INIT_X = [100, 0, -100, 0],
    INIT_Y = [0, 100, 0, -100],
    INIT_V = 20;

var MAX_ACC = 20;

var Vector2 = require('./Vector2');

var Player = function(config, id){
    this.id = id;
    this.pos = new Vector2(INIT_X[id], INIT_Y[id]);
    this.dir = this.pos.multiply(-1).normalize();

    this.v = INIT_V;
    this.turn = 0;
    this.deg = 0;

    this.socket = config.socket;

    initPlayerSocket(this);

    function initPlayerSocket(self){
        self.socket.on("deg", function(deg){
            deg = Math.max(deg, -Math.PI / 2);
            deg = Math.min(deg, Math.PI / 2);

            self.deg = deg;
            self.turn = deg * MAX_ACC;
        })
    }
}

Player.prototype.update = function(dt, callback){
    // update dir
    var acc = this.dir.rot(Math.PI / 2).multiply(this.turn);
    this.dir = this.dir.multiply(this.v).add(acc.multiply(dt)).normalize();

    // update pos
    this.pos = this.pos.add(this.dir.multiply(this.v * dt));

    if (callback) callback();
};

Player.prototype.toObj = function(){
    return {
        pos: {x: this.pos.x, y: this.pos.y},
        dir: {x: this.dir.x, y: this.dir.y},
        v: this.v,
        deg: this.deg
    };
}

module.exports = Player;
