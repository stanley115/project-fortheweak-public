/**
 * Bike object
 */
"use strict";
var configData = require("./config");

var DEFAULT_BIKE = "tron",
    DEFAULT_VELOCITY = 30;

var AbstractAsset = require("./AbstractAsset.js");

var Bike = function(scene, config, callback){
    AbstractAsset.call(this, scene, config);
    var self = this;
    config = config || {};

    this.v = DEFAULT_VELOCITY;
    this.turn = 0;
    this.id = config.id;

    var bikeURL = configData.bikes[config.bike || DEFAULT_BIKE];

    this.loadFromUrl(bikeURL, scene, callback);
}

Bike.prototype = Object.create(AbstractAsset.prototype);

Bike.prototype.update = function(dt){
    if (this.drive) {
        // get velocity
        var tv = new THREE.Vector2(this.dir.x, this.dir.z);
        // get acceleration
        var ta = new THREE.Vector2(-this.dir.z, this.dir.x);
        ta.normalize().multiplyScalar(this.turn * dt);
        // update velocity
        tv.add(ta);
        // update position and direaction
        tv.normalize();
        this.setPos(this.pos.x + tv.x * this.v * dt, this.pos.z + tv.y * this.v * dt);
        this.setDir(tv.x, tv.y);
        // this.bike.rotation.y += 0.1
        // this.obj.receiveShadow = true;
    }
}

module.exports = Bike;
