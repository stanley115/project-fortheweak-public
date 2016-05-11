"use strict";

var Clock = require("clock.js");
var async = require("async");
var Player = require("./Player");
var DEFAULT_FPS = 60;

var Game = function(io, config){
    this.clock = new Clock();
    this.io = io;

    this.roomID = config.roomID;

    // init sockets
    this.players = config.players.map(function(ele, idx){
        ele.roomID = config.roomID;
        return new Player(ele, idx, config.players.length);
    });

    this.viewers = config.viewers;
}

Game.prototype.sync = function () {
    var obj = {};

    obj.players = this.players.map(function(player){
        return player.toObj();
    });

    // send object to all
    this.io.to(this.roomID).emit("sync", obj);
};

Game.prototype.update = function(dt){
    var self = this;
    // TODO: detect collision

    async.series([
        // update things with order
        // players
        function(callback){
            async.forEach(self.players, function(player, callback){
                player.update(dt, callback);
            }, function(err){
                if (err) console.error("Update player", err);
                callback();
            });
        },
        // collision to wall
        function(callback){
            async.forEach(self.players, function(player, callback){
                player.dead = player.dead || self.players.reduce(function(prev, tPlayer){
                    return prev || player.hitWall(tPlayer.wall);
                }, false);
                callback();
            }, function(err){
                if (err) console.error("Detect wall", err);
                callback();
            });
        }
    ]);


}

Game.prototype.start = function () {
    var self = this;
    this.clock.tick();

    setInterval(function(){
        self.clock.tick();
        var dt = self.clock.deltaTime / 1000;

        self.update(dt);

        self.sync();

    }, 1000 / DEFAULT_FPS);

};

module.exports = Game;
