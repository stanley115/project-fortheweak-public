"use strict";

var Clock = require("clock.js"),
    async = require("async"),
    Player = require("./Player"),
    Prop = require("./Prop"),
    Vector2 = require("./Vector2");

var DEFAULT_FPS = 30,
    PROP_PROBI = .1, // prop/sec
    SIZE = 1000;

var Game = function(config){
    var self = this;

    this.clock = new Clock();
    this.io = config.serverSocket;

    config.room = {
        roomID: config.room.room_id,
        roomName: config.room.room_name,
        roomBgm: config.room.room_bgm,
        floor: config.room.floor
    };
    this.room = config.room;
    this.clients = config.client;

    this.props = {};
    this.nProps = 0;

    // init players
    this.players = this.clients.filter(function(client){
        return client.role === "player";
    }).map(function(ele, idx, arr){
        return new Player({
            roomID: self.room.roomID,
            socket: ele.client_socket
        }, idx, arr.length);
    });

    // init ready array
    this.ready = this.clients.map(function(client, idx){
        var setReady = (function(id){
            this.ready[id] = true;
            if (this.readyCheck()){
                this.clients.forEach(function(client){
                    client.client_socket.removeListener("disconnect", setReady);
                    client.client_socket.removeListener("ready", setReady);
                });
                this.start();
            }
        }).bind(self, idx);

        client.client_socket.on("disconnect", setReady);
        client.client_socket.on("ready", setReady);

        return false;
    });

    // tell client to ready
    this.getReady();
}

Game.prototype.getReady = function () {
    var self = this;
    var players = this.clients.filter(function(client){
        return client.role === "player";
    }),
        viewers = this.clients.filter(function(client){
            return client.role === "viewer";
        });

    var gameObj = {
        floor: this.room.floor,
        bgm: this.room.roomBgm,
        players: players.map(function(player, idx){
            return {
                id: idx,
                bike: player.car,
                name: player.name
            }
        }),
        role: "viewer"
    };

    viewers.forEach(function(viewer){
        viewer.client_socket.emit("getReady", gameObj);
        callabck();
    });
    players.forEach(function(player, idx){
        gameObj.role = idx;
        player.client_socket.emit("getReady", gameObj);
    })
};

Game.prototype.readyCheck = function () {
    return this.ready.reduce(function(prev, client){
        return prev && client;
    }, true);
};

Game.prototype.sync = function () {
    var obj = {};

    obj.players = this.players.map(function(player){
        return player.toObj();
    });

    // send object to all
    this.io.to(this.room.roomID).emit("sync", obj);
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
                        prop:  Prop.PROP_LIST[Math.floor(Math.random() * Prop.PROP_LIST.length)]
                    }, id);
                } while (self.players.reduce(function(prev, player){
                    return prev || prop.hitPlayer(player);
                }, false));

                self.props[id] = prop;

                self.io.to(self.room.roomID).emit("addProp", prop.toObj());
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
            async.forEach(self.props, function(prop, callback){
                var id = prop.id;
                var hit = self.players.reduce(function(prev, player){
                    return prev || (
                        prop.hitPlayer(player)? player: null
                    );
                }, null);

                if (hit){
                    self.io.to(self.room.roomID).emit("delProp", id);

                    // TODO: prop effect
                    prop.applyEffect(hit);
                    console.log(self.room.roomID + " Player " + hit.id + " hit prop " + id);

                    delete self.props[id];
                }
                callback();
            }, function(err){
                if (err) console.log("Detect Props", err);
                callback();
            });
        }
    ]);

}

Game.prototype.checkEnd = function () {
    var nDeads = this.players.reduce(function(prev, player){
        return prev + player.dead;
    }, 0),
        nPlayers = this.players.length;

    if (nPlayers == 1){
        return nDeads == 1;
    } else {
        return nDeads >= nPlayers - 1;
    }
};

Game.prototype.result = function () {
    return this.players.map(function(player){
        return player.dead;
    });
};

Game.prototype.start = function () {
    var self = this;

    this.io.to(this.room.roomID).emit("gameStart");

    this.clock.tick();

    var loopGameInterval = setInterval(function(){
        self.clock.tick();
        var dt = self.clock.deltaTime / 1000;

        self.update(dt);

        self.sync();

        //check game end
        if (self.checkEnd()){
            console.log("Game End:", self.room.roomID);
            self.io.to(self.room.roomID).
                emit("gameEnd", self.result());
            clearInterval(loopGameInterval);
        }
    }, 1000 / DEFAULT_FPS);

};

module.exports = Game;
