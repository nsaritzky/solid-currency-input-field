import '@testing-library/jest-dom'
import { render, fireEvent, screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import CurrencyInput from '../CurrencyInput'

const name = 'inputName'

describe('<CurrencyInput/> onBlur', () => {
  const onBlurSpy = vi.fn()
  const onValueChangeSpy = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call onBlur and onValueChange', async () => {
    render(() => (
      <>
        <CurrencyInput
          name={name}
          prefix="$"
          onBlur={onBlurSpy}
          onValueChange={onValueChangeSpy}
          decimalScale={2}
        />
        <button />
      </>
    ))

    await userEvent.type(screen.getByRole('textbox'), '123')
    await userEvent.click(screen.getByRole('button'))

    expect(onBlurSpy).toBeCalled()

    expect(onValueChangeSpy).toHaveBeenLastCalledWith('123.00', name, {
      float: 123,
      formatted: '$123.00',
      value: '123.00',
    })

    expect(screen.getByRole('textbox')).toHaveValue('$123.00')
  })

  it('should call onBlur for 0', async () => {
    render(() => (
      <>
        <CurrencyInput name={name} prefix="$" onBlur={onBlurSpy} />
        <button />
      </>
    ))

    userEvent.type(screen.getByRole('textbox'), '0')
    await userEvent.click(screen.getByRole('button'))

    expect(onBlurSpy).toBeCalled()

    expect(screen.getByRole('textbox')).toHaveValue('$0')
  })

  it('should call onBlur for empty value', async () => {
    render(() => (
      <>
        <CurrencyInput name={name} prefix="$" onBlur={onBlurSpy} />
        <button />
      </>
    ))

    await userEvent.click(screen.getByRole('button'))

    expect(onBlurSpy).toBeCalled()

    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('should call onBlur for "-" char', async () => {
    render(() => (
      <>
        <CurrencyInput name={name} prefix="$" onBlur={onBlurSpy} />
        <button />
      </>
    ))

    await userEvent.type(screen.getByRole('textbox'), '-')
    await userEvent.click(screen.getByRole('button'))

    expect(onBlurSpy).toBeCalled()

    expect(screen.getByRole('textbox')).toHaveValue('')
  })
})
