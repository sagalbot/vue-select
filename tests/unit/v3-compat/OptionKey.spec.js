import { it, describe, expect } from 'vitest'
import { selectWithProps, openDropdown, dropdownOptions } from './helpers.js'

/**
 * The default getOptionKey is not exposed in v4. Options are compared by
 * key, so an option renders as selected exactly when its key equals the
 * key of the value. Each test pairs a value with options whose keys would
 * only match if the value's key is the expected one.
 */
const selectedFlags = async (props) => {
  const Select = selectWithProps(props)
  await openDropdown(Select)
  return dropdownOptions(Select).map((option) =>
    option.classes().includes('vs__dropdown-option--selected')
  )
}

describe('Serializing Option Keys', () => {
  it('can serialize strings to a key', async () => {
    // getOptionKey('vue') === 'vue', the key of { id: 'vue' }
    expect(
      await selectedFlags({
        modelValue: 'vue',
        options: [
          { id: 'vue', label: 'Vue' },
          { id: 'react', label: 'React' },
        ],
      })
    ).toEqual([true, false])
  })

  it('can serialize integers to a key', async () => {
    // getOptionKey(1) === 1, not '1'
    expect(
      await selectedFlags({
        modelValue: 1,
        options: [
          { id: 1, label: 'Number one' },
          { id: '1', label: 'String one' },
        ],
      })
    ).toEqual([true, false])
  })

  it('can serialize objects to a key', async () => {
    // getOptionKey({ label: 'vue' }) === '{"label":"vue"}'
    expect(
      await selectedFlags({
        modelValue: { label: 'vue' },
        options: ['{"label":"vue"}', 'vue'],
      })
    ).toEqual([true, false])

    // so equal objects match, whatever their identity
    expect(
      await selectedFlags({
        modelValue: { label: 'vue' },
        options: [{ label: 'vue' }, { label: 'react' }],
      })
    ).toEqual([true, false])
  })

  it('will use an ID property if the object contains one', async () => {
    // getOptionKey({ id: 1 }) === 1
    expect(
      await selectedFlags({
        modelValue: { id: 1, label: 'Selected' },
        options: [1, '1', 'one'],
      })
    ).toEqual([true, false, false])

    // getOptionKey({ id: 'one' }) === 'one'
    expect(
      await selectedFlags({
        modelValue: { id: 'one', label: 'Selected' },
        options: [1, '1', 'one'],
      })
    ).toEqual([false, false, true])

    // getOptionKey({ id: { im: 'a nested object' } }) is the nested object
    // itself: the same object matches, an equal copy does not.
    const nested = { im: 'a nested object' }
    expect(
      await selectedFlags({
        modelValue: { id: nested, label: 'Selected' },
        options: [{ id: nested, label: 'Same id object' }],
      })
    ).toEqual([true])
    expect(
      await selectedFlags({
        modelValue: { id: { im: 'a nested object' }, label: 'Selected' },
        options: [{ id: nested, label: 'Same id object' }],
      })
    ).toEqual([false])
  })
})
