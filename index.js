'use strict';
const childProcess = require('child_process');
const gutil = require('gulp-util');
const through = require('through2');
const dargs = require('dargs');
const resolveCwd = require('resolve-cwd');

const BIN = require.resolve('ava/cli.js');

module.exports = opts => {
	opts = opts || {};

	const files = [];

	return through.obj((file, enc, cb) => {
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
		const args = [BIN].concat(files, '--color', dargs(opts, {excludes: ['nyc']}));

		if (opts.nyc) {
			const nycBin = resolveCwd('nyc/bin/nyc.js');

			if (nycBin) {
				args.unshift(nycBin);
			} else {
				this.emit('error', new gutil.PluginError('gulp-ava', 'Couldn\'t find the `nyc` binary'));
			}
		}

		childProcess.execFile(process.execPath, args, (err, stdout, stderr) => {
			if (err) {
				this.emit('error', new gutil.PluginError('gulp-ava', stderr || stdout || err));
				cb();
				return;
			}

			cb();
			gutil.log(`gulp-ava:\n${stderr}${stdout}`);
		});
	});
};
