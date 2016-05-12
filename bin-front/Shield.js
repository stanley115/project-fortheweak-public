"use strict";

var AbstractAsset = require("./AbstractAsset");

var SHIELD_RADIUS = 10,
    SHIELD_ROTATE = Math.PI / 2;

var Shield = function(scene, config, callback){
    config = config || {};
    AbstractAsset.call(this, scene, config);

    this.scene = scene;
    this.turn = 0;

    var geometry = new THREE.SphereGeometry( SHIELD_RADIUS, 8, 6, 0, 6.3, 2, 3 ); // OP config, don't ask
    geometry.rotateX( - Math.PI / 2);

    var material = new THREE.MeshBasicMaterial( {
        color: 0xFF8000,
        side: THREE.DoubleSide,
        opacity: 0.08,
        transparent: true,
        fog: false
    } );

    this.obj = new THREE.Mesh( geometry, material );
    this.obj.renderOrder = 1;

    scene.add(this.obj);

    if (callback) callback();
}
Shield.prototype = Object.create(AbstractAsset.prototype);

Shield.prototype.remove = function(){
    this.scene.remove(this.obj);
}

Shield.prototype.update = function(dt){
    this.turn += SHIELD_ROTATE * dt;
    this.obj.rotateOnAxis(new THREE.Vector3(0, 0, 1), - this.turn);
}

module.exports = Shield;
