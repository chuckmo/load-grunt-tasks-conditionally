'use strict';
module.exports = function (grunt) {
	require('./smartload-grunt-tasks')(grunt, {
		pattern: ['*'],
		config: require('./package'),
		scope: 'devDependencies'
	});

	grunt.initConfig({
		svgmin: {
			noop: {}
		},
		release: {}
	});

	grunt.registerTask('default', ['svgmin']);
};
