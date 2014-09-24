var _ = require('lodash');
var geometriesData;
var embedsData;
var optimizeGeometry = require('./optimizeGeometry');
var useOptimize = true;
var optimizeDecimalPlaces = 3;
var reduceRedudantGeometry = true;
var findSimilarGeometry = require('./findSimilarGeometry');
var _geometryCache; 
function saveObjectData(data, path, objectsToWrite, grunt) {
	if(data.children) {
		for(var objectName in data.children) {
			var object = data.children[objectName];
			saveObjectData(object, path + objectName + '/', objectsToWrite, grunt);
		};
		for(var objectName in data.children) {
			data.children[objectName] = objectName;
		}
	}
	objectsToWrite[path+'index'] = data;
	saveGeometryDataIfAvailable(data, path, objectsToWrite, grunt);
}

function saveGeometryDataIfAvailable(data, path, objectsToWrite, grunt) {
	if(data.geometry) {
		var geometryData = embedsData[geometriesData[data.geometry].id];
		if(useOptimize) optimizeGeometry(geometryData, optimizeDecimalPlaces);

		function queueGeometryWrite() {
			objectsToWrite['geometry/' + data.geometry] = geometryData;
		}

		if(reduceRedudantGeometry) {
			var redundantGeometryName = findSimilarGeometry(geometryData, _geometryCache);
			if(redundantGeometryName) {
				grunt.log.oklns("REUSING", redundantGeometryName);
				data.geometry = redundantGeometryName;
			}else{
				grunt.log.oklns("CREATING", data.geometry);
				_geometryCache[data.geometry] = geometryData;
				queueGeometryWrite();
			}
		} else {
			queueGeometryWrite();
		}
	}
}
function splitModel(data, path, grunt) {
	var objectsToWrite = {};
	_geometryCache = {};
	geometriesData = data.geometries;
	embedsData = data.embeds;
	var root = {
		children : data.objects
	}
	saveObjectData(root, path, objectsToWrite, grunt);
	return objectsToWrite;
}

module.exports = splitModel;
/*
		var geometryName = object.geometry;
		grunt.log.oklns(geometryName);
		var embedName = data.geometries[geometryName].id;
		var materialName = object.material;
		var clone = _.clone(data, true);
		//clean up the clone
		for(var objectNameToDelete in data.objects) {
			if(objectName == objectNameToDelete) continue;
			var geometryNameToDelete = data.objects[objectNameToDelete].geometry;
			var embedNameToDelete = data.geometries[geometryNameToDelete].id;
			delete clone.embeds[embedNameToDelete];
			delete clone.geometries[geometryNameToDelete];
			delete clone.objects[objectNameToDelete];
		}
		var materialCount = 0;
		for(var materialNameToDelete in data.materials) {
			if(materialName == materialNameToDelete) {
				materialCount++;
				continue;
			}
			delete clone.materials[materialNameToDelete];
		}
		clone.metadata = _.merge(clone.metadata, {
			geometries: 1,
			materials: materialCount,
			objects: 1
		})
		objectsToWrite[objectName+/'index.json'] = clone;
*/