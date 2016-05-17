"use strict";
var INIT_V = 20,
    LENGTH = 2,
    WIDTH = 1,
    RADIUS =  200;

var MAX_ACC = 20,
    MAX_ALLOW_DEG = Math.PI / 15;

var Vector2 = require('./Vector2');

var Player = function(config, id, total){
    this.id = id;
    this.io = config.io;

    var posDeg = Math.PI * 2 / total * id;
    this.pos = new Vector2(Math.sin(posDeg) * RADIUS, Math.cos(posDeg) * RADIUS);
    this.dir = this.pos.multiply(-1).normalize();

    this.v = INIT_V;
    this.turn = 0;
    this.deg = 0;

    this.shield = 0;
    this.dead = false;
    this.liveTime = 0;
    this.propsHit = {speed: 0, slow: 0, shield: 0};

    this.wall = [this.coner(-1, 0)];

    this.socket = config.socket;
    this.roomID = config.roomID;
    this.name = config.name;

    initPlayerSocket(this);

    function initPlayerSocket(self){
        self.socket.on("deg", function(deg){
            deg = Math.max(deg, -Math.PI / 2);
            deg = Math.min(deg, Math.PI / 2);

            self.deg = deg;
            self.turn = deg * MAX_ACC;
        });

        self.socket.on("disconnect", function(){
            self.dead = true;
        })
    }
}

var damn = 0;
Player.prototype.update = function(dt, callback){
    if (!this.dead){
        var self = this;
        // update live time
        this.liveTime += dt;

        // update dir
        var acc = this.dir.rot(Math.PI / 2).multiply(this.turn);
        this.dir = this.dir.multiply(this.v).add(acc.multiply(dt)).normalize();

        // update pos
        this.pos = this.pos.add(this.dir.multiply(this.v * dt));

        // update walls
        var newPt = this.coner(-1.5, 0);
        var len = this.wall.length;

        var createNewPt = (len == 1 ||
            this.wall[len - 2].vecTo(this.wall[len - 1]).absDegTo(this.wall[len - 1].vecTo(newPt)) > MAX_ALLOW_DEG);
        if (createNewPt){
            this.wall.push(newPt);
        }else {
            this.wall[len - 1] = newPt;
        }

        len = this.wall.length;
        this.io.to(this.roomID).emit("wall", { // TODO: all room
            createNewPt: createNewPt,
            id: self.id,
            start: self.wall[len - 2].toObj(),
            end: self.wall[len - 1].toObj()
        });

    }

    if (callback) callback();
};

Player.prototype.coner = function(dx, dy){
    var dirX = this.dir.multiply(LENGTH * dx / 2);
    var dirY = this.dir.rot(Math.PI / 2).multiply(WIDTH * dy / 2);

    return this.pos.add(dirX).add(dirY);
}

Player.prototype.toObj = function(){
    return {
        pos: this.pos.toObj(),
        dir: this.dir.toObj(),
        v: this.v,
        deg: this.deg,
        dead: this.dead,
        shield: this.shield,
        name: this.name
    };
}

Player.prototype.toBox = function(){
    return [
        this.coner(1, 1),
        this.coner(1, -1),
        this.coner(-1, -1),
        this.coner(-1, 1)
    ];
}

Player.prototype.hitWall = function(wall){
    if (this.shield) return false;

    var box = this.toBox();
    var hit = false;

    // use for-loop for performance
    for (var i = 0; !hit && i < wall.length - 1; i++){
        hit = hit ||
            Vector2.intersect(box[0], box[2], wall[i], wall[i + 1]) ||
            Vector2.intersect(box[1], box[3], wall[i], wall[i + 1]);
    }

    return hit;
}

Player.prototype.result = function () {
    return {
        name: this.name,
        status: this.dead?"Dead":"Alive",
        props: this.propsHit,
        time: this.liveTime
    };
};

module.exports = Player;
