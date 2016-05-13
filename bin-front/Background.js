/**
 * Game floor and background music etc.
 * TODO: BGM
 */
"use strict";
var configData = require("./config");

// var DEFAULT_GROUND = "assets/tron.png";
var DEFAULT_GROUND = "tron";
var scene = null;
var SIZE = 1000;

var Background = function(tmpScene, config){
     this.config = config || {};
     scene = tmpScene;
}

Background.prototype.createWorld = function(display){
    var light = new THREE.HemisphereLight(0xFFFFFF, 0x000000, 0.8);
	scene.add(light);

	var texture = THREE.ImageUtils.loadTexture(
			configData.floor[this.config.ground || DEFAULT_GROUND]
		);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat = new THREE.Vector2(50, 50);
	texture.anisotropy = display.renderer.getMaxAnisotropy();

	var material = new THREE.MeshPhongMaterial({
		color: 0xFFFFFF,
		specular: 0xFFFFFF,
		shininess: 100,
		shading: THREE.FlatShading,
		map: texture
	});

	var geometry = new THREE.PlaneGeometry(SIZE, SIZE);

	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
	scene.add(mesh);
}

Background.prototype.run = function(){

}

module.exports = Background;
