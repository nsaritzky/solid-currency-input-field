import '@testing-library/jest-dom'
import { render, screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import CurrencyInput from '../CurrencyInput'
import { vi } from 'vitest'

const name = 'inputName'

describe('<CurrencyInput/> separators', () => {
  const onValueChangeSpy = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not include separator if turned off', async () => {
    render(() => (
      <CurrencyInput
        name={name}
        prefix="£"
        disableGroupSeparators={true}
        onValueChange={onValueChangeSpy}
        defaultValue={10000}
      />
    ))

    expect(screen.getByRole('textbox')).toHaveValue('£10000')

    await userEvent.clear(screen.getByRole('textbox'))
    await userEvent.type(screen.getByRole('textbox'), '123456')
    expect(onValueChangeSpy).toHaveBeenLastCalledWith('123456', name, {
      float: 123456,
      formatted: '£123456',
      value: '123456',
    })

    expect(screen.getByRole('textbox')).toHaveValue('£123456')
  })

  it('should handle decimal and group separators passed in', async () => {
    render(() => (
      <CurrencyInput
        name={name}
        prefix="£"
        decimalSeparator=","
        groupSeparator="."
        onValueChange={onValueChangeSpy}
      />
    ))

    await userEvent.clear(screen.getByRole('textbox'))
    await userEvent.type(screen.getByRole('textbox'), '123456,33')
    expect(onValueChangeSpy).toHaveBeenLastCalledWith('123456,33', name, {
      float: 123456.33,
      formatted: '£123.456,33',
      value: '123456,33',
    })

    expect(screen.getByRole('textbox')).toHaveValue('£123.456,33')
  })

  describe('throwing errors', () => {
    // Ensure console error fails tests by replacing with a function that throws
    const { error: originalError } = console

    const errorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation((...args: Parameters<typeof console.error>) => {
        originalError(...args)
      })

    /* beforeAll(() => {
     *   vi.spyOn(console, 'error').mockImplementation((...args) => {
     *     originalError(...args)
     *   })
     * }) */

    /* beforeEach(() => {
     *   errorSpy.mockImplementation(vi.fn())
     * }) */

    afterAll(() => {
      vi.mocked(console.error).mockRestore()
    })

    afterEach(() => {
      vi.mocked(console.error).mockClear()
    })

    it('should throw error if decimalSeparator and groupSeparator are the same', () => {
      expect(() =>
        render(() => (
          <CurrencyInput name={name} prefix="£" decimalSeparator="," groupSeparator="," />
        )),
      ).toThrow('decimalSeparator cannot be the same as groupSeparator')
      /* expect(errorSpy).toHaveBeenCalled() */
    })

    it('should throw error if decimalSeparator and default groupSeparator are the same', () => {
      expect(() =>
        render(() => <CurrencyInput name={name} prefix="£" decimalSeparator="," />),
      ).toThrow('decimalSeparator cannot be the same as groupSeparator')
      /* expect(console.error).toHaveBeenCalled() */
    })

    it('should NOT throw error if decimalSeparator and default groupSeparator are the same but disableGroupSeparators is true', () => {
      expect(() =>
        render(() => (
          <CurrencyInput
            name={name}
            prefix="£"
            decimalSeparator=","
            disableGroupSeparators={true}
          />
        )),
      ).not.toThrow('decimalSeparator cannot be the same as groupSeparator')
      /* expect(console.error).not.toHaveBeenCalled() */
    })

    it('should throw error if groupSeparator and default decimalSeparator are the same', () => {
      expect(() =>
        render(() => <CurrencyInput name={name} prefix="£" groupSeparator="." />),
      ).toThrow('decimalSeparator cannot be the same as groupSeparator')
      /* expect(console.error).toHaveBeenCalled() */
    })

    it('should throw error if decimalSeparator is a number', () => {
      expect(() =>
        render(() => (
          <CurrencyInput name={name} prefix="£" decimalSeparator={'1'} groupSeparator="," />
        )),
      ).toThrow('decimalSeparator cannot be a number')
      /* expect(console.error).toHaveBeenCalled() */
    })

    it('should throw error if groupSeparator is a number', () => {
      expect(() =>
        render(() => (
          <CurrencyInput
            name={name}
            prefix="£"
            decimalSeparator="."
            groupSeparator={'2'}
            onValueChange={onValueChangeSpy}
            defaultValue={10000}
          />
        )),
      ).toThrow('groupSeparator cannot be a number')
      /* expect(console.error).toHaveBeenCalled() */
    })
  })
})
