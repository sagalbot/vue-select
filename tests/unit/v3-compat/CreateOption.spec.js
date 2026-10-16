import { it, describe, expect } from 'vitest'
import {
  lastEmittedValue,
  selectTag,
  selectWithProps,
  selectedLabels,
} from './helpers.js'

describe('CreateOption When Tagging Is Enabled', () => {
  it('can select the current search text as a string', async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      options: ['one', 'two'],
      createOption: () => 'four',
    })

    await selectTag(Select, 'three')
    expect(lastEmittedValue(Select)).toEqual(['four'])
    expect(selectedLabels(Select)).toEqual(['four'])
  })

  it('can select the current search text as an object', async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: false,
      modelValue: null,
      options: [],
      label: 'name',
      createOption: (title) => ({ name: title }),
    })

    await selectTag(Select, 'two')

    expect(Select.emitted('update:modelValue')[0]).toEqual([{ name: 'two' }])
  })
})
