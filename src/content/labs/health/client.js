import { energy, kilograms, bmi, metabolism, BMI_LIMITS } from './core.js';
const root = document.querySelector('#health-tool');
if (root) {
    const get = (id) => root.querySelector(`#${id}`);
    const text = (id, value) => { get(id).textContent = value; };
    const input = (id) => get(id);
    const select = (id) => get(id).value;
    const number = (id) => input(id).valueAsNumber;
    const format = (value) => new Intl.NumberFormat('zh-CN', { maximumSignificantDigits: 8 }).format(value);
    function enableMetabolism(enabled) {
        input('activity').disabled = !enabled;
        root.querySelectorAll('[data-factor]').forEach(button => { button.disabled = !enabled; });
    }
    function message(name, value, error = false) {
        text(`${name}-status`, value);
        get(`${name}-status`).dataset.error = String(error);
        // Announce successful results without repeating them visually above the result panel.
        get(`${name}-status`).classList.toggle('sr-only', !error);
    }
    function clear(name) {
        get(`${name}-result`).hidden = true;
        message(name, '');
        get(`${name}-form`).querySelectorAll('[aria-invalid]').forEach(item => item.removeAttribute('aria-invalid'));
    }
    function validate(form) {
        for (const field of form.querySelectorAll('input, select')) {
            if (field.closest('[hidden]'))
                continue;
            if (!field.checkValidity()) {
                field.setAttribute('aria-invalid', 'true');
                field.focus();
                if (field instanceof HTMLInputElement && field.type === 'checkbox')
                    throw new Error('此计算仅适用于非孕哺期成年人，请确认适用范围。');
                const label = field.labels?.[0]?.firstChild?.textContent?.trim() || '输入';
                throw new Error(`${label}未填写或超出范围，请检查。`);
            }
        }
    }
    function body(name) {
        return { weight: kilograms(number(`${name}-weight`), select(`${name}-unit`)), height: number(`${name}-height`), age: number(`${name}-age`) };
    }
    for (const name of ['energy', 'body']) {
        const form = get(`${name}-form`);
        form.addEventListener('input', () => clear(name));
        form.addEventListener('change', () => clear(name));
        form.addEventListener('reset', () => {
            clear(name);
            if (name === 'energy') {
                get('portion-fields').hidden = true;
                input('basis').required = false;
                input('portion').required = false;
            }
            else
                enableMetabolism(false);
        });
        form.addEventListener('submit', event => {
            event.preventDefault();
            clear(name);
            try {
                validate(form);
                if (name === 'energy') {
                    const portions = input('portion-enabled').checked;
                    const values = energy(number('energy-amount'), select('energy-unit'), portions ? number('basis') : 100, portions ? number('portion') : 100);
                    for (const unit of ['kcal', 'kJ', 'cal', 'J'])
                        text(`energy-${unit.toLowerCase()}`, format(values[unit]));
                    text('portion-caption', portions ? `食用 ${format(number('portion'))} g · 按每 ${format(number('basis'))} g 的标注换算` : '1 kcal = 4.184 kJ = 1,000 cal');
                    message(name, `${format(values.kcal)} kcal`);
                }
                else {
                    const { weight, height, age } = body('bmi');
                    const standard = select('bmi-standard');
                    const result = bmi(weight, height, age, standard);
                    text('bmi-value', result.value.toFixed(2));
                    text('bmi-category', `${standard === 'cn' ? '中国成人' : 'WHO 成人'} · ${result.category}`);
                    const [low, middle, high] = BMI_LIMITS[standard];
                    [`< ${low}`, `${low} ≤ BMI < ${middle}`, `${middle} ≤ BMI < ${high}`, `≥ ${high}`].forEach((label, index) => text(`bmi-band-${index}`, label));
                    root.querySelectorAll('.bmi-scale li').forEach((item, index) => {
                        item.dataset.current = String(result.index === index);
                        if (result.index === index)
                            item.setAttribute('aria-current', 'true');
                        else
                            item.removeAttribute('aria-current');
                    });
                    let announcement = `BMI ${result.value.toFixed(2)} · ${result.category}`;
                    const sex = select('sex');
                    get('metabolism-result').hidden = !sex;
                    if (sex) {
                        const factor = number('activity');
                        const estimates = metabolism(weight, height, age, sex, factor);
                        text('resting-value', String(Math.round(estimates.resting)));
                        text('total-value', String(Math.round(estimates.total)));
                        text('metabolism-caption', `Mifflin–St Jeor × ${factor} · 结果已取整${age < 19 || age > 78 ? '；年龄超出原研究范围，参考性更有限。' : '，仅供参考。'}`);
                        announcement += `；静息代谢约 ${Math.round(estimates.resting)}，每日消耗约 ${Math.round(estimates.total)} kcal。`;
                    }
                    message(name, announcement);
                }
                get(`${name}-result`).hidden = false;
            }
            catch (error) {
                message(name, error instanceof Error ? error.message : '请检查输入。', true);
            }
        });
    }
    input('portion-enabled').addEventListener('change', () => {
        const enabled = input('portion-enabled').checked;
        get('portion-fields').hidden = !enabled;
        input('basis').required = enabled;
        input('portion').required = enabled;
    });
    get('sex').addEventListener('change', () => enableMetabolism(Boolean(select('sex'))));
    root.querySelectorAll('[data-factor]').forEach(button => button.addEventListener('click', () => {
        input('activity').value = button.dataset.factor;
        clear('body');
    }));
}
