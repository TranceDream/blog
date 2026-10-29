export const ENERGY_UNITS = { kcal: 4184, kJ: 1000, cal: 4.184, J: 1 };
export const BMI_LIMITS = { cn: [18.5, 24, 28], who: [18.5, 25, 30] };
export function range(value, min, max, label) {
    if (!Number.isFinite(value) || value < min || value > max)
        throw new Error(`${label}须在 ${min}–${max} 之间。`);
    return value;
}
export function energy(amount, unit, basis = 100, portion = 100) {
    range(amount, 0, 1e9, '能量');
    range(basis, 0.001, 1e6, '标注份量');
    range(portion, 0, 1e6, '食用份量');
    if (!Object.hasOwn(ENERGY_UNITS, unit))
        throw new Error('能量单位无效。');
    const joules = amount * ENERGY_UNITS[unit] * portion / basis;
    return Object.fromEntries(Object.entries(ENERGY_UNITS).map(([key, factor]) => [key, joules / factor]));
}
export function kilograms(weight, unit) {
    const factors = { kg: 1, lb: 0.45359237, jin: 0.5 };
    if (!Object.hasOwn(factors, unit))
        throw new Error('体重单位无效。');
    return range(weight * factors[unit], 20, 500, '体重（kg）');
}
function adult(age) {
    range(age, 18, 120, '年龄');
    if (!Number.isInteger(age))
        throw new Error('年龄请填写整数周岁。');
}
export function bmi(weightKg, heightCm, age, standard) {
    adult(age);
    range(weightKg, 20, 500, '体重（kg）');
    range(heightCm, 100, 250, '身高（cm）');
    if (!Object.hasOwn(BMI_LIMITS, standard))
        throw new Error('BMI 标准无效。');
    const value = weightKg / (heightCm / 100) ** 2;
    const limits = BMI_LIMITS[standard];
    const index = value < limits[0] ? 0 : value < limits[1] ? 1 : value < limits[2] ? 2 : 3;
    return { value, index, category: ['体重偏低', '正常范围', '超重范围', '肥胖范围'][index] };
}
export function metabolism(weightKg, heightCm, age, sex, factor) {
    adult(age);
    range(weightKg, 20, 500, '体重（kg）');
    range(heightCm, 100, 250, '身高（cm）');
    range(factor, 1.4, 2.5, '活动系数');
    if (sex !== 'male' && sex !== 'female')
        throw new Error('请选择公式参数。');
    const resting = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161);
    if (resting <= 0)
        throw new Error('此组参数不适合该公式，请检查输入或咨询专业人士。');
    return { resting, total: resting * factor };
}
