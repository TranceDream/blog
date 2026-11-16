import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse, pointer, sortKeys, differences, toCsv, typeOf, schemaOf, MAX_SIZE } from './core.js';
test('strict parsing and numerical limits', () => {
    assert.deepEqual(parse('{"ok":true,"a":[null,1]}'), { ok: true, a: [null, 1] });
    for (const input of ['', '{bad}', '{"x":1,}', '9007199254740993', '1e400', '1e-400', ' '.repeat(MAX_SIZE + 1)])
        assert.throws(() => parse(input));
    assert.equal(parse('"9007199254740993"'), '9007199254740993');
    assert.equal(parse('0e-400'), 0);
    assert.throws(() => parse('['.repeat(82) + '0' + ']'.repeat(82)));
});
test('sorting is recursive, preserves arrays and own dangerous keys', () => {
    const value = parse('{"z":1,"a":[{"z":2,"a":1}],"__proto__":{"x":1}}');
    const sorted = sortKeys(value);
    assert.equal(JSON.stringify(sorted), '{"__proto__":{"x":1},"a":[{"a":1,"z":2}],"z":1}');
    assert.equal(JSON.stringify(value), '{"z":1,"a":[{"z":2,"a":1}],"__proto__":{"x":1}}');
});
test('JSON Pointer handles escapes, scalars and rejects inherited keys', () => {
    const value = parse('{"a/b":{"~key":[false,null]},"":42}');
    assert.equal(pointer(value, '/a~1b/~0key/0'), false);
    assert.equal(pointer(value, '/'), 42);
    assert.equal(pointer(null, ''), null);
    for (const path of ['/constructor', '/a~2b', '/a~1b/~0key/01', 'a'])
        assert.throws(() => pointer(value, path));
});
test('structural diff ignores object order but not array order', () => {
    assert.deepEqual(differences({ a: 1, b: 2 }, { b: 2, a: 1 }), []);
    assert.equal(differences([1, 2], [2, 1]).length, 2);
    assert.deepEqual(differences({ 'a/b': 1 }, {}), [{ path: '/a~1b', kind: '删除', before: 1 }]);
    assert.deepEqual(differences({}, { x: null }), [{ path: '/x', kind: '新增', after: null }]);
});
test('CSV quotes values and neutralizes formulas including headers', () => {
    assert.equal(toCsv([{ a: 'x,"y', b: '=1+1' }, { a: null }]), '"a","b"\r\n"x,""y","\'=1+1"\r\n"",""');
    assert.ok(toCsv([{ '=SUM()': 'value' }]).startsWith('"\'=SUM()"'));
    assert.throws(() => toCsv([1, 2]));
});
test('inference supports heterogeneous arrays and null', () => {
    assert.equal(typeOf([1, 'a', null]), 'Array<number | string | null>');
    assert.deepEqual(schemaOf([]), { type: 'array', items: {} });
    assert.deepEqual(schemaOf([1, 'a']), { type: 'array', items: { anyOf: [{ type: 'integer' }, { type: 'string' }] } });
});
