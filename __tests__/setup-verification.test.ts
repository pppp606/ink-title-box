import { describe, test, expect } from '@jest/globals';

// Simple utility functions to test Jest setup
function add(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

function isEven(num: number): boolean {
  return num % 2 === 0;
}

describe('Jest Setup Verification', () => {
  test('should run basic arithmetic tests', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });

  test('should handle multiplication', () => {
    expect(multiply(3, 4)).toBe(12);
    expect(multiply(-2, 3)).toBe(-6);
    expect(multiply(0, 100)).toBe(0);
  });

  test('should check even numbers correctly', () => {
    expect(isEven(2)).toBe(true);
    expect(isEven(3)).toBe(false);
    expect(isEven(0)).toBe(true);
    expect(isEven(-2)).toBe(true);
    expect(isEven(-3)).toBe(false);
  });

  test('should work with async operations', async () => {
    const promise = Promise.resolve(42);
    await expect(promise).resolves.toBe(42);
  });

  test('should support TypeScript features', () => {
    interface User {
      name: string;
      age: number;
    }

    const user: User = { name: 'Alice', age: 30 };
    expect(user.name).toBe('Alice');
    expect(user.age).toBe(30);
  });

  test('should work with modern JavaScript features', () => {
    const numbers = [1, 2, 3, 4, 5];
    const doubled = numbers.map(n => n * 2);
    const evens = numbers.filter(n => n % 2 === 0);

    expect(doubled).toEqual([2, 4, 6, 8, 10]);
    expect(evens).toEqual([2, 4]);
  });
});
