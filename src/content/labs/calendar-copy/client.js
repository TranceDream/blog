import { MIN_DAY, MAX_DAY, dateNumber, dateKey, parseDate, parts, monthNumber, monthBounds, monthTitle, weekday, weekLabels, formatCalendar } from './core.js';

const $ = (id) => document.getElementById(id);
const scroller = $('calendar-scroll'), months = $('months');
const now = new Date();
const today = dateNumber(now.getFullYear(), now.getMonth(), now.getDate());
const thisMonth = monthNumber(today);
const minMonth = monthNumber(MIN_DAY), maxMonth = monthNumber(MAX_DAY);
let [anchor, end] = monthBounds(thisMonth);
let awaitingEnd = false, weekStart = 1, focusedDay = today;
let firstMonth, lastMonth, output = '', drag = null, dragFrame = 0, suppressClick = false;

function feedback(message = '', error = false) {
  $('feedback').textContent = message;
  $('feedback').toggleAttribute('data-error', error);
}

function paintSelection() {
  const start = Math.min(anchor, end), finish = Math.max(anchor, end);
  months.querySelectorAll('[data-day]').forEach((button) => {
    const day = Number(button.dataset.day);
    const selected = anchor !== null && end !== null && day >= start && day <= finish;
    button.setAttribute('aria-pressed', String(selected));
    button.toggleAttribute('data-edge', selected && (day === start || day === finish));
    button.tabIndex = day === focusedDay ? 0 : -1;
  });
}

function update(syncInputs = true) {
  feedback();
  output = '';
  if (syncInputs) {
    $('start').value = anchor === null ? '' : dateKey(Math.min(anchor, end));
    $('end').value = end === null ? '' : dateKey(Math.max(anchor, end));
  }
  if (anchor === null || end === null) {
    $('selection').textContent = '请选择一个日期，或点击「整月」。';
  } else {
    const first = Math.min(anchor, end), last = Math.max(anchor, end);
    $('selection').textContent = `${dateKey(first)} → ${dateKey(last)} · ${last - first + 1} 天${awaitingEnd ? ' · 再点一个日期确定结束' : ''}`;
    try {
      output = formatCalendar(first, last, {
        weekStart, gap: Number($('gap').value), title: $('show-title').checked,
        weekdays: $('show-weekdays').checked, zeroPad: $('zero-pad').checked,
      });
    } catch (error) {
      feedback(error.message, true);
    }
  }
  $('preview').textContent = output || '选择日期后，这里会显示日历文本。';
  $('copy').disabled = !output;
  paintSelection();
}

function createMonth(month) {
  const section = document.createElement('section');
  section.className = 'month';
  section.dataset.month = month;
  const heading = document.createElement('div');
  heading.className = 'month-heading';
  const title = document.createElement('h3');
  title.textContent = monthTitle(month);
  const select = document.createElement('button');
  select.type = 'button';
  select.textContent = '整月';
  select.dataset.selectMonth = month;
  select.setAttribute('aria-label', `选择 ${monthTitle(month)}整月`);
  heading.append(title, select);
  const grid = document.createElement('div');
  grid.className = 'days';
  const [first, last] = monthBounds(month);
  for (let i = 0; i < weekday(first, weekStart); i++) grid.append(document.createElement('span'));
  for (let day = first; day <= last; day++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'day';
    button.dataset.day = day;
    button.textContent = parts(day).day;
    button.setAttribute('aria-label', `${dateKey(day)} 星期${weekLabels(0)[weekday(day, 0)]}`);
    button.toggleAttribute('data-weekend', [0, 6].includes(weekday(day, 0)));
    if (day === today) button.setAttribute('aria-current', 'date');
    grid.append(button);
  }
  section.append(heading, grid);
  return section;
}

function scrollToMonth(month) {
  const target = months.querySelector(`[data-month="${month}"]`);
  if (target) scroller.scrollTop += target.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
}

function jump(month) {
  if (!Number.isInteger(month) || month < minMonth || month > maxMonth) return;
  firstMonth = Math.max(minMonth, month - 2);
  lastMonth = Math.min(maxMonth, month + 2);
  focusedDay = monthBounds(month)[0];
  months.replaceChildren(...Array.from({ length: lastMonth - firstMonth + 1 }, (_, i) => createMonth(firstMonth + i)));
  $('month-jump').value = dateKey(monthBounds(month)[0]).slice(0, 7);
  paintSelection();
  scrollToMonth(month);
}

function visibleMonth() {
  const top = scroller.getBoundingClientRect().top;
  return [...months.children].find((month) => month.getBoundingClientRect().bottom > top + 50) || months.firstElementChild;
}

scroller.addEventListener('scroll', () => {
  if (scroller.scrollTop < 120 && firstMonth > minMonth) {
    const height = scroller.scrollHeight;
    const nextFirst = Math.max(minMonth, firstMonth - 3);
    const fragment = document.createDocumentFragment();
    for (let month = nextFirst; month < firstMonth; month++) fragment.append(createMonth(month));
    months.prepend(fragment);
    firstMonth = nextFirst;
    scroller.scrollTop += scroller.scrollHeight - height;
    paintSelection();
  }
  if (scroller.scrollTop + scroller.clientHeight > scroller.scrollHeight - 120 && lastMonth < maxMonth) {
    const nextLast = Math.min(maxMonth, lastMonth + 3);
    for (let month = lastMonth + 1; month <= nextLast; month++) months.append(createMonth(month));
    lastMonth = nextLast;
    paintSelection();
  }
});

