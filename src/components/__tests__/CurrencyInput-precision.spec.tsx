import '@testing-library/jest-dom'
import { render, fireEvent, screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import CurrencyInput from '../CurrencyInput'
import { vi } from 'vitest'

describe('<CurrencyInput/> decimalScale', () => {
  const onValueChangeSpy = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should pad to decimalScale of 5 on blur', async () => {
    render(() => (
      <>
        <CurrencyInput prefix="£" onValueChange={onValueChangeSpy} decimalScale={5} />
        <button />
      </>
    ))

    await userEvent.type(screen.getByRole('textbox'), '1.5')
    await userEvent.click(screen.getByRole('button'))

    expect(onValueChangeSpy).toBeCalledWith('1.50000', undefined, {
      float: 1.5,
      formatted: '£1.50000',
      value: '1.50000',
    })

    expect(screen.getByRole('textbox')).toHaveValue('£1.50000')
  })

  it('should pad to decimalScale of 2 on blur', async () => {
    const onBlurSpy = vi.fn()
    render(() => (
      <>
        <CurrencyInput
          prefix="£"
          onValueChange={onValueChangeSpy}
          onBlur={onBlurSpy}
          decimalScale={2}
        />
        <button />
      </>
    ))

    await userEvent.type(screen.getByRole('textbox'), '1')
    await userEvent.click(screen.getByRole('button'))

    expect(onBlurSpy).toBeCalled()

    expect(onValueChangeSpy).toBeCalledWith('1.00', undefined, {
      float: 1,
      formatted: '£1.00',
      value: '1.00',
    })

    expect(screen.getByRole('textbox')).toHaveValue('£1.00')
  })
})
