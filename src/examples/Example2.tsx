import { Component, createSignal } from 'solid-js'
import CurrencyInput from '../components/CurrencyInput'

export const Example2: Component = () => {
  const [errorMessage, setErrorMessage] = createSignal('')
  const [className, setClassName] = createSignal('')
  const [rawValue, setRawValue] = createSignal<string | undefined>(' ')

  const validateValue = (value: string | undefined): void => {
    const rawValue = value === undefined ? 'undefined' : value
    setRawValue(rawValue || ' ')

    if (!value) {
      setClassName('')
    } else if (Number.isNaN(Number(value))) {
      setErrorMessage('Please enter a valid number')
      setClassName('is-invalid')
    } else {
      setClassName('is-valid')
    }
  }

  return (
    <div class="row">
      <div class="col-12 mb-4">
        <a href="https://github.com/cchanxzy/react-currency-input-field/blob/master/src/examples/Example2.tsx">
          <h2>Example 2</h2>
        </a>
        <ul>
          <li>{`'$'`} prefix</li>
          <li>Has placeholder</li>
          <li>Does not allow decimals</li>
          <li>Value is stored via component state</li>
        </ul>
        <form class="needs-validation">
          <div class="row">
            <div class="col">
              <label for="validation-example-2-field">Please enter a value:</label>
              <CurrencyInput
                id="validation-example-2-field"
                placeholder="$1,234,567"
                allowDecimals={false}
                class={`form-control ${className()}`}
                onValueChange={validateValue}
                prefix={'$'}
                step={10}
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
                </div>
              </pre>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Example2
