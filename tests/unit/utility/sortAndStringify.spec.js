import sortAndStringify from '../../../src/utility/sortAndStringify';

test('it will stringify an object', () => {
  expect(sortAndStringify({hello: 'world'})).toEqual('{"hello":"world"}');
});

test('it will sort attributes alphabetically', () => {
  expect(sortAndStringify({b: 'b', a: 'a'})).toEqual('{"a":"a","b":"b"}');
});

test('comparing two objects with unsorted keys', () => {
  expect(sortAndStringify({b: 'b', a: 'a'}))
    .toEqual(sortAndStringify({a: 'a', b: 'b'}))
});
