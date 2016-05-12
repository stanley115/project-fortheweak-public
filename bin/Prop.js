"use strict";

var PROP_RADIUS = 3;

var Prop = function(config, id){
    var self = this;

    this.id = id;
    this.pos = config.pos;

    this.prop = config.prop;

    this.detectRange = PROP_RADIUS * PROP_RADIUS;
}

Prop.prototype.hitPlayer = function (player) {
    return !player.dead && player.pos.sqrDistanceTo(this.pos) < this.detectRange;
}

Prop.prototype.toObj = function () {
    return {
        id: this.id,
        prop: this.prop,
        pos: this.pos.toObj()
    };
};

Prop.prototype.applyEffect = function (player) {
    if (this.prop == "speed"){
        player.v *= 2;
        setTimeout(function(){
            player.v /= 2;
        }, 10000);
    } else if (this.prop == "shield"){
        player.shield++;
        setTimeout(function(){
            player.shield--;
        }, 30000);
    } else if (this.prop == "slow"){
        player.v /= 2;
        setTimeout(function(){
            player.v *= 2;
        }, 10000);
    }else {
        console.error("Prop Effect: ", "unknow prop " + this.prop);
    }
};

Prop.PROP_LIST = ["speed", "shield", "slow"];

module.exports = Prop;
