var DEFAULT_HEIGHT = 7,
    DEFAULT_COLOR = 0xFFFFFF;

var AbstractAsset = require('./AbstractAsset');

var Wall = function(scene, config){
    AbstractAsset.call(this, scene, config);
    var self = this;

    var geometry = new THREE.PlaneGeometry(
        config.start.distanceTo(config.end),
        DEFAULT_HEIGHT
    );
    var material = new THREE.MeshBasicMaterial( {
        color: config.color || DEFAULT_COLOR,
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true
    } );

    this.obj = new THREE.Mesh( geometry, material );
    scene.add(this.obj);
    // set position and direction
    this.setPos(
        (config.start.x + config.end.x) / 2,
        (config.start.y + config.end.y) / 2,
        DEFAULT_HEIGHT / 2
    );
    // this.setPos(0, 0, 0);
    this.setDir(
        config.start.y - config.end.y,
        config.end.x - config.start.x,
        0
    );

    if (config.callback){
        config.callback();
    }
}
Wall.prototype = Object.create(AbstractAsset.prototype);

module.exports = Wall;
