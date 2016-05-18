var AbstractAsset = require("./AbstractAsset"),
    configData = require("./config");

var Pointer = function(scene, config, callback){
    AbstractAsset.call(this, scene, config);
    var self = this;

    var pointerURL = configData.pointer;

    this.scene = scene;

    this.loadFromUrl(pointerURL, scene, function(){
        self.obj.renderOrder = 10;
        if (callback) callback();
    });
}
Pointer.prototype = Object.create(AbstractAsset.prototype);

Pointer.prototype.set = function (cur, tar) {
    // set position and direction
    this.setPos(
        cur.x, cur.y
    );
    // this.setPos(0, 0, 0);
    this.setDir(
        tar.x - cur.x,
        tar.y - cur.y
    );
};

Pointer.prototype.remove = function () {
    this.scene.remove(this.obj);
    delete this;
};

module.exports = Pointer;
