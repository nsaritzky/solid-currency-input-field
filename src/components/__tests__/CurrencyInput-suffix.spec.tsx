import '@testing-library/jest-dom'
import { render, screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import CurrencyInput from '../CurrencyInput'
import { vi } from 'vitest'

describe('<CurrencyInput/> suffix', () => {
  const onValueChangeSpy = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle custom suffix', async () => {
    render(() => <CurrencyInput onValueChange={onValueChangeSpy} suffix=" €" defaultValue="1234" />)

    expect(screen.getByRole('textbox')).toHaveValue('1,234 €')

    await userEvent.type(screen.getByRole('textbox'), '56')

    expect(screen.getByRole('textbox')).toHaveValue('123,456 €')

    await userEvent.type(
      screen.getByRole('textbox'),
      '{backspace}{backspace}{backspace}{backspace}',
    )

    expect(screen.getByRole('textbox')).toHaveValue('123 €')
  })

  it('should handle custom prefix and suffix', async () => {
    render(() => (
      <CurrencyInput onValueChange={onValueChangeSpy} prefix="$" suffix=" %" defaultValue="1234" />
    ))

    expect(screen.getByRole('textbox')).toHaveValue('$1,234 %')

    await userEvent.type(screen.getByRole('textbox'), '56')

    expect(screen.getByRole('textbox')).toHaveValue('$123,456 %')

    await userEvent.type(screen.getByRole('textbox'), '{backspace}{backspace}{backspace}')

    expect(screen.getByRole('textbox')).toHaveValue('$1,234 %')

    await userEvent.type(screen.getByRole('textbox'), '.9')

    expect(screen.getByRole('textbox')).toHaveValue('$1,234.9 %')
  })
})
