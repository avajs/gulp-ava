'use strict';
const gutil = require('gulp-util');
const through = require('through2');
const dargs = require('dargs');
const resolveCwd = require('resolve-cwd');
const execa = require('execa');

const BIN = require.resolve('ava/cli.js');
const HUNDRED_MEGABYTES = 1000 * 1000 * 100;

module.exports = opts => {
	opts = Object.assign({
		silent: false
	}, opts);

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
	}, cb => {
		const args = [BIN].concat(files, '--color', dargs(opts, {excludes: ['nyc']}));

		if (opts.nyc) {
			const nycBin = resolveCwd('nyc/bin/nyc.js');

			if (!nycBin) {
				cb(new gutil.PluginError('gulp-ava', 'Couldn\'t find the `nyc` binary'));
				return;
			}

			args.unshift(nycBin);
		}

		const ps = execa(process.execPath, args, {
			// TODO: Remove this when `execa` supports a `buffer: false` option
			maxBuffer: HUNDRED_MEGABYTES
		});

		if (!opts.silent) {
			ps.stdout.pipe(process.stdout);
			ps.stderr.pipe(process.stderr);
		}

		ps.then(() => {
			cb();
		}).catch(err => {
			cb(new gutil.PluginError('gulp-ava', err));
		});
	});
};
