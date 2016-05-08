var express = require('express');
module.exports = (function() {
  //'use strict';
  var api = express.Router();
  api.get('/roomCreate', function(req, res) {
    res.send('some json');
  });
  api.get('/roomJoin', function(req, res) {
    res.send('some json');
  });
  api.get('/roomLeave', function(req, res) {
    res.send('some json');
  });
  api.get('/roomList', function(req, res) {
    res.send('some json');
  });
  api.get('/roomUpdate', function(req, res) {
    res.send('some json');
  });
  return api;
})();
