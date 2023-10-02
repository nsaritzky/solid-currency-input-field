import { Component, For, JSX, createSignal } from 'solid-js'
import CurrencyInput from '../components/CurrencyInput'
import { CurrencyInputProps } from '../components/CurrencyInputProps'

const options: ReadonlyArray<CurrencyInputProps['intlConfig']> = [
  {
    locale: 'de-DE',
    currency: 'EUR',
  },
  {
    locale: 'en-US',
    currency: 'USD',
  },
  {
    locale: 'en-GB',
    currency: 'GBP',
  },
  {
    locale: 'ja-JP',
    currency: 'JPY',
  },
  {
    locale: 'en-IN',
    currency: 'INR',
  },
] as const

export const Example3: Component = () => {
  const [intlConfig, setIntlConfig] = createSignal<CurrencyInputProps['intlConfig']>(options[0])
  const [value, setValue] = createSignal<string | undefined>('123')
  const [rawValue, setRawValue] = createSignal<string | undefined>(' ')

  const handleOnValueChange = (value: string | undefined): void => {
    setRawValue(value === undefined ? 'undefined' : value || ' ')
    setValue(value)
  }

  const handleIntlSelect: JSX.EventHandler<HTMLSelectElement, Event> = event => {
    const config = options[Number(event.currentTarget.value)]
    if (config) {
      setIntlConfig(config)
    }
  }

  return (
    <div class="row">
      <div class="col-12 mb-4">
        <a href="https://github.com/cchanxzy/react-currency-input-field/blob/master/src/examples/Example3.tsx">
          <h2>Example 3</h2>
        </a>
        <ul>
          <li>Intl config</li>
        </ul>

        <div class="row" />

        <div class="row">
          <div class="form-group col">
            <div class="row">
              <div class="col-12">
                <CurrencyInput
                  id="validationCustom04"
                  name="input-1"
                  intlConfig={intlConfig()}
                  class={`form-control`}
                  onValueChange={handleOnValueChange}
                  decimalsLimit={6}
                  value={value()}
                  step={1}
                />
              </div>
              <div class="col-12 mt-3">
                <label for="intlConfigSelect">Intl option</label>
                <select class="form-control" id="intlConfigSelect" onChange={handleIntlSelect}>
                  <For each={options}>
                    {(config, i) => <option value={i()}>{config!.locale}</option>}
                  </For>
                </select>
              </div>
            </div>
          </div>
          <div class="form-group col">
            <pre class="h-100 p-3 bg-dark text-white">
              <div class="row">
                <div class="col-12">
                  <div class="text-muted mr-3">onValueChange:</div>
                  {rawValue()}
                  <div class="text-muted mr-3 mt-3">intlConfig:</div>
                  {JSON.stringify(intlConfig())}
                </div>
              </div>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Example3
