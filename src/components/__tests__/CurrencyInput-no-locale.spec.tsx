import '@testing-library/jest-dom'
import { render, screen } from '@solidjs/testing-library'
import CurrencyInput from '../CurrencyInput'
import { getLocaleConfig } from '../utils'
import { vi } from 'vitest'

vi.mock('../utils/getLocaleConfig', () => ({
  getLocaleConfig: vi.fn().mockReturnValue({ groupSeparator: ',', decimalSeparator: '.' }),
}))

describe('<CurrencyInput/> no locale', () => {
  it('should have empty string for groupSeparator and decimalSeparator if not passed in and cannot find default locale', () => {
    vi.mocked(getLocaleConfig).mockReturnValue({ groupSeparator: '', decimalSeparator: '' })
    render(() => <CurrencyInput value="123456789" />)
    expect(screen.getByRole('textbox')).toHaveValue('123456789')
  })
})
