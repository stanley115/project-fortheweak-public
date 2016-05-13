"use strict";

var configData = require("./config"),
    AbstractAsset = require("./AbstractAsset");

var DEFAULT_SIGHT = "default";

var Sight = function(scene, config, callback){
    var self = this;
    config = config || {};
    AbstractAsset.call(this, scene, config);

    var sightURL = configData.sight[config.sight || DEFAULT_SIGHT];

    this.loadFromUrl(sightURL, scene, callback);
}
Sight.prototype = Object.create(AbstractAsset.prototype);

module.exports = Sight;
