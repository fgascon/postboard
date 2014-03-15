var postboard = require('..');
var express = require('express');

var app = express();

var data = {};

app.use(postboard({
  get: function(name, callback){
    callback(null, data[name]);
  },
  set: function(name, value, callback){
    data[name] = value;
    callback();
  }
}));

app.listen(3000);
