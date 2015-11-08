'use strict';
var test = require('ava');
var vinylFile = require('vinyl-file');
var hooker = require('hooker');
var gutil = require('gulp-util');
var ava = require('./');

test(function (t) {
	t.plan(1);

	var stream = ava();

	hooker.hook(gutil, 'log', function (str) {
		str = [].join.call(arguments, ' ');

		if (/2 tests passed/.test(str)) {
			hooker.unhook(gutil, 'log');
			t.pass();
		}
	});

	stream.on('error', t.error.bind(t));
	stream.write(vinylFile.readSync('fixture.js'));
	stream.write(vinylFile.readSync('fixture2.js'));
	stream.end();
});
