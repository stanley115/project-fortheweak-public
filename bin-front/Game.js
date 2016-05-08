/**
 * Game module
 */
"use strict";
var async = require("async"),
    Background = require('./Background'),
    Player = require('./Player'),
    Display = require('./Display');
var clock = new THREE.Clock(),
    scene = new THREE.Scene();

var Game = function(config){
    config = config || {};

    var self = this;
    this.display = null;
    this.player = null;
    this.controls = null;
    this.background = null;

    async.series([
        function(callback){
            // player
            console.log("RUN 1");
            self.player = new Player(scene, {
                callback: callback
            })
        },
        function(callback){
            // display
            self.display = new Display(scene, {
                role: config.role,
                player: self.player
            });

            callback();
        },
        function(callback){
            // controls
            self.controls = self.display.controls;

            if (config.role == "player"){
                self.controls.getTurnDeg = function(){
                    var tmp = new THREE.Euler();
                    tmp.setFromQuaternion(this.orientationQuaternion, "ZXY");
                    return tmp.x;
                }
            }

            callback();
        },
        function(callback){
            // background
            self.background = new Background(scene, config.background);
            self.background.createWorld(self.display);

            callback();
        }
    ], function(err){
        if (err) console.log(err);

        self.animate();
    });
}

Game.prototype.animate = function(t) {
    var self = this;

    function update(dt) {
        self.player.update(dt);
        self.display.update(dt);

        if (self.controls.getTurnDeg) self.player.bike.turn = self.controls.getTurnDeg();
    }

    function render(dt) {
    	self.display.render(dt);
    }

	requestAnimationFrame(self.animate.bind(self));

	update(clock.getDelta());
	render(clock.getDelta());
}

Game.prototype.start = function(){
    // this.animate();
}

module.exports = Game;
