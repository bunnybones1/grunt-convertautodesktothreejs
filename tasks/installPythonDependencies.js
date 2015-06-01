/*
 * grunt-convertautodesktothree
 * https://github.com/bunnybones1/grunt-convertautodesktothreejs
 *
 * Copyright (c) 2014 Tomasz Dysinski
 * Licensed under the MIT license.
 */

'use strict';

var shelljs = require('shelljs'),
  Download = require('download'),
  progress = require('download-status'),
  targz = require('tar.gz'),
  prompt = require('prompt'),
  path = require('path'),
  copy = require('directory-copy');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  // 
  grunt.registerMultiTask('installPythonDependencies', 'A task that sets up Python and the autodesk FBX SDK for you.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var done = this.async();
    var plaformOptions = {
      mac: {
        pythonPath : '/usr/bin/python2.6',
        pythonPathFull : '/usr/bin/python2.6',
        fbxSDKPath : '/Applications/Autodesk/FBX Python SDK/2013.3'
      },
      win: {
        pythonPath : path.normalize('C:/python26'),
        pythonPathFull : path.normalize('C:/python26/python.exe'),
        fbxSDKPath : path.normalize('C:/Program Files/Autodesk/FBX/FBX Python SDK/2013.3')
      }
    }

    var isWin = /^win/.test(process.platform);
    var platformSpecificOptions = isWin ? plaformOptions.win : plaformOptions.mac;
    console.log(isWin);

    var options = this.options(platformSpecificOptions);
    grunt.log.writeln('Checking for python 2.6');
    if(grunt.file.exists(options.pythonPath)) {
      grunt.log.ok('OK');
    } else {
      grunt.log.error('Python 2.6 not found! Install python 2.6 and try again, or provide path to python 2.6 as option: pythonPath');
      done();
      return;
    }
    var doSetupvirtualenvAndFBXSDK = true;
    grunt.log.writeln('Checking for virtualenv');
    var shellStdOutVirtualEnv = shelljs.exec('virtualenv --version');
    if(shellStdOutVirtualEnv.output.indexOf('not found') === -1 && shellStdOutVirtualEnv.output.indexOf('not recognized') === -1) {
      grunt.log.ok('OK');
    } else {
      grunt.log.error('virtualenv not found! Attempting to install virtualenv via pip');
      doSetupvirtualenvAndFBXSDK = false;
      grunt.log.writeln('Checking for pip');
      var shellStdOutPip = shelljs.exec('pip --version');
      if(shellStdOutPip.output.indexOf('not found') === -1 && shellStdOutPip.output.indexOf('not recognized') === -1) {
        grunt.log.ok('OK');
        var shellStdOutInstallVirtualEnv = shelljs.exec('pip install virtualenv');
        setupvirtualenvAndFBXSDK();
      } else {
        grunt.log.error('pip not found! Attempting to install pip via python script');
        var download = new Download()
        .get('https://bootstrap.pypa.io/get-pip.py')
        .dest(path.normalize('./tmp'))
        .use(progress());
        download.run(function (err, files, stream) {
          if (err) {
              throw err;
          }

          grunt.log.ok('File downloaded successfully!');
          grunt.log.writeln('Installing pip');

          var pipPath = path.normalize('./tmp/get-pip.py');
          var shellStdOutInstallPip = shelljs.exec((isWin ? '' : 'sudo ') + 'python ' + pipPath);
          var shellStdOutInstallVirtualEnv = shelljs.exec('pip install virtualenv');
          setupvirtualenvAndFBXSDK();
        });
      }
    }


    function copyFBXSDKfilesToPyEnv() {
      grunt.log.writeln("Copying FBX SDK files into pyEnv");
      copy({
          src: options.fbxSDKPath + '/include',
          dest: path.normalize('./pyEnv/include'),
        },
        function(){
          copy({
              src: options.fbxSDKPath + '/lib/Python26',
              dest: path.normalize('./pyEnv/lib/python2.6'),
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

      var compress = new targz().extract('./tmp/fbx20133_fbxpythonsdk_mac.pkg.tgz', './tmp', function(err){
        if(err) {
          grunt.log.error('A decompression error has occured. Aborting!');
          console.log(err);
          done();
        } else {
          console.log('The extraction has ended!');
          var shellStdOutInstallFBXSDK = shelljs.exec('sudo open ./tmp/fbx20133_fbxpythonsdk_macos.pkg');
          prompt.get(['hit enter when installation is complete'], function(errors, results) {
            
            grunt.log.writeln("verifying FBX SDK Install");
            if(grunt.file.exists(options.fbxSDKPath)) {
              grunt.log.ok("OK");
              copyFBXSDKfilesToPyEnv();
            } else {
              grunt.log.error("Autodesk FBX SDK failed to install.");
              done();
            }
          });
        }
      });
    }

    function setupvirtualenvAndFBXSDK() {
      grunt.log.writeln("Checking if virtualenv already created");
      if(grunt.file.exists(path.normalize('./pyEnv'))) {
        grunt.log.ok("OK");
      } else {
        grunt.log.error("Nope! Initializing pyEnv");
        var shellStdOutSetupVirtualEnv = shelljs.exec('virtualenv -p ' + platformSpecificOptions.pythonPathFull + ' pyEnv');
      }

      grunt.log.writeln("Checking for Autodesk FBX SDK 2013.3");
      if(grunt.file.exists(options.fbxSDKPath)) {
        grunt.log.ok("OK");
        copyFBXSDKfilesToPyEnv();
      } else {

        if(!grunt.file.exists(path.normalize('./tmp/fbx20133_fbxpythonsdk_mac.pkg.tgz'))) {
          var download2 = new Download()
          .get('http://images.autodesk.com/adsk/files/fbx20133_fbxpythonsdk_mac.pkg.tgz')
          .dest(path.normalize('./tmp'))
          .use(progress());
          download2.run(function (err, files, stream) {
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
    }
    if(doSetupvirtualenvAndFBXSDK) {
      setupvirtualenvAndFBXSDK();
    }
  });

};
