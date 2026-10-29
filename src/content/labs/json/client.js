import { parse, sortKeys, pointer, differences, toCsv, typeOf, schemaOf, escapePointer, MAX_SIZE } from './core.js';
const root = document.querySelector('#json-tool');
if (root) {
    const source = root.querySelector('#source');
    const output = root.querySelector('#output');
    const comparison = root.querySelector('#comparison');
    const path = root.querySelector('#pointer');
    const status = root.querySelector('#json-status');
    const tree = root.querySelector('#tree');
    const file = root.querySelector('#file');
    const indent = root.querySelector('#indent');
    let extension = 'json';
    const space = () => indent.value === 'tab' ? '\t' : Number(indent.value);
    function message(text, error = false) { status.textContent = text; status.dataset.error = String(error); }
    function stats() {
        root.querySelector('#input-stats').textContent = `${source.value.length.toLocaleString()} 字符 · ${source.value.split('\n').length} 行`;
        root.querySelector('#output-stats').textContent = `${output.value.length.toLocaleString()} 字符`;
    }
    function result(text, ext = 'json') {
        output.value = text;
        extension = ext;
        root.querySelector('#output-label').textContent = `输出 / ${ext === 'ts' ? 'TypeScript' : ext.toUpperCase()}`;
        stats();
    }
    function changed() {
        result('');
        tree.replaceChildren();
        stats();
        message('输入已更改，点击格式化或选择其他操作。');
    }
    function renderTree(value) {
        tree.replaceChildren();
        let count = 0;
        function node(item, key, pointerPath, depth) {
            const container = document.createElement(item && typeof item === 'object' ? 'details' : 'div');
            const branch = container instanceof HTMLDetailsElement;
            const line = branch ? document.createElement('summary') : container;
            if (branch) {
                container.open = depth < 2;
                container.append(line);
            }
            else
                container.className = 'leaf';
            const label = document.createElement('button');
            label.type = 'button';
            label.textContent = key.length > 100 ? key.slice(0, 100) + '…' : key;
            label.title = pointerPath || '(根节点)';
            label.addEventListener('click', event => { event.preventDefault(); path.value = pointerPath; message(`已选择路径：${pointerPath || '(根节点)'}`); });
            line.append(label);
            const scalar = document.createElement('span');
            scalar.className = 'scalar';
            scalar.textContent = branch ? ` ${Array.isArray(item) ? 'Array' : 'Object'} · ${Object.keys(item).length}` : `: ${JSON.stringify(item).slice(0, 200)}`;
            line.append(scalar);
            if (branch)
                for (const [childKey, child] of Object.entries(item)) {
                    if (++count > 2000)
                        break;
                    container.append(node(child, childKey, `${pointerPath}/${escapePointer(childKey)}`, depth + 1));
                }
            return container;
        }
        tree.append(node(value, '$', '', 0));
        if (count > 2000) {
            const hint = document.createElement('p');
            hint.textContent = '已截断树形预览；使用路径查询访问其余数据。';
            tree.append(hint);
        }
    }
    async function importFile(item) {
        if (!item)
            return;
        if (item.size > MAX_SIZE) {
            message('文件超过 1 MB，请拆分后导入。', true);
            return;
        }
        try {
            source.value = await item.text();
            changed();
            message(`已导入 ${item.name}，尚未校验。`);
        }
        catch {
            message('无法读取文件，请重试。', true);
        }
    }
    async function action(name) {
        try {
            if (name === 'import') {
                file.click();
                return;
            }
            if (name === 'clear') {
                source.value = '';
                changed();
                source.focus();
                return;
            }
            if (name === 'sample') {
                source.value = JSON.stringify({ project: 'TranceDream', active: true, users: [{ name: 'Alice', role: 'author' }, { name: 'Bob', role: 'reader' }], tags: ['Astro', 'JSON'], metadata: null }, null, 2);
                changed();
                await action('format');
                return;
            }
            if (name === 'apply') {
                if (!output.value)
                    throw new Error('还没有可使用的输出。');
                source.value = output.value;
                changed();
                return;
            }
            if (name === 'copy') {
                if (!output.value)
                    throw new Error('还没有可复制的输出。');
                await navigator.clipboard.writeText(output.value);
                message('已复制输出。');
                return;
            }
            if (name === 'download') {
                if (!output.value)
                    throw new Error('还没有可下载的输出。');
                const url = URL.createObjectURL(new Blob([extension === 'csv' ? '\uFEFF' + output.value : output.value], { type: 'text/plain;charset=utf-8' }));
                const link = document.createElement('a');
                link.href = url;
                link.download = `result.${extension}`;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                message('已开始下载。');
                return;
            }
            if (name === 'expand' || name === 'collapse') {
                tree.querySelectorAll('details').forEach(item => item.open = name === 'expand');
                return;
            }
            if (name === 'escape') {
                if (source.value.length > MAX_SIZE)
                    throw new Error('输入超过限制。');
                result(JSON.stringify(source.value));
                message('已将原始文本转义为 JSON 字符串。');
                return;
            }
            const value = parse(source.value);
            const stringify = (item) => JSON.stringify(item, null, space());
            switch (name) {
                case 'format':
                    result(stringify(value));
                    break;
                case 'minify':
                    result(JSON.stringify(value));
                    break;
                case 'sort':
                    result(stringify(sortKeys(value)));
                    break;
                case 'unicode':
                    result(stringify(value).replace(/[\u007f-\uffff]/g, char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`));
                    break;
                case 'unescape':
                    if (typeof value !== 'string')
                        throw new Error('请输入一个带双引号的 JSON 字符串。');
                    result(value, 'txt');
                    break;
                case 'csv':
                    result(toCsv(value), 'csv');
                    break;
                case 'types':
                    result(`// 从样本推断，请按业务需要调整。\nexport type Root = ${typeOf(value)};\n`, 'ts');
                    break;
                case 'schema':
                    result(stringify({ $schema: 'https://json-schema.org/draft/2020-12/schema', ...schemaOf(value) }));
                    break;
                case 'query':
                    result(stringify(pointer(value, path.value)));
                    break;
                case 'diff': {
                    const diff = differences(value, parse(comparison.value));
                    result(stringify(diff));
                    message(diff.length ? `发现 ${diff.length} 处差异，路径使用 JSON Pointer。` : '结构与值一致（忽略对象键顺序）。');
                    return;
                }
                case 'tree':
                    renderTree(value);
                    message('JSON 校验通过，已更新树形结构。');
                    return;
                default: return;
            }
            message('处理完成。原始输入保持不变。');
        }
        catch (error) {
            if (name === 'copy') {
                message('无法访问剪贴板，请手动选择输出并复制。', true);
                return;
            }
            if (name !== 'download')
                result('');
            message(error instanceof Error ? error.message : '操作失败，请重试。', true);
        }
    }
    root.addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (button)
            void action(button.dataset.action);
    });
    source.addEventListener('input', changed);
    comparison.addEventListener('input', () => { result(''); message('对比内容已更改，请重新比较。'); });
    root.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        void action('format');
    } });
    path.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey)
        void action('query'); });
    file.addEventListener('change', () => { void importFile(file.files?.[0]); file.value = ''; });
    source.addEventListener('dragover', event => event.preventDefault());
    source.addEventListener('drop', event => { event.preventDefault(); void importFile(event.dataTransfer?.files[0]); });
}
