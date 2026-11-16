import { test } from 'node:test';
import assert from 'node:assert/strict';
import { excerpt } from '../src/lib/excerpt.ts';

test('short notes retain wording and normalize paragraph whitespace', () => {
  assert.equal(excerpt('  今天很好。\n\n明天继续。  '), '今天很好。 明天继续。');
  assert.equal(excerpt(''), '');
});
test('truncate only beyond the limit, keeping complete emoji', () => {
  assert.equal(excerpt('你好👨‍👩‍👧‍👦呀', 3), '你好👨‍👩‍👧‍👦…');
  assert.equal(excerpt('你好呀', 3), '你好呀');
  assert.equal(excerpt('中'.repeat(201)), '中'.repeat(200) + '…');
});
