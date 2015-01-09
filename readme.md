# smartload-grunt-tasks

> Load multiple grunt tasks dynamically using globbing patterns. Load only the tasks you need based on the current task being run.

Usually you would have to load each task one by one, which is unnecessarily cumbersome. And despite only running a single `build` task, Grunt loads every single task which can add a second or more if it's a big project. Tell it to only load the one(s) you need based on what is being run.

This module will read the `dependencies`/`devDependencies`/`peerDependencies` in your package.json and load grunt tasks that match the provided patterns.


#### Before

Load everything you might possibly need in your Gruntfile.js

`grunt customtask:dev`

```js
require(__dirname + '/grunt/tasks/customTask.js');
require(__dirname + '/grunt/tasks/customTask2.js');
require(__dirname + '/grunt/tasks/customTask3.js');
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-sass');
grunt.loadNpmTasks('grunt-recess');
grunt.loadNpmTasks('grunt-newer');
grunt.loadNpmTasks('grunt-contrib-imagemin');
grunt.loadNpmTasks('grunt-styl');
```

#### After

Let smartload-grunt-tasks load only what you need!

`grunt customtask:dev`

```js
require('smartload-grunt-tasks')(grunt, {
	dir: 'grunt/tasks/',
	smartLoad: {
		'customtask:dev': ['customtask']
		'autoprefixer:sass': ['grunt-autoprefixer'],
		'newer:imagemin:assets_dev': ['grunt-newer', 'grunt-contrib-imagemin'],
	}
});
```


## Install

```bash
$ npm install --save-dev smartload-grunt-tasks
```


## Example config

```js
// Gruntfile.js
module.exports = function (grunt) {
	// load all grunt tasks matching the `grunt-*` pattern
	require('smartload-grunt-tasks')(grunt, {

		// in which directory (if any) do you have custom tasks?
		// Each .js file will be require'd
		dir: 'grunt/tasks/',

		// which tasks should be loaded for each CLI task argument?
		smartLoad: {
			'customtask:dev': ['grunt-styl', 'customtask'],
			'autoprefixer:sass': ['grunt-autoprefixer'],
			'newer:imagemin:assets_dev': ['grunt-newer', 'grunt-contrib-imagemin']
		}
	});

	grunt.initConfig({});
	grunt.registerTask('default', []);
}
```


## Usage examples

### Load all grunt tasks

```js
require('load-grunt-tasks')(grunt);
```

Equivalent to:

```js
require('load-grunt-tasks')(grunt, {pkgPattern: 'grunt-*'});
```

### Load all grunt-contrib tasks

```js
require('load-grunt-tasks')(grunt, {pkgPattern: 'grunt-contrib-*'});
```

### Load all grunt-contrib tasks, another non-contrib task, and every .js file in the `grunt_tasks` directory:

```js
require('load-grunt-tasks')(grunt, {
	pkgPattern: ['grunt-contrib-*', 'grunt-shell'],
	dir: 'grunt_tasks'
});
```

### Load all grunt-contrib tasks excluding one

You can exclude tasks using the negate `!` globbing pattern:

```js
require('load-grunt-tasks')(grunt, {pkgPattern: ['grunt-contrib-*', '!grunt-contrib-coffee']});
```

### Set custom path to package.json

```js
require('load-grunt-tasks')(grunt, {pkgConfig: '../package'});
```

### Only load from `devDependencies` and when running the `grunt` task, only load `grunt-contrib-sass` task:

```js
require('load-grunt-tasks')(grunt, {
	pkgScope: 'devDependencies',
	smartLoad: {
		'sass': ['grunt-contrib-sass']
	}
});
```

### Only load from `devDependencies` and `dependencies`

```js
require('load-grunt-tasks')(grunt, {pkgScope: ['devDependencies', 'dependencies']});
```

### All options in use

```js
require('load-grunt-tasks')(grunt, {
	pkgPattern: 'grunt-contrib-*',
	pkgConfig: '../package.json',
	pkgScope: 'devDependencies',
	dir: 'mycustomtasks/',
	dirPattern: '**/*.js',
	smartLoad: {
		'taskFromCLI': ['grunt-whatever']
	}
});
```


## Options

*Note: Since this was shamelessly stolen from and built upon [load-grunt-tasks](https://github.com/sindresorhus/load-grunt-tasks), it's backwards compatible; load-grunt-tasks' option keys will work here, too.*

### pkgPattern

Type: `String`, `Array`  
Default: `'grunt-*'` ([globbing pattern](https://github.com/isaacs/minimatch))

### pkgConfig

Type: `String`, `Object`  
Default: Path to nearest package.json

### pkgScope

Type: `String`, `Array`  
Default: `['dependencies', 'devDependencies', 'peerDependencies']`

### dir

Type: `String`  
Default: `false` (don't load any custom tasks)

### dirPattern

Type: `String`  
Default: `'**/*.js`

### smartLoad

Type: `Object`  
Default: `false` (load everything every time)

## License

[MIT](http://opensource.org/licenses/MIT) © [Sindre Sorhus](http://sindresorhus.com)
