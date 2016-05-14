/**
 * Game module
 */
var async = require("async"),
    Background = require('./Background'),
    Player = require('./Player'),
    Display = require('./Display'),
    Wall = require('./Wall'),
    Prop = require('./Prop');
var clock = new THREE.Clock();

var SIZE = 1000,
    CONERS = [
        new THREE.Vector2(-SIZE / 2., SIZE / 2.),
        new THREE.Vector2(SIZE / 2., SIZE / 2.),
        new THREE.Vector2(SIZE / 2., -SIZE / 2.),
        new THREE.Vector2(-SIZE / 2., -SIZE / 2.)
    ];

var Game = function(config){
    config = config || {};

    var self = this;
    this.display = null;
    this.players = null;
    this.controls = null;
    this.background = null;

    this.scene = new THREE.Scene()

    this.tmpWalls = [];
    this.props = {};

    this.role = config.role || "viewer";

    this.gameStartListener = this.start.bind(this);
    this.gameEndListener = this.end.bind(this);

    socket.on("gameStart", this.gameStartListener);
    socket.on("gameEnd", this.gameEndListener);

    this.animateID = null;

    async.series([
        function(callback){
            // player
            self.players = [];
            async.forEachOf(config.players, function(player, id, callback){
                player.id = id;
                player.display = (id === config.role);
                self.players[id] = new Player(self.scene, player, callback);
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
                    self.tmpWalls[data.id] = new Wall(self.scene, {
                        color: config.players[data.id].wall,
                        start: start,
                        end: end
                    });
                }else {
                    self.tmpWalls[data.id].set(start, end);
                }
            });

            // init wall
            for (var i = 0; i < 4; i++){
                new Wall(self.scene, {
                    color: config.role == "viewer"? null: config.players[config.role].wall,
                    start: CONERS[i],
                    end: CONERS[(i + 1) % 4]
                });
            }

            callback();
        },
        function(callback){
            // props
            socket.on("addProp", function(config){
                self.props[config.id] = new Prop(self.scene, config);
            });

            socket.on("delProp", function(id){
                if (self.props[id]){
                    self.props[id].remove();
                    delete self.props[id];
                }
            });

            callback();
        },
        function(callback){
            // display
            self.display = new Display(self.scene, {
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
            self.background = new Background(self.scene, config.floor);
            self.background.createWorld(self.display);

            callback();
        }
    ], function(err){
        if (err) console.log(err);
        socket.emit("ready");
    });
}

Game.prototype.animate = function(t) {
    var self = this;

    function update(dt) {
        self.players.forEach(function(player){
            player.update(dt);
        })

        for (var key in self.props){
            self.props[key].update(dt);
        }

        self.display.update(dt);

        if (self.controls.getTurnDeg){
            socket.emit("deg", self.controls.getTurnDeg());
        }
    }

    function render(dt) {
    	self.display.render(dt);
    }

	this.animateID = requestAnimationFrame(self.animate.bind(self));

	update(clock.getDelta());
	render(clock.getDelta());
}

Game.prototype.start = function(){
    console.log("game start");
    this.animate();
}

Game.prototype.end = function (result) {
    console.log("game end");

    // remove listeners
    socket.removeAllListeners("sync");
    socket.removeListener("gameStart", this.gameStartListener);
    socket.removeListener("gameEnd", this.gameEndListener);
    socket.removeAllListeners("wall");
    socket.removeAllListeners("addProp");
    socket.removeAllListeners("delProp");

    // remove objects
    document.querySelector("canvas").remove();
    while (this.scene.children.length){
        this.scene.remove(this.scene.children[this.scene.children.length - 1]);
    }
    delete this.scene;
    delete this.controls;
    delete this.background;
    delete this.display.remove();
    delete this.display;
    this.players.forEach(function(player){
        delete player;
    });

    cancelAnimationFrame(this.animateID);

    delete this;
};

Game.setup = function(){
    socket.on("getReady", function(gameObj){
        console.log(gameObj);
        new Game(gameObj);
    });
}

module.exports = Game;
