function optimizeBuffer(buffer, tens) {
	for (var i = buffer.length - 1; i >= 0; i--) {
		buffer[i] = (~~(buffer[i] * tens)) / tens;
	};
}

function optimizeGeometry(geometry, decimalPlaces) {
	var tens = Math.pow(10, decimalPlaces);
	optimizeBuffer(geometry.normals, tens);
	if(geometry.uvs) {
		for (var i = geometry.uvs.length - 1; i >= 0; i--) {
			optimizeBuffer(geometry.uvs[i], tens);
		};
	}
	optimizeBuffer(geometry.vertices, tens);
}

module.exports = optimizeGeometry;