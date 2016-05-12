/*
 * Prop object
 */
var ROTATE_SPEED = Math.PI / 2;

var AbstractAsset = require("./AbstractAsset"),
    configData = require("./config");

var Prop = function(scene, config, callback){
    AbstractAsset.call(this, scene, config);
    var self = this;

    this.id = config.id;
    this.turn = 0;
    this.scene = scene;

    var propURL = configData.props[config.prop];

    var loader = new THREE.ColladaLoader();

    loader.options.convertUpAxis = true;
    loader.geometries = new THREE.Geometry();
    loader.options.centerGeometry = true;

    loader.load(
		// resource URL
		propURL,
		// Function when resource is loaded
		function ( collada ) {
			console.log("load");
            self.obj = collada.scene;
            scene.add(self.obj);

            self.setPos(config.pos.x, config.pos.y, 0);
            console.log(self.pos);
            // self.obj.receiveShadow = true;

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
}
Prop.prototype = Object.create(AbstractAsset.prototype);

Prop.prototype.remove = function(){
    this.scene.remove(this.obj);
}

Prop.prototype.update = function (dt) {
    if (this.obj){
        this.obj.rotateOnAxis(new THREE.Vector3(0, 1, 0), ROTATE_SPEED * dt);
    }
};

module.exports = Prop;
