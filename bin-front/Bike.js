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

    var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
    loader.geometries = new THREE.Geometry();
    // loader.geometries.translate(-100, 0, -1);
    loader.options.centerGeometry = true;

    loader.load(
		// resource URL
		bikeURL,
		// Function when resource is loaded
		function ( collada ) {
			console.log("load");
            self.obj = collada.scene;
            scene.add(self.obj);

            self.obj.receiveShadow = true;

            if (callback){
                callback();
            }
            // self.bike.rotation.y = Math.PI / 2;
		},
		// Function called when download progresses
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		}
	);

    socket.on("sync", function(data){
        var player = data.players[self.id];

        self.setPos(player.pos.x, player.pos.y);
        self.setDir(player.dir.x, player.dir.y);

        self.v = player.v;

        self.obj.rotateOnAxis(new THREE.Vector3(0, 0, 1), player.deg);
        self.turn = player.deg;
    });
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
