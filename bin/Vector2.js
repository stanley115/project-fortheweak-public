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

Vector2.prototype.cross = function (v) {
    return this.x * v.y - v.x * this.y;
};

Vector2.prototype.absDegTo = function (v) {
    return Math.acos((this.x * v.x + this.y * v.y) / this.mag() / v.mag());
};

Vector2.prototype.vecTo = function (v) {
    return v.add(this.multiply(-1));
};

Vector2.prototype.toObj = function () {
    return {
        x: this.x,
        y: this.y
    }
};

Vector2.intersect = function(A, B, C, D){
    function s(x){
        return x >= 0? 1: -1;
    }

    var AB = A.vecTo(B);
    var CD = C.vecTo(D);

    return s(AB.cross(A.vecTo(D))) != s(AB.cross(A.vecTo(C))) &&
        s(CD.cross(C.vecTo(A))) != s(CD.cross(C.vecTo(B)));
}

Vector2.prototype.sqrDistanceTo = function(v){
    function sqr(x){return x * x;}
    return sqr(this.x - v.x) + sqr(this.y - v.y);
}

module.exports = Vector2;
