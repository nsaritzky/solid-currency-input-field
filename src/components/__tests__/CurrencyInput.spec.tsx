import '@testing-library/jest-dom'
import { render, fireEvent, screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import CurrencyInput from '../CurrencyInput'
import { vi } from 'vitest'

describe('<CurrencyInput/>', () => {
  const onValueChangeSpy = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Renders without error', () => {
    render(() => (
      <CurrencyInput
        id="validationCustom01"
        name="inputName"
        placeholder="£1,000"
        className="form-control"
      />
    ))
    const input = screen.getByRole('textbox')

    expect(input).toMatchSnapshot()

    expect(input).toHaveValue('')
  })

  it('Renders with default value', () => {
    render(() => <CurrencyInput defaultValue={1234.56} prefix="£" />)
    const input = screen.getByRole('textbox')

    expect(input).toMatchSnapshot()

    expect(input).toHaveValue('£1,234.56')
  })

  it('Renders with default value 0', () => {
    render(() => <CurrencyInput defaultValue={0} prefix="£" />)

    expect(screen.getByRole('textbox')).toHaveValue('£0')
  })

  it('Renders with default value undefined', () => {
    render(() => <CurrencyInput defaultValue={undefined} prefix="£" />)

    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('Renders with default value null', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(() => <CurrencyInput defaultValue={null as any} prefix="£" />)

    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('Renders with default value 0 with decimalScale 2', () => {
    render(() => <CurrencyInput defaultValue={0} decimalScale={2} prefix="£" />)

    expect(screen.getByRole('textbox')).toHaveValue('£0.00')
  })

  it('Renders with value prop', () => {
    render(() => <CurrencyInput value={49.99} prefix="£" />)

    expect(screen.getByRole('textbox')).toHaveValue('£49.99')
  })

  it('Renders with value 0', () => {
    render(() => <CurrencyInput value={0} prefix="£" />)

    expect(screen.getByRole('textbox')).toHaveValue('£0')
  })

  it('Renders with value undefined', () => {
    render(() => <CurrencyInput value={undefined} prefix="£" />)

    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('Renders with value null', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(() => <CurrencyInput value={null as any} prefix="£" />)

    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('Renders with value 0 with decimalScale 2', () => {
    render(() => <CurrencyInput value={0} prefix="£" decimalScale={2} />)

    expect(screen.getByRole('textbox')).toHaveValue('£0.00')
  })

  it('Renders with value 0.1 with decimalScale 2', async () => {
    render(() => <CurrencyInput value={0.1} prefix="£" decimalScale={2} />)

    expect(screen.getByRole('textbox')).toHaveValue('£0.10')

    await userEvent.type(screen.getByRole('textbox'), '{backspace}')

    expect(screen.getByRole('textbox')).toHaveValue('£0.1')
  })

  it('should go to end of string on focus', async () => {
    render(() => <CurrencyInput defaultValue={123} />)
    await userEvent.type(screen.getByRole('textbox'), '{arrowleft}4{arrowright}6')

    expect(screen.getByRole('textbox')).toHaveValue('12,436')
  })

  it('should allow value change with number', async () => {
    render(() => <CurrencyInput prefix="£" onValueChange={onValueChangeSpy} />)
    await userEvent.type(screen.getByRole('textbox'), '100')

    expect(onValueChangeSpy).toHaveBeenLastCalledWith('100', undefined, {
      float: 100,
      formatted: '£100',
      value: '100',
    })
  })

  it('should prefix 0 value', () => {
    render(() => <CurrencyInput prefix="£" value={0} onValueChange={onValueChangeSpy} />)

    expect(screen.getByRole('textbox')).toHaveValue('£0')
  })

  it('should allow 0 value on change', async () => {
    render(() => <CurrencyInput prefix="£" onValueChange={onValueChangeSpy} />)
    await userEvent.type(screen.getByRole('textbox'), '0')

    expect(onValueChangeSpy).toHaveBeenLastCalledWith('0', undefined, {
      float: 0,
      formatted: '£0',
      value: '0',
    })

    expect(screen.getByRole('textbox')).toHaveValue('£0')
  })

  it('should allow empty value', async () => {
    render(() => <CurrencyInput prefix="£" onValueChange={onValueChangeSpy} defaultValue={1} />)
    await userEvent.clear(screen.getByRole('textbox'))

    expect(onValueChangeSpy).toHaveBeenLastCalledWith(undefined, undefined, {
      float: null,
      formatted: '',
      value: '',
    })

    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('should callback name as second parameter if name prop provided', async () => {
    const name = 'inputName'
    render(() => <CurrencyInput name={name} prefix="£" onValueChange={onValueChangeSpy} />)
    await userEvent.type(screen.getByRole('textbox'), '123')

    expect(onValueChangeSpy).toHaveBeenLastCalledWith('123', name, {
      float: 123,
      formatted: '£123',
      value: '123',
    })
  })

  it('should not allow invalid characters', async () => {
    render(() => <CurrencyInput prefix="£" onValueChange={onValueChangeSpy} />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')

    expect(onValueChangeSpy).toHaveBeenLastCalledWith(undefined, undefined, {
      float: null,
      formatted: '',
      value: '',
    })

    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('should ignore invalid characters', async () => {
    render(() => <CurrencyInput prefix="£" onValueChange={onValueChangeSpy} />)
    await userEvent.type(screen.getByRole('textbox'), '£123hello')

    expect(onValueChangeSpy).toHaveBeenLastCalledWith('123', undefined, {
      float: 123,
      formatted: '£123',
      value: '123',
    })

    expect(screen.getByRole('textbox')).toHaveValue('£123')
  })

  it('should clear decimal point only input', async () => {
    render(() => (
      <>
        {' '}
        <CurrencyInput prefix="£" onValueChange={onValueChangeSpy} />
        <button data-testid="button" />
      </>
    ))
    await userEvent.type(screen.getByRole('textbox'), '.')

    expect(onValueChangeSpy).toHaveBeenLastCalledWith(undefined, undefined, {
      float: null,
      formatted: '',
      value: '',
    })

    await userEvent.click(screen.getByTestId('button'))
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('should allow .3 decimal inputs', async () => {
    render(() => <CurrencyInput prefix="£" onValueChange={onValueChangeSpy} />)
    await userEvent.type(screen.getByRole('textbox'), '.3')

    expect(onValueChangeSpy).toHaveBeenLastCalledWith('.3', undefined, {
      float: 0.3,
      formatted: '£0.3',
      value: '.3',
    })

    fireEvent.focusOut(screen.getByRole('textbox'))
    expect(screen.getByRole('textbox')).toHaveValue('£0.3')
  })

  it('should call onChange', async () => {
    const onChangeSpy = vi.fn()
    render(() => <CurrencyInput prefix="£" onChange={onChangeSpy} />)
    await userEvent.type(screen.getByRole('textbox'), '123')

    expect(onChangeSpy).toBeCalledTimes(3)

    expect(screen.getByRole('textbox')).toHaveValue('£123')
  })

  it('should call onBlur', async () => {
    const onBlurSpy = vi.fn()
    render(() => (
      <>
        <CurrencyInput prefix="£" onBlur={onBlurSpy} />
        <button data-testid="button" />
      </>
    ))
    await userEvent.click(screen.getByRole('textbox'))
    await userEvent.click(screen.getByTestId('button'))

    expect(onBlurSpy).toBeCalledTimes(1)
  })

  it('should call onFocus', async () => {
    const onFocusSpy = vi.fn()
    render(() => <CurrencyInput onFocus={onFocusSpy} />)
    await userEvent.click(screen.getByRole('textbox'))

    expect(onFocusSpy).toBeCalledTimes(1)
  })

  it('should call onKeyDown', async () => {
    const onKeyDownSpy = vi.fn()
    render(() => <CurrencyInput onKeyDown={onKeyDownSpy} />)
    await userEvent.type(screen.getByRole('textbox'), '1')

    expect(onKeyDownSpy).toBeCalledTimes(1)
  })

  it('should call onKeyUp', async () => {
    const onKeyUpSpy = vi.fn()
    render(() => <CurrencyInput onKeyUp={onKeyUpSpy} />)
    await userEvent.type(screen.getByRole('textbox'), '1')

    expect(onKeyUpSpy).toBeCalledTimes(1)
  })
})
