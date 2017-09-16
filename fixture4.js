import test from 'ava';

test('env', t => {
	t.is(process.env.NODE_ENV, 'foo');
});
