'use strict';
var gulp = require('gulp');
var ava = require('./');

gulp.task('default', function () {
	return gulp.src('fixture*.js')
		.pipe(ava({verbose: true}));
});
