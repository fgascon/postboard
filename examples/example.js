var postboard = require('..');
var express = require('express');

var app = express();

var data = {};

app.use(postboard({
  get: function(name, callback){
    console.log(data);
    callback(null, data[name]);
  },
  set: function(name, value, callback){
    data[name] = value;
    console.log(data);
    callback();
  }
}));

app.listen(3000);
