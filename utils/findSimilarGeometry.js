function compareBuffersQuick(a, b) {
	return (a.length == b.length);
}

function compareBuffersThorough(a, b) {
	for (var i = a.length - 1; i >= 0; i--) {
		if(a[i] != b[i]) return false;
	};
	return true;
}

function findSimilarGeometry(geometry, otherGeometries) {
	for (var otherGeometryName in otherGeometries) {
		var otherGeometry = otherGeometries[otherGeometryName];
		if(!compareBuffersQuick(geometry.vertices, otherGeometry.vertices)) continue;
		if(!compareBuffersQuick(geometry.uvs, otherGeometry.uvs)) continue;
		for (var i = geometry.uvs.length - 1; i >= 0; i--) {
			if(!compareBuffersQuick(geometry.uvs[i], otherGeometry.uvs[i])) continue;
		}
		if(!compareBuffersQuick(geometry.normals, otherGeometry.normals)) continue;
		if(!compareBuffersQuick(geometry.faces, otherGeometry.faces)) continue;
		if(!compareBuffersQuick(geometry.colors, otherGeometry.colors)) continue;

		if(!compareBuffersThorough(geometry.vertices, otherGeometry.vertices)) continue;
		for (var i = geometry.uvs.length - 1; i >= 0; i--) {
			if(!compareBuffersThorough(geometry.uvs[i], otherGeometry.uvs[i])) continue;
		}
		if(!compareBuffersThorough(geometry.normals, otherGeometry.normals)) continue;
		if(!compareBuffersThorough(geometry.faces, otherGeometry.faces)) continue;
		if(!compareBuffersThorough(geometry.colors, otherGeometry.colors)) continue;
		return otherGeometryName;
	}
}

module.exports = findSimilarGeometry;