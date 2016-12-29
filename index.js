'use strict';
var childProcess = require('child_process');
var gutil = require('gulp-util');
var through = require('through2');
var dargs = require('dargs');
var resolveCwd = require('resolve-cwd');

var BIN = require.resolve('ava/cli.js');

module.exports = function (opts) {
	opts = opts || {};

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
		var args = [BIN].concat(files, '--color', dargs(opts, {excludes: ['nyc']}));

		if (opts.nyc) {
			var nycBin = resolveCwd('nyc/bin/nyc.js');

			if (nycBin) {
				args.unshift(nycBin);
			} else {
				this.emit('error', new gutil.PluginError('gulp-ava', 'Couldn\'t find the `nyc` binary'));
			}
		}

		childProcess.execFile(process.execPath, args, function (err, stdout, stderr) {
			if (err) {
				this.emit('error', new gutil.PluginError('gulp-ava', stderr || stdout || err));
				cb();
				return;
			}

			cb();
			gutil.log('gulp-ava:\n' + stderr + stdout);
			this.emit('end');
		}.bind(this));
	});
};
