export const MAX_SIZE = 1_000_000;
// Refuse silently rounded integers before JSON.parse changes their value.
export function parse(text) {
    if (text.length > MAX_SIZE)
        throw new Error('输入超过 1 MB 字符限制，请拆分后处理。');
    if (!text.trim())
        throw new Error('请先输入 JSON。');
    const value = JSON.parse(text);
    const tokens = text.match(/"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g) ?? [];
    for (const token of tokens) {
        if (token.startsWith('"'))
            continue;
        const number = Number(token);
        if (!Number.isFinite(number) || (Number.isInteger(number) && !Number.isSafeInteger(number))) {
            throw new Error(`数字 ${token} 超出安全范围；请将大整数改为字符串，避免精度丢失。`);
        }
        if (number === 0 && /[1-9]/.test(token.split(/[eE]/)[0]))
            throw new Error('数字过小，会发生下溢；请改为字符串。');
    }
    let nodes = 0;
    function check(item, depth) {
        if (++nodes > 30_000 || depth > 80)
            throw new Error('结构过大或嵌套超过 80 层，请拆分后处理。');
        if (item && typeof item === 'object')
            Object.values(item).forEach(child => check(child, depth + 1));
    }
    check(value, 0);
    return value;
}
export function sortKeys(value) {
    if (Array.isArray(value))
        return value.map(sortKeys);
    if (value && typeof value === 'object')
        return Object.fromEntries(Object.keys(value).sort().map(key => [key, sortKeys(value[key])]));
    return value;
}
export function pointer(value, path) {
    if (path === '')
        return value;
    if (!path.startsWith('/'))
        throw new Error('JSON Pointer 必须以 / 开头；留空表示根节点。');
    for (const part of path.slice(1).split('/')) {
        if (/~(?![01])/.test(part))
            throw new Error('路径转义无效：使用 ~0 表示 ~，~1 表示 /。');
        const key = part.replace(/~1/g, '/').replace(/~0/g, '~');
        if (!value || typeof value !== 'object' || !Object.hasOwn(value, key) || (Array.isArray(value) && !/^(0|[1-9]\d*)$/.test(key)))
            throw new Error(`找不到路径：${path}`);
        value = value[key];
    }
    return value;
}
export const escapePointer = (key) => key.replace(/~/g, '~0').replace(/\//g, '~1');
export function differences(before, after, path = '') {
    if (Object.is(before, after))
        return [];
    if (before && after && typeof before === 'object' && typeof after === 'object' && Array.isArray(before) === Array.isArray(after)) {
        const a = before, b = after;
        return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(key => {
            const next = `${path}/${escapePointer(key)}`;
            if (!Object.hasOwn(a, key))
                return [{ path: next, kind: '新增', after: b[key] }];
            if (!Object.hasOwn(b, key))
                return [{ path: next, kind: '删除', before: a[key] }];
            return differences(a[key], b[key], next);
        });
    }
    return [{ path, kind: '修改', before, after }];
}
export function toCsv(value) {
    if (!Array.isArray(value) || !value.length || !value.every(row => row && typeof row === 'object' && !Array.isArray(row)))
        throw new Error('CSV 导出需要非空对象数组。');
    const rows = value;
    const keys = [...new Set(rows.flatMap(Object.keys))];
    const cell = (item) => {
        let text = item == null ? '' : typeof item === 'object' ? JSON.stringify(item) : String(item);
        // Spreadsheet formula injection protection, including headers.
        if (/^[\s]*[=+\-@\t\r]/.test(text))
            text = `'${text}`;
        return `"${text.replace(/"/g, '""')}"`;
    };
    return [keys.map(cell).join(','), ...rows.map(row => keys.map(key => cell(Object.hasOwn(row, key) ? row[key] : undefined)).join(','))].join('\r\n');
}
export function typeOf(value) {
    if (value === null)
        return 'null';
    if (Array.isArray(value))
        return value.length ? `Array<${[...new Set(value.map(typeOf))].join(' | ')}>` : 'unknown[]';
    if (typeof value === 'object')
        return `{ ${Object.entries(value).map(([key, item]) => `${JSON.stringify(key)}: ${typeOf(item)};`).join(' ')} }`;
    return typeof value;
}
export function schemaOf(value) {
    if (value === null)
        return { type: 'null' };
    if (Array.isArray(value)) {
        const variants = [...new Map(value.map(item => { const schema = schemaOf(item); return [JSON.stringify(schema), schema]; })).values()];
        return { type: 'array', items: variants.length === 1 ? variants[0] : variants.length ? { anyOf: variants } : {} };
    }
    if (typeof value === 'object')
        return { type: 'object', properties: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, schemaOf(item)])), required: Object.keys(value) };
    return { type: typeof value === 'number' && Number.isInteger(value) ? 'integer' : typeof value };
}
