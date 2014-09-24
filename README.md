# grunt-convertautodesktothree

> A task that converts autodesk DAE and FBX models to JSON models for threejs.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-convertautodesktothree --save-dev
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

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).