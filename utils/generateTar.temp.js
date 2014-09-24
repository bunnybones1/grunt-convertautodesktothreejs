var tar = require('tar'),
	zlib = require('zlib'),
	fstream = require('fstream');

function generateTar() {
	fstream.Reader({
		path: _this.inputPath,
		type: 'Directory',
		filter: function () {
			var isDirectory = this.type == 'Directory'
			var willInclude = isDirectory || (_this.filesToInclude.indexOf(this.basename) != -1);
			if(willInclude && !isDirectory) console.log('adding ' + this.basename);
			return willInclude;
		}
	})
	.pipe(tar.Pack())
	.pipe(zlib.createGzip())
	.pipe(fstream.Writer(_this.outputPath));
};

module.exports = generateTar;