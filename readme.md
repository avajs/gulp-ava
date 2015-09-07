# gulp-ava [![Build Status](https://travis-ci.org/sindresorhus/gulp-ava.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-ava)

> Run [AVA](https://github.com/sindresorhus/ava) tests


## Install

```
$ npm install --save-dev gulp-ava
```


## Usage

```js
var gulp = require('gulp');
var ava = require('gulp-ava');

gulp.task('default', function () {
	return gulp.src('test.js').pipe(ava());
});
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
