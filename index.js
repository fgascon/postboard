var Q = require('q');

function streamToBuffer(stream){
	var defered = Q.defer();
	var buffer = [];
	stream.setEncoding('utf8');
	stream.on('data', function(chunk){
		buffer.push(chunk);
	});
	stream.on('end', function(){
		defered.resolve(Buffer.concat(buffer));
	});
	stream.on('error', function(err){
		defered.reject(err);
	});
	return defered.promise;
}

module.exports = function(storage) {
	
	function readData(key){
		return Q.ninvoke(storage, 'get', key);
	}
	
	function writeData(key, stream){
		return streamToBuffer(stream)
			.then(function(body){
				return Q.ninvoke(storage, 'set', key, body.toString());
			});
	}
	
	function httpGet(req, res, next){
		readData(req.path)
			.then(function(value){
				if (value) {
					res.send(value);
				} else {
					next();
				}
			}, next);
	}
	
	function httpPost(req, res, next){
		writeData(req.path, req)
			.then(function(){
				res.send('success');
			}, next);
	}
	
	function httpDelete(req, res, next){
		next(); //not implemented yet
	}
	
	return function(req, res, next) {
		switch(req.method.toUpperCase()) {
			case 'GET':
				httpGet(req, res, next);
				break;
				
			case 'POST':
				httpPost(req, res, next);
				break;
				
			case 'DELETE':
				httpDelete(req, res, next);
				break;
				
			default:
				next();
		}
	};
	
};
