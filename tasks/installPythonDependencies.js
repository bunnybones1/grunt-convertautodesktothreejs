/*
 * grunt-convertautodesktothree
 * https://github.com/bunnybones1/grunt-convertautodesktothreejs
 *
 * Copyright (c) 2014 Tomasz Dysinski
 * Licensed under the MIT license.
 */

'use strict';

var shelljs = require('shelljs');
var Download = require('download');
var progress = require('download-status');
var targz = require('tar.gz');
var prompt = require('prompt');
var copy = require('directory-copy')

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  // 
  grunt.registerMultiTask('installPythonDependencies', 'A task that sets up Python and the autodesk FBX SDK for you.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var done = this.async();

    var options = this.options({
      pythonPath : '/usr/bin/python2.6',
      fbxSDKPath : '/Applications/Autodesk/FBX Python SDK/2013.3'
    });
    grunt.log.writeln('Checking for python 2.6');
    if(grunt.file.exists(options.pythonPath)) {
      grunt.log.ok('OK');
    } else {
      grunt.log.error('Python 2.6 not found! Install python 2.6 and try again, or provide path to python 2.6 as option: pythonPath');
      done();
      return;
    }

    grunt.log.writeln('Checking for virtualenv');
    var shellStdOutVirtualEnv = shelljs.exec('virtualenv --version');
    if(shellStdOutVirtualEnv.output.indexOf('not found') == -1) {
      grunt.log.ok('OK');
    } else {
      grunt.log.error('virtualenv not found! Attempting to install virtualenv via pip');

      grunt.log.writeln('Checking for pip');
      var shellStdOutPip = shelljs.exec('pip --version');
      if(shellStdOutPip.output.indexOf('not found') == -1) {
        grunt.log.ok('OK');
      } else {
        grunt.log.error('pip not found! Attempting to install pip via python script');
        var download = new Download()
        .get('https://bootstrap.pypa.io/get-pip.py')
        .dest('./temp')
        .use(progress());
        download.run(function (err, files, stream) {
          if (err) {
              throw err;
          }

          grunt.log.ok('File downloaded successfully!');
          grunt.log.writeln('Installing pip');

          var shellStdOutInstallPip = shelljs.exec('sudo python ./temp/get-pip.py');
          done();
        });
      }
      var shellStdOutInstallVirtualEnv = shelljs.exec('pip install virtualenv');
    }

    grunt.log.writeln("Checking if virtualenv already created");
    if(grunt.file.exists('./pyEnv')) {
      grunt.log.ok("OK");
    } else {
      grunt.log.error("Nope! Initializing pyEnv");
      var shellStdOutSetupVirtualEnv = shelljs.exec('virtualenv -p /usr/bin/python2.6 pyEnv');
    }

    function copyFBXSDKfilesToPyEnv() {
      grunt.log.writeln("Copying FBX SDK files into pyEnv");
      copy({
          src: options.fbxSDKPath + '/include',
          dest: './pyEnv/include',
        },
        function(){
          copy({
              src: options.fbxSDKPath + '/lib/Python26',
              dest: './pyEnv/lib/python2.6',
            },
            function(){
              grunt.log.ok("OK");
              grunt.log.ok("CONVERTER READY!");
              done();
            }
          );
        }
      );
    }

    function installFBXSDK() {
      grunt.log.writeln('Installing FBX SDK');

      var compress = new targz().extract('./temp/fbx20133_fbxpythonsdk_mac.pkg.tgz', './temp', function(err){
        if(err) {
          grunt.log.error('A decompression error has occured. Aborting!');
          console.log(err);
          done();
        } else {
          console.log('The extraction has ended!');
          var shellStdOutInstallFBXSDK = shelljs.exec('sudo open ./temp/fbx20133_fbxpythonsdk_macos.pkg');
          prompt.get(['hit enter when installation is complete'], function(errors, results) {
            
            grunt.log.writeln("verifying FBX SDK Install");
            if(grunt.file.exists(options.fbxSDKPath)) {
              grunt.log.ok("OK");
              copyFBXSDKfilesToPyEnv();
            } else {
              grunt.log.error("Autodesk FBX SDK failed to install.");
              done();
            }
          })
        }
      });
    }

    grunt.log.writeln("Checking for Autodesk FBX SDK 2013.3");
    if(grunt.file.exists(options.fbxSDKPath)) {
      grunt.log.ok("OK");
      copyFBXSDKfilesToPyEnv();
    } else {

      if(!grunt.file.exists('./temp/fbx20133_fbxpythonsdk_mac.pkg.tgz')) {
        var download = new Download()
        .get('http://images.autodesk.com/adsk/files/fbx20133_fbxpythonsdk_mac.pkg.tgz')
        .dest('./temp')
        .use(progress());
        download.run(function (err, files, stream) {
          if (err) {
              throw err;
          }

          grunt.log.ok('File downloaded successfully!');
          installFBXSDK();
        });
      } else {
        grunt.log.ok('File download skipped!');
        installFBXSDK();
      }
    }
  });

};
