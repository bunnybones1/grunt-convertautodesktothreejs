var fs = require('fs');

function ensureDirectoryExists(path, callback) {
	var path = path.substring(0, path.lastIndexOf('/'));
	var stepsAlongPath = path.split('/');
	var path = stepsAlongPath.shift();
	while(stepsAlongPath.length > 0) {
		path += '/' + stepsAlongPath.shift();
		if(!fs.existsSync(path)) {
			fs.mkdirSync(path);
		}
	}
	callback();	
};
module.exports = ensureDirectoryExists;