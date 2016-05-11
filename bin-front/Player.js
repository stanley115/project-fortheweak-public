/**
 * Player module
 * contain player position and direction, render bike
 */
"use strict";
var CAM_HEIGHT = 4.5;

var Bike = require("./Bike.js");

var Player = function(scene, config, callback){
    this.bike = new Bike(scene, config, callback);
}

Player.prototype.update = function (dt) {
    this.bike.update(dt);
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
