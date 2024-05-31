import { test } from '@japa/runner';

test.group('Example', () => {
  test('add two numbers', ({ expect }) => {
    expect(1 + 1).toEqual(2);
  });
});
