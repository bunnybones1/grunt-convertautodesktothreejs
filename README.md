# grunt-convertautodesktothree

> A task that converts autodesk DAE and FBX models to JSON models for threejs.

To simplify the FBX/DAE to Threejs JSON format conversion.
This is a relatively complex installer, which pulls together the following:
Autodesk FBX SDK 2013.3
Python 2.6
pip
virtualenv
Three.js
It checks your system for these components, and downloads and installs them as necessary.
Currently this is written on and tested on OSX. See platform support notes below for further disclaimers.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install bunnybones1/grunt-convertautodesktothree --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-convertautodesktothree');
```

## The "convertautodesktothree" task

### Overview
In your project's Gruntfile, add a section named `convertautodesktothree` to the data object passed into `grunt.initConfig()`.

### Usage Examples

```js
grunt.initConfig({
  convertautodesktothree: {
    options: {
      // Task-specific options go here.
    },
    exampleScene: {
      options: {
        // Target-specific options go here.
        models: [
          'test/fixtures/parse.autodesk.dae'
        ]
      }
    }
  },
});
```
## Platform Support Notes

This is currently written to work on OSX with python 2.6.
Though it should be relatively simple to implement modifications for windows users, it's not something I need right now, so I'm leaving it out. I welcome modifications to support more platforms.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
