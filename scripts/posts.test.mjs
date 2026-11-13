import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SITE } from '../src/config/site.ts';
import {
  archiveHref, archivePageCount, noteAnchor, postHref, selectVisiblePosts,
} from '../src/lib/posts.ts';

function post(id, { type = 'tech', draft = false, date = '2026-10-01T00:00:00+08:00' } = {}) {
  return { id, collection: 'posts', data: {
    type, draft, title: id, description: '', tags: [], toc: true, publishedAt: new Date(date),
  } };
}

test('生产内容排除所有类型的草稿，开发预览保留草稿', () => {
  const entries = ['life', 'tech', 'note'].flatMap(type => [
    post(`${type}-public`, { type }), post(`${type}-draft`, { type, draft: true }),
  ]);
  assert.deepEqual(selectVisiblePosts(entries).map(entry => entry.id), [
    'life-public', 'note-public', 'tech-public',
  ]);
  assert.equal(selectVisiblePosts(entries, true).length, 6);
  assert.deepEqual(selectVisiblePosts(entries, false), selectVisiblePosts(entries));
});

test('按真实发布时间倒序，同一时刻按 id 排序且不修改输入', () => {
  const entries = [
    post('b', { date: '2026-11-01T12:00:00+08:00' }),
    post('a', { date: '2026-11-01T04:00:00Z' }),
    post('newest', { date: '2026-11-01T05:00:00Z' }),
  ];
  assert.deepEqual(selectVisiblePosts(entries).map(entry => entry.id), ['newest', 'a', 'b']);
  assert.deepEqual(entries.map(entry => entry.id), ['b', 'a', 'newest']);
});

test('Archive 空列表保留首页，满页与溢出一条的页数正确', () => {
  const size = SITE.archivePageSize;
  for (const [total, pages] of [[0, 1], [1, 1], [size, 1], [size + 1, 2], [size * 2, 2], [size * 2 + 1, 3]]) {
    assert.equal(archivePageCount(total), pages, `内容数量：${total}`);
  }
  assert.equal(archiveHref(1), '/archive/');
  assert.equal(archiveHref(2), '/archive/page/2/');
});

test('Note 链接按混合内容流定位，普通文章始终链接到详情页', () => {
  const entries = Array.from({ length: SITE.archivePageSize + 1 }, (_, index) => post(`entry-${index}`));
  entries[0] = post('首页日志', { type: 'note' });
  entries[SITE.archivePageSize - 1] = post('第一页末尾', { type: 'note' });
  entries[SITE.archivePageSize] = post('第二页开头', { type: 'note' });
  assert.equal(postHref(entries[0], entries), '/archive/#note-首页日志');
  assert.equal(postHref(entries[SITE.archivePageSize - 1], entries), '/archive/#note-第一页末尾');
  assert.equal(postHref(entries[SITE.archivePageSize], entries), '/archive/page/2/#note-第二页开头');
  assert.equal(postHref(entries[1], entries), '/archive/entry-1/');
});

test('新内容将 Note 推到下一页时，锚点不变，链接页码更新', () => {
  const note = post('2026-11-02-周末记录', { type: 'note' });
  const entries = [...Array.from({ length: SITE.archivePageSize - 1 }, (_, index) => post(`entry-${index}`)), note];
  assert.equal(postHref(note, entries), '/archive/#note-2026-11-02-周末记录');
  assert.equal(postHref(note, [post('new'), ...entries]), '/archive/page/2/#note-2026-11-02-周末记录');
});

test('先过滤草稿再计算分页，开发与生产的 Note 页码可不同', () => {
  const draft = post('draft', { draft: true, date: '2026-11-03T00:00:00+08:00' });
  const note = post('note', { type: 'note', date: '2026-11-01T00:00:00+08:00' });
  const entries = [draft, ...Array.from({ length: SITE.archivePageSize - 1 }, (_, index) => post(`entry-${index}`, {
    date: '2026-11-02T00:00:00+08:00',
  })), note];
  assert.equal(postHref(note, selectVisiblePosts(entries)), '/archive/#note-note');
  assert.equal(postHref(note, selectVisiblePosts(entries, true)), '/archive/page/2/#note-note');
});

test('Note 缺少归档上下文时保留首页锚点，中文与特殊字符生成一致标识', () => {
  const note = post('２０２６-日常 Note/?#', { type: 'note' });
  assert.equal(noteAnchor(note), 'note-2026-日常-note-');
  assert.equal(postHref(note), '/archive/#note-2026-日常-note-');
  assert.equal(postHref(note, []), postHref(note));
});
