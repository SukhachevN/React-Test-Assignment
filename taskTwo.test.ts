import { counter } from './taskTwo';

test('test one counter', () => {
  const [getValue, getNext] = counter();

  expect(getValue()).toBe(0);

  getNext();

  expect(getValue()).toBe(1);

  getNext();
  getNext();
  getNext();

  expect(getValue()).toBe(4);
});

test('test several counters', () => {
  const [getA, nextA] = counter(10);
  const [getB, nextB] = counter(100);
  const [getC, nextC] = counter(1000);

  expect(getA()).toBe(10);
  expect(getB()).toBe(100);
  expect(getC()).toBe(1000);

  nextA();

  expect(getA()).toBe(11);
  expect(getB()).toBe(100);
  expect(getC()).toBe(1000);

  nextC();
  nextC();
  nextC();
  nextC();

  expect(getA()).toBe(11);
  expect(getB()).toBe(100);
  expect(getC()).toBe(1004);
});

test('test bad initial val', () => {
  const [getA, nextA] = counter(NaN);
  const [getB, nextB] = counter(Infinity);

  expect(getA()).toBe(0);
  nextA();
  expect(getA()).toBe(1);

  expect(getB()).toBe(0);
  nextB();
  expect(getB()).toBe(1);
});
