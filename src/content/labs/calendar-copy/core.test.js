import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dateNumber as date, parseDate, dateKey, monthBounds, formatCalendar, MAX_RANGE } from './core.js';

const plain = { title: false, weekdays: false };

test('a Sunday-start month keeps Monday-first columns aligned', () => {
  assert.equal(formatCalendar(date(2026, 10, 1), date(2026, 10, 8), plain),
    '                   1\n 2  3  4  5  6  7  8');
});

test('partial and reversed ranges preserve blank columns', () => {
  const expected = '       4  5  6';
  assert.equal(formatCalendar(date(2026, 10, 4), date(2026, 10, 6), plain), expected);
  assert.equal(formatCalendar(date(2026, 10, 6), date(2026, 10, 4), plain), expected);
});

test('cross-year selection is split into titled month blocks', () => {
  assert.equal(formatCalendar(date(2026, 11, 31), date(2027, 0, 2), { weekdays: false }),
    '2026年 12月\n         31\n\n2027年 1月\n             1  2');
});

test('Gregorian leap years and invalid date input', () => {
  assert.equal(monthBounds(2000 * 12 + 1)[1], date(2000, 1, 29));
  assert.equal(monthBounds(2100 * 12 + 1)[1], date(2100, 1, 28));
  assert.equal(parseDate('2024-02-29'), date(2024, 1, 29));
  for (const input of ['2026-02-29', '2026-04-31', '2026-13-01', '0999-01-01', '2026-1-1', '']) {
    assert.equal(parseDate(input), null, input);
  }
});

test('Sunday-first, spacing and zero padding have fixed ASCII columns', () => {
  assert.equal(formatCalendar(date(2026, 10, 1), date(2026, 10, 7), { title: false, weekStart: 0, gap: 2, zeroPad: true }),
    'Su  Mo  Tu  We  Th  Fr  Sa\n01  02  03  04  05  06  07');
});

test('civil dates remain consecutive across daylight saving boundaries', () => {
  const first = date(2026, 2, 7);
  assert.deepEqual([0, 1, 2].map((offset) => dateKey(first + offset)), ['2026-03-07', '2026-03-08', '2026-03-09']);
  assert.equal(formatCalendar(first, first + 2, plain), '                7  8\n 9');
});

test('range limits and invalid formatting never produce misleading output', () => {
  const start = date(2026, 0, 1);
  assert.doesNotThrow(() => formatCalendar(start, start + MAX_RANGE - 1));
  assert.throws(() => formatCalendar(start, start + MAX_RANGE), /最多/);
  assert.throws(() => formatCalendar(NaN, start), /有效/);
  assert.throws(() => formatCalendar(null, start), /有效/);
  assert.throws(() => formatCalendar(date(999, 0, 1), start), /有效/);
  assert.throws(() => formatCalendar(start, start, { gap: 0 }), /选项/);
});
