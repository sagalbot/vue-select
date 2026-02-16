// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useClickAway } from '@/hooks/useClickAway'

describe('useClickAway', () => {
  let el: HTMLDivElement

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.removeChild(el)
  })

  it('calls callback when clicking outside the element', async () => {
    const callback = vi.fn()
    const { addClickAwayListener } = useClickAway(callback)
    addClickAwayListener(el)

    document.body.click()
    expect(callback).toHaveBeenCalledOnce()
  })

  it('does not call callback when clicking inside the element', () => {
    const callback = vi.fn()
    const { addClickAwayListener } = useClickAway(callback)
    addClickAwayListener(el)

    el.click()
    expect(callback).not.toHaveBeenCalled()
  })

  it('stops listening after removeClickAwayListener is called', () => {
    const callback = vi.fn()
    const { addClickAwayListener, removeClickAwayListener } = useClickAway(callback)
    addClickAwayListener(el)
    removeClickAwayListener(el)

    document.body.click()
    expect(callback).not.toHaveBeenCalled()
  })

  it('does not throw when removing listener before adding', () => {
    const callback = vi.fn()
    const { removeClickAwayListener } = useClickAway(callback)
    expect(() => removeClickAwayListener(el)).not.toThrow()
  })
})
