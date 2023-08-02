import CurrencyInput from '../components/CurrencyInput'
import { Component, createSignal } from 'solid-js'
import { CurrencyInputProps, CurrencyInputOnChangeValues } from '../components/CurrencyInputProps'

export const Example1: Component = () => {
  const limit = 1000
  const prefix = '£'

  const [errorMessage, setErrorMessage] = createSignal('')
  const [className, setClassName] = createSignal('')
  const [value, setValue] = createSignal<string | number>(123.45)
  const [values, setValues] = createSignal<CurrencyInputOnChangeValues>()
  const [rawValue, setRawValue] = createSignal<string | undefined>(' ')

  /**
   * Handle validation
   */
  const handleOnValueChange: CurrencyInputProps['onValueChange'] = (value, _, values): void => {
    setValues(values)
    setRawValue(value === undefined ? 'undefined' : value || ' ')

    if (!value) {
      setClassName('')
      setValue('')
      return
    }

    if (Number.isNaN(Number(value))) {
      setErrorMessage('Please enter a valid number')
      setClassName('is-invalid')
      return
    }

    if (Number(value) > limit) {
      setErrorMessage(`Max: ${prefix}${limit}`)
      setClassName('is-invalid')
      setValue(value)
      return
    }

    setClassName('is-valid')
    setValue(value)
  }

  return (
    <div class="row">
      <div class="col-12 mb-4">
        <a href="https://github.com/cchanxzy/react-currency-input-field/blob/master/src/examples/Example1.tsx">
          <h2>Example 1</h2>
        </a>
        <ul>
          <li>{`'£'`} prefix</li>
          <li>Allows decimals (up to 2 decimal places)</li>
          <li>Value is set programmatically (passed in via props)</li>
        </ul>

        <form class="needs-validation">
          <div class="row">
            <div class="form-group col">
              <label for="validationCustom01">Please enter a value (max £1,000)</label>
              <CurrencyInput
                id="validationCustom01"
                name="input-1"
                class={`form-control ${className()}`}
                value={value()}
                onValueChange={handleOnValueChange}
                placeholder="Please enter a number"
                prefix={prefix}
                step={1}
              />
              <div class="invalid-feedback">{errorMessage()}</div>
            </div>
            <div class="form-group col">
              <pre class="h-100 p-3 bg-dark text-white">
                <div class="row">
                  <div class="col-6">
                    <div class="text-muted mr-3">onValueChange:</div>
                    {rawValue()}
                  </div>
                  <div class="col-6">
                    <div class="text-muted mr-3">Values:</div>
                    {JSON.stringify(values(), undefined, ' ')}
                  </div>
                </div>
              </pre>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Example1
