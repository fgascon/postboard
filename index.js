
module.exports = function(storage){
  
  return function(req, res, next){
    var method = req.method.toLowerCase();
    if(method === 'get'){
      storage.get(req.path, function(err, data){
        if(err) return next(err);
        else if(data) res.send(data);
        else next();
      });
    }else if(method === 'post'){
      req.setEncoding('utf8');
      var body = '';
      req.on('data', function(chunk){
        body += chunk;
      });
      req.on('end', function(){
        storage.set(req.path, body, function(err){
          if(err) next(err);
          res.send(body);
        });
      });
    }else{
      next();
    }
  };
};
