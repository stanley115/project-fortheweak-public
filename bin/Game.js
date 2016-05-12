"use strict";

var Clock = require("clock.js"),
    async = require("async"),
    Player = require("./Player"),
    Prop = require("./Prop"),
    Vector2 = require("./Vector2");

var DEFAULT_FPS = 30,
    PROP_PROBI = .1, // prop/sec
    SIZE = 1000,
    PROP_LIST = ["speed", "shield"];

var Game = function(io, config){
    this.clock = new Clock();
    this.io = io;

    this.roomID = config.roomID;
    this.props = {};
    this.nProps = 0;

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
        // create new props
        function(callback){
            if (Math.random() < PROP_PROBI * dt){
                var id = "prop" + (self.nProps++);
                var prop;
                do {
                    prop = new Prop({
                        pos: new Vector2(
                            Math.random() * SIZE - SIZE / 2,
                            Math.random() * SIZE - SIZE / 2
                        ),
                        prop:  PROP_LIST[Math.floor(Math.random() * PROP_LIST.length)]
                    }, id);
                } while (self.players.reduce(function(prev, player){
                    return prev || prop.hitPlayer(player);
                }, false));

                self.props[id] = prop;

                self.io.to(self.roomID).emit("addProp", prop.toObj());
            }
            callback();
        },
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
        },
        // collision to prop
        function(callback){
            for (var id in self.props){
                var prop = self.props[id];

                var hit = self.players.reduce(function(prev, player){
                    return prev || (
                        prop.hitPlayer(player)? player: null
                    );
                }, null);

                if (hit){
                    self.io.to(self.roomID).emit("delProp", id);

                    // TODO: prop effect
                    console.log(self.roomID + " Player " + hit.id + " hit prop " + id);

                    delete self.props[id];
                }
            }
            callback();
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
