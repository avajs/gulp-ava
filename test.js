import test from 'ava';
import vinylFile from 'vinyl-file';
import hooker from 'hooker';
import gutil from 'gulp-util';
import m from '.';

const passes = [
	{paths: 'fixture.js:fixture2.js', pass: 2, args: []},
	{paths: 'fixture4.js', pass: 1, args: [{
		env: {NODE_ENV: 'foo'}
	}]}
];

passes.forEach(({paths, pass, args}) => test.cb(t => {
	const stream = m.apply(null, args);

	hooker.hook(process.stderr, 'write', (...chunks) => {
		if (RegExp(`${pass} (?:tests? )?passed`).test(chunks.join(' '))) {
			hooker.unhook(gutil, 'log');
			t.pass();
			t.end();
		}
	});

	stream.on('error', err => {
		t.ifError(err);
		t.end();
	});

	paths.split(/:/)
			.forEach(path => stream.write(vinylFile.readSync(path)));
	stream.end();
})
);
