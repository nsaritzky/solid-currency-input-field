import '@testing-library/jest-dom'
import { render, screen } from '@solidjs/testing-library'
import CurrencyInput from '../CurrencyInput'

describe('<CurrencyInput/> ref', () => {
  it('should be able to add HTML ref to component', () => {
    let ref: HTMLInputElement | undefined

    render(() => <CurrencyInput value="123456789" ref={ref} />)

    expect(screen.getByRole('textbox')).toBe(ref)
  })
})
