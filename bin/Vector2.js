var Vector2 = function(x, y){
    this.x = x || 0;
    this.y = y || 0;
}

Vector2.prototype.mag = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector2.prototype.add = function(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
}

Vector2.prototype.multiply = function (s) {
    return new Vector2(this.x * s, this.y * s);
};

Vector2.prototype.normalize = function (){
    return this.multiply(1. / this.mag());
}

Vector2.prototype.rot = function(deg){
    var sin = Math.sin(deg), cos = Math.cos(deg);
    return new Vector2(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
}

module.exports = Vector2;
