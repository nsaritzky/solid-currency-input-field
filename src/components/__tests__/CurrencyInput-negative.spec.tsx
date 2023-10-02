import '@testing-library/jest-dom'
import { render, fireEvent, screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import CurrencyInput from '../CurrencyInput'
import { vi } from 'vitest'

const id = 'validationCustom01'

describe('<CurrencyInput/> negative value', () => {
  const onValueChangeSpy = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle negative value input', async () => {
    render(() => (
      <CurrencyInput
        id={id}
        prefix="$"
        onValueChange={onValueChangeSpy}
        decimalScale={2}
        defaultValue={123}
      />
    ))

    expect(screen.getByRole('textbox')).toHaveValue('$123.00')

    await userEvent.clear(screen.getByRole('textbox'))
    await userEvent.type(screen.getByRole('textbox'), '-1234')
    expect(onValueChangeSpy).toHaveBeenLastCalledWith('-1234', undefined, {
      float: -1234,
      formatted: '-$1,234',
      value: '-1234',
    })

    expect(screen.getByRole('textbox')).toHaveValue('-$1,234')
  })

  it('should call onValueChange with undefined and keep "-" sign as state value', async () => {
    render(() => (
      <CurrencyInput
        id={id}
        prefix="$"
        onValueChange={onValueChangeSpy}
        decimalScale={2}
        defaultValue={123}
      />
    ))

    expect(screen.getByRole('textbox')).toHaveValue('$123.00')

    await userEvent.clear(screen.getByRole('textbox'))
    await userEvent.type(screen.getByRole('textbox'), '-')
    expect(onValueChangeSpy).toHaveBeenLastCalledWith(undefined, undefined, {
      float: undefined,
      formatted: '',
      value: '',
    })

    expect(screen.getByRole('textbox')).toHaveValue('-')
  })

  it('should not call onBlur if only negative sign and clears value', async () => {
    render(() => (
      <>
        <CurrencyInput
          id={id}
          prefix="$"
          onValueChange={onValueChangeSpy}
          decimalScale={2}
          defaultValue={123}
        />
        <button data-testid="button" />
      </>
    ))

    expect(screen.getByRole('textbox')).toHaveValue('$123.00')

    await userEvent.type(
      screen.getByRole('textbox'),
      '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}-',
    )
    expect(screen.getByRole('textbox')).toHaveValue('-')
    expect(onValueChangeSpy).toBeCalledTimes(7)
    expect(onValueChangeSpy).toHaveBeenLastCalledWith(undefined, undefined, {
      float: undefined,
      formatted: '',
      value: '',
    })

    await userEvent.click(screen.getByTestId('button'))
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('should not allow negative value if allowNegativeValue is false', async () => {
    render(() => (
      <CurrencyInput
        id={id}
        prefix="$"
        onValueChange={onValueChangeSpy}
        allowNegativeValue={false}
        defaultValue={123}
      />
    ))

    expect(screen.getByRole('textbox')).toHaveValue('$123')

    await userEvent.clear(screen.getByRole('textbox'))
    await userEvent.type(screen.getByRole('textbox'), '-1234')
    expect(onValueChangeSpy).toHaveBeenLastCalledWith('1234', undefined, {
      float: 1234,
      formatted: '$1,234',
      value: '1234',
    })

    expect(screen.getByRole('textbox')).toHaveValue('$1,234')
  })
})
