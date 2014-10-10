/*
 * grunt-convertautodesktothree
 * https://github.com/bunnybones1/grunt-convertautodesktothreejs
 *
 * Copyright (c) 2014 Tomasz Dysinski
 * Licensed under the MIT license.
 */

'use strict';

var shelljs = require('shelljs'),
  derive = require('../utils/filePathDerivatives'),
  path = require('path');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  // 
  grunt.registerMultiTask('convertautodesktothree', 'A task that converts autodesk 3D models to JSON models for threejs.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    
    var options = this.options({
      python : {
        meshConverter: 'utils/threejsFbxConverter/convert_to_threejs.py'
      },
      modulePath: 'node_modules/grunt-convertautodesktothree/',
      standaloneTest: false
    });

    var modulePath = options.standaloneTest ? '' : options.modulePath;

    var pyEnvActivateCommands = {
      mac: 'source ' + path.normalize(modulePath + 'pyEnv/bin/activate'),
      win: path.normalize('pyEnv/Scripts/activate.bat')
    }
    var isWin = /^win/.test(process.platform);
    var platformSpecificActivateCommand = isWin ? pyEnvActivateCommands.win : pyEnvActivateCommands.mac;

    grunt.log.ok('standaloneTest:', options.standaloneTest);
    // Iterate over all specified file groups.
    options.models.forEach(function(filepath) {
      grunt.log.ok("converting", filepath);
      var outputFilePath = derive.path(filepath) + derive.baseName(filepath)+'.json';
      // Warn on and remove invalid source files (if nonull was set).
      if (!grunt.file.exists(filepath)) {
        grunt.log.warn('Source file "' + filepath + '" not found.');
        return false;
      } else {
        grunt.log.ok("Running converter via shell");
        var shellStdOut = shelljs.exec(platformSpecificActivateCommand);
        var shellCommand = 'python ' + path.normalize(modulePath + options.python.meshConverter) + ' ' + path.normalize(filepath) + ' ' + path.normalize(outputFilePath)
        console.log(shellCommand);
        shellStdOut = shelljs.exec(shellCommand);
        if(shellStdOut.code === 0) {
          // Print a success message.
          grunt.log.ok('File "' + outputFilePath + '" created.');
        }
      }
    });
  });
};
