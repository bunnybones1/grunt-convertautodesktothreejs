function baseName(filepath) {
	return filepath.substring(filepath.lastIndexOf('/') + 1, filepath.lastIndexOf('.'));
};

function fileName(filepath) {
	return filepath.substring(filepath.lastIndexOf('/') + 1, filepath.length);
};

function path(filepath) {
	return filepath.substring(0, filepath.lastIndexOf('/') + 1);
};

module.exports = {
	path: path,
	fileName: fileName,
	baseName: baseName
};