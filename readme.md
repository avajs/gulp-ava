# gulp-ava [![Build Status](https://travis-ci.org/sindresorhus/gulp-ava.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-ava)

> Run [AVA](https://ava.li) tests


## Install

```
$ npm install --save-dev gulp-ava
```


## Usage

```js
const gulp = require('gulp');
const ava = require('gulp-ava');

gulp.task('default', () =>
	gulp.src('test.js')
		// gulp-ava needs filepaths so you can't have any plugins before it
		.pipe(ava())
);
```


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
