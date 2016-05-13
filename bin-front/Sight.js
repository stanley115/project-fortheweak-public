"use strict";

var configData = require("./config"),
    AbstractAsset = require("./AbstractAsset");

var DEFAULT_SIGHT = "default";

var Sight = function(scene, config, callback){
    var self = this;
    config = config || {};
    AbstractAsset.call(this, scene, config);

    var sightURL = configData.sight[config.sight || DEFAULT_SIGHT];

    var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
    loader.geometries = new THREE.Geometry();
    // loader.geometries.translate(-100, 0, -1);
    loader.options.centerGeometry = true;

    loader.load(
		// resource URL
		sightURL,
		// Function when resource is loaded
		function ( collada ) {
			console.log("load");
            self.obj = collada.scene;
            scene.add(self.obj);

            if (callback){
                callback();
            }
		},
		// Function called when download progresses
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		}
	);
}
Sight.prototype = Object.create(AbstractAsset.prototype);

module.exports = Sight;
