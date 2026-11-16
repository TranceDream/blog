const DAY = 86400000;
export const MIN_DAY = dateNumber(1000, 0, 1);
export const MAX_DAY = dateNumber(9999, 11, 31);
export const MAX_RANGE = 3660;

// Civil dates use UTC day numbers so daylight-saving transitions do not shift cells.
export function dateNumber(year, month, day = 1) {
  return Date.UTC(year, month, day) / DAY;
}
export function parts(value) {
  const date = new Date(value * DAY);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth(), day: date.getUTCDate() };
}
export function dateKey(value) {
  const { year, month, day } = parts(value);
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
export function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const number = dateNumber(year, month - 1, day);
  return number >= MIN_DAY && number <= MAX_DAY && dateKey(number) === value ? number : null;
}
export function monthNumber(value) {
  const { year, month } = parts(value);
  return year * 12 + month;
}
export function monthBounds(month) {
  return [dateNumber(Math.floor(month / 12), month % 12), dateNumber(Math.floor(month / 12), month % 12 + 1) - 1];
}
export function monthTitle(month) {
  return `${Math.floor(month / 12)}年 ${month % 12 + 1}月`;
}
export function weekday(value, weekStart = 1) {
  return (new Date(value * DAY).getUTCDay() - weekStart + 7) % 7;
}
export function weekLabels(weekStart = 1) {
  const labels = ['日', '一', '二', '三', '四', '五', '六'];
  return [...labels.slice(weekStart), ...labels.slice(0, weekStart)];
}
export function formatCalendar(first, last, { weekStart = 1, gap = 1, title = true, weekdays = true, zeroPad = false } = {}) {
  if (![first, last].every(Number.isInteger)) throw new Error('请选择有效的日期区间。');
  const start = Math.min(first, last), end = Math.max(first, last);
  if (start < MIN_DAY || end > MAX_DAY) throw new Error('请选择有效的日期区间。');
  if (end - start + 1 > MAX_RANGE) throw new Error('一次最多复制 3660 天，请缩短日期区间。');
  if (![0, 1].includes(weekStart) || ![1, 2, 3, 4].includes(gap)) throw new Error('排版选项无效。');
  const separator = ' '.repeat(gap);
  const blocks = [];
  for (let month = monthNumber(start); month <= monthNumber(end); month++) {
    const [monthStart, monthEnd] = monthBounds(month);
    const from = Math.max(start, monthStart), to = Math.min(end, monthEnd);
    const firstCell = from - weekday(from, weekStart);
    const lines = [];
    if (title) lines.push(monthTitle(month));
    // ASCII labels keep exactly the same width as two-digit dates in any monospace font.
    const labels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    if (weekdays) lines.push([...labels.slice(weekStart), ...labels.slice(0, weekStart)].join(separator));
    for (let row = firstCell; row <= to; row += 7) {
      const cells = Array.from({ length: 7 }, (_, i) => {
        const day = row + i;
        return day < from || day > to ? '  ' : String(parts(day).day).padStart(2, zeroPad ? '0' : ' ');
      });
      lines.push(cells.join(separator).trimEnd());
    }
    blocks.push(lines.join('\n'));
  }
  return blocks.join('\n\n');
}
