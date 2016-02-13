 'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var extend = require('extend');
var pkgConf = require('pkg-conf');

var Api = require('ava/api.js');
var Logger = require('ava/lib/logger');

var conf = pkgConf.sync('ava');

module.exports = function (options) {
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
		options = extend({
			failFast: false,
			serial: false,
			require: [],
			cache: true
		}, conf, options);

		var api = new Api(files, {
			failFast: options.failFast,
			serial: options.serial,
			require: options.require,
			cacheEnabled: options.cache !== false
		});
		var reporter = ({
			tap: 'ava/lib/reporters/tap',
			verbose: 'ava/lib/reporters/verbose'
		})[options.reporter] || 'ava/lib/reporters/mini';
		var logger = new Logger();

		logger.api = api;
		logger.use(require(reporter)());

		gutil.log('gulp-ava:');
		logger.start();

		api.on('test', logger.test);
		api.on('error', logger.unhandledError);

		api.on('stdout', logger.stdout);
		api.on('stderr', logger.stderr);

		api.run()
			.then(function () {
				logger.finish();
			})
			.catch(function (error) {
				this.emit('error', new gutil.PluginError('gulp-ava', error));
			}.bind(this));
	});
};
