'use strict';
var path = require('path');
var childProcess = require('child_process');
var gutil = require('gulp-util');
var through = require('through2');
var BIN = path.join('node_modules', '.bin', 'ava');

module.exports = function () {
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-ava', 'Streaming not supported'));
			return;
		}

		childProcess.execFile(BIN, [file.path, '--color'], function (err, stdout, stderr) {
			if (err) {
				cb(new gutil.PluginError('gulp-ava', err, {fileName: file.path}));
				return;
			}

			gutil.log('gulp-ava: ' + file.relative + '\n' + stderr);
			cb(null, file);
		});
	});
};
