var DEFAULT_HEIGHT = 7,
    DEFAULT_COLOR = "#FFFFFF";

var AbstractAsset = require("./AbstractAsset"),
    configData = require("./config");

var Wall = function(scene, config){
    AbstractAsset.call(this, scene, config);
    var self = this;

    this.height = config.height || DEFAULT_HEIGHT;

    this.geometry = new THREE.PlaneGeometry(1, this.height);

    var material = new THREE.MeshBasicMaterial( {
        color: config.color || DEFAULT_COLOR,
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true
    } );

    this.obj = new THREE.Mesh( this.geometry, material );
    scene.add(this.obj);

    // set position and direction
    this.set(config.start, config.end);

    if (config.callback){
        config.callback();
    }
}
Wall.prototype = Object.create(AbstractAsset.prototype);

Wall.prototype.set = function (start, end) {
    this.obj.scale.x = start.distanceTo(end);

    // set position and direction
    this.setPos(
        (start.x + end.x) / 2,
        (start.y + end.y) / 2,
        this.height / 2
    );
    // this.setPos(0, 0, 0);
    this.setDir(
        start.y - end.y,
        end.x - start.x,
        0
    );
};

module.exports = Wall;
