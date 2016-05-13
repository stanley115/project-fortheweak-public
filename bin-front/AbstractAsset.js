/**
 * Abstract Asset, basic functions of an object in world
 */
"use strict";

var AssetLoader = require("./AssetLoader");

var AbstractAsset = function(scene, config){
    config = config || {};
    this.obj = null;
    this.offset = config.offset || new THREE.Vector3(0, 0, 0);
    this.pos = new THREE.Vector3(0, 0, 0);
    this.dir = new THREE.Vector3(1, 0, 0);
}

AbstractAsset.prototype.setPos = function(x, y, z){
    if (x !== undefined && y != undefined){
        this.pos = new THREE.Vector3(x, z || this.pos.y, y);
    }
    this.pos.add(this.offset);
    this.obj.position.copy(this.pos);
}

AbstractAsset.prototype.setDir = function(x, y, z){
    var tmp = this.pos.clone();
    if (x !== undefined && y != undefined){
        this.dir = new THREE.Vector3(x, z || 0, y);
    }
    tmp.add(this.dir);
    this.obj.lookAt(tmp);
};

AbstractAsset.prototype.getPos = function () {
    return this.pos.clone();
};

AbstractAsset.prototype.getPos2 = function(){
    return new THREE.Vector2(this.pos.x, this.pos.z);
};

AbstractAsset.prototype.getDir2 = function () {
    return new THREE.Vector2(this.dir.x, this.dir.z);
};

AbstractAsset.prototype.loadFromUrl = function (url, scene, callback) {
    var self = this;
    AssetLoader(url, function(obj){
        self.obj = obj;
        self.obj.receiveShadow = true;
        scene.add(obj);

        if (callback) callback();
    })
};

module.exports = AbstractAsset;
