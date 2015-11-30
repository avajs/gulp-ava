import test from 'ava';
import vinylFile from 'vinyl-file';
import hooker from 'hooker';
import gutil from 'gulp-util';
import fn from './';

test.cb(t => {
	const stream = fn();

	hooker.hook(gutil, 'log', (...args) => {
		if (/2 tests passed/.test(args.join(' '))) {
			hooker.unhook(gutil, 'log');
			t.pass();
			t.end();
		}
	});

	stream.on('error', t.error.bind(t));
	stream.write(vinylFile.readSync('fixture.js'));
	stream.write(vinylFile.readSync('fixture2.js'));
	stream.end();
});
