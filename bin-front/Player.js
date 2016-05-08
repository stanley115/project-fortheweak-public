/**
 * Player module
 * contain player position and direction, render bike
 */
"use strict";

var Bike = require("./Bike.js");

var Player = function(scene, config){
    this.bike = new Bike(scene, config);
}

Player.prototype.update = function (dt) {
    this.bike.update(dt);
};

Player.prototype.getCameraPos = function(){
    var coef = 2;
    // return new THREE.Vector3(10, 10, 10);
    return new THREE.Vector3(this.bike.pos.x + this.bike.dir.x * coef, 4.5, this.bike.pos.z + this.bike.dir.z * coef);
}

Player.prototype.getCameraDir = function(){
    // return new THREE.Vector3(1, 0, 1);
    return new THREE.Vector3(this.bike.dir.z, 0, -this.bike.dir.x);
}

module.exports = Player;
