'use strict';
const PluginError = require('plugin-error');
const through = require('through2');
const dargs = require('dargs');
const resolveCwd = require('resolve-cwd');
const execa = require('execa');

const BINARY = require.resolve('ava/cli.js');

module.exports = options => {
	options = {
		silent: false,
		...options
	};

	const files = [];

	return through.obj((file, encoding, callback) => {
		if (file.isNull()) {
			callback(null, file);
			return;
		}

		if (file.isStream()) {
			callback(new PluginError('gulp-ava', 'Streaming not supported'));
			return;
		}

		files.push(file.path);

		callback(null, file);
	}, async callback => {
		const args = [BINARY].concat(files, '--color', dargs(options, {excludes: ['nyc']}));

		if (options.nyc) {
			const nycBin = resolveCwd('nyc/bin/nyc.js');

			if (!nycBin) {
				callback(new PluginError('gulp-ava', 'Couldn\'t find the `nyc` binary'));
				return;
			}

			args.unshift(nycBin);
		}

		const subprocess = execa(process.execPath, args, {buffer: true});

		if (!options.silent) {
			subprocess.stdout.pipe(process.stdout);
			subprocess.stderr.pipe(process.stderr);
		}

		try {
			await subprocess;
			callback();
		} catch (_) {
			callback(new PluginError('gulp-ava', 'One or more tests failed'));
		}
	});
};
