import test from 'ava';
import vinylFile from 'vinyl-file';
import hooker from 'hooker';
import gutil from 'gulp-util';
import m from './';

test.cb(t => {
	const stream = m();

	hooker.hook(gutil, 'log', (...args) => {
		if (/2.*passed/.test(args.join(' '))) {
			hooker.unhook(gutil, 'log');
			t.pass();
			t.end();
		}
	});

	stream.on('error', err => t.ifError(err));
	stream.write(vinylFile.readSync('fixture.js'));
	stream.write(vinylFile.readSync('fixture-2.js'));
	stream.end();
});
