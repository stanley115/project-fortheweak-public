/**
 * Player module
 * contain player position and direction, render bike
 */
"use strict";
var CAM_HEIGHT = 4.5;

var Bike = require("./Bike"),
    Shield = require("./Shield");

var Player = function(scene, config, callback){
    var self = this;

    this.shieldOn = false;
    this.shield = null;
    this.dead = false;

    this.id = config.id;
    this.bike = new Bike(scene, config, callback);

    socket.on("sync", function(data){
        var player = data.players[self.id];

        self.shieldOn = player.shield;
        self.dead = player.dead;

        self.bike.setPos(player.pos.x, player.pos.y);
        self.bike.setDir(player.dir.x, player.dir.y);
        self.bike.v = player.v;
        self.bike.obj.rotateOnAxis(new THREE.Vector3(0, 0, 1), player.deg);
        self.bike.turn = player.deg;

        if (self.shieldOn && self.shield === null){
            self.shield = new Shield(scene);
        } else if (!self.shieldOn && self.shield !== null){
            self.shield.remove();
            self.shield = null;
        }

        if (self.shieldOn){
            self.shield.setPos(player.pos.x, player.pos.y, 0);
            self.shield.setDir(player.dir.x, player.dir.y);
        }
    });
}

Player.prototype.update = function (dt) {
    // this.bike.update(dt);
    if (this.shield) this.shield.update(dt);
};

Player.prototype.getCameraPos = function(){
    var coef = 2;
    // return new THREE.Vector3(10, 10, 10);
    var dec = new THREE.Vector3(0, - (1 - Math.cos(this.bike.turn)) * CAM_HEIGHT, 0);
    var shift = (new THREE.Vector3(-this.bike.dir.z, 0, this.bike.dir.x)).multiplyScalar(Math.sin(this.bike.turn) * CAM_HEIGHT);
    return (new THREE.Vector3(this.bike.pos.x + this.bike.dir.x * coef, CAM_HEIGHT, this.bike.pos.z + this.bike.dir.z * coef)).add(dec).add(shift);
}

Player.prototype.getCameraDir = function(){
    // return new THREE.Vector3(1, 0, 1);
    return new THREE.Vector3(this.bike.dir.z, 0, -this.bike.dir.x);
}

module.exports = Player;
