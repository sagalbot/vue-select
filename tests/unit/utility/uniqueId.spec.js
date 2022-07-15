import uniqueId from '../../../src/utility/uniqueId'

test('it generates a unique number', () => {
  expect(uniqueId()).not.toEqual(uniqueId())
})
