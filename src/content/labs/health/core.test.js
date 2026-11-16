import { test } from 'node:test';
import assert from 'node:assert/strict';
import { energy, kilograms, bmi, metabolism } from './core.js';
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} ≠ ${expected}`);
test('energy units distinguish kcal and cal', () => {
    close(energy(418.4, 'kJ').kcal, 100);
    close(energy(1, 'kcal').cal, 1000);
    close(energy(1, 'cal').J, 4.184);
    close(energy(4184, 'J').kcal, 1);
    close(energy(100, 'kcal').kJ, 418.4);
});
test('portion conversion accepts zero, rejects missing or zero basis', () => {
    close(energy(1000, 'kJ', 100, 30).kJ, 300);
    assert.equal(energy(10, 'kcal', 100, 0).kcal, 0);
    assert.equal(energy(0, 'kJ').kcal, 0);
    for (const bad of [-1, NaN, Infinity])
        assert.throws(() => energy(bad, 'kJ'));
    assert.throws(() => energy(100, 'kJ', 0, 30));
    assert.throws(() => energy(100, 'kJ', 100, NaN));
});
test('weight units are equivalent', () => {
    close(kilograms(140, 'jin'), 70);
    close(kilograms(70 / 0.45359237, 'lb'), 70);
    assert.throws(() => kilograms(0, 'kg'));
});
test('BMI classifies raw values at every Chinese and WHO boundary', () => {
    close(bmi(70, 175, 30, 'cn').value, 22.857142857142858);
    for (const [standard, bounds] of [['cn', [18.5, 24, 28]], ['who', [18.5, 25, 30]]]) {
        for (const [index, boundary] of bounds.entries()) {
            // Height 200 cm gives exact floating-point division at the boundaries.
            assert.equal(bmi(boundary * 4, 200, 30, standard).index, index + 1);
            assert.equal(bmi((boundary - 0.001) * 4, 200, 30, standard).index, index);
        }
    }
});
test('adult calculations reject invalid dimensions, ages and coefficients', () => {
    for (const age of [0, 17, 30.5, 121, NaN])
        assert.throws(() => bmi(70, 175, age, 'cn'));
    assert.throws(() => bmi(70, 0, 30, 'cn'));
    for (const factor of [0, 1.2, 2.6, Infinity])
        assert.throws(() => metabolism(70, 175, 30, 'male', factor));
    assert.throws(() => metabolism(-20, 175, 30, 'female', 1.6));
});
test('Mifflin–St Jeor and activity estimates use unrounded values', () => {
    close(metabolism(70, 175, 30, 'male', 1.6).resting, 1648.75);
    close(metabolism(70, 175, 30, 'male', 1.6).total, 2638);
    close(metabolism(70, 175, 30, 'female', 1.6).resting, 1482.75);
    close(metabolism(70, 175, 30, 'female', 1.6).total, 2372.4);
});
