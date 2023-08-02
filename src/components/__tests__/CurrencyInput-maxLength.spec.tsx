import '@testing-library/jest-dom'
import { render, screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import CurrencyInput from '../CurrencyInput'
import { vi } from 'vitest'

describe('<CurrencyInput/> maxLength', () => {
  const onValueChangeSpy = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not allow more values than max length', async () => {
    render(() => (
      <CurrencyInput prefix="£" onValueChange={onValueChangeSpy} maxLength={3} defaultValue={123} />
    ))

    expect(screen.getByRole('textbox')).toHaveValue('£123')

    await userEvent.type(screen.getByRole('textbox'), '4')
    expect(onValueChangeSpy).not.toBeCalled()

    expect(screen.getByRole('textbox')).toHaveValue('£123')
  })

  it('should apply max length rule to negative value', async () => {
    render(() => (
      <CurrencyInput
        prefix="£"
        onValueChange={onValueChangeSpy}
        maxLength={3}
        defaultValue={-123}
      />
    ))

    expect(screen.getByRole('textbox')).toHaveValue('-£123')

    await userEvent.type(screen.getByRole('textbox'), '4')
    expect(onValueChangeSpy).not.toBeCalled()
    expect(screen.getByRole('textbox')).toHaveValue('-£123')

    await userEvent.type(screen.getByRole('textbox'), '{backspace}5')
    expect(onValueChangeSpy).toHaveBeenLastCalledWith('-125', undefined, {
      float: -125,
      formatted: '-£125',
      value: '-125',
    })
    expect(screen.getByRole('textbox')).toHaveValue('-£125')
  })
})
