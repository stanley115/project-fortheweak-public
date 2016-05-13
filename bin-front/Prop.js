/*
 * Prop object
 */
var ROTATE_SPEED = Math.PI / 2;

var AbstractAsset = require("./AbstractAsset"),
    AssetLoader = require("./AssetLoader"),
    configData = require("./config");

var Prop = function(scene, config, callback){
    AbstractAsset.call(this, scene, config);
    var self = this;

    this.id = config.id;
    this.turn = 0;
    this.scene = scene;

    var propURL = configData.props[config.prop];

    this.loadFromUrl(propURL, scene, function(){
        self.setPos(config.pos.x, config.pos.y, 0);
        if (callback) callback();
    });
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
