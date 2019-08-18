'use strict';
const gulp = require('gulp');
const ava = require('.');

exports.default = () => (
	gulp.src('fixture.js')
		.pipe(ava({
			verbose: true,
			nyc: true
		}))
);