months.addEventListener('click', (event) => {
  if (suppressClick) return;
  const wholeMonth = event.target.closest('[data-select-month]');
  const day = event.target.closest('[data-day]');
  if (wholeMonth) {
    [anchor, end] = monthBounds(Number(wholeMonth.dataset.selectMonth));
    awaitingEnd = false;
  } else if (day) {
    focusedDay = Number(day.dataset.day);
    if (awaitingEnd) { end = focusedDay; awaitingEnd = false; }
    else { anchor = end = focusedDay; awaitingEnd = true; }
  } else return;
  update();
});

// Mouse dragging selects; touch keeps native scrolling and uses two endpoint taps.
scroller.addEventListener('pointerdown', (event) => {
  const button = event.target.closest('[data-day]');
  if (!button || event.pointerType !== 'mouse' || event.button !== 0) return;
  drag = { id: event.pointerId, start: Number(button.dataset.day), x: event.clientX, y: event.clientY,
    originX: event.clientX, originY: event.clientY, active: false, previous: [anchor, end, awaitingEnd] };
});

function updateDrag() {
  if (!drag?.active) return;
  const rect = scroller.getBoundingClientRect();
  if (drag.x >= rect.left && drag.x <= rect.right) {
    const y = Math.max(rect.top + 1, Math.min(rect.bottom - 1, drag.y));
    const button = document.elementFromPoint(drag.x, y)?.closest('[data-day]');
    if (button && months.contains(button) && end !== Number(button.dataset.day)) {
      end = focusedDay = Number(button.dataset.day);
      update();
    }
  }
}

function autoScroll() {
  if (!drag?.active) return;
  const rect = scroller.getBoundingClientRect();
  if (drag.x >= rect.left && drag.x <= rect.right) {
    const edge = 36;
    const speed = drag.y < rect.top + edge ? -Math.min(12, (rect.top + edge - drag.y) / 3)
      : drag.y > rect.bottom - edge ? Math.min(12, (drag.y - rect.bottom + edge) / 3) : 0;
    if (speed) { scroller.scrollTop += speed; updateDrag(); }
  }
  dragFrame = requestAnimationFrame(autoScroll);
}

window.addEventListener('pointermove', (event) => {
  if (!drag || event.pointerId !== drag.id) return;
  drag.x = event.clientX; drag.y = event.clientY;
  if (!drag.active && Math.hypot(drag.x - drag.originX, drag.y - drag.originY) > 4) {
    drag.active = true;
    anchor = end = focusedDay = drag.start;
    awaitingEnd = false;
    scroller.setPointerCapture(drag.id);
    update();
    autoScroll();
  }
  updateDrag();
});

function finishDrag(event, cancelled = false) {
  if (!drag || (event && event.pointerId !== drag.id)) return;
  if (drag.active) {
    if (cancelled) { [anchor, end, awaitingEnd] = drag.previous; update(); }
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
  }
  if (scroller.hasPointerCapture(drag.id)) scroller.releasePointerCapture(drag.id);
  drag = null;
  cancelAnimationFrame(dragFrame);
}
window.addEventListener('pointerup', (event) => finishDrag(event));
window.addEventListener('pointercancel', (event) => finishDrag(event, true));
window.addEventListener('blur', () => finishDrag(null, true));

months.addEventListener('keydown', (event) => {
  const button = event.target.closest('[data-day]');
  const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
  if (!button || !offset) return;
  event.preventDefault();
  const from = Number(button.dataset.day), next = Math.max(MIN_DAY, Math.min(MAX_DAY, from + offset));
  if (!months.querySelector(`[data-day="${next}"]`)) jump(monthNumber(next));
  focusedDay = next;
  if (event.shiftKey) { if (!awaitingEnd) anchor = from; end = next; awaitingEnd = true; update(); }
  else paintSelection();
  const target = months.querySelector(`[data-day="${next}"]`);
  target.focus({ preventScroll: true });
  const cell = target.getBoundingClientRect(), viewport = scroller.getBoundingClientRect();
  if (cell.top < viewport.top) scroller.scrollTop -= viewport.top - cell.top;
  if (cell.bottom > viewport.bottom) scroller.scrollTop += cell.bottom - viewport.bottom;
});

$('month-jump').addEventListener('change', (event) => {
  const day = parseDate(`${event.target.value}-01`);
  if (day !== null) jump(monthNumber(day));
});
$('today').addEventListener('click', () => jump(thisMonth));
$('clear').addEventListener('click', () => { anchor = end = null; awaitingEnd = false; update(); });

for (const id of ['start', 'end']) $(id).addEventListener('input', () => {
  const first = parseDate($('start').value), last = parseDate($('end').value);
  anchor = first; end = last; awaitingEnd = false;
  update(false);
  if (first === null || last === null) feedback('请填写有效的开始和结束日期。', true);
});
for (const id of ['gap', 'show-title', 'show-weekdays', 'zero-pad']) $(id).addEventListener('change', () => update(false));
$('week-start').addEventListener('change', () => {
  const visible = visibleMonth(), month = Number(visible.dataset.month);
  const offset = visible.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
  weekStart = Number($('week-start').value);
  renderWeekdays();
  jump(month);
  scroller.scrollTop -= offset;
  update(false);
});

$('copy').addEventListener('click', async () => {
  if (!output) return;
  const text = output;
  try {
    await navigator.clipboard.writeText(text);
    if (output === text) feedback('已复制到剪贴板。');
  } catch {
    feedback('复制失败，请选中预览文本手动复制。', true);
  }
});

function renderWeekdays() {
  $('weekdays').replaceChildren(...weekLabels(weekStart).map((label) => {
    const cell = document.createElement('span'); cell.textContent = label; return cell;
  }));
}
renderWeekdays();
jump(thisMonth);
update();
