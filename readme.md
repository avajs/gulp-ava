# gulp-ava [![Build Status](https://travis-ci.org/avajs/gulp-ava.svg?branch=master)](https://travis-ci.org/avajs/gulp-ava)

> Run [AVA](https://ava.li) tests


## Install

```
$ npm install --save-dev gulp-ava
```


## Usage

```js
const gulp = require('gulp');
const ava = require('gulp-ava');

exports.default = () => (
	gulp.src('test.js')
		// `gulp-ava` needs file paths, so you can't have any plugins before it
		.pipe(ava({verbose: true}))
);
```


## API

### ava(options?)

This plugin adheres to AVA [options](https://github.com/avajs/ava#configuration) in package.json. You can also specify options in the plugin, as seen above, but prefer the package.json approach whenever possible.

`gulp-ava` specific options:

#### silent

Type: `boolean`<br>
Default: `false`

Only print output on failure.

#### nyc

Type: `boolean`<br>
Default: `false`

Run AVA with [`nyc`](https://github.com/istanbuljs/nyc). You must have `nyc` as a devDependency. `nyc` [options](https://github.com/istanbuljs/nyc#configuring-nyc) can be defined in package.json.

#### outputFile

Type: `string`<br>
Default: `undefined`

Store a copy of the stdout of AVA as a file. Example: `tests/output/tapOutput.txt`
