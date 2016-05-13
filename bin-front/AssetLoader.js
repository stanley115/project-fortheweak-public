
module.exports = (function(){

    var async = require("async");

    var assets = {};

    var AssetLoader = function(url, callback){
        if (url in assets){
            callback(assets[url].clone());
        } else {
            var loader = new THREE.ColladaLoader();
        	loader.options.convertUpAxis = true;
            loader.geometries = new THREE.Geometry();
            loader.options.centerGeometry = true;

            loader.load(
        		// resource URL
        		url,
        		// Function when resource is loaded
        		function ( collada ) {
        			console.log("loaded", url);
                    assets[url] = collada.scene;

                    if (callback){
                        callback(assets[url].clone());
                    }
        		},
        		// Function called when download progresses
        		function ( xhr ) {
        			console.log( url + '\n' + (xhr.loaded / xhr.total * 100) + '% loaded' );
        		}
        	);
        }
    }

    return AssetLoader;

})();
