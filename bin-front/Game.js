/**
 * Game module
 */
"use strict";
var async = require("async"),
    Background = require('./Background'),
    Player = require('./Player'),
    Display = require('./Display'),
    Wall = require('./Wall');
var clock = new THREE.Clock(),
    scene = new THREE.Scene();

var Game = function(config){
    config = config || {};

    var self = this;
    this.display = null;
    this.players = null;
    this.controls = null;
    this.background = null;

    this.tmpWalls = [];

    this.role = config.role || "viewer";

    async.series([
        function(callback){
            // player
            self.players = [];
            async.forEachOf(config.players, function(player, id, callback){
                player.id = id;
                self.players[id] = new Player(scene, player, callback);
            }, function(err){
                if (err) console.error("construct player", err);
                callback();
            });
        },
        function(callback){
            // wall
            socket.on("wall", function(data){
                var start = new THREE.Vector2(data.start.x, data.start.y),
                    end = new THREE.Vector2(data.end.x, data.end.y);
                if (data.createNewPt){
                    self.tmpWalls[data.id] = new Wall(scene, {
                        color: config.players[data.id].color,
                        start: start,
                        end: end
                    });
                }else {
                    self.tmpWalls[data.id].set(start, end);
                }
            });

            callback();
        },
        function(callback){
            // display
            self.display = new Display(scene, {
                role: config.role,
                player: self.players[config.role] || null
            });

            callback();
        },
        function(callback){
            // controls
            self.controls = self.display.controls;

            if (config.role != "viewer"){
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
        // self.player.update(dt);
        self.display.update(dt);

        if (self.controls.getTurnDeg){
            socket.emit("deg", self.controls.getTurnDeg());
        }
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
