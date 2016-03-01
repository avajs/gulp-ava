'use strict';
var childProcess = require('child_process');
var gutil = require('gulp-util');
var through = require('through2');
var BIN = require.resolve('ava/cli.js');

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
	}, function (cb) {
		files.unshift(BIN);

		childProcess.execFile(process.execPath, files.concat('--color'), function (err, stdout, stderr) {
			if (err) {
				this.emit('error', new gutil.PluginError('gulp-ava', stderr));
				return;
			}

			cb();
			gutil.log('gulp-ava:\n' + stderr);
		}.bind(this));
	});
};
