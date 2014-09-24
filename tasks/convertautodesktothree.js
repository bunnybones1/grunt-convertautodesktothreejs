/*
 * grunt-convertautodesktothree
 * https://github.com/bunnybones1/grunt-convertautodesktothreejs
 *
 * Copyright (c) 2014 Tomasz Dysinski
 * Licensed under the MIT license.
 */

'use strict';

var shelljs = require('shelljs');
var derive = require('../utils/filePathDerivatives');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  // 
  grunt.registerMultiTask('convertautodesktothree', 'A task that converts autodesk 3D models to JSON models for threejs.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      python : {
        meshConverter: 'node_modules/three.js/utils/converters/fbx/convert_to_threejs.py'
      },
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        console.log(filepath);
        var shellStdOut = shelljs.exec([
          'source pyEnv/bin/activate',
          'python ' + options.python.meshConverter + ' ' + filepath + ' ' + derive.path(filepath)+derive.baseName(filepath)+'.json'
        ].join('&&'));
        grunt.log.writeln(shellStdOut.output);
        if(shellStdOut.code == 0) {
          // Print a success message.
          grunt.log.writeln('File "' + filepath + '" created.');
        }
      });

    });
  });

};
