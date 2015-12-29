 'use strict';
var gutil = require('gulp-util');
var through = require('through2');

var Api = require('ava/api.js');
var Verbose = require('ava/lib/reporters/verbose');

module.exports = function () {
	var files = [];

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-ava', 'Streaming not supported'));
			return;
		}

		files.push(file.path);

		cb(null, file);
	}, function () {
		var api = new Api(files);
		var reporter = new Verbose();

		var logs = '';

		reporter.api = api;

		api.on('test', function (test) {
			logs += '\n' + reporter.test(test);
		});
		api.on('error', function (error) {
			logs += '\n' + reporter.unhandledError(error);
		});

		api.run().then(function () {
			logs += '\n' + reporter.finish();

			gutil.log('gulp-ava:\n' + logs);
		}).catch(function (error) {
			this.emit('error', new gutil.PluginError('gulp-ava', error));
		}.bind(this));
	});
};
