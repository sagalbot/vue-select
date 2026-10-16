import { it, describe, expect } from 'vitest'
import { selectWithProps, openDropdown, dropdownOptions } from './helpers.js'

/**
 * optionComparator is not exposed in v4. An option renders as selected
 * when it compares equal to the value, so compare `value` against each
 * option and read which ones render as selected.
 */
const comparisons = async (value, options) => {
  const Select = selectWithProps({ modelValue: value, options })
  await openDropdown(Select)
  return dropdownOptions(Select).map((option) =>
    option.classes().includes('vs__dropdown-option--selected')
  )
}

describe('Comparing Options', () => {
  it('can compare numbers', async () => {
    //  1 vs 2 is falsy, 1 vs 1 is truthy
    expect(await comparisons(1, [2, 1])).toEqual([false, true])
  })

  it('can compare strings', async () => {
    expect(await comparisons('one', ['one', 'two'])).toEqual([true, false])
  })

  it('can compare objects', async () => {
    //  compare ID keys
    expect(
      await comparisons({ label: 'halo', id: 1 }, [
        { label: 'halo', id: 2 },
        { label: 'halo', id: 1 },
      ])
    ).toEqual([false, true])
    //  compare objects
    expect(
      await comparisons({ label: 'halo', value: 1 }, [
        { label: 'halo', value: 1 },
        { label: 'halo', value: 2 },
      ])
    ).toEqual([true, false])
    //  compare objects with different orders
    expect(
      await comparisons({ value: 1, label: 'halo' }, [
        { label: 'halo', value: 1 },
        { label: 'halo', value: 2 },
      ])
    ).toEqual([true, false])
  })
})
