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
    this.background = new Background(scene, config.background);

    async.series([
        function(callback){
            // player
            console.log("RUN 1");
            self.player = new Player(scene, {
                callback: callback
            })
        }
    ], function(err){
        if (err) console.log(err);
        self.display = new Display(scene, {
            role: 'not player',
            player: self.player
        });

        self.background.createWorld(self.display);
        self.animate();
    });
}

Game.prototype.animate = function(t) {
    var self = this;

    function update(dt) {
        self.player.update(dt);
        self.display.update(dt);
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
