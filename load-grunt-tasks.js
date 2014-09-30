'use strict';
var path = require('path');
var findup = require('findup-sync');
var multimatch = require('multimatch');
var glob = require('multi-glob');

function arrayify(el) {
	return Array.isArray(el) ? el : [el];
}

module.exports = function (grunt, options) {
	options = options || {};

	var pkgPattern = arrayify(options.pkgPattern || options.pattern || ['grunt-*']);
	var pkgConfig = options.pkgConfig || options.config || findup('package.json');
	var pkgScope = arrayify(options.pkgScope || options.scope || ['dependencies', 'devDependencies', 'peerDependencies']);
	var dir = options.dir || false;
	var dirPattern = arrayify(options.dirPattern || ['**/*.js']);
	var smartLoad = options.smartLoad || false;


	if (typeof pkgConfig === 'string') {
		pkgConfig = require(path.resolve(pkgConfig));
	}

	// ensure trailing slash on dir
	if (dir){
		dir = dir.replace(/\/?$/, '/');
	}

	// prepare package tasks
	pkgPattern.push('!grunt', '!grunt-cli');

	var pkgNames = pkgScope.reduce(function (result, prop) {
		return result.concat(Object.keys(pkgConfig[prop] || {}));
	}, []);

	// prepare directory tasks
	var dirNames = [];
	if(dir){
		glob.glob(dirPattern, {sync: true, cwd: dir}, function(err, matches){
			dirNames = matches;
		})
	}

	// update patterns based on smartLoad rules
	if (smartLoad && grunt.cli.tasks.length > 0){
		var smartTasks = Object.keys(smartLoad);

		// check current task(s) for definition
		var hasSmartTaskDefinition = function(task){
			return smartTasks.indexOf(task) > -1;
		}

		if (grunt.cli.tasks.every(hasSmartTaskDefinition)){
			var newPattern = smartTasks._always || [];

			grunt.cli.tasks.forEach(function(task){
				newPattern = newPattern.concat(smartLoad[task]);
			});

			pkgPattern = newPattern;
			dirPattern = newPattern;
		}
	}

	grunt.log.debug('Current Tasks: ', grunt.cli.tasks);
	grunt.log.debug('Package Pattern:', pkgPattern);
	grunt.log.debug('Directory Pattern:', dirPattern);
	grunt.log.debug('All Package Tasks:', pkgNames);
	grunt.log.debug('All Directory Tasks:', dirNames);
	grunt.log.debug('Filtered Package Tasks:', multimatch(pkgNames, pkgPattern));
	grunt.log.debug('Filtered Directory Tasks:', multimatch(dirNames, dirPattern));

	// load package tasks
	multimatch(pkgNames, pkgPattern).forEach(grunt.loadNpmTasks);

	// load dir tasks
	multimatch(dirNames, dirPattern).forEach(function(task){
		require(process.cwd() + '/' + dir + task)(grunt);
	});
};
