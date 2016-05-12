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

module.exports = Prop;
